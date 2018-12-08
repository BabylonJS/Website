Welcome to this Babylon.JS Minecraft-like sample
---------

This is a technical demonstration of how you can recreate a Minecraft-like experience using WebGL.

This is a work in progress and a lot of improvement needs to be done for it to be perfect (do not look too much on the javascript code inside index.html ;-)).

You can have more information about this here : http://www.html5gamedevs.com/topic/12608-voxel-rendering-without-too-many-draw-calls/?p=73672

I will soon write a blog article explaining this more in details.

Do not hesitate to contact me on twitter to talk about this (http://www.twitter.com/meulta) or on the forum (https://forum.babylonjs.com)

Features 
---------
For now we did most of the work about rendering and improving performances (and still have a lot of work in this area).
You can move, add / remove blocs.
Next we need to work on gravity / collision which cannot be done using standard Babylon.JS features in this case due to the specific mesh object we use.

How to use / test
----------

1. Get the files
2. Launch index.html :) (and wait a bit until everything initiate)

How to contribute
-------

The main code is written in Typescript (www.typescriptlang.org) and you have to run a Gulp workflow to translate it into Javascript.

There are two main files :
- boxmonger.boxmesh.ts : which is the mesh object that can handle a lot of adding and removing of boxes
- boxmonger.worldmanager.ts : which defines the world structure and the displaying logic (including chunk management)

You just need nodejs and npm installed on your machine.

1. Get the files
2. Open a command line prompt
2. Run : **npm install -g gulp**
3. Run : **npm install gulp**
4. Run : **npm update**
5. Run : **gulp**
6. Launch index.html :) (and wait a bit until everything initiate)
