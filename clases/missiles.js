function getQBezierValue(t, p1, p2, p3) {
	var iT = 1 - t;
	return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}


function B1(t) {
	return t * t * t
}

function B2(t) {
	return 3 * t * t * (1 - t)
}

function B3(t) {
	return 3 * t * (1 - t) * (1 - t)
}

function B4(t) {
	return (1 - t) * (1 - t) * (1 - t)
}

function getBezier(percent, C1, C2, C3, C4) {
	var pos = new coord();
	pos.x = C1.x * B1(percent) + C2.x * B2(percent) + C3.x * B3(percent) + C4.x * B4(percent);
	pos.y = C1.y * B1(percent) + C2.y * B2(percent) + C3.y * B3(percent) + C4.y * B4(percent);
	return pos;
}

function missileBasic(id, rad, po) {
	//console.log(rad);
	this.index = id;
	this.id = "mBasic" + id;

	this.center = new vector2D(0, 0);
	this.pos = {
		x: 0,
		y: 0
	};
	this.lastPos = new vector2D(); //for angle in beziers curves
	this.radio = rad / 2;
	this.width = rad;

	this.emitter = new vector2D(0, 0);

	this.target = 0;

	this.mode = false;

	this.aRads = 1.0;
	this.aGrads = 0;
	this.cutX = 0;
	this.cutY = 0;

	this.i = 0;
	this.j = 0;
	this.k = 0;
	this.l = 0;
	this.m = 0;

	this.q = 0;
	this.ax = 0;
	this.ay = 0;

	this.hipo = 0.0;
	this.hipo2 = 0.0;
	//ojo, cuadrar daño
	this.damage = 2;//ojo cambiar

	this.flyMode = 0; //0. lineal, like a rocket, 1 : cub bezier, 2: quadratic bezier, 3: diretly to target

	this.cubic = {
		xi: 0,
		yi: 0,
		p1x: 0,
		p1y: 0,
		p2x: 0,
		p2y: 0,
		xf: 0,
		yf: 0
	}

	this.quadr = {
		xi: 0,
		yi: 0,
		p1x: 0,
		p1y: 0,
		xf: 0,
		yf: 0
	}

	this.lineal = {
		xi: 0,
		yi: 0,
		xf: 0,
		yf: 0
	}
	this.pEm = 0.03; //hallar la punta de la turbina
	//area de trails
	this.runer = 0;
	this.trail = [];
	for (this.i = 0; this.i <= 100; this.i += 1) {
		this.trail[this.i] = {
			x: 0,
			y: 0,
			alpa: 1.0,
			life: 20,
			mode: false,
			cx: 0,
			cy: 0
		}
	}
	this.step=1.0;
	this.dt=0;
}

missileBasic.prototype.dead = function () {
	//console.log("murio "+this.id);

	this.mode = false;
	this.hipo = 0.0;
	this.hipo2 = 0.0;
	this.runer = 0;
	this.step=0.0;
	
	for (this.m = 0; this.m <= 100; this.m += 1) {
		
		this.trail[this.m].life = 20;
		this.trail[this.m].mode = false;
		this.trail[this.m].alpa = 1.0;

	}
	//console.log(this.id+" , mori ");
}

missileBasic.prototype.exit = function () {

	this.mode = false;
	this.hipo = 0.0;
	this.runer = 0;
	
	for (this.m = 0; this.m <= 100; this.m+= 1) {
		this.trail[this.m].life = 20;
		this.trail[this.m].mode = false;
		this.trail[this.m].alpa = 1.0;
	}
}

