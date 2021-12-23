window.addEventListener("keydown", keyDownRecieved, false);
window.addEventListener("keyup", keyUpRecieved, false);

//Keymap defaults
var accelerateKey = 87; //W
var breakKey = 83; //S
var leftKey = 65; //A
var rightKey = 68; //D

//Input values
var accelerateInput = false;
var breakInput = false;
var leftInput = false;
var rightInput = false;


function keyDownRecieved(e) {
	switch(e.keyCode){
		case accelerateKey:
			accelerateInput = true;
        break;

		case breakKey:
			breakInput = true;
		break;

		case leftKey:
			leftInput = true;
        break;

		case rightKey:
			rightInput = true;
        break;
	}
}

function keyUpRecieved(e) {
	switch(e.keyCode){
		case accelerateKey:
			accelerateInput = false;
        break;

		case breakKey:
			breakInput = false;
		break;

		case leftKey:
			leftInput = false;
        break;

		case rightKey:
			rightInput = false;
        break;
	}
}