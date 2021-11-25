function Action() {

	this.allObjects = 32;
	this.objectsLoaded = 0;

	this.loading = true;
	this.playing = false;
	this.paused = false;
	this.ended = false;
	this.over = false;
	this.losed = false;
	this.showInts = false;
	this.bloqued = false; //flag to orientation device
	this.runSome = false;
	this.joyTouched = false;
	this.shooting = false;
	this.shootingR = false;
	this.downing = false; //flag to manage recoil of canon

	this.buttons = [];
	this.sounds = [];
	this.sMisRocks = [];
	this.images = [];
	this.iCreated = []; //images created in game from sprites

	this.myBullets = []; //mi bullets
	this.theyBullets = []; //enemy bullets
	this.myMissiles = [];
	this.myRockets = [];
	this.theyMissiles = [];
	this.mines = [];
	this.asteroids = [];
	this.enemies = [];
	this.friends = [];
	this.items = [];
	this.sparks = [];
	this.explodes = [];
	this.tExplodes = []; //big explosions caused for missiles and rockets
	this.myParticles = [];
	this.luceros=[];
	
	this.sBullets = [];
	this.sBullEne = [];
	this.sRockets = [];
	this.sBig = [];
	this.sAst = [];
	this.tScores = [];//para pintar los puntajes ganados al destruir enemigos y asteroides
	this.eneDestr=[];

	this.i = 0; //for use in for structures
	this.j = 0;
	this.k = 0;
	this.l = 0;
	this.m = 0;
	this.n = 0; //runexplodes
	this.o = 0; //inside runexplodes for structures
	this.p = 0; //in runParticle
	this.l = 0; //for use in action, run rockets
	this.p = 0;
	this.q = 0; //run missiles in action

	this.posAudX = 0;
	this.rExp = 0;
	this.doing = "none";
	this.frame = 0;

	//maxims
	if (isHD) {

		this.maxLights = 1000;
		
	} else {

		this.maxLights = 500;

	}
	this.maxSparks = 15;
	this.maxBlltsFr = 40;
	this.maxBlltsEn = 60;//ojo.optimizacion
	this.maxParticles = 14; //chorros particles

	this.maxAsteroids = 3; //from json
	this.maxLuceros=1000;
	this.maxEnemies;

	this.totalAst = 0;
	this.totalEne = 0; //actuales En pantalla

	this.turret = new tBasic(1, 0);
	this.angAdder = 0;

	this.totalScore;
	//use data from json
	this.shield = new shieldBasic(0, 0, 0);

	this.mode = miGame.resolution;
	this.HD = false;

	this.baseJoy = new vector2D(0, 0);
	this.baseRadio = 0;
	this.radioExplodes = 0;

	this.targetCanon = new vector2D(0, 0);
	this.sTargetCanon = new vector2D(0, 0);
	this.radTarget = 48;
	this.dataJoy = {
		aGrads: 0,
		aRads: 1.0
	}
	this.flashData = {
		x: 0,
		y: 0,
		im: 3,
		mode: false,
		adder: 0,
		width: 0,
		height: 0,
		radio: 0
	}
	this.correcData = {
			aGrads: 0,
			aRads: 0,
			co: 0,
			ca: 0
		} //corect data of target by main canon, it is sides of display to show

	this.playDat = {
		w: 0,
		h: 0,
		m: 0
	}

	this.labels = [];
	for (this.i = 0; this.i <= 6; this.i += 1) {
		this.labels[this.i] = {
			cex: 0,
			cey: 0,
			x: 0,
			y: 0,
			ty: 0
		}
	}
	//tipes ammo
	this.ammoDefault = "normal"; //here purchases, values : searcher, explosive, searcher-explosive
	this.adderAster = 0; //to run asteroids
	this.adderEnemi = 0; //to run enemies

	this.radioShips = 0;

	this.maxMissiles = 10;
	this.avaiMissiles = 1;
	this.radioMissiles = 0;

	this.idLaunch = 0; //missile to launch
	this.bDatGui = {
			w: 0,
			h: 0
		} //para los botones de la gui en action, scenes, store y help
	this.numGuiG = {
			w: 0,
			h: 0,
			rx: 0,
			ry: 0
		} //para los numeros grandes en la gui
	this.numGuiP = {
			w: 0,
			h: 0,
			rx: 0,
			ry: 0
		} //para los numeros pequenos en la gui

	this.isTime = false;
	this.mins;
	this.seconds;
	this.posPuntosTime = {
		x: 0,
		y: 0
	};
	this.cTime = 0;
	this.lastTime = 0;
	this.cTimeF = 0.01;
	this.dataPlanet={x:0,y:0,w:0,rx:0,cx:0,cy:0};
	//sumador disparos enemigos
	this.adRunEnBul=0;
	
	//sumador disparos Amigos
	this.adRunAmBul=0;
	
	this.scoreData={confrontacion:0,segundos:0,balasD:0,misilD:0,rocketD:0,minesD:0};
	this.asceData={xIm:0,xTam:0,yTam:0,cyTam:0,yMin:0,yMax:0,recor:100,vel:0.1,mode:3,tope:1500,sum:0};
	//ojo. la velocidad varia en funcion del tipo de torreta activa, cambiar
	
	//mode -> 1: subiendo, 2: descargando, 3: bajando, 4: cargando
}//fin de la definicion de la clase accion

Action.prototype.setImData = function (cual) {

	Object.defineProperty(this.images[cual], 'x', {
		value: 0,
		writable: true,
		configurable: true,
		enumerable: false
	});
	Object.defineProperty(this.images[cual], 'y', {
		value: 0,
		writable: true,
		configurable: true,
		enumerable: false
	});
	Object.defineProperty(this.images[cual], 'alpha', {
		value: 1.0,
		writable: true,
		configurable: true,
		enumerable: false
	});
}
  