missileBasic.prototype.getBezierCubic = function (percent, s) {

	this.center.x = ~~(this.cubic.xf * B1(percent) + this.cubic.p2x * B2(percent) + this.cubic.p1x * B3(percent) + this.cubic.xi * B4(percent));
	this.center.y = ~~(this.cubic.yf * B1(percent) + this.cubic.p2y * B2(percent) + this.cubic.p1y * B3(percent) + this.cubic.yi * B4(percent));

	this.lastPos.x = ~~(this.cubic.xf * B1(percent - 0.03) + this.cubic.p2x * B2(percent - 0.03) + this.cubic.p1x * B3(percent - 0.03) + this.cubic.xi * B4(percent - 0.03));
	this.lastPos.y = ~~(this.cubic.yf * B1(percent - 0.03) + this.cubic.p2y * B2(percent - 0.03) + this.cubic.p1y * B3(percent - 0.03) + this.cubic.yi * B4(percent - 0.03));

	this.emitter.x = ~~(this.cubic.xf * B1(percent - this.pEm) + this.cubic.p2x * B2(percent - this.pEm) + this.cubic.p1x * B3(percent - this.pEm) + this.cubic.xi * B4(percent - this.pEm));
	this.emitter.y = ~~(this.cubic.yf * B1(percent - this.pEm) + this.cubic.p2y * B2(percent - this.pEm) + this.cubic.p1y * B3(percent - this.pEm) + this.cubic.yi * B4(percent - this.pEm));

	this.aGrads = rOpposeds[180 + this.lastPos.getAngulo(this.center.x, this.center.y)];
	//if(this.aGrads < 0)this.aGrads+=360;

	if (this.aGrads >= 0 & this.aGrads <= 119) {
		this.cutY = 0;
		this.cutX = this.aGrads;
	} else if (this.aGrads > 119 & this.aGrads <= 239) {
		this.cutY = 1;
		this.cutX = this.aGrads - 120;
	} else if (this.aGrads > 239 & this.aGrads <= 359) {
		this.cutY = 2;
		this.cutX = this.aGrads - 240;
	} else if (this.aGrads == 360) {
		this.cutY = 0;
		this.cutX = this.aGrads;
	}

}

missileBasic.prototype.getBezierQuadr = function (percent) {


	this.center.x = getQBezierValue(percent, this.quadr.xi, this.quadr.p1x, this.quadr.xf);
	this.center.y = getQBezierValue(percent, this.quadr.yi, this.quadr.p1y, this.quadr.yf);

	this.lastPos.x = getQBezierValue(percent - 0.03, this.quadr.xi, this.quadr.p1x, this.quadr.xf);
	this.lastPos.y = getQBezierValue(percent - 0.03, this.quadr.yi, this.quadr.p1y, this.quadr.yf);

	this.emitter.x = getQBezierValue(percent - this.pEm, this.quadr.xi, this.quadr.p1x, this.quadr.xf);
	this.emitter.y = getQBezierValue(percent - this.pEm, this.quadr.yi, this.quadr.p1y, this.quadr.yf);

	this.aGrads = rOpposeds[180 + this.lastPos.getAngulo(this.center.x, this.center.y)];
	//if(this.aGrads < 0)this.aGrads+=360;

	if (this.aGrads >= 0 & this.aGrads <= 119) {
		this.cutY = 0;
		this.cutX = this.aGrads;
	} else if (this.aGrads > 119 & this.aGrads <= 239) {
		this.cutY = 1;
		this.cutX = this.aGrads - 120;
	} else if (this.aGrads > 239 & this.aGrads <= 359) {
		this.cutY = 2;
		this.cutX = this.aGrads - 240;
	} else if (this.aGrads == 360) {
		this.cutY = 0;
		this.cutX = this.aGrads;
	}

}

missileBasic.prototype.setCortex=function(){
	//Nuevo metodo
	if (this.aGrads >= 0 & this.aGrads <= 119) {
		this.cutY = 0;
		this.cutX = this.aGrads;
	} else if (this.aGrads > 119 & this.aGrads <= 239) {
		this.cutY = 1;
		this.cutX = this.aGrads - 120;
	} else if (this.aGrads > 239 & this.aGrads <= 359) {
		this.cutY = 2;
		this.cutX = this.aGrads - 240;
	} else if (this.aGrads == 360) {
		this.cutY = 0;
		this.cutX = this.aGrads;
	}
	
}

