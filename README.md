PogoBot
=======

Configurable PokemonGo-Map alerts via Telegram.

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
`/help` - Displays this helpful list of commands

Installation
------------

1. Clone this repo
2. `npm install`
3. Copy and rename `config.json.example` to `config.json`
4. Get yourself a Google Maps API key. If you already have a map key for PokemonGo-Map, you can use the same key here. Put the key in the config file.
5. Set your Telegram bot up by following [these instructions](https://core.telegram.og/bots#3-how-do-i-create-a-bot). Set your api token in the config file

Usage
-----

1. `npm start`
2. Message `/start` to your bot to start receiving notifications!

Contributing
------------

PRs are more than welcome! Feature suggestions can also be sent as issues labeled as 'enhancement'.
Currently planned features on my list are

* Persistent watchlists
* Full multiuser support (same bot can handle multiple users and their watchlists)
* Cleanup procedure for deleting expired Pokémen and map images
