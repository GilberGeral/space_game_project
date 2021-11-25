function tBasic(father, image) {

	this.id = "tBasic";
	this.father = father;
	this.image = image;

	this.width = 96;
	this.height = 192;
	this.radio = 48;

	if (!isHD) {
		
		this.width = 48;
		this.height = 96;
		this.radio = 24;
	}

	this.maxLife = 300;
	this.life = 300;
	this.percentLife = 100;
	this.color = "rgba(255,0,0,1.0)";
	this.lifeData = {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		mw: 100
	}
	this.lastCol = "none";
	this.aGrads = 0;
	this.aRads = 6.0;
	this.aRads2 = 6.0; //for origin of missiles
	this.aRads3 = 6.0; //for origin of rockets

	this.center = new vector2D(0, 0);
	this.pos = new vector2D(0, 0);

	this.obx = 0;
	this.oby = 0;

	this.back = {
			x: 0,
			y: 0
		} //chorro trasero

	this.oBullets = new vector2D(0, 0); //origin of bullets
	this.oMissile = new vector2D(0, 0); //origin of missiles
	this.oRocket = new vector2D(0, 0); //origin of rockets

	this.aGradsM = 0;
	this.aGradsR = 0;

	this.center.x = canvasW / 2;
	this.center.y = canvasH / 2;

	this.pos.x = this.center.x - this.radio;
	this.pos.y = this.center.y - this.radio;

	this.oBullets.x = this.center.x + this.radio;
	this.oBullets.y = this.center.y;

	this.cutX = 1;
	this.cutY = 0;

	this.adder = 0;
	this.way = 0; //flag para borrar el ultimo objeto que choco contra la torreta

	//points for bezier curve for use in movement of missiles
	this.frontalPoint = new vector2D(0, 0);
	this.frontalPointR = new vector2D(0, 0); //at 90 degrees
	this.frontalPointZ = new vector2D(0, 0); //at -90 degrees

	this.dr = 0; //distance of eachs point per to objetive
	this.dz = 0;

	this.target = 0;

	this.r = 0;

	this.q = 1; //to run missiles in order

	this.decreaseRunRocket = 0;
	this.decreaseRunMissil = 5;
	this.dt = 0;

	this.bh = 0; //elecion de puntos de control laterales 
	this.bj = 0; //para las bezier de cada misil

	this.ran = 0;
	this.sRockets = 1; //para el sonido de lanzamiento de rockets
	this.radar = new Raddar();
	this.radar.center.x = canvasW / 2;
	this.radar.center.y = canvasH / 2;
	this.radar.lastDt = canvasW / 2;
	this.angs = {
			target: 0,
			x: 0,
			y: 0
		} //to detec enemies for missiles
	this.mLaunched = false;

	this.maxMisiles = 24;
	this.dMisiles = "none";
	this.maxRockets = 36;
	this.dRockets = "none";
	this.maxBullets = 250;
	this.dBullets = "none";
	
	this.extMat={x:0,y:0,cx:0,cy:0};
	
	this.extMat.x=this.center.x - (this.height/2);
	this.extMat.y=this.center.y - (this.height/2);
	//console.log(this.extMat);
} //end class turret1 declaration

tBasic.prototype.setLifeData = function () {
	//Nuevo metodo
	if (isHD) {

		this.lifeData.x = 39;
		this.lifeData.y = 7;
		this.lifeData.w = 200;
		this.lifeData.h = 20;
		this.lifeData.mw = 200;
	} else {

		this.lifeData.x = 19;
		this.lifeData.y = 3;
		this.lifeData.w = 100;
		this.lifeData.h = 11;
		this.lifeData.mw = 100;
	}

}