Action.prototype.constructor = function () {
	//sprites created
	this.iCreated[0] = new Image(); //rockets in all rotates
	this.iCreated[1] = new Image(); //missiles in all rotates
	this.iCreated[2] = new Image(); //bala amiga sprite
	this.iCreated[3] = new Image(); //estela blanca
	this.iCreated[4] = new Image(); //estela de fuego
	this.iCreated[5] = new Image(); //balas enemigas rojas
	this.iCreated[6] = new Image(); //enemigo 1 destruido en 0 -> 360 grados

	this.eneDestr[0]=new Image();
	this.eneDestr[1]=new Image();//nave enemiga 1 destruida,  a x grados
	
	//this.images[0]=new dImage();
	this.images[0] = new Image(); //main spritesheet
	this.images[1] = new Image(); //bloqued devire per orientation
	this.images[2] = new Image(); //sprites with yellow bullet
	this.images[3] = new Image(); //flash for shoot
	this.images[4] = new Image(); //asteroids
	this.images[5] = new Image(); //shields, explodes
	this.images[6] = new Image(); //ships

	this.images[7] = new Image(); //missil
	this.images[8] = new Image(); //rocket
	this.images[9] = new Image(); //smoke snap
	this.images[10] = new Image(); //fire snap
	this.images[11] = new Image(); //bottons shoots
	this.images[12] = new Image(); //estela de balas
	this.images[13] = new Image(); //Numeros grandes para UI
	this.images[14] = new Image(); //Numeros pequenos para UI
	this.images[15] = new Image(); //planeta de fondo
	this.images[16] = new Image(); //penumbra para el planeta de fondo
	this.images[17] = new Image(); //balas enemigas rojas
	this.images[18] = new Image(); //balas enemigas rojas
	this.images[19] = new Image(); //explosiones sprite 10 verticales
	this.images[20] = new Image(); //deep space
	this.images[21] = new Image(); //assensor
	this.images[22] = new Image(); //tambor con las suministros en el ascensor
	//cambiarlo despues a los ultimos en el array de imagenes de la clase
	this.images[23] = new Image(); //enemi1 destruido para 360 grados

	this.images[0].onload = function () {

		miGame.scenes[1].objectsLoaded += 1;
		miGame.scenes[1].bDatGui.w = this.height / 3;
	}

	this.images[0].src = miGame.resolution + "/canon.png";

	this.images[1].onload = function () {

		miGame.scenes[1].objectsLoaded += 1;
		miGame.scenes[1].setImData(1);

		this.x = (canvasW / 2) - (~~(this.width / 2));
		this.y = (canvasH / 2) - (~~(this.height / 2));

	}
	this.images[1].src = miGame.resolution + "/rotate.png";

	this.images[2].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		if (!app) {
			miGame.creaSprite(1, 2, 2, this.width);
		}
	}
	this.images[2].src = miGame.resolution + "/balaAmiga1.png";

	this.images[3].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		miGame.scenes[1].flashData.height = this.height;
		miGame.scenes[1].flashData.radio = ~~(this.height / 2);
	}
	this.images[3].src = miGame.resolution + "/spark.png";

	this.images[4].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.images[4].src = miGame.resolution + "/asteroides.png";

	this.images[5].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		
	}
	this.images[5].src = miGame.resolution + "/escudos.png";

	this.images[6].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		miGame.scenes[1].radioShips = ((this.width / 6));
	}
	this.images[6].src = miGame.resolution + "/enemigo1.png";

	this.images[7].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;

		miGame.scenes[miGame.sceneActive].radioMissiles = this.width;
		if (!app) {
			miGame.creaSprite(1, 7, 0, this.width);
		}

	}
	this.images[7].src = miGame.resolution + "/nCohete.png";

	this.images[8].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		miGame.scenes[1].radioMissiles = this.height;
		//cal the creator sprites
		if (!app) {
			miGame.creaSprite(1, 8, 1, this.width);
		}

	}
	this.images[8].src = miGame.resolution + "/nMisil.png";

	this.images[9].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;

		miGame.scenes[1].playDat.w = this.width;
		miGame.scenes[1].playDat.h = ~~(this.height / 10);
		miGame.scenes[1].playDat.m = ~~(this.width / 2);

		//console.log(miGame.scenes[1].playDat);
	}
	this.images[9].src = miGame.resolution + "/gamePlayGui.png";

	this.images[10].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		if (!app) {
			miGame.creaSprite(1, 10, 4, this.width);
		}

	}
	this.images[10].src = miGame.resolution + "/estela2.png";

	this.images[11].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.images[11].src = miGame.resolution + "/botonesArmas.png"

	this.images[12].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;

		//cal the creator sprites
		if (!app) {
			miGame.creaSprite(1, 12, 3, this.width);
		}

	}
	this.images[12].src = miGame.resolution + "/estela1.png";

	this.images[13].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;

		miGame.scenes[1].numGuiG.w = this.width / 13;
		miGame.scenes[1].numGuiG.h = this.height;
		miGame.scenes[1].numGuiG.rx = this.width / 26;
		miGame.scenes[1].numGuiG.ry = this.height / 2;

	}
	this.images[13].src = miGame.resolution + "/numerosGrandes.png";

	this.images[14].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;

		miGame.scenes[1].numGuiP.w = this.width / 13;
		miGame.scenes[1].numGuiP.h = this.height/3;
		miGame.scenes[1].numGuiP.rx = this.width / 26;
		miGame.scenes[1].numGuiP.ry = this.height / 6;

	}
	this.images[14].src = miGame.resolution + "/numerosPeques.png";


	this.images[15].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		miGame.scenes[1].dataPlanet.x=(canvasW/2 ) - (this.width/2);
		miGame.scenes[1].dataPlanet.y=(canvasH/2 ) - (this.height/2);
		miGame.scenes[1].dataPlanet.w=this.width;
		miGame.scenes[1].dataPlanet.rx=this.width/2;

		//console.log(miGame.scenes[1].dataPlanet);
	}
	this.images[15].src = miGame.resolution + "/es/tierra.png";

	this.images[16].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.images[16].src = miGame.resolution + "/penumbra.png";

	this.images[16].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.images[16].src = miGame.resolution + "/penumbra.png";

	this.images[17].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		//cal the creator sprites
		if (!app) {
			miGame.creaSprite(1, 17, 5, this.width);
		}
	}
	this.images[17].src = miGame.resolution + "/balaEnemiga1.png";
	
	this.images[18].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.images[18].src = miGame.resolution + "/humos.png";
	
	this.images[19].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		miGame.scenes[1].radioExplodes =(this.width / 24);
	}
	this.images[19].src = miGame.resolution + "/explodes.png";
	
	this.images[20].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		
	}
	this.images[20].src = miGame.resolution +"/space2.jpg";
	
	this.images[21].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		miGame.scenes[1].asceData.xIm = canvasW - this.width;
		
		if(isHD){
			
			miGame.scenes[1].asceData.yMin=94;
			miGame.scenes[1].asceData.yMax=462;
			miGame.scenes[1].asceData.recor=462-94;
			miGame.scenes[1].asceData.yTam=94;
			miGame.scenes[1].asceData.xTam=canvasW - 37;
		}else{
			miGame.scenes[1].asceData.yMin=47;
			miGame.scenes[1].asceData.yMax=230;
			miGame.scenes[1].asceData.recor=230-47;
			miGame.scenes[1].asceData.yTam=47;
			miGame.scenes[1].asceData.xTam=canvasW - 18;
		}
		miGame.scenes[1].asceData.xIm
	}
	this.images[21].src = miGame.resolution +"/ascensor.png";
	
	this.images[22].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		
	}
	this.images[22].src = miGame.resolution +"/tambor.png";
	
	this.images[23].onload = function () {
		miGame.scenes[1].objectsLoaded += 1;
		//cal the creator sprites
		if (!app) {
			//miGame.setEnemiDes(1, 23, 1, this.width,45);
		}
	}
	this.images[23].src = miGame.resolution + "/ene1Destroid.png";
	
	//-----------------------
	if (app) {
		//cargar las rotaciones por sprites
		//significa que no se crearon de manera procedural

		this.iCreated[0].src = miGame.resolution + "/cCohetes.png";

		this.iCreated[1].src = miGame.resolution + "/cMisiles.png";

		this.iCreated[2].src = miGame.resolution + "/balaAmiga1Sprite.png";

		this.iCreated[3].src = miGame.resolution + "/estelaC.png";

		this.iCreated[4].src = miGame.resolution + "/iestela2.png";

		this.iCreated[5].src = miGame.resolution + "/balaEnemiga1Sprite.png";
	}

	//set the buttons
	this.buttons[0] = new simpleButton(3, (miGame.guiData[3].width / 2), canvasH - (miGame.guiData[3].height / 2), 0, 0, null, null, "baseJoy", 1, "aBase");


	//set the base of joystick
	this.baseJoy.x = (~~(canvasW / 7));
	this.baseJoy.y = ~~((canvasH) - (~~(canvasH / 2.5)));
	if (miGame.resolution == "HD") {
		this.baseRadio = 192;
	} else {
		this.baseRadio = 96;

	}
	//ud,sx,sy,cx,cy,im,cl,tx,father,doing
	this.buttons[1] = new simpleButton(5, this.baseJoy.x + this.baseRadio, this.baseJoy.y, 6, 0, 0, 0, "joystick", 1, "cRotate");

	this.buttons[4] = new simpleButton(6, canvasW - (~~(canvasW / 9)), (canvasH / 4), 2, 0, 11, 0, "missDis", 1, "bMissile");
	this.buttons[2] = new simpleButton(6, canvasW - (~~(canvasW / 7)), canvasH / 2, 0, 0, 11, 0, "balaDis", 1, "bDisparo");
	this.buttons[3] = new simpleButton(6, canvasW - (~~(canvasW / 9)), canvasH - (~~(canvasH / 5)), 1, 0, 11, 0, "minaDis", 1, "bRocket");


	//the property bullets


	//the generic sounds, no array of sounds

	//shoots canon1
	this.sounds[0] = new Audio();
	this.sounds[0].oncanplaythrough = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.sounds[0].preload = true;
	this.sounds[0].src = "sounds/shoot." + miGame.folderS;

	//shoot missiles and rockets
	this.sounds[1] = new Audio();
	this.sounds[1].oncanplaythrough = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.sounds[1].preload = true;
	this.sounds[1].src = "sounds/rockets." + miGame.folderS;

	//explosions asteroids on right
	this.sounds[2] = new Audio();
	this.sounds[2].oncanplaythrough = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.sounds[2].preload = true;
	this.sounds[2].src = "sounds/eLejanaDer." + miGame.folderS;

	//explosions asteroids on left
	this.sounds[3] = new Audio();
	this.sounds[3].oncanplaythrough = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.sounds[3].preload = true;
	this.sounds[3].src = "sounds/eLejanaIzq." + miGame.folderS;

	//big explosions on right
	this.sounds[4] = new Audio();
	this.sounds[4].oncanplaythrough = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.sounds[4].preload = true;
	this.sounds[4].src = "sounds/eCercaDer." + miGame.folderS;

	//big explosions on right
	this.sounds[5] = new Audio();
	this.sounds[5].oncanplaythrough = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.sounds[5].preload = true;
	this.sounds[5].src = "sounds/eCercaIzq." + miGame.folderS;
	//enemies shoot canon sound, stereo
		
	this.sounds[6]=new Audio();
	this.sounds[6].oncanplaythrough = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.sounds[6].preload = true;
	this.sounds[6].src = "sounds/eShootIzq." + miGame.folderS;
	
	this.sounds[7]=new Audio();
	this.sounds[7].oncanplaythrough = function () {
		miGame.scenes[1].objectsLoaded += 1;
	}
	this.sounds[7].preload = true;
	this.sounds[7].src = "sounds/eShootDer." + miGame.folderS;
	
} //end of constructor

