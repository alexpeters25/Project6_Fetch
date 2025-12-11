document.addEventListener('DOMContentLoaded', async () => {
    
    // initial variable declaration
    const key = "278985C45F75E625318400A6BC376ACD";

    // Page Nav functionality
    const initialScreen = document.querySelector("#page1");
    const dataScreen = document.querySelector("#page2");
    const enter = document.querySelector("#idSubmit");

    enter.addEventListener("click", () => {
        //e.preventDefault();
        const yourID = document.querySelector("#yourID").value;
        const otherID = document.querySelector("#otherID").value;

        console.log("yourID: " + yourID);
        console.log("otherID: " + otherID);

        initialScreen.className = "isHidden";
        dataScreen.className = "isVisible";
    });



    // Testing
    /*let tstId = "76561199073557362";
    

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


});





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
    let gameAchievements = gameSchema.game.availableGameStats.achievements;
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
function loadGameAccordion(gamesArray, u1, u2) { //still needs data to be set
    const gameCount = 0;
    const divFrameBody2 = document.querySelector("#frameBody2"); //need to clear this div after the first button press
    for (game of gamesArray.length) {
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
            

            //set data
            loadGameAchievements(achievementsArray.game, divL8)

            
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
            buttonL4.setAttribute("data-bs-target", ("collapse" + gameCount));
            buttonL4.setAttribute("aria-expanded", "true");
            buttonL4.setAttribute("aria-controls", ("collapse" + gameCount));


            divL3.classList.add("accordion-collapse", "collapse");
            divL3.id = "collapse" + gameCount;
            divL3.setAttribute("aria-labelledby", ("heading" + gameCount));
            divL3.setAttribute("data-bs-parent", ("accordionParent" + gameCount));


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
            buttonL8.setAttribute("data-bs-target", ("collapseAchv" + gameCount));
            buttonL8.setAttribute("aria-expanded", "true");
            buttonL8.setAttribute("aria-controls", ("collapseAchv" + gameCount));


            divL7.classList.add("accordion-collapse", "collapse");
            divL7.id = "collapseAchv" + gameCount;
            divL7.setAttribute("aria-labelledby", ("achvHeading" + gameCount));
            divL7.setAttribute("data-bs-parent", ("achvAccordionParent" + gameCount));


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
        }
    }
}

function loadGameAchievements(achievementsArray, gameDivL8) {
    for (achv of achievementsArray.length) {
        const achvIconURL = achv.icon //whatever the attribute is to retrieve the achievement's icon
        //create elements
        const divL0 = document.createElement("div");
        
        const iconImg = document.createElement("img");
        const achvName = document.createElement("p");
        const yourCompletion = document.createElement("img");
        const otherCompletion = document.createElement("img");

        //set data
        achvIcon.src = achvIconURL;
        achvIcon.alt = "icon";

        
        //set class
        divL0.className = "listedAchievement";

        //place in top div
        divL0.appendChild(iconImg);
        divL0.appendChild(achvName);
        divL0.appendChild(yourCompletion);
        divL0.appendChild(otherCompletion);

        //place in level 8 game div
        gameDivL8.appendChild(divL0);
    }
}