tBasic.prototype.runSound = function () {

	this.sRockets += 1;
	if (this.sRockets > 20) this.sRockets = 1;
	miGame.scenes[1].sRockets[this.sRockets].play();

	//lanzar chorros

	if (isHD) {

		miGame.scenes[1].runChorro(this.oMissile.x - 1, this.oMissile.y - 1, this.aGrads, 15);
		this.back.x = this.oMissile.x -= (40 * (Math.cos(this.aRads)));
		this.back.y = this.oMissile.y -= (40 * (Math.sin(this.aRads)));
		miGame.scenes[1].runChorro(this.back.x - 1, this.back.y - 1, rOpposeds[this.aGrads], 20);

	} else {

		miGame.scenes[1].runChorro(this.oMissile.x, this.oMissile.y, this.aGrads, 15);
		this.back.x = this.oMissile.x -= (20 * (Math.cos(this.aRads)));
		this.back.y = this.oMissile.y -= (20 * (Math.sin(this.aRads)));
		miGame.scenes[1].runChorro(this.back.x, this.back.y, rOpposeds[this.aGrads], 20);

	}
}

tBasic.prototype.runMissile = function () {

		if (this.dMisiles.val < 1) return;

		if (this.decreaseRunMissil > 0) return;


		//ningun enemigo ?
		this.target = this.radar.enemiClose();
		this.radar.reset();
		//console.log("el objetivo es "+this.target);
		
	
		if (this.target == -1 & !this.mLaunched) {
			//lanzar el misil en modo rocket
			if (!miGame.scenes[1].myMissiles[this.q].mode) {

				miGame.scenes[1].myMissiles[this.q].mode = true;
				miGame.scenes[1].myMissiles[this.q].flyMode = 0;

				miGame.scenes[1].myMissiles[this.q].aRads = this.aRads;
				miGame.scenes[1].myMissiles[this.q].aGrads = this.aGrads;
				
				miGame.scenes[1].myMissiles[this.q].center.x = this.oMissile.x;
				miGame.scenes[1].myMissiles[this.q].center.y = this.oMissile.y;

				if (this.aGrads >= 0 & this.aGrads <= 119) {
					miGame.scenes[1].myMissiles[this.q].cutY = 0;
					miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads;
				} else if (this.aGrads > 119 & this.aGrads <= 239) {
					miGame.scenes[1].myMissiles[this.q].cutY = 1;
					miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads - 120;
				} else if (this.aGrads > 239 & this.aGrads <= 359) {
					miGame.scenes[1].myMissiles[this.q].cutY = 2;
					miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads - 240;
				} else if (this.aGrads == 360) {
					miGame.scenes[1].myMissiles[this.q].cutY = 0;
					miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads;
				}
				miGame.scenes[1].myMissiles[this.q].lineal.xi = this.oMissile.x;
				miGame.scenes[1].myMissiles[this.q].lineal.yi = this.oMissile.y;
				
				
				miGame.scenes[1].myMissiles[this.q].step = 0.0;
				
				miGame.scenes[1].myMissiles[this.q].setEnded();
				//el sonido y el chorro
				this.mLaunched = true;
				this.runSound();
				this.dMisiles.substract();
				this.q += 1;
				if (this.q > 10) this.q = 1;
				this.decreaseRunMissil = 9;
			}
		}
		//---------------------
		this.target = this.radar.enemiIsFrontal(7, this.aGrads);
		this.radar.reset();
		if (this.target != 100 & !this.mLaunched) {
			//console.log("a 5 grados +/- esta  "+this.target);
			//return;
			if (!miGame.scenes[1].myMissiles[this.q].mode) {

				miGame.scenes[1].myMissiles[this.q].mode = true;
				miGame.scenes[1].myMissiles[this.q].flyMode = 3;
				miGame.scenes[1].myMissiles[this.q].target = this.target;

				miGame.scenes[1].myMissiles[this.q].aGrads = this.aGrads;
				miGame.scenes[1].myMissiles[this.q].aRads = this.aRads;

				if (this.aGrads >= 0 & this.aGrads <= 119) {
					miGame.scenes[1].myMissiles[this.q].cutY = 0;
					miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads;
				} else if (this.aGrads > 119 & this.aGrads <= 239) {
					miGame.scenes[1].myMissiles[this.q].cutY = 1;
					miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads - 120;
				} else if (this.aGrads > 239 & this.aGrads <= 359) {
					miGame.scenes[1].myMissiles[this.q].cutY = 2;
					miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads - 240;
				} else if (this.aGrads == 360) {
					miGame.scenes[1].myMissiles[this.q].cutY = 0;
					miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads;
				}
				miGame.scenes[1].myMissiles[this.q].lineal.xi = this.oMissile.x;
				miGame.scenes[1].myMissiles[this.q].lineal.yi = this.oMissile.y;

				miGame.scenes[1].myMissiles[this.q].setEnemi();
				miGame.scenes[1].myMissiles[this.q].setEnded();
				
				//el sonido y el chorro
				this.mLaunched = true;
				this.runSound();
				this.dMisiles.substract();
				this.q += 1;
				if (this.q > 10) this.q = 1;
				this.decreaseRunMissil = 9;
			}
		} else if (this.target == 100 & !this.mLaunched) {
			//si this.target es igual a 100 significa que no 
			//hay enfrente un enemigo
			//entonces se buscan cerca
			//lanzar como bezier
			//es cuadratica ?
			this.target = this.radar.enemiClose();
			this.radar.reset();

			this.angs.x = miGame.scenes[1].enemies[this.target].center.x;
			this.angs.y = miGame.scenes[1].enemies[this.target].center.y;

			this.angs.target = this.center.getAngulo(this.angs.x, this.angs.y);
			if (this.angs.target < 0) this.angs.target += 360;

			if (isInMid(this.aGrads, this.angs.target)) {

				//console.log("usar linea cuadratica, 1 punto, con el enem "+this.target);

				if (!miGame.scenes[1].myMissiles[this.q].mode) {

					miGame.scenes[1].myMissiles[this.q].mode = true;
					miGame.scenes[1].myMissiles[this.q].flyMode = 2;
					miGame.scenes[1].myMissiles[this.q].target = this.target;

					miGame.scenes[1].myMissiles[this.q].aGrads = this.aGrads;
					miGame.scenes[1].myMissiles[this.q].aRads = this.aRads;

					if (this.aGrads >= 0 & this.aGrads <= 119) {
						miGame.scenes[1].myMissiles[this.q].cutY = 0;
						miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads;
					} else if (this.aGrads > 119 & this.aGrads <= 239) {
						miGame.scenes[1].myMissiles[this.q].cutY = 1;
						miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads - 120;
					} else if (this.aGrads > 239 & this.aGrads <= 359) {
						miGame.scenes[1].myMissiles[this.q].cutY = 2;
						miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads - 240;
					} else if (this.aGrads == 360) {
						miGame.scenes[1].myMissiles[this.q].cutY = 0;
						miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads;
					}

					miGame.scenes[1].myMissiles[this.q].quadr.xi = this.oMissile.x;
					miGame.scenes[1].myMissiles[this.q].quadr.yi = this.oMissile.y;

					miGame.scenes[1].myMissiles[this.q].quadr.xf = miGame.scenes[1].enemies[this.target].center.x;
					miGame.scenes[1].myMissiles[this.q].quadr.xf = miGame.scenes[1].enemies[this.target].center.y;

					miGame.scenes[1].myMissiles[this.q].quadr.p1x = this.frontalPoint.x;
					miGame.scenes[1].myMissiles[this.q].quadr.p1y = this.frontalPoint.y;

					miGame.scenes[1].myMissiles[this.q].setEnded();
					//el sonido y el chorro
					this.mLaunched = true;
					this.runSound();
					this.dMisiles.substract();
					this.q += 1;
					if (this.q > 10) this.q = 1;
					this.decreaseRunMissil = 9;
				}

			} else {

				//console.log("enem "+this.target+" cubica, de 2 p  "+this.angs.target +"mi ang "+this.aGrads);
				if (!miGame.scenes[1].myMissiles[this.q].mode) {

					miGame.scenes[1].myMissiles[this.q].mode = true;
					miGame.scenes[1].myMissiles[this.q].flyMode = 1;
					miGame.scenes[1].myMissiles[this.q].target = this.target;

					miGame.scenes[1].myMissiles[this.q].aGrads = this.aGrads;
					miGame.scenes[1].myMissiles[this.q].aRads = this.aRads;

					if (this.aGrads >= 0 & this.aGrads <= 119) {
						miGame.scenes[1].myMissiles[this.q].cutY = 0;
						miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads;
					} else if (this.aGrads > 119 & this.aGrads <= 239) {
						miGame.scenes[1].myMissiles[this.q].cutY = 1;
						miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads - 120;
					} else if (this.aGrads > 239 & this.aGrads <= 359) {
						miGame.scenes[1].myMissiles[this.q].cutY = 2;
						miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads - 240;
					} else if (this.aGrads == 360) {
						miGame.scenes[1].myMissiles[this.q].cutY = 0;
						miGame.scenes[1].myMissiles[this.q].cutX = this.aGrads;
					}

					miGame.scenes[1].myMissiles[this.q].cubic.xi = this.oMissile.x;
					miGame.scenes[1].myMissiles[this.q].cubic.yi = this.oMissile.y;

					miGame.scenes[1].myMissiles[this.q].cubic.xf = miGame.scenes[1].enemies[this.target].center.x;
					miGame.scenes[1].myMissiles[this.q].cubic.xf = miGame.scenes[1].enemies[this.target].center.y;

					miGame.scenes[1].myMissiles[this.q].cubic.p1x = this.frontalPoint.x;
					miGame.scenes[1].myMissiles[this.q].cubic.p1y = this.frontalPoint.y;

					this.dr = this.frontalPointR.getDistancia(miGame.scenes[1].enemies[this.target].center.x, miGame.scenes[1].enemies[this.target].center.y);
					this.dz = this.frontalPointZ.getDistancia(miGame.scenes[1].enemies[this.target].center.x, miGame.scenes[1].enemies[this.target].center.y);

					if (this.dr > this.dz) {

						miGame.scenes[1].myMissiles[this.q].cubic.p2x = this.frontalPointZ.x;
						miGame.scenes[1].myMissiles[this.q].cubic.p2y = this.frontalPointZ.y;

					} else if (this.dr < this.dz) {

						miGame.scenes[1].myMissiles[this.q].cubic.p2x = this.frontalPointR.x;
						miGame.scenes[1].myMissiles[this.q].cubic.p2y = this.frontalPointR.y;

					} else if (this.dr == this.dz) {

						if (random(1, 2) == 1) {
							miGame.scenes[1].myMissiles[this.q].cubic.p2x = this.frontalPointZ.x;
							miGame.scenes[1].myMissiles[this.q].cubic.p2y = this.frontalPointZ.y;
						} else {
							miGame.scenes[1].myMissiles[this.q].cubic.p2x = this.frontalPointR.x;
							miGame.scenes[1].myMissiles[this.q].cubic.p2y = this.frontalPointR.y;
						}

					}

					miGame.scenes[1].myMissiles[this.q].setEnded();
					//el sonido y el chorro
					this.mLaunched = true;
					this.runSound();
					this.dMisiles.substract();
					this.q += 1;
					if (this.q > 10) this.q = 1;
					this.decreaseRunMissil = 9;
				}
			}

			//console.log("se lanzo el misil "+this.q);
			this.target = 0;
		}
	} //fin de run missiles
	//**------------------------------------------