Action.prototype.createBackGround = function () {

		//console.log("llego a create back");
	if(isHD){
		this.dataPlanet.cx=(canvasW / 2 )+(random(-100,100));
		this.dataPlanet.cy=(canvasH / 2 )+(random(-100,100));
	}else{
		this.dataPlanet.cx=(canvasW / 2 )+(random(-50,50));
		this.dataPlanet.cy=(canvasH / 2 )+(random(-50,50));
	}
	
	
	this.dataPlanet.x=this.dataPlanet.cx - this.dataPlanet.rx;
	this.dataPlanet.y=this.dataPlanet.cy - this.dataPlanet.rx;

	ctx2.clearRect(0, 0, canvasW, canvasH);
	//ctx2.fillStyle = miGame.colours[0];
	//ctx2.fillRect(0, 0, canvasW, canvasH);
	
	ctx2.drawImage(this.images[20],0,0);
	ctx2.fill();
	//lights
	/*
	for (this.i = 1; this.i <= 1000; this.i++) {


		if (isHD) this.j = random(2, 4);
		if (!isHD) this.j = random(1, 2);
		ctx2.beginPath();
		ctx2.fillStyle = "rgba("+random(100,255)+","+0+","+random(100,255)+","+(random(50,90)/100)+")";
		ctx2.fillRect(random(0, canvasW), random(0, canvasH), 2, 2);
		ctx2.closePath();
		ctx2.fill();
	}
	*/
	ctx2.save();
	ctx2.translate(this.dataPlanet.cx, this.dataPlanet.cy);
	ctx2.rotate((random(0,359)*PI / 180 ));
	ctx2.drawImage(miGame.scenes[1].images[16],-this.dataPlanet.rx, -this.dataPlanet.rx);
	ctx2.restore();
	
	ctx2.globalAlpha=0.30;
	ctx2.drawImage(miGame.scenes[1].images[15],this.dataPlanet.x,this.dataPlanet.y);
	ctx2.globalAlpha=1.0;
	
	
		this.images[20]=null;
		

} //end craet bagr

Action.prototype.control = function () {
	//console.log(this.iCreated[0]);
	//setings de los labels de gui gameplay
	for (this.i = 1; this.i <= 3; this.i += 1) {
		//this.labels[this.i]={cex:0,cey:0,x:0,y:0,ty:0}
		//console.log("dd "+this.bDatGui.w);
		this.labels[this.i].cex = (this.playDat.w * this.i) - this.playDat.m;
		this.labels[this.i].cey = this.playDat.h / 2;
		this.labels[this.i].ty = this.i - 1;

		this.labels[this.i].x = this.labels[this.i].cex - this.playDat.m;
		this.labels[this.i].y = this.labels[this.i].cey - (this.playDat.h / 2);
		//console.log(this.labels[this.i].cey);
	}
	for (this.i = 4; this.i <= 6; this.i += 1) {
		//this.labels[this.i]={cex:0,cey:0,x:0,y:0,ty:0}
		this.labels[this.i].cex = (canvasW ) - (this.playDat.w * (6 - this.i));
		this.labels[this.i].cex -= this.playDat.m;
		this.labels[this.i].cey = this.playDat.h / 2;
		this.labels[this.i].ty = this.i - 1;
		//console.log(this.i);
		this.labels[this.i].x = this.labels[this.i].cex - this.playDat.m;
		this.labels[this.i].y = this.labels[this.i].cey - (this.playDat.h / 2);

	}
	/*
	this.labels[6].ty=3;
	this.labels[4].ty=5;
	*/
	this.maxEnemies = new numeroGrande(10, 1, this.numGuiG.w, this.numGuiG.h, 2, 13, 1, 1, 0); //from json, value
	this.maxEnemies.setVal();
	
	for(this.i=1; this.i <= this.maxEnemies.val; this.i+=1){
		this.eneDestr[this.i]=new Image();
		miGame.setEnemiDes(1, 23, 1, this.width,45);
	}
	this.turret.maxMisiles = 16; //ojo, estos vienen de json de cada mision
	this.turret.maxRockets = 24;
	this.turret.maxBullets = 101;

	this.turret.dMisiles = new numeroGrande(99, 2, this.numGuiG.w, this.numGuiG.h, 4, 13, 2, 1, 0);
	this.turret.dRockets = new numeroGrande(99, 2, this.numGuiG.w, this.numGuiG.h, 5, 13, 3, 1, 0);
	if (isHD) {
		this.turret.dBullets = new numeroGrande(999, 3, this.numGuiG.w, this.numGuiG.h, 6, 13, 4, 1, -8);
	} else {
		this.turret.dBullets = new numeroGrande(999, 3, this.numGuiG.w, this.numGuiG.h, 6, 13, 4, 1, -4);
	}
	this.totalScore = new numeroGrande(1000, 4, this.numGuiG.w, this.numGuiG.h, null, 13, 5, 1, 0);
	this.totalScore.center.x = canvasW / 2;
	this.totalScore.center.y = canvasH / 10;
	this.totalScore.setVal();

	//ojo con el tiempo, viene del json de configuraciom
	this.isTime = true;
	if (this.isTime) {

		if (isHD) {

			this.mins = new numeroGrande(5, 1, this.numGuiP.w, this.numGuiP.h, 3, 14, 5, 1, -40);
			this.seconds = new numeroGrande(0, 2, this.numGuiP.w, this.numGuiP.h, 3, 14, 5, 1, +40);
			this.mins.setVal();
			this.seconds.setVal();

			this.posPuntosTime.x = this.labels[3].cex + 2;
			this.posPuntosTime.y = this.numGuiP.h / 2;

		} else {

			this.mins = new numeroGrande(5, 1, this.numGuiP.w, this.numGuiP.h, 3, 14, 5, 1, -20);
			this.seconds = new numeroGrande(0, 2, this.numGuiP.w, this.numGuiP.h, 3, 14, 5, 1, +20);
			this.mins.setVal();
			this.seconds.setVal();

			this.posPuntosTime.x = this.labels[3].cex + 1;
			this.posPuntosTime.y = this.numGuiP.h / 2;
		}

		this.mins.substract();
		this.seconds.val = 60;
		this.seconds.decena = 5;
		this.seconds.unidad = 9;

		//this.seconds.setVal();
	}

	this.turret.dMisiles.setVal();
	this.turret.dRockets.setVal();
	this.turret.dBullets.setVal();


	this.i = 1;
	for (this.k = 0; this.k <= this.maxBlltsFr; this.k += 1) {
		//type,id,father,radio,son,damage,colour
		this.myBullets[this.k] = new Bullet(1, this.k, 1, this.images[2].height, 2, 6);
		this.sBullets[this.k] = new Audio();
		this.sBullets[this.k].src = this.sounds[0].src;

	}
	for (this.k = 1; this.k <= this.maxSparks; this.k += 1) {
		this.sparks[this.k] = new Chispa();

	}

	this.maxAsteroids = 10; //from json

	//radio,damage,cry,father,id
	for (this.k = 0; this.k <= 10; this.k += 1) {

		this.asteroids[this.k] = new Asteroid(miGame.guiData[4].width, 5, 1, 1, this.k);

		this.explodes[this.k] = new mainExplode(1, this.k);

		this.sAst[this.k] = [];

		this.sAst[this.k][0] = new Audio();
		this.sAst[this.k][0].src = this.sounds[3].src;

		this.sAst[this.k][1] = new Audio();
		this.sAst[this.k][1].src = this.sounds[2].src;


		this.myMissiles[this.k] = new missileBasic(this.k, this.radioMissiles, this.k);
		this.myRockets[this.k] = new rocketBasic(this.k, 1, this.radioMissiles);
		this.tExplodes[this.k] = new trackExplode(this.k, this.radioExplodes);

		this.sBig[this.k] = [];

		this.sBig[this.k][0] = new Audio();
		this.sBig[this.k][0].src = this.sounds[5].src;

		this.sBig[this.k][1] = new Audio();
		this.sBig[this.k][1].src = this.sounds[4].src;

		//tScores
		this.tScores[this.k]=new tScore(this.numGuiP.h,this.numGuiP.w);
	}


	if (miGame.resolution == "SD") {

		this.radTarget = 24;

	} else {

		this.HD = true;
		this.maxLuceros=500;
	}

	this.flashData.width = this.radTarget * 2;
	this.loading = false;
	this.playing = true;
	this.targetCanon.x = canvasW;
	this.targetCanon.y = ~~(canvasH / 2);

	this.adderAster = random(100, 150);
	this.adderEnemi = random(160, 250);

	//shield setings
	this.shield.width = ~~(this.radioExplodes * 2);
	this.shield.radio = ~~(this.radioExplodes);
	this.shield.center.x = canvasW / 2;
	this.shield.center.y = ~~(canvasH / 2);
	this.shield.restart();
	//chorros
	for (this.k = 0; this.k <= this.maxParticles; this.k += 1) {

		this.myParticles[this.k] = new Chorro(this.k);

	}
	//sonidos de lanzamiento de misiles y rockets
	for (this.k = 0; this.k <= 20; this.k += 1) {
		this.sRockets[this.k] = new Audio();
		this.sRockets[this.k].src = this.sounds[1].src;
	}
	this.shield.setLifeData();
	this.turret.setLifeData();

	//enemi bullets
	for(this.k=0; this.k <= this.maxBlltsEn; this.k+=1){
		//type,id,father,radio,son,damage,colour
		this.sBullEne[this.k]=[];
		
		this.sBullEne[this.k][0]=new Audio();
		this.sBullEne[this.k][1]=new Audio();
		
		this.sBullEne[this.k][0].src=this.sounds[6].src;
		this.sBullEne[this.k][1].src=this.sounds[7].src;
		
		this.theyBullets[this.k]=new Bullet(2,"En"+this.k,1,this.images[2].width,2,6);
	}
	//sumador disparos enemigos, amigos
	this.adRunEnBul=1;
	this.adRunAmBul=1;
	
	//luceros dinamicos
	for(this.k=0; this.k <= this.maxLuceros; this.k+=1){
		this.luceros[this.k]=new Lucero(this.k);
	}
	
	//enemigos por MISION, OJO del json
	for(this.k=0; this.k <= this.maxEnemies.val; this.k+=1){
		//ojo con la creacion de enemigos, viene del json cuantos se crearan
		// la politica es crearlos todos al inicio de cada escena
		this.enemies[this.k] = new Enemi1(this.k, this.radioShips, this.radioShips, random(0, canvasW), random(0, canvasH), this.maxEnemies.val);
		this.enemies[this.k].flashData.w=this.flashData.height;
		this.enemies[this.k].flashData.r=this.flashData.height/2;
	}
	
} //end of control method