missileBasic.prototype.setEnded = function () {

	this.j = ((canvasW / 4) * 3) * Math.cos(this.aRads);
	this.k = ((canvasW / 4) * 3) * Math.sin(this.aRads);

	this.lineal.xf = ~~((this.lineal.xi + (this.j + random(-4, 4))));
	this.lineal.yf = ~~((this.lineal.yi + (this.k + random(-4, 4))));


	/*
	console.log(this.origin.x+" , "+this.origin.y);
	console.log(this.ended.x+" , "+this.ended.y);
	console.log("------");
	*/
	this.hipo = 0.0;
	this.hipo2 = 0.0;
	
	this.j = 0;
	this.k = 0;
	switch(this.flyMode){
		case 0:
			this.dt=this.center.getDistancia(this.lineal.xf,this.lineal.yf);
			this.step=(this.dt * 0.02)/canvasH;
		break;
		case 1:
			this.dt=this.center.getDistancia(this.cubic.xf,this.cubic.yf);
			this.step=(this.dt * 0.02)/canvasH;
		break;
		case 2:
			this.dt=this.center.getDistancia(this.quadr.xf,this.quadr.yf);
			this.step=(this.dt * 0.02)/canvasH;
		break;
		case 3:
			this.dt=this.center.getDistancia(this.lineal.xf,this.lineal.yf);
			this.step=(this.dt * 0.02)/canvasH;
			
		break;
	}
	if(this.step < 0.017)this.step=0.017;
	if(this.step > 0.023)this.step=0.023;
	//console.log(this.id+" , "+this.step);
}

missileBasic.prototype.setEnemi = function () {

	this.lineal.xf = miGame.scenes[1].enemies[this.target].center.x;
	this.lineal.yf = miGame.scenes[1].enemies[this.target].center.y;

	this.hipo = 0.0;
	this.hipo2 = 0.0;

	this.j = 0;
	this.k = 0;

}

missileBasic.prototype.colision = function () {


	for (this.n = 1; this.n <= 10; this.n += 1) {

		if (miGame.scenes[1].asteroids[this.n].mode) {
			//raiz cuadrada

			this.k = this.center.getDistancia(miGame.scenes[1].asteroids[this.n].center.x, miGame.scenes[1].asteroids[this.n].center.y);

			if (this.k < miGame.scenes[1].asteroids[this.n].radioCols) {
				this.dead(true);
				miGame.scenes[1].asteroids[this.n].health -= this.damage;
				if (miGame.scenes[1].asteroids[this.n].health < 1) {
					miGame.scenes[1].asteroids[this.n].exit(true);
					//great explode
					//console.log("soy "+this.nd+" y colisione con el asteroide "+this.n);
					miGame.scenes[1].runExBig(this.center.x, this.center.y, this.aRads, this.aGrads,1);
				}
			}
		}
	}

	//collsiion with enemies
	//otra vex, fatla mirar cuantos enemigos son en realifdad
	//del json
	for (this.n = 1; this.n <= 10; this.n += 1) {
		if (miGame.scenes[1].enemies[this.n].mode) {
			//raiz cuadrada

			this.k = this.center.getDistancia(miGame.scenes[1].enemies[this.n].center.x, miGame.scenes[1].enemies[this.n].center.y);

			if (this.k < miGame.scenes[1].enemies[this.n].radiox) {

				miGame.scenes[1].runExBig(this.center.x, this.center.y, this.aRads, this.aGrads,2);
				//falta revisar si los misiles enemigos , estos NO generarian puntaje
				
				miGame.scenes[1].enemies[this.n].bDamage(this.id, this.damage,this.center.x,this.center.y,2,1);
				this.dead(true);
			}
		}
	}
}

missileBasic.prototype.getPosLine = function () {

	this.ax = ((1.0 - this.hipo) * this.lineal.xi) + (this.hipo * this.lineal.xf);
	this.ay = ((1.0 - this.hipo) * this.lineal.yi) + (this.hipo * this.lineal.yf);

	this.center.x = ~~(this.ax);
	this.center.y = ~~(this.ay);

	//la boca de la turbina

	this.ax = ((1.0 - (this.hipo - this.pEm)) * this.lineal.xi) + ((this.hipo - this.pEm) * this.lineal.xf);
	this.ay = ((1.0 - (this.hipo - this.pEm)) * this.lineal.yi) + ((this.hipo - this.pEm) * this.lineal.yf);

	this.emitter.x = ~~(this.ax);
	this.emitter.y = ~~(this.ay);

}

