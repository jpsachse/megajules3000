# MegaJules*3000*

## Why is this?
This little project was created during the [WikiMedia GameJam 2015](https://www.wikimedia.de/wiki/Game_Jam/Info).
The task was to create a prototypic game implementation using free knowledge.

## What is this?
It is a prototypic implementation of an RPG that allows you to explore 2D maps, interact with (static) NPCs and read information on signs.
Every map has an entity (e.g., a person, city, building, ...) that information on the signs can be about.
This information is downloaded from DBPedia and then displayed on the signs.
Additionally the player is asked to guess the name of entities in a minigame, where several facts are displayed after a certain amount of time.

## Setup
MegaJules*3000* is built using a JavaScript frontend connecting to a Python webserver.
You need pip and [NodeJS 4](https://nodejs.org/en/download/) to be setup on your Computer in order to be able to execute the project
Additionally, you have to execute the following commands in a terminal in the project directory to setup the project:
```
pip install -r requirements.txt
npm install -g grunt-cli, bower
cd frontend/
npm install & bower install
```
Afterwards you can start the python server from the server/ directory:
```
cd server/
python main.py
```
And the webserver from the frontend directory:
```
cd frontend/
grunt serve
```

## License
Our code is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

[![CC BY 4.0 Image](https://licensebuttons.net/l/by/3.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

## Used Ressources
- Character Sprites by Philipp Lenssen (released under CC BY 3.0; available [here](http://blogoscoped.com/archive/2006-08-08-n51.html))
- Environmental sprites by [Ayene-chan](http://ayene-chan.deviantart.com) (released under CC BY 3.0; see separate files for links)
- Environmental sprites by [painhurt](http://painhurt.deviantart.com) (released under CC BY NC 3.0; see separate files for links)

## Last Remarks
Sorry for the hacks - it were only 24 hours, after all :-)

In order to improve performance while playing, our server can use a cache file with information downloaded from DBPedia in advance.
An example cache file can be found at `server/mock/pre-cached entities/fact.cache`.
This cache file has to be placed at `server/tmp/fact.cache` in order to be used by the server.