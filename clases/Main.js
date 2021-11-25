'use_strict';

//window.addEventListener('load',Init, false);
var app = false; //if touch device to run
var isHD = false;

var isWeb = false;

var isAndroid = false;
var isIos = false;
var isWinPC = false;
var isWinMob = false;

var isChrome = false;
var isTizen = false;

var aud = new Audio();

//time variables counters
var counter = 0;

var maxAst=10;//ojo cambiables en cada mision
var maxEne=10;//ojo cambiables en cada mision

var lastUpdate = Date.now();
var now = Date.now();
var deltaTime = 0;

if (window.cordova) {
	document.addEventListener("deviceready", Init, false);
	console.log("se fue por cordoba");
	app = true;
} else {
	console.log("no hay cordoba");
	window.addEventListener('load', Init, false);
}

var canvas, ctx, canvas2, ctx2, canvas3, ctx3, mql, platFormD, miGame;
var canvasW = 0;
var canvasH = 0;
var touches = [];
var t = [];
var touchesB = [];
var borders = [];

var url;//para el creador d eimagenes de naves destruidas y sprites rotados
//commons functions
function Vtouch(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

function vector2D(fx, fy) {
	this.x = fx || 0;
	this.y = fy || 0;
}
vector2D.prototype.getAngulo = function (sx, sy) {
	//devuelve el angulo en grados
	return ~~((Math.atan2((sy) - this.y, (sx) - this.x)) * (180 / 3.1416));
}
vector2D.prototype.getAnguloRads = function (sx, sy) {
	//devuelve el angulo en radianes
	return Math.atan2((sy) - this.y, (sx) - this.x);
}
vector2D.prototype.getDistancia = function (sx, sy) {
	miGame.dx = this.x - sx;
	miGame.dy = this.y - sy;
	return ~~(Math.sqrt(miGame.dx * miGame.dx + miGame.dy * miGame.dy));
}
var PI = Math.PI;
var aColours = []; //average colours of asteroids, and bullets vfx
aColours[0] = {
	name: "black",
	value: "rgba(0,0,0,1.0)",
	val: "0,0,0",
	health: 0,
	fire: 0
};
aColours[1] = {
	name: "gris",
	value: "rgba(82,83,83,1.0)",
	val: "83,83,83",
	health: 1,
	fire: 2
};
aColours[2] = {
	name: "rojo",
	value: "rgba(93,83,85,1.0)",
	val: "93,83,85",
	health: 1,
	fire: 0
};
aColours[3] = {
	name: "verde",
	value: "rgba(76,85,76,1.0)",
	val: "76,85,76",
	health: 2,
	fire: 3
};
aColours[4] = {
	name: "azul",
	value: "rgba(79,80,89,1.0)",
	val: "79,80,89",
	health: 3,
	fire: 2
};
aColours[5] = {
	name: "violeta",
	value: "rgba(93,83,95,1.0)",
	val: "93,83,95",
	health: 2,
	fire: 0
};
aColours[6] = {
	name: "amarillo",
	value: "rgba(89,88,80,1.0)",
	val: "89,88,80",
	health: 1,
	fire: 1
};
aColours[7] = {
	name: "naranja",
	value: "rgba(93,82,77,1.0)",
	val: "93,82,77",
	health: 4,
	fire: 1
};
aColours[8] = {
	name: "oscuro",
	value: "rgba(82,86,82,1.0)",
	val: "82,86,82",
	health: 2,
	fire: 2
};

//each object that can used like target, will register here
//when missile shooting
/*
@isInField angulo de la torreta, apertura, angulo que se forma con el obj, i si es invertido
 */
var isf = {
	min: 0,
	max: 0,
	bus: 0,
	mode: false
}

function isInField(angP, angF, angI, inv) {

	if (inv) {
		var angle_main = rOpposeds[angP];
	} else {
		var angle_main = angP;
	}

	var angle_field = angF;
	var angle_incident = angI;

	var minAngle = angle_main - angle_field;
	var maxAngle = angle_main + angle_field;
	var isIn = false;

	if (minAngle < 0) {
		//minAngle+=360;//ojo, punto polemico
		minAngle += 360;
	}

	if (maxAngle >= 360) {
		maxAngle -= 360;
	}


	if (angle_incident > minAngle & angle_incident < maxAngle) {

		isIn = true;

	} else {
		isIn = false;
	}
	return isIn;
}

function isInMid(aRef, aB) {
	//en mi mitad de circulo positiva ?

	isf.min = aRef - 90;
	isf.max = aRef + 90;
	isf.bus = aB;
	isf.mode = false;

	var is = false;

	//console.log(isf.min+" < "+isf.bus+" < "+isf.max);
	//console.log("----------------");

	if (isf.min < 0) {

		if (isf.bus >= 0 & isf.bus < isf.max) {
			isf.mode = true;
		}
		if (isf.bus > (isf.min + 360)) {
			isf.mode = true;
		}
	}
	if (isf.max > 360) {
		if (isf.bus <= 360 & isf.bus > isf.min) {
			isf.mode = true;
		}
		if (isf.bus < (isf.max - 360)) {
			isf.mode = true;
		}
	}
	if (isf.min >= 0 & isf.max <= 360) {

		if (isf.bus > isf.min & isf.bus < isf.max) {
			isf.mode = true;
		}
	}

	return isf.mode;
}

function random(nMin, nMax) {
	return ~~(Math.random() * (nMax - (nMin - 1))) + nMin;
}

function isOdd(x) {
	return x & 1;
};

function isEven(x) {
	return !(x & 1);
};

function canPlayOgg() {


	if (aud.canPlayType('audio/ogg').replace(/no/, '')) {
		return true;
	} else {
		return false;
	}
}

//variables de medicion de tiempo

function game(tEscenas) {

	this.totalScenes = tEscenas; //total de las escenas


	this.scenes = [];
	this.enableAds = false;
	this.multiResolution = true;
	this.resolution = "none";

	this.enabledSound = true;
	this.enabledMusic = true;

	this.i = 0;
	this.j = 0;
	this.k = 0;
	this.w = 0;
	this.l = 0;
	this.r = 0; //on create sprites

	this.x = 0;
	this.y = 0;
	this.dx = 0;
	this.dy = 0;
	this.dy = 0;
	this.lineW = 0;
	this.tTxt = 0;

	this.audioExt = "none";

	this.levelActive = 0;
	this.sceneActive = 0;

	this.scaleX = 1;
	this.scaleY = 1;

	this.audio = new Audio();

	this.guiData = [];
	this.colours = [];

	this.colours[0] = "rgba(0,0,0,1)"; //black
	this.colours[1] = "rgba(0,0,255,1)"; //blue
	this.colours[2] = "rgba(255,0,0,1)"; //red
	this.colours[3] = "rgba(0,255,0,1)"; //green
	this.colours[4] = "rgba(255,255,255,1)"; //white
	this.limits = {
		x1: 0,
		x2: 0,
		y1: 0,
		y2: 0
	}

	this.psAudio = [];
	this.posMouse = new vector2D(0, 0); //on mouseover

	this.targets = [];
	this.folderS = "none";
	this.sFondo=new Audio();
	this.mData={lVol:0.400,aVol:0.400,fadeOut:false,fadeIn:false,sonar:false,step:0.005};
}//fin de la clase game

game.prototype.setScenes = function(){

	this.scenes[0] = new Menu();
	this.scenes[1] = new Action();

	this.scenes[0].constructor();
	this.scenes[1].constructor();
	this.sceneActive = 0;
}

game.prototype.setCanvas = function (hdGraphics, sdGraphics) {

	//canvas to create our sprites

	canvas3 = document.getElementById("creator");
	ctx3 = canvas3.getContext('2d', {
		antialias: false
	});
	canvas3.style.top = '0';
	canvas3.style.left = '0';
	canvas3.style.position = 'absolute';
	canvas3.style.backgroundColor = 'transparent';
	canvas3.style.zIndex = "-3";

	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.position = 'absolute';
	canvas.style.backgroundColor = 'transparent';
	canvas.style.zIndex = "-1";

	canvas2 = document.getElementById("esce");
	ctx2 = canvas2.getContext('2d', {
		antialias: false
	});
	canvas2.style.top = '0';
	canvas2.style.left = '0';
	canvas2.style.position = 'absolute';
	canvas2.style.backgroundColor = '#000';
	canvas2.style.zIndex = "-2";

	canvas.screencanvas = true;

	/*
	console.log("width normal "+window.innerWidth );
	console.log("width with px Ratio "+window.innerWidth*window.devicePixelRatio);
	console.log("device pixelRatio "+window.devicePixelRatio);
	*/
	if ((window.innerWidth * window.devicePixelRatio) > 1300) {

		canvasW = 1920;
		canvasH = 1080;
		this.resolution = hdGraphics;
		this.guiData[0] = {
				width: 386,
				height: 64
			} //main button of menu
		this.guiData[1] = {
				width: 64,
				height: 64
			} //main menu social,levels
		this.guiData[2] = {
				width: 300,
				height: 96
			} //labels for gameplay
		this.guiData[3] = {
				width: 600,
				height: 800
			} //control game buttons
		this.guiData[4] = {
				width: 64,
				height: 64
			} //asteroids size
		this.guiData[5] = {
				width: 96,
				height: 96
			} //botones en gameplay
		this.guiData[6] = {
				width: 192,
				height: 192
			} //botones en gameplay
		this.guiData[7] = {
				width: 128,
				height: 136
			} //ancho de naves, en raycastin de naves
		
		isHD = true;
		canvas.width = 1920;
		canvas.height = 1080;
		canvas2.width = 1920;
		canvas2.height = 1080;
		this.lineW = 3;
		// externals borders for all objects
		borders[0] = {
				x1: 0,
				y1: -256,
				x2: canvasW,
				y2: -256
			} //top borders
		borders[1] = {
				x1: canvasW + 256,
				y1: 0,
				x2: canvasW + 256,
				y2: canvasH
			} //right borders
		borders[2] = {
				x1: 0,
				y1: canvasH + 256,
				x2: canvasW,
				y2: canvasH + 256
			} //bottom borders
		borders[3] = {
				x1: -256,
				y1: 0,
				x2: -256,
				y2: canvasH
			} //left borders
		this.tTxt = 20;

	} else {

		canvasW = 960;
		canvasH = 540;
		canvas.width = 960;
		canvas.height = 540;
		canvas2.width = 960;
		canvas2.height = 540;
		this.resolution = sdGraphics;
		isHD = false;
		this.guiData[0] = {
				width: 192,
				height: 32
			} //main button of menu
		this.guiData[1] = {
				width: 32,
				height: 32
			} //main menu socials,levels
		this.guiData[2] = {
				width: 150,
				height: 48
			} //labels for gameplay
		this.guiData[3] = {
				width: 300,
				height: 400
			} //control game buttons, joystick and fire
		this.guiData[4] = {
				width: 32,
				height: 32
			} //asteroids size
		this.guiData[5] = {
				width: 48,
				height: 48
			} //botones peques en el gameplay
		this.guiData[6] = {
				width: 96,
				height: 96
			} //botones de disparar cualquier cosa
		this.guiData[7] = {
				width: 64,
				height: 72
			} //ancho de naves, en raycastin de naves
		
		this.lineW = 2;
		this.tTxt = 10;
		// externals borders for all objects
		borders[0] = {
				x1: 0,
				y1: -128,
				x2: canvasW,
				y2: -128
			} //top borders
		borders[1] = {
				x1: canvasW + 128,
				y1: 0,
				x2: canvasW + 128,
				y2: canvasH
			} //right borders
		borders[2] = {
				x1: 0,
				y1: canvasH + 128,
				x2: canvasW,
				y2: canvasH + 128
			} //bottom borders
		borders[3] = {
				x1: -128,
				y1: 0,
				x2: -128,
				y2: canvasH
			} //left borders
	}

	canvas.style.width = '100%';
	canvas.style.height = '100%';

	canvas2.style.width = '100%';
	canvas2.style.height = '100%';

	for (this.i = 1; this.i <= 32; this.i++) {
		this.targets[this.i] = {
			mode: false,
			x: 0,
			y: 0,
			id: "none",
			misil: 0
		}
	}


	//console.log(this.resolution);
	//console.log("-------------------------");

}

game.prototype.setStorage = function () {
	
	if (localStorage.getItem("sound") == null) {
		
		localStorage.setItem("sound", "1");
		this.enabledSound = true;
		
	} else {
		if (localStorage.getItem("sound") == "1") {
			this.enabledSound = true;
		}
		if (localStorage.getItem("sound") == "0") {
			this.enabledSound = false;
		}
	}
	//music
	if (localStorage.getItem("music") == null) {
		localStorage.setItem("music", "1");
		this.enabledMusic = true;
		this.mData.fadeIn=true;

	} else {
		if (localStorage.getItem("music") == "1") {
			this.enabledMusic = true;
			this.mData.fadeIn=true;
		}
		if (localStorage.getItem("music") == "0") {
			this.enabledMusic = false;
			this.mData.fadeIn=false;
		}
	}
	
}
	//cambiar para recibir solo el vector del objeto que solicita la funcion

game.prototype.range = function (ob) {
	//the object in the argument must have a center object (vector2D)
	if (ob.center.y < borders[0].y1 | ob.center.y > borders[2].y1 | ob.center.x < borders[3].x1 | ob.center.x > borders[1].x2) {
		return true;
	}
	return false;
}

game.prototype.range2 = function (ob) {

	if (ob.y < borders[0].y1 | ob.y > borders[2].y1 | ob.x < borders[3].x1 | ob.x > borders[1].x2) {
		return true;
	}
	return false;
}

game.prototype.enableInputs = function () {
		//console.log("enableinputs");
		if (app) {
			document.addEventListener('touchstart', function (evt) {
				t = evt.changedTouches;
				//miGame.escenas[miGame.escenaActiva].toque=true;

				for (miGame.i = 0; miGame.i <= t.length - 1; miGame.i++) {

					miGame.x = ~~((t[miGame.i].pageX - canvas.offsetLeft) * miGame.scaleX);
					miGame.y = ~~((t[miGame.i].pageY - canvas.offsetTop) * miGame.scaleY);
					touches[t[miGame.i].identifier % 100] = new Vtouch(miGame.x, miGame.y);


				}
				/*
				miGame.x=~~((t[0].pageX-canvas.offsetLeft)*miGame.scaleX);
				miGame.y=~~((t[0].pageY-canvas.offsetTop)*miGame.scaleY);
				touches[0]=new Vtouch(miGame.x,miGame.y);
                
				*/

			}, false);

			document.addEventListener('touchmove', function (evt) {
				evt.preventDefault();
				t = evt.changedTouches;

				for (miGame.j = 0; miGame.j <= t.length - 1; miGame.j++) {

					if (touches[t[miGame.j].identifier % 100]) {

						touches[t[miGame.j].identifier % 100].x = ~~((t[miGame.j].pageX - canvas.offsetLeft) * miGame.scaleX);
						touches[t[miGame.j].identifier % 100].y = ~~((t[miGame.j].pageY - canvas.offsetTop) * miGame.scaleY);
					}
				}
				/*
				if(touches[0] != null){
				    touches[0].x=~~((t[0].pageX-canvas.offsetLeft)*miGame.scaleX);
				    touches[0].y=~~((t[0].pageY-canvas.offsetTop)*miGame.scaleY);
				}
				*/

			}, false);

			document.addEventListener('touchend', function (evt) {
				t = evt.changedTouches;
				for (miGame.k = 0; miGame.k <= t.length - 1; miGame.k++) {

					touchesB[miGame.k].x = ~~((t[miGame.k].pageX - canvas.offsetLeft) * miGame.scaleX);
					touchesB[miGame.k].y = ~~((t[miGame.k].pageY - canvas.offsetTop) * miGame.scaleY);

					touches[t[miGame.k].identifier % 100] = null;
				}

				/*
                    touchesB[0].x=~~((t[0].pageX-canvas.offsetLeft)*miGame.scaleX);
                    touchesB[0].y=~~((t[0].pageY-canvas.offsetTop)*miGame.scaleY);
                        
                
                    touches[0]=null;
                    */

			}, false);

			document.addEventListener('touchcancel', function (evt) {

				t = evt.changedTouches;
				for (miGame.k = 0; miGame.k <= t.length - 1; miGame.k++) {

					touchesB[miGame.k].x = ~~((t[miGame.k].pageX - canvas.offsetLeft) * miGame.scaleX);
					touchesB[miGame.k].y = ~~((t[miGame.k].pageY - canvas.offsetTop) * miGame.scaleY);

					touches[t[miGame.k].identifier % 100] = null;
				}


			}, false);

		}
		if (!app) {
			document.addEventListener('mousedown', function (evt) {
				evt.preventDefault();
				//console.log("imouse");
				if (app) {

					miGame.x = ~~((evt.pageX - canvas.offsetLeft) * miGame.scaleX);
					miGame.y = ~~((evt.pageY - canvas.offsetTop) * miGame.scaleY);
					touches[0] = new Vtouch(miGame.x, miGame.y);

				} else {
					switch (evt.which) {
					case 1:
						//console.log('Left Mouse button pressed.');

						miGame.x = ~~((evt.pageX - canvas.offsetLeft) * miGame.scaleX);
						miGame.y = ~~((evt.pageY - canvas.offsetTop) * miGame.scaleY);
						touches[0] = new Vtouch(miGame.x, miGame.y);

						if (miGame.sceneActive == 1) {
							miGame.scenes[miGame.sceneActive].action(509);
						}

						break;
					case 2:
						console.log('Middle Mouse button pressed.');
						break;
					case 3:
						evt.preventDefault();
						console.log('Right Mouse button pressed.');
						break;
					default:
						//console.log('You have a strange Mouse!');
					}
				}

			}, false);

			document.addEventListener('mousemove', function (evt) {
				if (touches[0] != null) {

					touches[0].x = ~~((evt.pageX - canvas.offsetLeft) * miGame.scaleX);
					touches[0].y = ~~((evt.pageY - canvas.offsetTop) * miGame.scaleY);
				}
			}, false);

			document.addEventListener('mouseup', function (evt) {
				if (app) {
					touchesB[0].x = ~~((evt.pageX - canvas.offsetLeft) * miGame.scaleX);
					touchesB[0].y = ~~((evt.pageY - canvas.offsetTop) * miGame.scaleY);
					touches[0] = null;
				} else {
					switch (evt.which) {
					case 1:
						//console.log('Left Mouse button pressed.');
						touchesB[0].x = ~~((evt.pageX - canvas.offsetLeft) * miGame.scaleX);
						touchesB[0].y = ~~((evt.pageY - canvas.offsetTop) * miGame.scaleY);
						touches[0] = null;

						if (miGame.sceneActive == 1) {
							miGame.scenes[miGame.sceneActive].shooting = false;
						}

						break;
					case 2:
						//console.log('Middle Mouse button pressed.');
						break;
					case 3:
						//console.log('Right Mouse button pressed.');
						break;
					default:
						//console.log('You have a strange Mouse!');
					}
				}
				//console.log("me solte en ");
			}, false);
			if (!app) {
				canvas.addEventListener('mousemove', function (evt) {

					miGame.posMouse.x = ~~((evt.pageX - canvas.offsetLeft) * miGame.scaleX);
					miGame.posMouse.y = ~~((evt.pageY - canvas.offsetTop) * miGame.scaleY);

				}, false);
			}

			document.addEventListener('keydown', function (evt) {
				//console.log(evt.keyCode); 
				if (evt.keyCode == 83 | evt.keyCode == 40) {
					miGame.scenes[miGame.sceneActive].down();
				}
				if (evt.keyCode == 87 | evt.keyCode == 38) {
					miGame.scenes[miGame.sceneActive].up();
				}
				if (evt.keyCode == 39 | evt.keyCode == 68) {
					miGame.scenes[miGame.sceneActive].right();
				}
				if (evt.keyCode == 65 | evt.keyCode == 37) {
					miGame.scenes[miGame.sceneActive].left();
				}
				if (evt.keyCode == 32) {
					miGame.scenes[miGame.sceneActive].action(32);
				}
				if (evt.keyCode == 88) {
					miGame.scenes[miGame.sceneActive].action(88);
				}
			}, false);

			document.addEventListener('keyup', function (evt) {

				if (evt.keyCode == 83 | evt.keyCode == 40) {
					miGame.scenes[miGame.sceneActive].stop();
				}
				if (evt.keyCode == 87 | evt.keyCode == 38) {
					miGame.scenes[miGame.sceneActive].stop();
				}
				if (evt.keyCode == 39 | evt.keyCode == 68) {
					miGame.scenes[miGame.sceneActive].stop();
				}
				if (evt.keyCode == 65 | evt.keyCode == 37) {
					miGame.scenes[miGame.sceneActive].stop();
				}

			}, false);


			window.addEventListener("resize", function () {
				miGame.driveDisplay();
			}, false);

			document.addEventListener("visibilitychange", miGame.driveFocus, false);
		}
	} //end of enableinputs

game.prototype.driveDisplay = function () {

	//mql = window.matchMedia("(orientation: portrait)");
	//mql.matches
	mql = false;
	if (mql) {
		//protrait mode
		this.scaleY = (canvasH / window.innerHeight);
		this.scaleX = (canvasW / window.innerWidth);
		this.scenes[this.sceneActive].bloqued = true;

		//console.log("bad orientation");
	} else {
		//landscape mode
		this.scaleY = (canvasH / window.innerHeight);
		this.scaleX = (canvasW / window.innerWidth);
		this.scenes[this.sceneActive].bloqued = false;

		//console.log("good orientation");
	}
	//console.log(this.scenes[this.sceneActive].bloqued);
	this.enableInputs();
}

game.prototype.driveFocus = function () {

	if (!miGame.enabledSound) return;

	if (document.hidden) {

		//mFondo.mute(true);
		console.log("oculto");
	} else {

		//mFondo.mute(false);
		console.log("visible");
	}
}

game.prototype.goScene = function (from, to) {

	if (to !== null) {
		this.sceneActive = to;
		this.scenes[this.sceneActive].loading = true;

	} else {
		console.log("error : not SCENE specified to load");
	}
}

//create a sprite on scene, from a simple image to complex sprite
//to rotatfe 360 degrees

game.prototype.creaSprite = function (scene, imgFrom, imgTo, size) {
	

	canvas3.width = size * 120;
	canvas3.height = size * 3;

	ctx3.save();
	ctx3.translate(size / 2, size / 2);
	ctx3.rotate(0 * Math.PI / 180);
	ctx3.drawImage(this.scenes[scene].images[imgFrom], -(size / 2), -(size / 2), size, size);
	ctx3.restore();

	for (this.r = 1; this.r <= 119; this.r++) {

		ctx3.save();
		ctx3.translate((this.r * size) + (size / 2), size / 2);

		ctx3.rotate(this.r * Math.PI / 180);
		ctx3.drawImage(this.scenes[scene].images[imgFrom], -(size / 2), -(size / 2), size, size);
		ctx3.restore();

	}
	for (this.r = 120; this.r <= 239; this.r++) {

		ctx3.save();
		ctx3.translate(((this.r * size) + (size / 2)) - (canvas3.width), (size) + size / 2);

		ctx3.rotate(this.r * Math.PI / 180);
		ctx3.drawImage(this.scenes[scene].images[imgFrom], -(size / 2), -(size / 2), size, size);
		ctx3.restore();

	}

	for (this.r = 240; this.r <= 359; this.r++) {

		ctx3.save();
		ctx3.translate(((this.r * size) + (size / 2)) - (canvas3.width * 2), (size * 2) + size / 2);

		ctx3.rotate(this.r * Math.PI / 180);
		ctx3.drawImage(this.scenes[scene].images[imgFrom], -(size / 2), -(size / 2), size, size);
		ctx3.restore();

	}
	//send to src for use 

	this.scenes[scene].iCreated[imgTo] = document.createElement("img");
	this.scenes[scene].iCreated[imgTo].width = canvas3.width;
	this.scenes[scene].iCreated[imgTo].height = canvas3.height;
	this.scenes[scene].iCreated[imgTo].id = "iCreated" + imgFrom;
	this.scenes[scene].iCreated[imgTo].name = "iCreated" + imgFrom;

	url = canvas3.toDataURL("image/png");

	this.scenes[scene].iCreated[imgTo].src = url;
	//document.body.appendChild(this.scenes[scene].iCreated[imgTo]);
}

game.prototype.setEnemiDes=function(scene, imgFrom, size, angle,image){
	
	//crear la nave enemiga en una posicion rotada y destruida para pintar por cuadros
	
	canvas3.width = size;
	canvas3.height = size;
	
	ctx3.save();
	ctx3.translate(size / 2, size / 2);
	ctx3.rotate(angle * Math.PI / 180);
	ctx3.drawImage(this.scenes[scene].images[imgFrom], -(size / 2), -(size / 2), size, size);
	ctx3.restore();
	
	image.width = size;
	image.height = size;
	image.id = "edestr" + imgFrom;
	image.name = "edestr" + imgFrom;
	
	url = canvas3.toDataURL("image/png");

	image.src = url;
	
	
}

function Init() {

	miGame = new game(45);

	if (canPlayOgg()) {

		miGame.folderS = "ogg";

	} else {

		miGame.folderS = "mp3";

	}


	miGame.setCanvas("HD", "SD");
	miGame.setScenes();
	miGame.driveDisplay();
	miGame.setStorage();
	

	touchesB[0] = new Vtouch(0, 0);
	touchesB[1] = new Vtouch(0, 0);
	
	this.i = 1;
	for (this.k = 11; this.k <= 20; this.k += 1) {

		miGame.psAudio[this.k] = {
				pos: this.i,
				start: ((this.k - 1) * (canvasW / 20)) + 1,
				end: (this.k - 1) * (canvasW / 20) + ((canvasW / 20))
			}
			//console.log(miGame.psAudio[this.k].start+" --> "+miGame.psAudio[this.k].end+" pos "+miGame.psAudio[this.k].pos);
		this.i += 1
	}

	miGame.sFondo.oncanplaythrough=function(){
		miGame.scenes[0].objectsLoaded+=1;
		
		if(!miGame.mData.sonar){
			miGame.mData.sonar=true;
			
			this.play();
		}
		
	}
	
	miGame.sFondo.preload=true;
	miGame.sFondo.loop=true;
	miGame.sFondo.autoplay=false;
	miGame.sFondo.volume=0.0;
	miGame.sFondo.src="sounds/fondo." + miGame.folderS;
	miGame.mData.step=miGame.mData.lVol / 100;

	rOpo();
	miGame.goScene(null, 0);
	run();
}

function run() {

	now = Date.now();
	deltaTime = (now - lastUpdate) / 1000;
	//if(deltaTime>1)deltaTime=0; 
	lastUpdate = now;

	if (deltaTime > 1) deltaTime = 0;
	lastUpdate = now;


	requestAnimationFrame(run);
	miGame.scenes[miGame.sceneActive].update();
	miGame.scenes[miGame.sceneActive].paint();
	//console.log("here");

}

window.requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 100);
		};
})();