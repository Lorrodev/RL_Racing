//+++Variable Declaration
var mainCanvas;
var mainCtx;
var canvasSize;
var canvasDiagonal;

var fps = 25;
var ups = 25;

var frameInterval = 1000/fps;
var timeLastFrame = -1;
var frameDeltaTime = -1;

var updateInterval = 1000/ups;
var timeLastUpdate = -1;
var updateDeltaTime = -1;

//var debugLevel = 3; //0: none - 3: deep

//---Variable Declaration
var GLOBAL_currentGeneration = 0;
var GLOBAL_renderOffset = new Vect2d(1000, 1000);

var GLOBAL_spawnPoint = new Vect2d(1800, 1000);
var GLOBAL_spawnForward = new Vect2d(0, 1);

var generations = [];

var track;

//DEBUG Vars
var DEBUG = true;
var DEBUG_rayHits = [];
var DEBUG_walls = [];
var DEBUG_pos = new Vect2d(1000, 200);

window.onload = setup;

function setup(){
    mainCanvas = document.getElementById("mainCanvas");
    mainCtx = mainCanvas.getContext("2d");
    canvasSize = new Vect2d(2000, 2000);
    canvasDiagonal = Math.sqrt(Math.pow(canvasSize.x, 2) + Math.pow(canvasSize.y, 2));
    
    //Start update/animation cycle
    timeLastFrame = Date.now();
    timeLastUpdate = Date.now();

    //+++INIT TEST SETUP
    track = new Track();
    track.spawnCircleTrack(800, new Vect2d(1000, 1000));
    //track.spawnZeroTrack(500, new Vect2d(1000, 1000));

    let gen1 = new Generation(0);
    gen1.populate(POPULATION_SIZE);
    //---INIT TEST SETUP

    updateGame();
}

function updateGame(){
    //Game Updates
    updateDeltaTime = Date.now() - timeLastUpdate;

    if(updateDeltaTime > updateInterval){
        timeLastUpdate = Date.now();

        //game updates go here
        generations[GLOBAL_currentGeneration].update();
    }


    //Frame Rendering
    frameDeltaTime = Date.now() - timeLastFrame;

    if(frameDeltaTime > frameInterval){
        timeLastFrame = Date.now();

        nextFrame();
    }

    setTimeout(updateGame, 1);
}

function nextFrame(){
    mainCtx.clearRect(0, 0, 2000, 2000);

    //frame updates go here
    generations[GLOBAL_currentGeneration].drawAgents();

    mainCtx.fillStyle = "#FFF";
    mainCtx.font = "30px Consolas";
    mainCtx.fillText("GEN: "+GLOBAL_currentGeneration, 20, 40);
    if(GLOBAL_currentGeneration > 1){
        mainCtx.fillText("BST: "+Math.round(generations[GLOBAL_currentGeneration-1].bestAgent.points), 20, 80);
        let delta = Math.round(generations[GLOBAL_currentGeneration-1].bestAgent.points)-Math.round(generations[GLOBAL_currentGeneration-2].bestAgent.points)
        mainCtx.fillText("DLT: "+delta, 20, 120);
    }

    //+++DEBUG
    if(DEBUG){
        for(let rh = 0; rh < DEBUG_rayHits.length; rh++){
            DEBUG_rayHits[rh].draw();
        }
        DEBUG_rayHits = [];

        /*for(let w = 0; w < track.walls.length; w++){
            let wall = track.walls[w];

            if(Vect2d.subtract(wall.centerPos, DEBUG_pos).magnitude() < 400){
                mainCtx.strokeStyle = "#F0F";
                mainCtx.beginPath();
                mainCtx.moveTo(DEBUG_pos.x, DEBUG_pos.y);
                mainCtx.lineTo(wall.centerPos.x, wall.centerPos.y);
                mainCtx.stroke();
            }
        }*/
        /*DEBUG_walls = track.getClosestWalls(DEBUG_pos, 8);
        for(let w = 0; w < DEBUG_walls.length; w++){
            let wall = DEBUG_walls[w];
            mainCtx.lineWidth = 15;
            mainCtx.strokeStyle = "#F0F";
            mainCtx.beginPath();
            mainCtx.moveTo(wall.startPos.x, wall.startPos.y);
            mainCtx.lineTo(wall.endPos.x, wall.endPos.y);
            mainCtx.stroke();
        }*/
    }
    //---DEBUG
    
    track.draw();
}