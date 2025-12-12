document.addEventListener('DOMContentLoaded', async () => {
    
    // initial variable declaration
    const key = "278985C45F75E625318400A6BC376ACD";

    // Page Nav functionality
    const initialScreen = document.querySelector("#page1");
    const dataScreen = document.querySelector("#page2");
    const enter = document.querySelector("#idSubmit");
    
    
    enter.addEventListener("click", () => {
        //e.preventDefault(); //I forget if we need to prevent default here, so far doesn't appear to need it
        const yourID = document.querySelector("#yourID").value;
        const otherID = document.querySelector("#otherID").value;

        console.log("yourID: " + yourID);
        console.log("otherID: " + otherID);

        initialScreen.className = "isHidden";
        dataScreen.className = "isVisible";



        //html generator test arrays
        const gameArray = ['game1', 'game2', 'game3', 'game4'] //gameArray needs to end up as an array of the game objects
        const achvGameArray = [['achv1', 'achv2', 'achv3', 'achv4'], //achvGameArray needs to end up as a 3d array with its achievements array in the same index as the game in gameArray
                                ['achv1', 'achv2', 'achv3', 'achv4'], 
                                ['achv1', 'achv2', 'achv3', 'achv4'],
                                ['achv1', 'achv2', 'achv3', 'achv4']];
        
        
        //Loads and sets the data into html
        loadGameAccordion(gameArray, achvGameArray);
        


        btnChangeAll();
        
    });
    

    


    // testing
    let tstId = "76561199073557362";
    /*
    let games = await GetOwnedGames(key, tstId);
    console.log("GAMES");
    console.log(games);

    
    let summaryResponse = await GetPlayerSummary(key, tstId);
    let userAvatar = summaryResponse.userAvatar;
    let userName = summaryResponse.userName;
    console.log("USER INFO");
    console.log(userAvatar);
    console.log(userName);
    

    let schemaResponse = await GetSchemaForGame(key, 440);
    let gameName = schemaResponse.gameName;
    let gameAchievements = schemaResponse.gameAchievements;
    console.log("SCHEMA");
    console.log(gameName);
    console.log(gameAchievements);


    let userAchievements = await GetPlayerAchievements(key, tstId, 440);
    console.log("TF2 ACHIEVEMENTS");
    console.log(userAchievements);

    let gameIcon = await GetGameIcon(440);
    console.log("TF2 ICON");
    console.log(gameIcon);
    */ 

    // compareLibraries testing
    // let tstIdTwo = "76561199214605508"
    // let games = await GetOwnedGames(key, tstId);
    // let gamesTwo = await GetOwnedGames(key, tstIdTwo);
    // let commonGames = compareLibraries(games, gamesTwo);
    // console.log(commonGames);
    // let commonSchema = [];
    // for (let i=0; i<commonGames.length; i++){
    //     let gameSchema = await GetSchemaForGame(key, commonGames[i].appid);
    //     commonSchema.push(gameSchema);
    // }
    // console.log(commonSchema);
});


// accepts two libraries returns a list of games they have in common
function compareLibraries(libraryOne, libraryTwo){
    let shorterLibrary;
    let longerLibrary;
    if (libraryOne.length > libraryTwo.length){
        shorterLibrary = libraryTwo;
        longerLibrary = libraryOne;
    } else{
        shorterLibrary = libraryOne;
        longerLibrary = libraryTwo;
    }
    let commonGames = [];
    for (let indexLong = 0; indexLong < longerLibrary.length; indexLong++){
        for (let indexShort = 0; indexShort < shorterLibrary.length; indexShort++){
            if (shorterLibrary[indexShort].appid === longerLibrary[indexLong].appid){
                commonGames.push(shorterLibrary[indexShort])
            }
        }
    }
    return commonGames;
}



// --------API Functions--------


// Accepts a key and a userID
// Returns an array of owned games; owned games are objects; contain appid, playtime_forever (stored in minutes)
async function GetOwnedGames(key, steamId){
    let link = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&include_played_free_games&format=json`;
    let gamesData = await FetchAPI(link);
    let games = gamesData.response.games;
    return games;
}

// Accepts a key and a userID
// Returns userAvatar and userName as object; user avatar is a link stored as str, userName is an str
async function GetPlayerSummary(key, steamId){
    let link = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamId}`;
    let playerSummary = await FetchAPI(link);
    playerSummary = playerSummary.response.players[0]
    let userAvatar = playerSummary.avatarfull;
    let userName = playerSummary.personaname;
    return {userAvatar, userName};
}

