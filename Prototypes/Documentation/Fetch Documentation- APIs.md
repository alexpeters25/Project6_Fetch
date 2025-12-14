# API Documentation
## This project will interact with 4 steam API endpoints:
  - GetOwnedGames- Returns games owned by a player
    - Format:  http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXX&steamid=XXXXXXXXXXXXXXXXXXXXXXX&include_played_free_games&format=json
  - GetPlayerSummaries- Returns information reguarding the player, this is to fetch the display name and avatar
    - Format: http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXXXXXXXXXXXXXXXXXXXXXX&steamids=XXXXXXXXXXXXXXXXXXXXXXX
  - GetSchemaForGame- Returns list of game achievements, including display names and icons
    - Format: https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=XXXXXXXXXXXXXXXXXXXXXXX&appid=XXXX
  - GetPlayerAchievements- Returns list of achievements obtained by player
    - Format:  http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=XXXX&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=XXXXXXXXXXXXXXXXXXXXXXX
  - appdetails- Returns steam store information for an app
    - Format- https://store.steampowered.com/api/appdetails?appids=XXXXXXXX
### These endpoints will be accessed with the following steam API key: 278985C45F75E625318400A6BC376ACD