Action.prototype.up = function () {

	if (this.playing) {
		//turn at 270 degrees

	}
}

Action.prototype.down = function () {

	if (this.playing) {


	}
}

Action.prototype.left = function () {

	if (this.playing) {

	}
}

Action.prototype.right = function () {

	if (this.playing) {

	}
}

Action.prototype.action = function (w) {

	if (this.playing) {
		switch (w) {
		case 32:
			this.turret.runMissile(); //zero is a target to these missile
			break;
		case 509:
			if (this.turret.dBullets.val > 0) this.shooting = true;
			//this.turret.runMissile();
			break;
		case 88:
			//lanzar un cohete, con la letra "x"
			this.turret.runRocket();
			break;

		}
	}

}

Action.prototype.stop = function () {

	if (this.playing) {

	}
}

Action.prototype.runSpark = function (dx, dy, quien,r,g,b) {
		
		for (this.i = 1; this.i <= this.maxSparks; this.i += 1) {

			if (this.sparks[this.i].mode == false) {

				this.sparks[this.i].mode = true;
				this.sparks[this.i].x = dx;

				this.sparks[this.i].y = dy;
				this.sparks[this.i].duracion = random(10, 15);


				for (this.j = 1; this.j <= 6; this.j += 1) {
					if (isHD) {
						this.sparks[this.i].particula[this.j] = {
							x: dx,
							y: dy,
							vx: random(-4, 4),
							vy: random(-4, 4),
							ancho: 2,
							r: r,
							g: g,
							b: b,
							a: 1.0
						}
					} else {
						this.sparks[this.i].particula[this.j] = {
							x: dx,
							y: dy,
							vx: random(-2, 2),
							vy: random(-2, 2),
							ancho: 1,
							r: r,
							g: g,
							b: b,
							a: 1.0
						}
					}

				}
				break;
			}
		}

	} //end of runSpark

Action.prototype.shootBullet = function(){

	if (this.turret.dBullets.val < 1) return;

		if (!this.myBullets[this.adRunAmBul].mode) {

		this.myBullets[this.adRunAmBul].mode = true;
		this.myBullets[this.adRunAmBul].aGrads = this.turret.aGrads + (random(-1, 1));
		this.myBullets[this.adRunAmBul].aRads = (this.myBullets[this.adRunAmBul].aGrads * PI) / 180;


		this.myBullets[this.adRunAmBul].origin.x = ~~(this.turret.oBullets.x);
		this.myBullets[this.adRunAmBul].origin.y = ~~(this.turret.oBullets.y);

		//ojo aqui, cambio a mayor presicion
		if (this.turret.aGrads > 263 & this.turret.aGrads <= 270) {
			if (miGame.resolution == "HD") {
				this.myBullets[this.adRunAmBul].origin.x = ~~(this.turret.oBullets.x + 2);
			} else {
				this.myBullets[this.adRunAmBul].origin.x = ~~(this.turret.oBullets.x + 1);
			}
		}

		this.myBullets[this.adRunAmBul].center.x = ~~(this.turret.oBullets.x);
		this.myBullets[this.adRunAmBul].center.y = ~~(this.turret.oBullets.y);

		/*
		this.myBullets[this.adRunAmBul].cutX=360-this.turret.aGrads;
		if(this.myBullets[this.adRunAmBul].cutX == 360)this.myBullets[this.adRunAmBul].cutX=0;
		*/
		if (this.turret.aGrads >= 0 & this.turret.aGrads <= 119) {

			this.myBullets[this.adRunAmBul].cutY = 0;
			this.myBullets[this.adRunAmBul].cutX = this.turret.aGrads;

		} else if (this.turret.aGrads > 119 & this.turret.aGrads <= 239) {

			this.myBullets[this.adRunAmBul].cutY = 1;
			this.myBullets[this.adRunAmBul].cutX = this.turret.aGrads - 120;

		} else if (this.turret.aGrads > 239 & this.turret.aGrads <= 359) {

			this.myBullets[this.adRunAmBul].cutY = 2;
			this.myBullets[this.adRunAmBul].cutX = this.turret.aGrads - 240;

		} else if (this.turret.aGrads == 360) {

			this.myBullets[this.adRunAmBul].cutY = 0;
			this.myBullets[this.adRunAmBul].cutX = 0;

		}

		//this.sounds[this.myBullets[this.adRunAmBul].sound].pos(((canvasW/2)+(this.turret.oBullets.x)/1000).toFixed(2),0,0);

		//this.sounds[this.myBullets[this.adRunAmBul].sound].orientation(0,0,0);
		this.sBullets[this.adRunAmBul].play();

		this.runSpark(this.turret.oBullets.x, this.turret.oBullets.y,this.myBullets[this.adRunAmBul].id,255,255,1);

		this.myBullets[this.adRunAmBul].setEnded();

		this.turret.dBullets.substract();
		this.flashData.adder = 0;
		this.flashData.x = this.turret.oBullets.x - this.flashData.radio;
		this.flashData.y = this.turret.oBullets.y - this.flashData.radio;
		//console.log("shoot the bullet "+this.myBullets[this.adRunAmBul].center.x);
		this.shootingR = false;
		
	}
	this.adRunAmBul+=1;
	if(this.adRunAmBul > this.maxBlltsFr)this.adRunAmBul=1;

}

