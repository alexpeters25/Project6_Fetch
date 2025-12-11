document.addEventListener('DOMContentLoaded', async () => {
    
    
    
    
    // initial variable declaration
    const key = "278985C45F75E625318400A6BC376ACD";

    // Start of Regular JS
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







// html generation functions
async function loadGame() {

}