missileBasic.prototype.update = function () {

		switch (this.flyMode) {
		case 0:
			//linear mode move like a rocket
			this.hipo += this.step/2;
			this.getPosLine();

			this.pos.x = this.center.x - this.radio;
			this.pos.y = this.center.y - this.radio;

			if (miGame.range2(this.center)) {
				this.exit();
			}
			this.colision();
			break;
		case 1:
			//move with cubic bezier, 2 points
			this.hipo += this.step;
			if (miGame.scenes[1].enemies[this.target].mode) {

				this.cubic.xf = miGame.scenes[1].enemies[this.target].center.x;
				this.cubic.yf = miGame.scenes[1].enemies[this.target].center.y;
				
				this.getBezierCubic(this.hipo);

				this.pos.x = this.center.x - this.radio;
				this.pos.y = this.center.y - this.radio;

				if (miGame.range2(this.center)) {
					this.exit();
				}
				this.colision();
			} else {
				//transformar en lineal
				this.lineal.xi=this.center.x;
				this.lineal.yi=this.center.y;
				this.aGrads = rOpposeds[180 + this.lastPos.getAngulo(this.center.x, this.center.y)];
				//this.aGrads = 180 - this.lastPos.getAngulo(this.center.x, this.center.y);
				this.setCortex();
				this.aRads=(this.aGrads * PI)/180;
				//console.log(this.aGrads+" , "+this.aRads);
				this.setEnded();
				this.flyMode=0;
			}
			

			break;
		case 2:
			//move with quadratic bezier, 1 point of influence
			this.hipo += this.step;
			if (miGame.scenes[1].enemies[this.target].mode) {

				this.quadr.xf = miGame.scenes[1].enemies[this.target].center.x;
				this.quadr.yf = miGame.scenes[1].enemies[this.target].center.y;
				
				this.getBezierQuadr(this.hipo);

				this.pos.x = this.center.x - this.radio;
				this.pos.y = this.center.y - this.radio;

				if (miGame.range2(this.center)) {
					this.exit();
				}
				this.colision();
			} else {
				//transformar en lineal
				
				this.lineal.xi=this.center.x;
				this.lineal.yi=this.center.y;
				this.aGrads = rOpposeds[180 + this.lastPos.getAngulo(this.center.x, this.center.y)];
				//this.aGrads = 180 - this.lastPos.getAngulo(this.center.x, this.center.y);
				this.setCortex();
				this.aRads=(this.aGrads * PI)/180;
				//console.log(this.aGrads+" , "+this.aRads);
				this.setEnded();
				this.flyMode=0;
				
			}
			

			break;
		case 3:
			//angular movement, directly over target

			this.hipo += this.step;

			if (miGame.scenes[1].enemies[this.target].mode) {

				this.lineal.xf = miGame.scenes[1].enemies[this.target].center.x;
				this.lineal.yf = miGame.scenes[1].enemies[this.target].center.y;
				
				
				
				this.getPosLine();
				
				this.aGrads=rOpposeds[180 + this.center.getAngulo(this.lineal.xf,this.lineal.yf)];
				this.setCortex();
				
				this.pos.x = this.center.x - this.radio;
				this.pos.y = this.center.y - this.radio;

				if (miGame.range2(this.center)) {
					this.exit();
				}

				this.colision();
				
			}else{
				//se murio la nave antes de que llegue a ella
				this.lineal.xi=this.center.x;
				this.lineal.yi=this.center.y;
				
				//this.aGrads = 180 + this.center.getAngulo(this.center.x, this.center.y)];
				this.aGrads = rOpposeds[180 + this.center.getAngulo(this.lineal.xf, this.lineal.yf)];
				
				this.aRads=(this.aGrads * PI)/180;
				
				this.setEnded();
				this.setCortex();
				//console.log(this.aGrads+" , "+this.aRads);
				
				this.flyMode=0;
			}
			
				
			break;

		}//fin del switch


		if (this.hipo > 0.995) this.dead();

		//area de trails
		if (this.hipo > 0.04) {

			this.runer += 1;
			//console.log("r "+this.runer);

			if (this.runer < 99) {
				this.trail[this.runer].x = this.emitter.x - this.radio;
				this.trail[this.runer].y = this.emitter.y - this.radio;

				this.trail[this.runer].cx = this.cutX;
				this.trail[this.runer].cy = this.cutY;
				this.trail[this.runer].alpa = 1.0;
				this.trail[this.runer].life = 20;

				this.trail[this.runer].mode = true;
			}

		}
		for (this.l = 1; this.l <= 100; this.l += 1) {

			if (this.trail[this.l].mode) {

				if (isHD) {
					this.trail[this.l].life -= random(1, 3);
				} else {
					this.trail[this.l].life -= random(2, 4);
				}


				this.trail[this.l].alpa = (this.trail[this.l].life / 10);

				if (this.trail[this.l].alpa > 1.0) this.trail[this.l].alpa = 1.0;
				if (this.trail[this.l].alpa < 0.1) this.trail[this.l].alpa = 0.1;


				//this.trail[this.l].alpa=1.0;

				if (this.trail[this.l].life < 1) {
					this.trail[this.l].mode = false;
				}
			}

		}

	} //end of update missiles

