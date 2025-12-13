document.addEventListener('DOMContentLoaded', async () => {
    
    // initial variable declaration
    const key = "278985C45F75E625318400A6BC376ACD";

    // Page Nav functionality
    const initialScreen = document.querySelector("#page1");
    const dataScreen = document.querySelector("#page2");
    const enter = document.querySelector("#idSubmit");
    
    
    enter.addEventListener("click", async() => {
        const yourID = document.querySelector("#yourID").value;
        const otherID = document.querySelector("#otherID").value;

        console.log("yourID: " + yourID);
        console.log("otherID: " + otherID);

        const [userOneInfo, userTwoInfo, gameArray, achievementsOne, achievementsTwo, achvGameArray, gameIcons] = await FetchInformation(key, yourID, otherID);
        

        initialScreen.className = "isHidden";
        dataScreen.className = "isVisible";

        if(gameArray.length > 0) {
            loadGameAccordion(gameArray, achvGameArray, userOneInfo, userTwoInfo, achievementsOne, achievementsTwo, gameIcons);
        
            btnChangeAll();
        } else {
            noSharedGames(userOneInfo, userTwoInfo);
            const divFrameBody2 = document.querySelector("#frameBody2");
            const goBackBtn = document.querySelector("#goBack");
            const divNoSharedMsg = document.querySelector(".noSharedMsg");

            goBackBtn.addEventListener("click", () => {
                divFrameBody2.removeChild(divNoSharedMsg);
                initialScreen.className = "isVisible";
                dataScreen.className = "isHidden";

            });
        }    
        
    });

    

    


    // testing ids
    let tstId = "76561199073557362"; //The Byrd
    let tstID2 = "76561199268185945"; //alexpeters
    let tstID3 = "76561199214605508"; //RedPanda

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


// Accepts: key, steam ID, steam ID
// Returns: Player one info, player two info, library, achievements for player one, achievements for player two, achivement info, game icons
async function FetchInformation(key, idOne, idTwo){
    // grab player information
    // OBJECTS: .userAvatar and .userName 

    const playerInfoOne = await GetPlayerSummary(key, idOne);
    const playerInfoTwo = await GetPlayerSummary(key, idTwo);


    // Grab all games for each player

    const libraryOne = await GetOwnedGames(key, idOne);
    const libraryTwo = await GetOwnedGames(key, idTwo);

    // Compare libraries

    // OBJECTS: appid, playtime_forever (measured in minutes)

    const collectiveLibrary = CompareLibraries(libraryOne, libraryTwo);


    // ACHIEVEMENT OBJECTS: apiname, achieved, unlocktime
    // GAMESCHEMA OBJECTS: gameAchievements, gameName
        // GAMEACHIEVEMENT OBJECTS objects (child of gameSchema): name (shows apiname), displayName, icon, icongray
    // game Icons is a list of links

    let achievementsOne = [];
    let achievementsTwo = [];
    let gameIcons = [];
    let gameSchema = [];

        // sift through library to collect info on both
    for (let i = 0; i < collectiveLibrary.length; i++){
        achievementsOne.push(await GetPlayerAchievements(key, idOne, collectiveLibrary[i][0].appid));
        achievementsTwo.push(await GetPlayerAchievements(key, idTwo, collectiveLibrary[i][0].appid));
        gameIcons.push(await GetGameIcon(collectiveLibrary[i][0].appid));
        gameSchema.push(await GetSchemaForGame(key, collectiveLibrary[i][0].appid));
    }
    console.log([playerInfoOne, playerInfoTwo, collectiveLibrary, achievementsOne, achievementsTwo, gameSchema, gameIcons]);

    return [playerInfoOne, playerInfoTwo, collectiveLibrary, achievementsOne, achievementsTwo, gameSchema, gameIcons];
}


// accepts two libraries returns a list of games they have in common
function CompareLibraries(libraryOne, libraryTwo){
    let shorterLibrary;
    let longerLibrary;
    let shorterPlayer;
    let libraryList;
    
    if (libraryOne.length > libraryTwo.length){
        shorterLibrary = libraryTwo;
        longerLibrary = libraryOne;
        shorterPlayer = 2
    } else{
        shorterLibrary = libraryOne;
        longerLibrary = libraryTwo;
        shorterPlayer = 1
    }
    let commonGames = [];
    // ADD IGNORED IDS
    let ignoredAppIds = [422450, 1422450, 320, 623990];
    for (let indexLong = 0; indexLong < longerLibrary.length; indexLong++){
        for (let indexShort = 0; indexShort < shorterLibrary.length; indexShort++){
            if (shorterLibrary[indexShort].appid === longerLibrary[indexLong].appid && !ignoredAppIds.includes(shorterLibrary[indexShort].appid)){
                
                if (shorterPlayer == 2){
                    libraryList = [longerLibrary[indexLong], shorterLibrary[indexShort]]
                } else{
                    libraryList = [shorterLibrary[indexShort], longerLibrary[indexLong]]
                }
                
                commonGames.push(libraryList);
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
    let gameName;
    try{
        gameAchievements = gameSchema.game.availableGameStats.achievements;
    } catch{
        gameAchievements = null
    }
    try{
        gameName = gameSchema.game.gameName;
    } catch {
        gameName = null;
    }
    return {gameName, gameAchievements};
}

// Accepts a key, userId, and appID
// Returns a list of achievements objects for achievments for the specified game; objects contain apiname, acheived (1 for achieved), and unlocktime as potentially important values
async function GetPlayerAchievements(key, steamId, appId){
    let link = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${key}&steamid=${steamId}`;
    let achievements;
    try{
        let playerAchievements = await FetchAPI(link);
        achievements = playerAchievements.playerstats.achievements;
    } catch{
        achievements = [];
    }
    if (achievements === undefined || achievements === null){
        achievements = [];
    }
    return achievements;
}

// Accepts appid
// Returns game icon
async function GetGameIcon(appid){
    let link = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    let gameInfo;
    let gameIcon
    try {
        gameInfo = await FetchAPI(link);
        gameIcon = gameInfo[appid].data.capsule_image;
    } catch{
        gameIcon = null;
    }
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
function loadGameAccordion(gamesArray, achievementsArray, userOneInfo, userTwoInfo, achievementsOne, achievementsTwo, gameIcons) { //still needs data to be set
    var gameCount = 0;
    const divFrameBody2 = document.querySelector("#frameBody2");


    //Access avatarRow elements
    const userOneImg = document.querySelector("#userOneImg");
    const userTwoImg = document.querySelector("#userTwoImg");

    const userOneName = document.querySelector('label[for="avatar1"]');
    const userTwoName = document.querySelector('label[for="avatar2"]');


    //Set data for avatarRow elements
    userOneImg.src = userOneInfo.userAvatar;
    userTwoImg.src = userTwoInfo.userAvatar;

    userOneName.textContent = userOneInfo.userName;
    userTwoName.textContent = userTwoInfo.userName;




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

            const ImgL5 = document.createElement("img");

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
            loadGameAchievements(achievementsArray, divL8, achievementsOne, achievementsTwo, gameCount)

            if (achievementsArray[gameCount].gameName === "") {
                buttonL4.textContent = "[NO NAME], appid: " + game[0].appid;

            } else {
                buttonL4.textContent = achievementsArray[gameCount].gameName;
            }
            

            ImgL5.src = gameIcons[gameCount];
            ImgL5.alt = "Game Banner";


            if (game[0].playtime_forever > 500) {
                pL6a.textContent = (game[0].playtime_forever / 60).toFixed(2) + " hours";    
            } else {
                pL6a.textContent = game[0].playtime_forever + " minutes"; //User1's playtime_forever for game of gamesArray
            }

            pL6b.innerHTML = "<strong>Playtime</strong>";

            if (game[1].playtime_forever > 500) {
                pL6c.textContent = (game[1].playtime_forever / 60).toFixed(2) + " hours";    
            } else {
                pL6c.textContent = game[1].playtime_forever + " minutes"; //User1's playtime_forever for game of gamesArray
            }

            pL6d.innerHTML = "<strong>Achievements</strong>";


            pL7a.textContent = completionRatio(achievementsOne, gameCount); //User1's completed achvmnts / total achvmnts for game of gamesArray
            pL7b.innerHTML = "<strong>Completion</strong>";
            pL7c.textContent = completionRatio(achievementsTwo, gameCount); //User2's completed achvmnts / total achvmnts for game of gamesArray



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
            //buttonL4.textContent = "Game #" + (gameCount + 1);


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


            divL7.classList.add("accordion-collapse", "collapse"); //collapse or show for testing
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


            divL4.appendChild(ImgL5);

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

function loadGameAchievements(achievementsArray, divL8, achievementsOne, achievementsTwo, gameCount) {
    
    var currentGame = achievementsArray[gameCount];

    var user1CurrentGame = achievementsOne[gameCount];
    var user2CurrentGame = achievementsTwo[gameCount];

    var achvNum = 0;
    
    try {
        for (const achv of currentGame.gameAchievements) {

            //console.log(achv.displayName);
            const achvIconURL = achv.icon;
                    
            //create elements
            const divL0 = document.createElement("div");
            
            const achvIcon = document.createElement("img");
            const achvName = document.createElement("p");
            const yourCompletion = document.createElement("img");
            const otherCompletion = document.createElement("img");

            //set data
            achvIcon.src = achvIconURL;
            achvIcon.alt = "icon";

            if (achv.displayName == null || achv.displayName == undefined) {
                achvName.textContent = "empty";
            }
            achvName.textContent = achv.displayName; //Name of the achievement

            
            if (user1CurrentGame[achvNum].achieved == 1) {
                yourCompletion.src = "./images/checked.svg";
                //console.log("achievementsOne: " + gameCount + " " + achvNum + " true");
            } else if (user1CurrentGame[achvNum].achieved == 0) {
                yourCompletion.src = "./images/unchecked.svg";
                //console.log("achievementsOne: " + gameCount + " " + achvNum + " false");
            }

            if (user2CurrentGame[achvNum].achieved == 1) {
                otherCompletion.src = "./images/checked.svg";
                //console.log("achievementsTwo: " + gameCount + " " + achvNum + " true");
            } else if (user2CurrentGame[achvNum].achieved == 0) {
                otherCompletion.src = "./images/unchecked.svg";
                //console.log("achievementsTwo: " + gameCount + " " + achvNum + " false");
            }

            
            //set class
            divL0.className = "listedAchievement";

            //place in top div
            divL0.appendChild(achvIcon);
            divL0.appendChild(achvName);
            divL0.appendChild(yourCompletion);
            divL0.appendChild(otherCompletion);

            //place in level 8 game div
            divL8.appendChild(divL0);
            achvNum++;
        }
    }
    catch(error) {
        console.log("Error: " + error);
        
        const divL0 = document.createElement("div");
            
        const achvIcon = document.createElement("img");
        const achvName = document.createElement("p");
        const yourCompletion = document.createElement("img");
        const otherCompletion = document.createElement("img");

        achvName.textContent = "No Achievements available for this game. :(";

        divL0.appendChild(achvName);
        divL8.appendChild(divL0);
    }
}

function completionRatio(achievementsUser, gameCount) {
    var total = 0;
    var completed = 0;
    for (const achv of achievementsUser[gameCount]) {
        total += 1;
        completed += achv.achieved;
    }

    if (total > 0) {
        return `${completed} / ${total}`;
    } else {
        return 'NA';
    }
};

//Expand All / Collapse All button
function btnChangeAll() {
    const btnChangeAll = document.querySelector(".loadedButton");
    const divCollapse = document.querySelectorAll("div.accordion-collapse.collapse");

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

function noSharedGames(userOneInfo, userTwoInfo) {
    const divFrameBody2 = document.querySelector("#frameBody2");

    //Access avatarRow elements
    const userOneImg = document.querySelector("#userOneImg");
    const userTwoImg = document.querySelector("#userTwoImg");

    const userOneName = document.querySelector('label[for="avatar1"]');
    const userTwoName = document.querySelector('label[for="avatar2"]');


    //Set data for avatarRow elements
    userOneImg.src = userOneInfo.userAvatar;
    userTwoImg.src = userTwoInfo.userAvatar;

    userOneName.textContent = userOneInfo.userName;
    userTwoName.textContent = userTwoInfo.userName;

    //Create and set no-games message
    const altDivL0 = document.createElement("div");
    const altH1L1 = document.createElement("h1");
    const altpL1 = document.createElement("p");

    altDivL0.className = "noSharedMsg"

    altH1L1.textContent = "No Shared Games!";
    altpL1.textContent = "Try comparing with another user"

    //Create and set goBack button
    const goBackBtn = document.createElement("button");
    goBackBtn.type = "button";
    goBackBtn.className = "loadedButton";
    goBackBtn.id = "goBack";
    goBackBtn.textContent = "Go Back";

    altDivL0.appendChild(altH1L1);
    altDivL0.appendChild(altpL1);
    altDivL0.appendChild(goBackBtn);

    divFrameBody2.appendChild(altDivL0);

}