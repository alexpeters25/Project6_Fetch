document.addEventListener('DOMContentLoaded', async () => {
    // initial variable declaration
    const key = "278985C45F75E625318400A6BC376ACD";






    // Testing
    let tstId = "76561199073557362";
    

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
    gameName = schemaResponse.gameName;
    gameAchievements = schemaResponse.gameAchievements;
    console.log("SCHEMA");
    console.log(gameName);
    console.log(gameAchievements);


    let userAchievements = await GetPlayerAchievements(key, tstId, 440);
    console.log("TF2 ACHIEVEMENTS");
    console.log(userAchievements);
});





// --------API Functions--------


// Accepts a key and a userID
// Returns an array of owned games; owned games are objects; contain appid, playtime_forever (stored in minutes)
async function GetOwnedGames(key, steamId){
    let link = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&include_played_free_games&format=json`;
    gamesData = await FetchAPI(link);
    games = gamesData.response.games;
    return games;
}

// Accepts a key and a userID
// Returns userAvatar and userName as object; user avatar is a link stored as str, userName is an str
async function GetPlayerSummary(key, steamId){
    let link = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamId}`;
    playerSummary = await FetchAPI(link);
    playerSummary = playerSummary.response.players[0]
    userAvatar = playerSummary.avatarfull;
    userName = playerSummary.personaname;
    return {userAvatar, userName};
}

// Accepts key and app ID
// Returs game Name and gameAchievements in an object
// Returns an array of objects; each object contains name (backend acievement name), displayName, icon, and icongrey as potentially important values
// Returns a string containing the name of the game
async function GetSchemaForGame(key, appId){
    let link = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${appId}`;
    gameSchema = await FetchAPI(link);
    gameAchievements = gameSchema.game.availableGameStats.achievements;
    gameName = gameSchema.game.gameName;
    return {gameName, gameAchievements};
}

// Accepts a key, userId, and appID
// Returns a list of achievements objects for achievments for the specified game; objects contain apiname, acheived (1 for achieved), and unlocktime as potentially important values
async function GetPlayerAchievements(key, steamId, appId){
    let link = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${key}&steamid=${steamId}`;
    playerAchievements = await FetchAPI(link);
    achievements = playerAchievements.playerstats.achievements;
    console.log(playerAchievements);
    return playerAchievements;
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