tBasic.prototype.runRocket = function (r) {

	if (this.dRockets.val < 1) return;
	if (this.decreaseRunRocket > 0) return;

	for (this.r = 1; this.r <= 10; this.r += 1) {

		if (!miGame.scenes[miGame.sceneActive].myRockets[this.r].mode) {

			miGame.scenes[miGame.sceneActive].myRockets[this.r].mode = true;
			miGame.scenes[miGame.sceneActive].myRockets[this.r].aGrads = this.aGrads;
			miGame.scenes[miGame.sceneActive].myRockets[this.r].aRads = this.aRads;


			miGame.scenes[miGame.sceneActive].myRockets[this.r].center.x = this.oRocket.x;
			miGame.scenes[miGame.sceneActive].myRockets[this.r].center.y = this.oRocket.y;

			miGame.scenes[miGame.sceneActive].myRockets[this.r].origin.x = this.oRocket.x;
			miGame.scenes[miGame.sceneActive].myRockets[this.r].origin.y = this.oRocket.y;

			//tomar de json para mejorar las velocidades de lanzamiento de rockets
			//segun cada torreta

			if (this.aGrads >= 0 & this.aGrads <= 119) {
				miGame.scenes[miGame.sceneActive].myRockets[this.r].cutY = 0;
				miGame.scenes[miGame.sceneActive].myRockets[this.r].cutX = this.aGrads;
			} else if (this.aGrads > 119 & this.aGrads <= 239) {
				miGame.scenes[miGame.sceneActive].myRockets[this.r].cutY = 1;
				miGame.scenes[miGame.sceneActive].myRockets[this.r].cutX = this.aGrads - 120;
			} else if (this.aGrads > 239 & this.aGrads <= 359) {
				miGame.scenes[miGame.sceneActive].myRockets[this.r].cutY = 2;
				miGame.scenes[miGame.sceneActive].myRockets[this.r].cutX = this.aGrads - 240;
			} else if (this.aGrads == 360) {
				miGame.scenes[miGame.sceneActive].myRockets[this.r].cutY = 0;
				miGame.scenes[miGame.sceneActive].myRockets[this.r].cutX = this.aGrads;
			}
			this.decreaseRunRocket = 6;
			//sound
			miGame.scenes[miGame.sceneActive].myRockets[this.r].setEnded();

			this.sRockets += 1;
			if (this.sRockets > 20) this.sRockets = 1;
			miGame.scenes[1].sRockets[this.sRockets].play();
			this.dRockets.substract();

			//lanzar chorros

			if (isHD) {

				miGame.scenes[1].runChorro(this.oRocket.x - 1, this.oRocket.y - 1, this.aGrads, 15);
				this.back.x = this.oRocket.x -= (40 * (Math.cos(this.aRads)));
				this.back.y = this.oRocket.y -= (40 * (Math.sin(this.aRads)));
				miGame.scenes[1].runChorro(this.back.x - 1, this.back.y - 1, rOpposeds[this.aGrads], 20);

			} else {

				miGame.scenes[1].runChorro(this.oRocket.x, this.oRocket.y, this.aGrads, 15);
				this.back.x = this.oRocket.x -= (20 * (Math.cos(this.aRads)));
				this.back.y = this.oRocket.y -= (20 * (Math.sin(this.aRads)));
				miGame.scenes[1].runChorro(this.back.x, this.back.y, rOpposeds[this.aGrads], 20);

			}

			break;
		}
	}
	//console.log("e: "+miGame.scenes[miGame.sceneActive].myRockets[this.r].aGrads);
}