missileBasic.prototype.paint = function () {

		for (this.l = 1; this.l <= 100; this.l += 1){

			if (this.trail[this.l].mode) {

				ctx.globalAlpha = this.trail[this.l].alpa;


				ctx.drawImage(miGame.scenes[1].iCreated[4],
					this.trail[this.l].cx * this.width,
					this.trail[this.l].cy * this.width,
					this.width,
					this.width,
					this.trail[this.l].x,
					this.trail[this.l].y,
					this.width,
					this.width);
				ctx.globalAlpha = 1.0;


			}

		}

		ctx.drawImage(miGame.scenes[1].iCreated[1],
			this.cutX * this.width,
			this.cutY * this.width,
			this.width,
			this.width,
			this.pos.x,
			this.pos.y,
			this.width,
			this.width);
		/*
		if(this.flyMode == 3){
			
			ctx.lineWidth=miGame.lineW;
			ctx.strokeStyle="rgba(255,255,255,0.15)";
			ctx.beginPath();
			ctx.moveTo(this.center.x,this.center.y);
			ctx.lineTo(this.lineal.xf,this.lineal.yf);
			ctx.stroke();
			ctx.closePath();
			ctx.lineWidth=1;

			ctx.font= miGame.tTx;
			ctx.fillStyle="rgba(25,255,255,1.0)";
			ctx.fillText(this.aGrads,this.pos.x,this.center.y);
			
		}
	if(this.flyMode == 0){
			
			ctx.lineWidth=miGame.lineW;
			ctx.strokeStyle="rgba(255,124,255,0.25)";
			ctx.beginPath();
			ctx.moveTo(this.center.x,this.center.y);
			ctx.lineTo(this.lineal.xf,this.lineal.yf);
			ctx.stroke();
			ctx.closePath();
			ctx.lineWidth=1;

			ctx.font= miGame.tTx;
			ctx.fillStyle="rgba(25,255,255,1.0)";
			ctx.fillText(this.hipo,this.pos.x,this.center.y);
			
		}
	*/
		
} //end of paint missiles


//rockets--------------------------------------------------------------------------------------------------*/
function rocketBasic(id, father, radio) {

	this.index = 10 + id;
	this.id = "rBasic" + id;
	this.father = father;

	this.damage = 2; //ojo cambiar


	this.aGrads = 0;
	this.aRads = 1.0;

	this.cutX = 0;
	this.cutY = 0;

	this.radio = radio / 2;
	this.width = radio;

	this.eWidth = this.width * 2;

	this.center = new vector2D(0, 0);
	this.emitter = new vector2D(0, 0); //to trails
	this.turb = new vector2D();

	this.pos = new vector2D(0, 0);

	this.origin = new vector2D(0, 0);
	this.ended = new vector2D(0, 0);


	this.mode = false;
	//console.log("created bullet "+this.sound);
	this.hipo = 1.0;
	this.hipo2 = 1.0;

	this.ax = 0;
	this.ay = 0;
	this.runer = 0;

	this.i = 0;
	this.j = 0;
	this.k = 0;
	this.l = 0;
	this.n = 0;

	this.fire = {
		x: 0,
		y: 0
	}

	this.trail = [];
	for (this.i = 0; this.i <= 100; this.i += 1) {
		this.trail[this.i] = {
			x: 0,
			y: 0,
			alpa: 1.0,
			life: 20,
			mode: false,
			cx: 0
		}
	}


}