//run enemie bullets
Action.prototype.runEneBullet=function(ox,oy,grad){
	//Nuevo metodo
	if(!this.theyBullets[this.adRunEnBul].mode){
		//disparar esta bala
		this.theyBullets[this.adRunEnBul].mode=true;
		this.theyBullets[this.adRunEnBul].aGrads=grad;
		this.theyBullets[this.adRunEnBul].aRads=(grad * PI) / 180;
		this.theyBullets[this.adRunEnBul].origin.x=ox;
		this.theyBullets[this.adRunEnBul].origin.y=oy;
		
		this.theyBullets[this.adRunEnBul].center.x=ox;
		this.theyBullets[this.adRunEnBul].center.y=oy;
		this.theyBullets[this.adRunEnBul].setEnded();
		this.theyBullets[this.adRunEnBul].hipo=0;
		
		//cutx
		if (grad >= 0 & grad <= 119) {

			this.theyBullets[this.adRunEnBul].cutY = 0;
			this.theyBullets[this.adRunEnBul].cutX = grad;

		} else if (grad > 119 & grad <= 239) {

			this.theyBullets[this.adRunEnBul].cutY = 1;
			this.theyBullets[this.adRunEnBul].cutX = grad - 120;

		} else if (grad > 239 & grad <= 359) {

			this.theyBullets[this.adRunEnBul].cutY = 2;
			this.theyBullets[this.adRunEnBul].cutX = grad - 240;

		} else if (grad == 360) {

			this.theyBullets[this.adRunEnBul].cutY = 0;
			this.theyBullets[this.adRunEnBul].cutX = 0;

		}
		//el sonido posicionado
		this.posAudX = ((ox * 100) / canvasW) / 100;

		if (this.posAudX > 0.90) this.posAudX = 0.90;
		if (this.posAudX < 0.10) this.posAudX = 0.10;

		this.sBullEne[this.adRunEnBul][1].volume = this.posAudX;
		this.sBullEne[this.adRunEnBul][0].volume = 1.0 - this.posAudX;

		this.sBullEne[this.adRunEnBul][0].play();
		this.sBullEne[this.adRunEnBul][1].play();
		this.runSpark(ox, oy,this.theyBullets[this.adRunEnBul].id,255,10,10);
		
	}else{
		console.log("NO hay ninguna bala enemiga disponible");
	}
	this.adRunEnBul+=1;
	if(this.adRunEnBul > this.maxBlltsEn)this.adRunEnBul=1;
	
}

Action.prototype.playExplode = function (sx) {
	//esplodes asteroides
	//define volume from pos audio


	this.rExp += 1;
	if (this.rExp > 10) this.rExp = 1;
	//console.log("exploto a expo pequena "+this.rExp);
	this.posAudX = ((sx * 100) / canvasW) / 100;

	if (this.posAudX > 0.90) this.posAudX = 0.90;
	if (this.posAudX < 0.10) this.posAudX = 0.10;

	this.sAst[this.rExp][1].volume = this.posAudX;
	this.sAst[this.rExp][0].volume = 1.0 - this.posAudX;


	this.sAst[this.rExp][0].play();
	this.sAst[this.rExp][1].play();



}

Action.prototype.playExplodeBig = function (sx, q) {

	//define volume from pos audio
	//console.log("grandee");
	this.posAudX = ((sx * 100) / canvasW) / 100;

	if (this.posAudX > 0.90) this.posAudX = 0.90;
	if (this.posAudX < 0.10) this.posAudX = 0.10;

	this.sBig[q][1].volume = this.posAudX;
	this.sBig[q][0].volume = 1.0 - this.posAudX;



	this.sBig[q][0].play();
	this.sBig[q][1].play();
}

Action.prototype.runAsteroid = function () {
	
	if (this.totalAst == this.maxAsteroids) return;
	for (this.k = 1; this.k <= 10; this.k += 1) {

		if (!this.asteroids[this.k].mode) {
			//lanzar el asteroides
			this.asteroids[this.k].mode = true;
			switch (random(0, 0)) {
			case 0:
				//lanzar de arriba a abajo
				//posicionar el asteroide;
				this.asteroids[this.k].center.x = random(0, canvasW);
				this.asteroids[this.k].center.y = borders[0].y1;

				this.asteroids[this.k].pos.x = this.asteroids[this.k].center.x - this.asteroids[this.k].radio;
				this.asteroids[this.k].pos.y = this.asteroids[this.k].center.y - this.asteroids[this.k].radio;

				//definir el angulo de destino del asteroide
				this.asteroids[this.k].aGrads = this.asteroids[this.k].center.getAngulo(random(0, canvasW), canvasH);
				//this.asteroids[this.k].aGrads=this.asteroids[this.k].center.getAngulo((canvasW/2),(canvasH));
				this.asteroids[this.k].aRads = (this.asteroids[this.k].aGrads * 3.14159) / 180;
				if (this.mode == "HD") {
					this.asteroids[this.k].speed = 2;
				} else if (this.mode == "SD") {
					this.asteroids[this.k].speed = 1;
				}


				this.asteroids[this.k].cutX = random(0, 7);
				this.asteroids[this.k].cutY = 3; //tomar de json data
				this.asteroids[this.k].health = aColours[this.asteroids[this.k].cutY].health;
				this.asteroids[this.k].fire = aColours[this.asteroids[this.k].cutY].fire;
				this.totalAst += 1;

				break;

			}
			break;

		}
	}
}

Action.prototype.runEnemie = function () {
		
	if (this.totalEne == this.maxEnemies.val) return;

	for (this.k = 1; this.k <= maxEne; this.k += 1) {

		if (!this.enemies[this.k].mode & this.enemies[this.k].health > 0 & !this.enemies[this.k].zombi) {
			//lanzar el enemigo
			//ojo, falta el reingreso con vida
			//reducida si es el caso

			this.enemies[this.k].mode = true;
			//console.log("se lanzo enemigo "+this.k);
			switch (random(0, 1)) {
			case 0:
				//lanzar de arriba a abajo
				//posicionar el asteroide;
				this.enemies[this.k].center.x = random(0, canvasW);
				this.enemies[this.k].center.y = borders[0].y1;

				this.enemies[this.k].pos.x = this.enemies[this.k].center.x - this.enemies[this.k].radio;
				this.enemies[this.k].pos.y = this.enemies[this.k].center.y - this.enemies[this.k].radio;

				//definir el angulo de destino del asteroide
				this.enemies[this.k].aGrads = this.enemies[this.k].center.getAngulo(random(0, canvasW), canvasH);
				//this.enemies[this.k].aGrads=this.enemies[this.k].center.getAngulo((canvasW/2),(canvasH));
				this.enemies[this.k].aRads = (this.enemies[this.k].aGrads * 3.14159) / 180;

				this.enemies[this.k].cutX = 0;
				this.enemies[this.k].state = 1;

				this.totalEne += 1;

				break;
			case 1:
				//lanzar de abajo a arriba 
				//posicionar el asteroide;
				this.enemies[this.k].center.x = random(0, canvasW);
				this.enemies[this.k].center.y = borders[2].y1;

				this.enemies[this.k].pos.x = this.enemies[this.k].center.x - this.enemies[this.k].radio;
				this.enemies[this.k].pos.y = this.enemies[this.k].center.y - this.enemies[this.k].radio;

				//definir el angulo de destino del asteroide
				this.enemies[this.k].aGrads = this.enemies[this.k].center.getAngulo(random(0, canvasW), 0);
				if (this.enemies[this.k].aGrads < 0) {
					this.enemies[this.k].aGrads = 180 - this.enemies[this.k].aGrads;
				}
				//this.enemies[this.k].aGrads=this.enemies[this.k].center.getAngulo((canvasW/2),(canvasH));
				this.enemies[this.k].aRads = (this.enemies[this.k].aGrads * 3.14159) / 180;

				this.enemies[this.k].cutX = 0;
				this.enemies[this.k].state = 1;

				this.totalEne += 1;
				break;

			}
			break;

		}
	}

}
	//exploded caused when a bulletr colision with a easteroid