tBasic.prototype.bDamage = function (quien, cuanto) {
	//Nuevo metodo

	if (quien != this.lastCol) {
		//console.log(quien + " a la torreta le quito : " + cuanto);
		this.way = 30;
		this.lastCol = quien;
		this.life -= cuanto;
		if (this.life < 0) {
			this.life = 0;
			//perder o terminar el juego
			//aqui
			//falta los daños, tanto de fuego como de humo 
			//que indiquen que se esta dañando
			//la torreta

		}
	}

}

tBasic.prototype.update = function () {


		if (this.aGrads >= 360) this.aGrads -= 360;
		if (this.aGrads < 0) this.aGrads += 360;

		if (this.way > 0) {
			this.way -= 1;
		} else {
			this.lastCol = "none";
		}
		//origin of bullets
		this.aRads = (this.aGrads * 3.14159) / 180;

		this.ran = random(-1, 1);
		if (miGame.scenes[1].shooting) {

			this.center.x = (canvasW / 2) + (this.ran);
			this.center.y = (canvasH / 2) + (this.ran);

		} else {
			this.center.x = (canvasW / 2);
			this.center.y = (canvasH / 2)
		}

		this.obx = (this.radio) * Math.cos(this.aRads);
		this.oby = (this.radio) * Math.sin(this.aRads);

		this.oBullets.x = ~~((this.center.x + (this.obx)));
		this.oBullets.y = ~~((this.center.y + (this.oby)));

		//origin of missiles
		this.aGradsM = this.aGrads + 30;

		this.aRads2 = (this.aGradsM * 3.14159) / 180;
		this.oMissile.x = this.center.x + (Math.cos(this.aRads2) * (this.radio / 2));
		this.oMissile.y = this.center.y + (Math.sin(this.aRads2) * (this.radio / 2));

		//origin of rockets
		this.aGradsR = this.aGrads - 30;
		this.aRads3 = (this.aGradsR * 3.14159) / 180;
		this.oRocket.x = this.center.x + (Math.cos(this.aRads3) * (this.radio / 2));
		this.oRocket.y = this.center.y + (Math.sin(this.aRads3) * (this.radio / 2));

		//frontal point to bezier
		this.frontalPoint.x = this.oMissile.x + (Math.cos(this.aRads) * (this.radio * 5));
		this.frontalPoint.y = this.oMissile.y + (Math.sin(this.aRads) * (this.radio * 5));

		//point right to bezier, at 90 degrees
		this.aGradsM = this.aGrads + 90;
		this.aRads2 = (this.aGradsM * 3.14159) / 180;
		this.frontalPointR.x = this.oMissile.x + (Math.cos(this.aRads2) * (this.radio * 5));
		this.frontalPointR.y = this.oMissile.y + (Math.sin(this.aRads2) * (this.radio * 5));

		//point left to bezier, at -90 degrees
		this.aGradsM = this.aGrads - 90;
		this.aRads2 = (this.aGradsM * 3.14159) / 180;
		this.frontalPointZ.x = this.oMissile.x + (Math.cos(this.aRads2) * (this.radio * 5));
		this.frontalPointZ.y = this.oMissile.y + (Math.sin(this.aRads2) * (this.radio * 5));

		//
		if (this.decreaseRunRocket > 0) this.decreaseRunRocket -= 1;
		if (this.decreaseRunMissil > 0) {
			this.decreaseRunMissil -= 1
		} else {
			this.mLaunched = false;
		}
		//the percent life

		this.percentLife = ~~((this.life * 100) / this.maxLife);
		if (this.percentLife < 0) this.percentLife = 0;
		this.lifeData.w = ~~((this.percentLife * this.lifeData.mw) / 100);
	} //en of update methos by turret