rocketBasic.prototype.dead = function (u) {

	//miGame.scenes[miGame.sceneActive].runSpark(this.center.x,this.center.y,this.colour,this.id);
	this.mode = false;
	this.runer = 0;
	//console.log("mori "+this.id);

	for (this.i = 1; this.i <= 100; this.i += 1) {

		this.trail[this.i].alpa = 1.0;
		this.trail[this.i].life = 20;
		this.trail[this.i].mode = false;
		this.trail[this.i].cx = 0;


	}
}

rocketBasic.prototype.exit = function () {

	this.runer = 0;
	this.mode = false;
	//console.log("sali "+this.id);

	for (this.i = 1; this.i <= 100; this.i += 1) {

		this.trail[this.i].alpa = 1.0;
		this.trail[this.i].cx = 0;

		this.trail[this.i].life = random(16, 20);
		this.trail[this.i].mode = false;
	}
	//console.log("created bullet "+this.id);

}

rocketBasic.prototype.setEnded = function () {

	this.ax = ((canvasW / 4) * 3) * Math.cos(this.aRads);
	this.ay = ((canvasW / 4) * 3) * Math.sin(this.aRads);

	this.ended.x = ~~((this.origin.x + (this.ax + random(-4, 4))));
	this.ended.y = ~~((this.origin.y + (this.ay + random(-4, 4))));


	/*
	console.log(this.origin.x+" , "+this.origin.y);
	console.log(this.ended.x+" , "+this.ended.y);
	console.log("------");
	*/
	this.hipo = 0.0;
	this.hipo2 = 0.0;

	this.ax = 0;
	this.ay = 0;
}

rocketBasic.prototype.getPosLine = function () {


	this.ax = ((1.0 - this.hipo) * this.origin.x) + (this.hipo * this.ended.x);
	this.ay = ((1.0 - this.hipo) * this.origin.y) + (this.hipo * this.ended.y);

	this.center.x = ~~(this.ax);
	this.center.y = ~~(this.ay);

	//la boca de la turbina
	this.ax = ((1.0 - (this.hipo - 0.01)) * this.origin.x) + ((this.hipo - 0.01) * this.ended.x);
	this.ay = ((1.0 - (this.hipo - 0.01)) * this.origin.y) + ((this.hipo - 0.01) * this.ended.y);

	this.turb.x = ~~(this.ax);
	this.turb.y = ~~(this.ay);

}

rocketBasic.prototype.getPosLineTrail = function () {


	this.ax = ((1.0 - this.hipo2) * this.origin.x) + (this.hipo2 * this.ended.x);
	this.ay = ((1.0 - this.hipo2) * this.origin.y) + (this.hipo2 * this.ended.y);


	this.emitter.x = ~~(this.ax);
	this.emitter.y = ~~(this.ay);

}