Action.prototype.runExplode = function (rx, ry, rar, fire, vel, father, radio, hFire,sc) {
		//console.log("se lanzo la explosion "+hFire);
		for (this.n = 1; this.n <= 10; this.n += 1) {

			if (!this.explodes[this.n].mode) {
				this.explodes[this.n].mode = true;
				this.explodes[this.n].haveFire = hFire;
				this.explodes[this.n].center.x = rx;
				this.explodes[this.n].center.y = ry;
				this.explodes[this.n].autor = sc;

				this.explodes[this.n].pos.x = this.explodes[this.n].center.x - this.radioExplodes;
				this.explodes[this.n].pos.y = this.explodes[this.n].center.y - this.radioExplodes;

				this.explodes[this.n].aRads = rar;
				this.explodes[this.n].fireType = fire;
				this.explodes[this.n].smokeType = random(0, 3);
				this.explodes[this.n].speed = vel;
				this.explodes[this.n].cutY = 0;
				/*
				if(hFire){
					this.explodes[this.n].cutX = 7;
				}else{
					this.explodes[this.n].cutX = random(8,9);
				}
				*/
				
				this.explodes[this.n].cutX = random(8,11);
				
				this.explodes[this.n].radio = this.radioExplodes;
				this.explodes[this.n].width = this.radioExplodes * 2;

				this.explodes[this.n].damage = aColours[father].health; //the health of asteroid is the damage of explode
				this.explodes[this.n].colour = aColours[father].value;

				//console.log(this.explodes[this.n].damage);
				this.explodes[this.n].damageRadio = radio;

				this.explodes[this.n].fireAlpha = 1.0;
				this.explodes[this.n].smokeAlpha = 1.0;
				this.explodes[this.n].life = random(50, 70);

				for (this.o = 0; this.o < this.explodes[this.n].maxPoints; this.o += 1) {

					this.explodes[this.n].points[this.o].center.x = rx + radio;
					this.explodes[this.n].points[this.o].center.y = ry + radio;

					this.explodes[this.n].points[this.o].pos.x = this.explodes[this.n].points[this.o].center.x;
					this.explodes[this.n].points[this.o].pos.y = this.explodes[this.n].points[this.o].center.y;
					if (this.HD) {
						this.explodes[this.n].points[this.o].speed = random(200, 500) / 100;
					} else {
						this.explodes[this.n].points[this.o].speed = random(100, 250) / 100;
					}
					this.explodes[this.n].points[this.o].aRads = (random(0, 360)) * 3.14159 / 180;

					this.explodes[this.n].points[this.o].alpha = 1.0;
				}
				//play explode sound

				this.playExplode(rx);
				
				break;
			}
		}
	}
	//explode caused by rockets and missiles
Action.prototype.runExBig = function (rx, ry, arads, agrads,we){
	//console.log("grados q llegan a exbig "+agrads);
	for (this.n = 1; this.n <= 10; this.n += 1) {

		if (!this.tExplodes[this.n].mode) {

			this.tExplodes[this.n].mode = true;
			this.tExplodes[this.n].center.x = rx;
			this.tExplodes[this.n].center.y = ry;
			this.tExplodes[this.n].aRads = arads;
			this.tExplodes[this.n].nLife = 0;
			this.tExplodes[this.n].cutY = 0;
			switch(we){
				case 1:
					
					this.tExplodes[this.n].cutX= random(0,3);//explosiones de asteroides provocada por mis o cohts
					
				break;
				case 2:
					
					this.tExplodes[this.n].cutX= random(4,7);//explosiones de naves
				break;
			}
			
			


			for (this.p = 0; this.p <= this.tExplodes[this.n].maxParticles; this.p += 1) {

				this.tExplodes[this.n].points[this.p].radio = 2;
				this.tExplodes[this.n].points[this.p].center.x = this.tExplodes[this.n].center.x;
				this.tExplodes[this.n].points[this.p].center.y = this.tExplodes[this.n].center.y;

				this.tExplodes[this.n].points[this.p].pos.x = this.tExplodes[this.n].center.x;
				this.tExplodes[this.n].points[this.p].pos.y = this.tExplodes[this.n].center.y;
				if (this.HD) {
					this.tExplodes[this.n].points[this.p].speed = random(1, 4);
					this.tExplodes[this.n].points[this.p].aRads = ((random(0, 360)) * 3.14159) / 180;
				} else {
					this.tExplodes[this.n].points[this.p].speed = random(1, 3);
					this.tExplodes[this.n].points[this.p].aRads = ((random(0, 360)) * 3.14159) / 180;
				}

				this.tExplodes[this.n].points[this.p].alpha = 1.0;
				


				if (this.HD) {
					this.tExplodes[this.n].points[this.p].radio = 2;
				} else {
					this.tExplodes[this.n].points[this.p].radio = 1;
				}
			}
			for (this.p = 0; this.p <= this.tExplodes[this.n].maxParticles / 2; this.p += 1) {
				this.tExplodes[this.n].points[this.p].aRads = ((random(agrads - 30, agrads + 30)) * 3.14159) / 180;
				if (this.HD) {
					this.tExplodes[this.n].points[this.p].speed = random(1, 8);
				} else {
					this.tExplodes[this.n].points[this.p].speed = random(1, 5);
				}
			}
			this.playExplodeBig(rx, this.tExplodes[this.n].index);
			//console.log("se lanzo la explosion "+this.n);
			break;
		}
	}
}

//y
Action.prototype.runChorro = function (rx, ry, ang, ap) {

		for (this.k = 1; this.k <= this.maxParticles; this.k += 1) {
			if (!this.myParticles[this.k].mode) {

				this.myParticles[this.k].mode = true;
				this.myParticles[this.k].ini.x = rx;
				this.myParticles[this.k].ini.y = ry;
				this.myParticles[this.k].mAngle = ang;
				this.myParticles[this.k].aperture = ap;

				this.myParticles[this.k].setInit();
				//sonido

				break;
			}
		}

}