// Accepts key and app ID
// Returs game Name and gameAchievements in an object
// Returns an array of objects; each object contains name (backend acievement name), displayName, icon, and icongrey as potentially important values
// Returns a string containing the name of the game
async function GetSchemaForGame(key, appId){
    let link = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${appId}`;
    let gameSchema = await FetchAPI(link);
    let gameAchievements;
    try{
        gameAchievements = gameSchema.game.availableGameStats.achievements;
    } catch{
        gameAchievements = null
    }
    let gameName = gameSchema.game.gameName;
    return {gameName, gameAchievements};
}

// Accepts a key, userId, and appID
// Returns a list of achievements objects for achievments for the specified game; objects contain apiname, acheived (1 for achieved), and unlocktime as potentially important values
async function GetPlayerAchievements(key, steamId, appId){
    let link = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${key}&steamid=${steamId}`;
    let playerAchievements = await FetchAPI(link);
    let achievements = playerAchievements.playerstats.achievements;
    
    return achievements;
}

// Accepts appid
// Returns game icon
async function GetGameIcon(appid){
    let link = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    let gameInfo = await FetchAPI(link);
    let gameIcon = gameInfo[appid].data.capsule_image;
    return gameIcon;
}


// generic API function; accepts a link, returns a json file
async function FetchAPI(link){
    try{
        const response = await fetch(link);
        const jsonResult = await response.json();
        return jsonResult;
    } catch(error){
        console.log(error);
    }
}





//html generation
function loadGameAccordion(gamesArray, achievementsArray, gameIconArray) { //still needs data to be set
    var gameCount = 0;
    const divFrameBody2 = document.querySelector("#frameBody2");
    for (game of gamesArray) {
        if (gameCount < gamesArray.length) { 
            //create elements
            const divL0 = document.createElement("div");
            const divL1 = document.createElement("div");
            const divL2 = document.createElement("div");
            
            const h2L3 = document.createElement("h2");
            const buttonL4 = document.createElement("button");

            const divL3 = document.createElement("div");
            const divL4 = document.createElement("div");

            const divL5Playtime = document.createElement("div");
            const pL6a = document.createElement("p");
            const pL6b = document.createElement("p");
            const pL6c = document.createElement("p");

            const divL5AchvCount = document.createElement("div");
            const pL6d = document.createElement("p");

            const divL6CountBox = document.createElement("div");
            const pL7a = document.createElement("p");
            const pL7b = document.createElement("p");
            const pL7c = document.createElement("p");

            const divL5AchvAccordion = document.createElement("div");
            const divL6AchvAccordionItem = document.createElement("div");


            const h4L7 = document.createElement("h4");
            const buttonL8 = document.createElement("button");

            const divL7 = document.createElement("div");
            const divL8 = document.createElement("div");
            

            //##############################set data##############################
            loadGameAchievements(achievementsArray, divL8)

            pL6a.textContent = "Playtime #1"; //User1's playtime_forever for game of gamesArray
            pL6b.innerHTML = "<strong>Playtime</strong>";
            pL6c.textContent = "Playtime #2"; //User2's playtime_forever for game of gamesArray

            pL6d.innerHTML = "<strong>Achievements</strong>";


            pL7a.textContent = "Completion #1"; //User1's completed achvmnts / total achvmnts for game of gamesArray
            pL7b.innerHTML = "<strong>Completion</strong>";
            pL7c.textContent = "Completion #2"; //User2's completed achvmnts / total achvmnts for game of gamesArray




            //##############################set data END##############################

            //set classes and id's
            divL0.className = "accordion";
            divL0.id = "accordionParent" + gameCount;


            divL1.className = "gameBox"


            divL2.classList.add("accordion-item", "primaryTextColor");


            h2L3.classList.add("accordion-header", "gametitleRibbon");
            h2L3.id = "heading" + gameCount;

            buttonL4.classList.add("accordion-button", "collapsed"); 
            buttonL4.type = "button"
            buttonL4.setAttribute("data-bs-toggle", "collapse");
            buttonL4.setAttribute("data-bs-target", ("#collapse" + gameCount));
            buttonL4.setAttribute("aria-expanded", "true");
            buttonL4.setAttribute("aria-controls", ("collapse" + gameCount));
            buttonL4.textContent = "Game #" + (gameCount + 1);


            divL3.classList.add("accordion-collapse", "collapse"); //collapse or show for testing
            divL3.id = "collapse" + gameCount;
            divL3.setAttribute("aria-labelledby", ("heading" + gameCount));
            divL3.setAttribute("data-bs-parent", ("#accordionParent" + gameCount));


            divL4.classList.add("accordion-body", "gameBoxBody");


            divL5Playtime.className = "playtime";


            divL5AchvCount.className = "achievementCount";

            divL6CountBox.className = "achievementCountBox";


            divL5AchvAccordion.className = "accordion";
            divL5AchvAccordion.id = "achvAccordionParent" + gameCount;


            divL6AchvAccordionItem.classList.add("accordion-item", "primaryTextColor");


            h4L7.className = "accordion-header";
            h4L7.id = "achvHeading" + gameCount;

            buttonL8.classList.add("accordion-button", "collapsed");
            buttonL8.type = "button"
            buttonL8.setAttribute("data-bs-toggle", "collapse");
            buttonL8.setAttribute("data-bs-target", ("#collapseAchv" + gameCount));
            buttonL8.setAttribute("aria-expanded", "true");
            buttonL8.setAttribute("aria-controls", ("collapseAchv" + gameCount));
            buttonL8.textContent = "Achievement List";


            divL7.classList.add("accordion-collapse", "collapse"); //collapsed or show for testing
            divL7.id = "collapseAchv" + gameCount;
            divL7.setAttribute("aria-labelledby", ("achvHeading" + gameCount));
            divL7.setAttribute("data-bs-parent", ("#achvAccordionParent" + gameCount));


            divL8.classList.add("accordion-body", "achievementListBox");



            //place elements
            h4L7.appendChild(buttonL8);
            divL7.appendChild(divL8);
            
            divL6AchvAccordionItem.appendChild(h4L7);
            divL6AchvAccordionItem.appendChild(divL7);

            divL5AchvAccordion.appendChild(divL6AchvAccordionItem);


            divL6CountBox.appendChild(pL7a);
            divL6CountBox.appendChild(pL7b);
            divL6CountBox.appendChild(pL7c);

            divL5AchvCount.appendChild(pL6d);
            divL5AchvCount.appendChild(divL6CountBox);


            divL5Playtime.appendChild(pL6a);
            divL5Playtime.appendChild(pL6b);
            divL5Playtime.appendChild(pL6c);


            divL4.appendChild(divL5Playtime);
            divL4.appendChild(divL5AchvCount);
            divL4.appendChild(divL5AchvAccordion);


            h2L3.appendChild(buttonL4);

            divL3.appendChild(divL4);


            divL2.appendChild(h2L3);
            divL2.appendChild(divL3);

            divL1.appendChild(divL2);
            divL0.appendChild(divL1);

            divFrameBody2.appendChild(divL0);


            gameCount++;
        }
    }

    const btnChangeAll = document.createElement("button");
    btnChangeAll.type = "button";
    btnChangeAll.className = "expandShrink";
    btnChangeAll.id = "expand";
    btnChangeAll.textContent = "Expand All";


    divFrameBody2.appendChild(btnChangeAll);
}

