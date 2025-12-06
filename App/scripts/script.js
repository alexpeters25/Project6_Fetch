document.addEventListener('DOMContentLoaded', () => {
    // initial variable declaration
    const key = "278985C45F75E625318400A6BC376ACD";


    console.log("hello")

    // Testing
    let tstId = "76561199073557362";
    
    
    let userAvatar, userName = GetPlayerSummary(key, tstId).then(() =>{
        console.log("PLAYER SUMMARY")
        console.log(userAvatar);
        console.log(userName);
        return [userAvatar, userName];
    });

    let games = GetOwnedGames(key, tstId).then(() =>{
        console.log("OWNED GAMES")
        console.log(games)
        return games;
    })


});





// --------API Functions--------
// NONE OF THESE FUNCTIONS RETURN HERE, NEEDS TO BE DONE IN ANNONAMOUS FUNCTION WHERE FUNCTION IS CALLED
// (this could be abstracted into another function for simplicity)

// Accepts a key and a userID
// To be assigned: games
async function GetOwnedGames(key, steamId){
    let link = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&include_played_free_games&format=json`;
    gamesData = await FetchAPI(link);
    games = gamesData.response.games;
   
}

// Accepts a key and a userID
// To be assigned: userAvatar, userName
async function GetPlayerSummary(key, steamId){
    let link = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamId}`;
    playerSummary = await FetchAPI(link);
    playerSummary = playerSummary.response.players[0]
    userAvatar = playerSummary.avatarfull;
    userName = playerSummary.personaname;
}

async function GetSchemaForGame(key, appId){
    let link = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${appId}`;
    gameAchievements = await FetchAPI(link);

    return gameAchievements;
}

async function GetPlayerAchievements(key, steamId, appId){
    let link = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${key}&steamid=${steamId}`;
    playerAchievements = await FetchAPI(link);
    return playerAchievements;
}



async function FetchAPI(link){
    try{
        const response = await fetch(link);
        const jsonResult = await response.json();
        return jsonResult;
    } catch(error){
        console.log(error);
    }
}