Action.prototype.runTscore=function(dx,dy,how){
	//Nuevo metodo
	this.scoreData.confrontacion += how;
	for (this.n = 1; this.n <= 10; this.n += 1) {
		if(!this.tScores[this.n].mode){
			
			this.tScores[this.n].mode=true;
			this.tScores[this.n].value=how;
			this.tScores[this.n].center.x=~~(dx);
			this.tScores[this.n].center.y=~~(dy);
			this.tScores[this.n].setRun();
			break;
		}
	}
	
}
//p
Action.prototype.update = function(){

	if (this.bloqued) return;

	if (this.loading) {
		if (this.objectsLoaded >= this.allObjects) {
			this.createBackGround();
			this.control();
		} else {
			console.log("not yet loaded " + this.objectsLoaded);
		}
	}

	if (this.playing) {
		this.frame += 1;
		if (app) {
			if (this.buttons[0].touch()) {
				//touch in the area of joystick

				if (this.buttons[1].touch()) {
					//touch the joystick
					this.joyTouched = true;
				}
				if (this.joyTouched) {

					this.dataJoy.aRads = this.baseJoy.getAnguloRads(this.buttons[0].touched.x, this.buttons[0].touched.y);

					this.buttons[1].center.x = this.baseJoy.x + (Math.cos(this.dataJoy.aRads) * this.baseRadio);
					this.buttons[1].center.y = this.baseJoy.y + (Math.sin(this.dataJoy.aRads) * this.baseRadio);

					this.buttons[1].pos.x = this.buttons[1].center.x - this.buttons[1].radioX;
					this.buttons[1].pos.y = this.buttons[1].center.y - this.buttons[1].radioY;

					this.dataJoy.aGrads = this.baseJoy.getAngulo(this.buttons[0].touched.x, this.buttons[0].touched.y);
					if (this.dataJoy.aGrads < 0) {
						this.dataJoy.aGrads = 360 + (this.dataJoy.aGrads);
					}

					//if(isEven(this.dataJoy.aGrads)){
					this.turret.aGrads = this.dataJoy.aGrads;
					//}

				}


			} else {
				this.joyTouched = false;
			}

			if (this.buttons[4].touch()) {
				this.action(32);
			}
			if (this.buttons[3].touch()) {
				this.action(88);
			}
		} else {

			this.dataJoy.aGrads = miGame.posMouse.getAngulo(canvasW / 2, ~~(canvasH / 2));
			//this.dataJoy.aGrads=this.baseJoy.getAngulo(miGame.posMouse.x,miGame.posMouse.y);
			this.turret.aGrads = (180 + this.dataJoy.aGrads);
		}




		this.turret.update();
		this.shield.update();
		//targetn of canon main
		//this.ay=((this.hipo* 0.6)*(this.vel))*Math.sin(this.aRads);
		this.targetCanon.x = ~~((canvasW / 2) + ((canvasW / 2) * (Math.cos(this.turret.aRads))));
		this.targetCanon.y = ~~((~~(canvasH / 2)) + ((canvasW / 2) * (Math.sin(this.turret.aRads))));

		this.sTargetCanon.x = this.targetCanon.x - (this.radTarget);

		if (this.targetCanon.y >= 0 & this.targetCanon.y <= canvasH) {

			this.sTargetCanon.y = this.targetCanon.y - (this.radTarget);

		} else if (this.targetCanon.y < 0) {

			this.correcData.aGrads = 270 - (this.turret.aGrads);
			this.correcData.aRads = (this.correcData.aGrads * 3.14159) / 180;
			this.correcData.co = this.targetCanon.y;
			this.correcData.ca = this.correcData.co * (Math.tan(this.correcData.aRads));

			this.sTargetCanon.x = this.targetCanon.x - (this.correcData.ca + (this.radTarget));
			//this.sTargetCanon.y=canvasH- (this.radTarget/2);

			this.sTargetCanon.y = 0 - (this.radTarget);

		} else if (this.targetCanon.y > canvasH) {
			//la mira se sale por abajo
			//correccion de posicion para el target del cañon principal
			this.correcData.aGrads = 90 - (this.turret.aGrads);
			this.correcData.aRads = (this.correcData.aGrads * 3.14159) / 180;
			this.correcData.co = this.targetCanon.y - canvasH;
			this.correcData.ca = this.correcData.co * (Math.tan(this.correcData.aRads));

			this.sTargetCanon.x = this.targetCanon.x - (this.correcData.ca + (this.radTarget));
			this.sTargetCanon.y = canvasH - (this.radTarget);
		}

		for (this.i = 2; this.i <= 4; this.i += 1) {
			if (this.buttons[this.i].touch()) {
				this.doing = this.buttons[this.i].id;
			}
		}


		if (this.buttons[2].touch()) {
			this.shooting = true;
		}
		if (this.shooting) {
			if (this.turret.dBullets.val > 0) {
				if (!this.shootingR) {
					this.shootingR = true;
				}
			}
		}
		if (this.shootingR) {

			if (!this.downing) {
				//subir el corte hasta
				this.flashData.mode = true;
				if (this.turret.cutX == 1) this.shootBullet();
				this.turret.cutX += 1;
				if (this.turret.cutX == 6) {
					this.turret.cutX = 4;
					this.downing = true;
				}
			} else {
				this.turret.cutX -= 1;
				if (this.turret.cutX == 1) {

					if (app) this.shooting = false;
					this.downing = false;
				}
			}
		}

		//bullets manage
		for (this.k = 1; this.k <= this.maxBlltsFr; this.k += 1) {
			if (this.myBullets[this.k].mode) {
				this.myBullets[this.k].update();
			}
		}
		
		//enemi bullets manage
		for (this.k = 1; this.k <= this.maxBlltsEn; this.k += 1) {
			if (this.theyBullets[this.k].mode) {
				this.theyBullets[this.k].update();
			}
		}

		//sparks
		for (this.i = 1; this.i <= this.maxSparks; this.i += 1) {
			if (this.sparks[this.i].mode) {
				this.sparks[this.i].update();
			}
		}
		//asteroids
		for (this.i = 1; this.i <= 10; this.i += 1) {
			if (this.asteroids[this.i].mode) {
				this.asteroids[this.i].update();
			}
		}

		if (this.flashData.mode) {
			this.flashData.adder += 1;
			if (this.flashData.adder > 1) {
				this.flashData.mode = false;
			}
		}

		//manage run asteroids
		this.adderAster -= 1;
		if (this.adderAster < 1) {
			this.adderAster = random(100, 150);
			this.runAsteroid();
		}

		//manage run enemies
		this.adderEnemi -= 1;
		if (this.adderEnemi < 1) {
			this.adderEnemi = random(100, 150);
			this.runEnemie();
		}
		
		for (this.i = 1; this.i <= maxEne; this.i += 1) {
			if (!this.enemies[this.i].mode & this.enemies[this.i].zombi) this.enemies[this.i].upZombie();
		}
		for (this.i = 1; this.i <= maxEne; this.i += 1) {
			if (this.enemies[this.i].mode) this.enemies[this.i].update();
		}

		//manage explodes main
		for (this.i = 1; this.i <= 10; this.i += 1) {
			if (this.explodes[this.i].mode) this.explodes[this.i].update();
			if (this.myMissiles[this.i].mode) this.myMissiles[this.i].update();
			if (this.myRockets[this.i].mode) this.myRockets[this.i].update();
			if (this.tExplodes[this.i].mode) this.tExplodes[this.i].update();
			if (this.tScores[this.i].mode) this.tScores[this.i].update();
			
		}



		//general particles
		for (this.k = 1; this.k <= this.maxParticles; this.k += 1) {
			if (this.myParticles[this.k].mode) this.myParticles[this.k].update();
		}
		//manage time
		if (this.isTime) {
			this.cTimeF += deltaTime;
			this.cTime = ~~(this.cTimeF);

			if (this.cTime != this.lastTime) {

				//console.log(this.cTime);
				this.lastTime = this.cTime;


				if (this.cTime > 59) {

					if (this.mins.val > 0) {

						this.cTime = 0;
						this.cTimeF = 0.0;

						this.seconds.val = 60;
						this.seconds.decena = 6;
						this.seconds.unidad = 0;

					} else if (this.mins.val == 0) {
						this.isTime = false;
						console.log("se acabo el tiempo hp !");
					}
					this.mins.substract();
				} else {
					this.seconds.substract();
				}

			} //fin de triger de segundo
			//
		}
		
		
		//gestion del asensor
		switch (this.asceData.mode){
			case 1:
				//subiendo del planeta a la torreta
				this.asceData.cyTam += this.asceData.vel;
				this.asceData.yTam = this.asceData.yMax - (~~this.asceData.cyTam);
				
				if(this.asceData.yTam <= this.asceData.yMin){
					this.asceData.sum=0;
					this.asceData.yTam = this.asceData.yMin;
					this.asceData.mode=2;
				}
				//console.log("ahora subiendo");
			break;
			case 2:
				//descargando a la torreta
				this.asceData.sum+=1;
				if(this.asceData.sum >= this.asceData.tope){
					this.asceData.sum=0;
					this.asceData.mode=3;
					this.asceData.cyTam=0.0;
				}
				//console.log("ahora descargando");
			break;
			case 3:
				//bajando de la torreta al planeta
				//console.log("ahora bajando");
				this.asceData.cyTam += this.asceData.vel;
				this.asceData.yTam = this.asceData.yMin + (~~this.asceData.cyTam);
				if(this.asceData.yTam >= this.asceData.yMax){
					this.asceData.sum=0;
					this.asceData.yTam = this.asceData.yMax;
					this.asceData.mode=4;
				}
				
			break;
			case 4:
				//cargando la torreta
				this.asceData.sum+=1;
				//console.log("ahora cargando");
				if(this.asceData.sum >= this.asceData.tope){
					this.asceData.sum=0;
					this.asceData.cyTam=0.0;
					this.asceData.mode=1;
					
				}
			break;
				
		}
		
		//gestion de lucero
		/*
		if(isHD){
		for(this.k=1; this.k <= this.maxLuceros; this.k+=1){
			this.luceros[this.k].update();
		}}
		*/
	} //end of playing in update by class Action

}