function loadGameAchievements(achievementsArray, gameDivL8) {
    var achvCount = 0;
    for (achv of achievementsArray) {
            if (achvCount < achievementsArray.length) {
            const achvIconURL = "./images/blank-user-profile.png"; //[achv.icon] //whatever the attribute is to retrieve the achievement's icon
            //create elements
            const divL0 = document.createElement("div");
            
            const achvIcon = document.createElement("img");
            const achvName = document.createElement("p");
            const yourCompletion = document.createElement("img");
            const otherCompletion = document.createElement("img");

            //set data
            achvIcon.src = achvIconURL;
            achvIcon.alt = "icon";

            achvName.textContent = "Achievement #" + (achvCount + 1); //Name of the achievement

            yourCompletion.src = "./images/unchecked.svg"; //for User1: checked.svg if achv is complete, unchecked.svg if achv isn't
            otherCompletion.src = "./images/checked.svg"; //for User2: checked.svg if achv is complete, unchecked.svg if achv isn't

            
            //set class
            divL0.className = "listedAchievement";

            //place in top div
            divL0.appendChild(achvIcon);
            divL0.appendChild(achvName);
            divL0.appendChild(yourCompletion);
            divL0.appendChild(otherCompletion);

            //place in level 8 game div
            gameDivL8.appendChild(divL0);

            achvCount++;
        }
        
    }
}

//Expand All / Collapse All button
function btnChangeAll() {
    const btnChangeAll = document.querySelector(".expandShrink");
    const divCollapse = document.querySelectorAll("div.accordion-collapse.collapse");
    console.log(divCollapse);

    btnChangeAll.addEventListener("click", (e) => {
    e.preventDefault();
    for (div of divCollapse) {
        if (btnChangeAll.textContent === "Expand All") {
            bootstrap.Collapse.getOrCreateInstance(div).show();
        }
        else if (btnChangeAll.textContent === "Collapse All") {
            bootstrap.Collapse.getOrCreateInstance(div).hide();
        }
        
    }
    btnChangeAll.textContent = btnChangeAll.textContent === "Expand All" ? "Collapse All" : "Expand All";
    btnChangeAll.id = btnChangeAll.id === "expand" ? "shrink" : "expand";
    });
}