tBasic.prototype.paintBase = function () {
	ctx.drawImage(miGame.scenes[1].images[this.image],
				  5*this.width,
				  this.width,
				  this.height,
				  this.height,
				  this.extMat.x, 
				  this.extMat.y, 
				  this.height, 
				  this.height);
	ctx.drawImage(miGame.scenes[1].images[this.image], 0, 0, this.width, this.width, this.pos.x, this.pos.y, this.width, this.width);
	
	
	
}

tBasic.prototype.paint = function () {

	ctx.save();
	ctx.translate(this.center.x, this.center.y);

	ctx.rotate(this.aRads);
	ctx.drawImage(miGame.scenes[miGame.sceneActive].images[this.image],
		this.cutX * this.width,
		this.cutY * this.width,
		this.width,
		this.width, -this.radio, -this.radio,
		this.width,
		this.width);
	ctx.restore();
	/*
	ctx.fillStyle = "rgba(255,255,0,1.0)";
	ctx.beginPath();
	ctx.fillRect(this.oMissile.x - 2, this.oMissile.y - 2, 4, 4);
	ctx.fillRect(this.frontalPoint.x - 2, this.frontalPoint.y - 2, 4, 4);
	ctx.fillRect(this.frontalPointR.x - 3, this.frontalPointR.y - 3, 6, 6);
	ctx.fillRect(this.frontalPointZ.x - 3, this.frontalPointZ.y - 3, 6, 6);
	ctx.fill();
	ctx.closePath();

	ctx.fillStyle = "rgba(255,0,0,1.0)";
	ctx.beginPath();
	ctx.fillRect(this.oRocket.x - 2, this.oRocket.y - 2, 4, 4);
	ctx.fill();
	ctx.closePath();
	*/

}