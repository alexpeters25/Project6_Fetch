# Scope Statement
## Required Scope
  - Interact with Steam API to collect information about users and game hours/achievement progress
  - Interact with at least five Steam API endpoints
    - GetOwnedGames- Returns games owned by a player
    - GetPlayerSummaries- Returns information reguarding the player, this is to fetch the display name and avatar
    - GetSchemaForGame- Returns list of game achievements, including display names and icons
    - GetPlayerAchievements- Returns list of achievements obtained by player
  - Allow the user to type two Steam IDs to compare game stats and achievements between users
  - Display playtime and achievement comparisons for games owned by both users

## Outside Scope
  - Displaying game header image
    - Not offered in API, would require web scraping
  - Displaying game stats other than hours
    - Game stats are wildly inconsistent between different games, and most game do not support them.
    