rocketBasic.prototype.update = function () {

	if (this.hipo < 0.120) {

		if (isHD) {
			this.hipo += 0.009;
			this.hipo2 += 0.008;
		} else {
			this.hipo += 0.010;
			this.hipo2 += 0.009;
		}

	} else {

		if (isHD) {
			this.hipo += 0.0150;
			this.hipo2 += 0.0140;
		} else {
			this.hipo += 0.0180;
			this.hipo2 += 0.0170;
		}

	}
	this.getPosLine();


	if (this.hipo > 0.04) {

		this.runer += 1;
		//console.log("r "+this.runer);
		this.getPosLineTrail(this.hipo2);
		this.trail[this.runer].x = this.emitter.x - this.radio;
		this.trail[this.runer].y = this.emitter.y - this.radio;

		this.trail[this.runer].mode = true;
	}
	for (this.i = 1; this.i <= 60; this.i += 1) {

		if (this.trail[this.i].mode) {

			if (isHD) {
				this.trail[this.i].life -= random(1, 3);
			} else {
				this.trail[this.i].life -= random(2, 4);
			}


			this.trail[this.i].alpa = (this.trail[this.i].life / 20);
			this.trail[this.i].alpa = 1.0;

			if (this.trail[this.i].life < 1) {
				this.trail[this.i].mode = false;
			}
		}

	}

	this.pos.x = this.center.x - this.radio;
	this.pos.y = this.center.y - this.radio;

	//if(this.hipo > 0.50){
	if (miGame.range2(this.center)) {
		this.exit();
	}
	//}
	if (!this.mode) return;
	this.fire.x = this.turb.x - this.radio;
	this.fire.y = this.turb.y - this.radio;

	//collsiion with asteroids
	for (this.n = 1; this.n <= 10; this.n += 1) {

		if (miGame.scenes[1].asteroids[this.n].mode) {
			//raiz cuadrada

			this.k = this.center.getDistancia(miGame.scenes[1].asteroids[this.n].center.x, miGame.scenes[1].asteroids[this.n].center.y);

			if (this.k < miGame.scenes[1].asteroids[this.n].radioCols) {
				this.dead(true);
				miGame.scenes[1].asteroids[this.n].health -= this.damage;
				if (miGame.scenes[1].asteroids[this.n].health < 1) {
					miGame.scenes[1].asteroids[this.n].exit(true);
					//great explode
					//console.log("soy "+this.nd+" y colisione con el asteroide "+this.n);
					miGame.scenes[1].runExBig(this.center.x, this.center.y, this.aRads, this.aGrads,1);
				}
			}
		}
	}

	//collsiion with enemies
	for (this.n = 1; this.n <= 10; this.n += 1) {
		if (miGame.scenes[miGame.sceneActive].enemies[this.n].mode) {
			//raiz cuadrada

			this.k = this.center.getDistancia(miGame.scenes[miGame.sceneActive].enemies[this.n].center.x,
				miGame.scenes[miGame.sceneActive].enemies[this.n].center.y);

			if (this.k < miGame.scenes[miGame.sceneActive].enemies[this.n].radiox) {
				
				miGame.scenes[miGame.sceneActive].runExBig(this.center.x, this.center.y, this.aRads, this.aGrads,2);
				
				//aqui falta revisar los cohetes enemigos
				miGame.scenes[1].enemies[this.n].bDamage(this.id, this.damage,this.center.x,this.center.y,2,1);
				this.dead(true);
			}
		}
	}
}

rocketBasic.prototype.paint = function () {
	/*
	ctx.lineWidth=miGame.lineW;
	ctx.strokeStyle="rgba(255,255,255,0.1)";
	ctx.beginPath();
	ctx.moveTo(this.origin.x,this.origin.y);
	ctx.lineTo(this.center.x,this.center.y);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth=1;
	ctx.fillText(this.cutX,this.center.x,this.center.y);
	ctx.fillText(this.cutY,this.center.x,this.center.y+20);
	*/
	

	for (this.i = 1; this.i <= 100; this.i += 1) {

		if (this.trail[this.i].mode) {

			ctx.globalAlpha = this.trail[this.i].alpa;


			ctx.drawImage(miGame.scenes[1].iCreated[4],
				this.cutX * this.width,
				this.cutY * this.width,
				this.width,
				this.width,
				this.trail[this.i].x,
				this.trail[this.i].y,
				this.width,
				this.width);
			ctx.globalAlpha = 1.0;


		}

	}
	/*
	ctx.globalAlpha=(100-this.runer)/120;
	ctx.drawImage(miGame.scenes[1].images[3],this.fire.x,this.fire.y);
	ctx.globalAlpha=1.0;
	*/
	ctx.drawImage(miGame.scenes[1].iCreated[0],
		this.cutX * this.width,
		this.cutY * this.width,
		this.width,
		this.width,
		this.pos.x,
		this.pos.y,
		this.width,
		this.width);
	/*
    ctx.fillStyle="rgba(255,0,0,1.0)";
    ctx.beginPath();
    ctx.fillRect(this.emitter.x-2,this.emitter.y-2,4,4);
    ctx.fill();
    ctx.closePath();*/
}