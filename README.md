PogoBot-Telegram
================

Configurable PokemonGo-Map alerts via Telegram.  
**Check the develop branch for the most recent updates**

<img src=http://i.imgur.com/7zscpP7.png width=30% height=30%>

Features
--------

* Edit the list of Pokémon you want to watch via Telegram /commands
* Sends a Google Maps image of the spawnpoint in the notification

Commands
--------

`/start` - Start receiving notifications  
`/stop` - Stop notifications (bot still remains online until you kill the node app)  
`/add pokemon [pokemon]...` - Adds Pokémon to the watchlist (space or comma separated list)  
`/remove pokemon [pokemon]...` - Removes Pokémon from the watchlist (space or comma separated list)  
`/list` - Lists Pokémon currently on your watchlist  
`/reset` - Resets your watchlist to the default  
`/pokedex` - Lists all known Pokémon  
`/help` - Displays this helpful list of commands

Requirements
------------

* Node.js
* MongoDB
* [PokemonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map) instance that has webhook support enabled

Installation
------------

1. Clone this repo
2. `npm install`
3. Copy and rename `config.json.example` to `config.json`
4. Get yourself a Google Maps API key. If you already have a map key for PokemonGo-Map, you can use the same key here. Put the key in the config file. For this project, also enable Google Static Maps API for that key on the [developer console](https://console.developers.google.com/apis/dashboard).
5. Set your MongoDB path in `config.json`.
6. Set your Telegram bot up by following [these instructions](https://core.telegram.org/bots#3-how-do-i-create-a-bot). Set your api token in the config file.
7. Start your PokemonGo-Map with webhook support (-wh flag).

Usage
-----

1. `npm start`
2. Message `/start` to your bot to start receiving notifications!

Contributing
------------

PRs are more than welcome! Feature suggestions can also be sent as issues labeled as 'enhancement'.
Currently planned features on my list are

- [x] Persistent watchlists
- [x] Full multiuser support (same bot can handle multiple users and their watchlists)
- [x] Cleanup procedure for deleting expired Pokémen and map images
- [ ] Test and document installation on Windows