//89
Action.prototype.paint = function () {
	ctx.clearRect(0, 0, canvasW, canvasH);
	//
	if (this.bloqued) {
		ctx.fillStyle = miGame.colours[0];
		ctx.beginPath();
		ctx.fillRect(0, 0, canvasH, canvasW);
		ctx.fill();
		ctx.closePath();
		ctx.drawImage(this.images[1], this.images[1].y, this.images[1].x);

	}

	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.font = "12Px Arial";

	if (touches[0] != null) {
		//ctx.fillText(touches[0].x+" , "+touches[0].y,50,200);
	}
	if (this.bloqued) return;

	if (this.loading) {

	}

	if (this.playing) {


		ctx.fillStyle = "rgba(255,255,255,1)";
		//ctx.font = miGame.tTxt + "Px arial";
		//ctx.fillText(this.asceData.yTam, 50, 110);
		//ctx.fillText(this.enemies[1].centerF.y, 50, 140);
		/*
        
        ctx.fillText("ast actvs "+this.totalAst,50,160);
        ctx.fillText("max asteroids "+this.maxAsteroids,200,160);
       /*
        ctx.fillText("mis 1 grads "+this.myMissiles[1].aGrads,50,200);
        ctx.fillText("mis 1 rads "+this.myMissiles[1].aRads,50,240);
        */
		//this.buttons[0].paint();
		
		//gestion de luceros
		/*
		if(isHD){
			for(this.k=1; this.k <= this.maxLuceros; this.k+=1){
				this.luceros[this.k].paint();
			}
		}
		*/
		ctx.fillStyle="rgba(255,255,255,1.0)";	
		//enemies with life
		for (this.i = 1; this.i <= maxEne; this.i += 1) {
			if (!this.enemies[this.i].mode & this.enemies[this.i].zombi) this.enemies[this.i].paint2();
		}
		
		this.turret.paintBase();
		
		//ctx.drawImage(this.eneDestr[1],0,200);

		//flas shoot
		if (this.flashData.mode) {
			ctx.drawImage(this.images[3],0,0,this.flashData.height,this.flashData.height,this.flashData.x,this.flashData.y,this.flashData.height,this.flashData.height);
		}
		//bullets manage
		for (this.k = 1; this.k <= this.maxBlltsFr; this.k += 1) {
			if (this.myBullets[this.k].mode) {
				this.myBullets[this.k].paint();
			}
		}
		//enemi bullets manage
		for (this.k = 1; this.k <= this.maxBlltsEn; this.k += 1) {
			if (this.theyBullets[this.k].mode) {
				this.theyBullets[this.k].paint();
			}
		}
		//asteroids
		for (this.i = 1; this.i <= 10; this.i += 1) {
			if (this.asteroids[this.i].mode) {
				this.asteroids[this.i].paint();
			}
		}
		
		//enemies with life
		for (this.i = 1; this.i <= maxEne; this.i += 1) {
			if (this.enemies[this.i].mode) this.enemies[this.i].paint();
		}
		//manage explodes main
		for (this.i = 1; this.i <= 10; this.i += 1) {

			if (this.explodes[this.i].mode) this.explodes[this.i].paint();
			if (this.myMissiles[this.i].mode) this.myMissiles[this.i].paint();
			if (this.myRockets[this.i].mode) this.myRockets[this.i].paint();
			if (this.tExplodes[this.i].mode) this.tExplodes[this.i].paint();
			if (this.tScores[this.i].mode) this.tScores[this.i].paint();
		}
		//general particles
		for (this.i = 1; this.i <= this.maxParticles; this.i += 1) {
			if (this.myParticles[this.i].mode) this.myParticles[this.i].paint();
		}


		//spaks
		for (this.i = 1; this.i <= this.maxSparks; this.i += 1) {
			if (this.sparks[this.i].mode) {
				this.sparks[this.i].paint();
			}
		}

		for (this.i = 1; this.i <= 10; this.i += 1) {
			if (this.tScores[this.i].mode) this.tScores[this.i].paint();
		}
		//base of joystick
		if (app) {
			ctx.lineWidth = miGame.lineW * 2;
			ctx.strokeStyle = "rgba(255,147,0,1.0)";
			ctx.beginPath();
			ctx.arc(this.baseJoy.x, this.baseJoy.y, this.baseRadio, 0, 2 * Math.PI, true);
			ctx.stroke();
			ctx.closePath();
			ctx.lineWidth = 1;

			//this.buttons[0].paint2();//sabe de la base del joystick

			this.buttons[1].paint2();
			this.buttons[2].paint2();
			this.buttons[3].paint2();
			this.buttons[4].paint2();

		}

		ctx.drawImage(this.images[0], 0,
			1 * this.flashData.width,
			this.flashData.width,
			this.flashData.width,
			this.sTargetCanon.x,
			this.sTargetCanon.y,
			this.flashData.width,
			this.flashData.width);

		ctx.fillStyle = "rgba(234,0,237,1.0)";
		ctx.font = "20Px Arial";
		//ctx.fillText("ESCUDO : "+this.shield.percentLife+" % ",50,50);

		this.turret.paint();
		this.shield.paint();
		//ctx.fillText(" m x "+this.shooting,50,150);
		//ctx.fillText("m y "+miGame.posMouse.y,200,150);

		//ctx.fillText("ang de mouse  "+this.turret.aGrads,50,200);

		/*ctx.fillText("y de target  "+this.targetCanon.y,50,250);
		ctx.fillText("x de target real  "+this.sTargetCanon.x,50,300);
		ctx.fillText("ca target  "+this.correcData.ca,50,350);
		ctx.fillText("co target  "+this.correcData.co,50,400);
		ctx.fillText("grads target  "+this.correcData.aGrads,50,450);
		*/

		for (this.i = 1; this.i <= 10; this.i += 1) {

			if (this.enemies[this.i].mode) this.enemies[this.i].paint();
		}

		//gui gameplay, labels
		//return;
		//ascensor
		ctx.drawImage(this.images[21],this.asceData.xIm,0);
		//tambor del ascensor
		ctx.drawImage(this.images[22],this.asceData.xTam,this.asceData.yTam);

		//cabeza
		
		
		if( isHD ){
			ctx.drawImage(miGame.scenes[0].images[2],0,canvasH,canvasW,82,0,0,canvasW,82);
		}else{
			ctx.drawImage(miGame.scenes[0].images[2],0,canvasH,canvasW,41,0,0,canvasW,41);
		}
		
		
		ctx.fillStyle = "rgba(255,255,255,1.0)";

		for (this.i = 1; this.i <= 6; this.i += 1) {

			ctx.drawImage(this.images[9],
				0,
				this.labels[this.i].ty * this.playDat.h,
				this.playDat.w,
				this.playDat.h,
				this.labels[this.i].x,
				this.labels[this.i].y,
				this.playDat.w,
				this.playDat.h
			);

			ctx.fillStyle = "rgba(255,0,0,1.0)";
			ctx.font = miGame.tTxt + "px Arial";

			//ctx.fillText(" "+this.i,this.labels[this.i].cex,this.labels[this.i].cey);

		}

		//boton de pausatr
		/*
		ctx.drawImage(this.images[0],
			1 * this.bDatGui.w,
			1 * this.bDatGui.w,
			this.bDatGui.w,
			this.bDatGui.w,
			canvasW - this.bDatGui.w,
			0,
			this.bDatGui.w,
			this.bDatGui.w
		);
		*/
		this.maxEnemies.paint();
		this.turret.dRockets.paint();
		this.turret.dMisiles.paint();
		this.turret.dBullets.paint();
		//this.totalScore.paint();//en el terminado, perdido

		if (this.isTime) {
			this.mins.paint();
			this.seconds.paint();
			//los dos puntos del tiempo
			ctx.drawImage(this.images[14],
				10 * this.numGuiP.w,
				0,
				this.numGuiP.w,
				this.numGuiP.h,
				this.posPuntosTime.x,
				this.posPuntosTime.y,
				this.numGuiP.w,
				this.numGuiP.h
			);
		}
		//vida de la vida del escudo de la torreta
		ctx.fillStyle = this.shield.color;
		ctx.beginPath();
		ctx.fillRect(this.shield.lifeData.x, this.shield.lifeData.y, this.shield.lifeData.w, this.shield.lifeData.h);
		ctx.fill();
		ctx.closePath();
		//la torreta
		ctx.fillStyle = this.turret.color;
		ctx.beginPath();
		ctx.fillRect(this.turret.lifeData.x, this.turret.lifeData.y, this.turret.lifeData.w, this.turret.lifeData.h);
		ctx.fill();
		ctx.closePath();
	} //end of playnig in paint of action class
}