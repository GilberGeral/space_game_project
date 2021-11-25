function Point() {

	this.center = new vector2D(0, 0);
	this.pos = new vector2D(0, 0);
	this.radio = 0;
	this.width = 0;
	this.colour = "";

	this.r = 0;
	this.g = 0;
	this.b = 0;

	this.alpha = 1.0;
	this.aGrads = 0;
	this.aRads = 1.0;
	this.speed = 1.0;

}


function Chispa() {
	this.mode = false;
	this.duracion = 0;
	this.radio = 20;
	this.x = 0;
	this.y = 0;
	this.transparencia = 1.00;
	this.particula = [];

	this.restator1 = 0.13;
	if (miGame.resolution == "SD") this.restator1 = 0.18;
	for (var i = 1; i <= 6; i++) {
		if (miGame.resolution == "HD") {
			this.particula[i] = {
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				ancho: 3,
				r: 10,
				g: 255,
				b: 20,
				a: 1.0
			}
		} else if (miGame.resolution == "SD") {
			this.particula[i] = {
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				ancho: 2,
				r: 10,
				g: 255,
				b: 20,
				a: 1.0
			}
		}
	}
} //fin de la clase chispa

Chispa.prototype.update = function () {

		if (this.duracion > 0) {
			this.duracion -= 1;
			for (var i = 1; i <= 6; i++) {

				this.particula[i].x += (this.particula[i].vx);
				this.particula[i].y += (this.particula[i].vy);
				if (this.particula[i].a > 0.0) {
					this.particula[i].a -= this.restator1;
				} else {
					this.particula[i].a = 0.0;
				}

				//this.particula[i].ancho=2;

			}

		} else {
			this.mode = false;
		}
	} //fin del metodo existir de la chispa

Chispa.prototype.paint = function () {

	for (var i = 1; i <= 6; i++) {
		//ctx.fillStyle="rgba("+this.particula[i].r+","+this.particula[i].g+","+this.particula[i].b+","+this.particula[i].a+")";
		ctx.fillStyle = "rgba("+this.particula[i].r+","+this.particula[i].g+","+this.particula[i].b+"," + this.particula[i].a + ")";
		ctx.beginPath();
		ctx.fillRect(this.particula[i].x, this.particula[i].y, this.particula[i].ancho, this.particula[i].ancho);
		ctx.fill();
		ctx.closePath();
	}

}
	//-------
function mainExplode(father, id) {

	//estas explosiones son para los ateroides
	this.id = "mainExplode" + id;
	this.index = id;
	this.mode = false;
	this.HD = false;
	this.haveFire = true;
	if (miGame.resolution == "HD") this.HD = true;
	this.center = new vector2D(0, 0);
	this.pos = new vector2D(0, 0);

	this.radio = 0;
	this.width = 0;

	this.aRads = 1.0;

	this.image = 19;
	this.father = father;

	this.life = 0;
	this.damage = 5;
	this.radioDamage = 0;

	this.fireAlpha = 1.0;
	this.smokeAlpha = 1.0;
	this.rFire = 0.04; //restators of sprite
	this.rSmoke = 0.01;

	this.fireType = 0; //cut on sprite, 0:red,1:yellow, 2:blue simple, 3:green simple
	this.smokeType = 0; //0 to 3, random sprite to smoke

	if (miGame.resolution == "HD") {
		this.maxPoints = 30;
	} else if (miGame.resolution == "SD") {
		this.maxPoints = 20;
	}
	this.colour = "";
	this.i = 0;
	this.j = 0;
	this.k = 0;

	this.sx = 0;
	this.sy = 0;
	this.cutX=0;
	this.cutY=0;

	this.points = [];

	for (this.i = 0; this.i < this.maxPoints; this.i += 1) {
		this.points[this.i] = new Point();
	}
	//console.log("en masinexplodes "+this.index);
	this.autor=1;
	this.alpa=1.0;
	this.cSprite=0;
} //end of mainexplode class definition

mainExplode.prototype.dead = function () {
	this.mode = false;
	//console.log("soy "+this.id+" mi radio maximo fue "+this.radioDamage);
	this.radioDamage = 0;
	this.alpa=1.0;
}

mainExplode.prototype.setDamage = function () {
	//Nuevo metodo
	//colissions
	//with asteroids
	for (this.i = 1; this.i <= maxAst; this.i += 1) {
		if (miGame.scenes[1].asteroids[this.i].mode) {
			//raiz cuadrada
			this.sx = miGame.scenes[1].asteroids[this.i].center.x;
			this.sy = miGame.scenes[1].asteroids[this.i].center.y;
			this.k = this.center.getDistancia(this.sx, this.sy);

			if (this.k < (miGame.scenes[1].asteroids[this.i].radioCols + this.radioDamage)) {
				if(this.autor == 1){
					miGame.scenes[1].asteroids[this.i].bDamage(this.id,this.damage,false,1);
				}else if(this.autor != 1){
					miGame.scenes[1].asteroids[this.i].bDamage(this.id,this.damage,false,2);
				}
			}
		}
	}

	//with enemies
	for (this.i = 1; this.i <= maxEne; this.i += 1) {
		if (miGame.scenes[1].enemies[this.i].mode) {

			//raiz cuadrada
			this.sx = miGame.scenes[1].enemies[this.i].center.x;
			this.sy = miGame.scenes[1].enemies[this.i].center.y;
			this.k = this.center.getDistancia(this.sx, this.sy);

			if (this.k < this.radioDamage){
				if(this.autor == 1){
					miGame.scenes[1].enemies[this.i].bDamage(this.id,this.damage,this.center.x,this.center.y,1,1);
				}else if(this.autor != 1){
					miGame.scenes[1].enemies[this.i].bDamage(this.id,this.damage,this.center.x,this.center.y,1,2);
				}
				
				
			}
			
		}
	}
	//with station
	//with station
	this.sx = miGame.scenes[1].turret.center.x;
	this.sy = miGame.scenes[1].turret.center.y;
	this.k = this.center.getDistancia(this.sx, this.sy);
	if (this.k < (this.radioDamage + miGame.scenes[1].turret.radio)) {

		if (miGame.scenes[1].shield.life > 0) {

			miGame.scenes[1].shield.bDamage(this.id, random(11, 20));
			miGame.scenes[1].shield.counter = 100;

		} else {
			//ya NO hay escudo, dañe a la nave
			miGame.scenes[1].turret.bDamage(this.id, random(11, 20));
			miGame.scenes[1].shield.counter = 100;
		}

	}

}//finde  setdamage

mainExplode.prototype.update = function () {
	if (this.life > 25) {
		this.life -= 3;
	} else {
		this.life -= 1;
	}

	if (this.life < 1) {
		this.setDamage();
		this.dead();
	}

	if (!this.mode) return;

	if (this.HD) {
		this.radioDamage += 3;
	} else {
		this.radioDamage += 1;
	}
	this.cSprite+=1;
	if(this.cSprite == 2){
		if(this.cutY < 23){
			this.cutY+=1;
			//this.alpa-=0.018;
		}
		this.cSprite=0;
	}
	

	for (this.i = 0; this.i < this.maxPoints; this.i += 1) {


		this.points[this.i].center.x += (Math.cos(this.points[this.i].aRads) * (this.points[this.i].speed * 0.95));
		this.points[this.i].center.y += (Math.sin(this.points[this.i].aRads) * (this.points[this.i].speed * 0.95));


		if (this.HD) {
			this.points[this.i].radio = ~~(this.life / 10);
		} else {
			this.points[this.i].radio = ~~(this.life / 12);
		}

		this.points[this.i].pos.x = this.points[this.i].center.x - (~~(this.radio / 2));
		this.points[this.i].pos.y = this.points[this.i].center.y - (~~(this.radio / 2));
		this.points[this.i].width = this.points[this.i].radio * 2;
	}

	//collision with other objects
	
}

mainExplode.prototype.paint = function () {

	//particles
	//ctx.fillStyle="rgba(255,255,255,1.0)";
	ctx.fillStyle = this.colour;
	ctx.beginPath();
	for (this.i = 0; this.i < this.maxPoints; this.i += 1) {

		ctx.fillRect(this.points[this.i].pos.x, this.points[this.i].pos.y, this.points[this.i].width, this.points[this.i].width);
		ctx.fill();

	}
	ctx.closePath();
	//if(isHD)ctx.globalAlpha=this.alpa;
	if(this.cutY < 23){
		ctx.drawImage(miGame.scenes[1].images[this.image],
						this.cutX * this.width, 
						this.cutY * this.width,
						this.width,
						this.width,
						this.pos.x,
						this.pos.y,
						this.width,
						this.width);
	}
	if(isHD)ctx.globalAlpha=1.0;
		
	
}


//r
//great explodes with direcion
function trackExplode(id, radio) {
	//estas explosiones son para objetos como naves
	this.index = id;
	this.id = "bigEx" + id;
	this.center = new vector2D();
	this.pos = new vector2D();
	this.radio = radio;
	this.width = this.radio * 2;
	this.image = 19;//cargada en action
	this.HD = false;
	if (miGame.resolution == "HD") this.HD = true;

	this.mode = false;
	this.damage = 8;

	this.radioDamage = 0;

	this.i = 0;
	this.j = 0;
	this.k = 0;
	this.l = 0;

	this.gravx = 1.0; //for gravity
	this.gravy = 1.0;

	this.maxLife = 100;
	this.nLife = 0;
	if (app) {
		this.maxParticles = 8;
		if (this.HD) this.maxParticles = 24;
	} else {
		this.maxParticles = 15;
		if (this.HD) this.maxParticles = 30;
	}

	this.points = [];

	for (this.l = 0; this.l <= this.maxParticles; this.l += 1) {
		this.points[this.l] = new Point();
	}
	this.toYellow = false;
	this.toRed = false;

	this.rojo = 255;
	this.verde = 255;
	this.azul = 255;
	this.modeColor=3;
	
	this.aRads=1.0;
	this.sx = 0;
	this.sy = 0;
	this.aOnda=1.0;
	//console.log("radio "+this.radio);
	//console.log("ancho  "+this.width);
	this.cutX=0;
	this.cutY=0;
	this.autor=1;//quien genero esta explosion
	this.alpa=1.0;
	this.cSprite=0;
}

trackExplode.prototype.setDamage = function () {
	
	//colissions
	//with asteroids
	for (this.i = 1; this.i <= 10; this.i += 1) {
		if (miGame.scenes[1].asteroids[this.i].mode) {
			//raiz cuadrada
			this.sx = miGame.scenes[1].asteroids[this.i].center.x;
			this.sy = miGame.scenes[1].asteroids[this.i].center.y;
			this.k = this.center.getDistancia(this.sx, this.sy);

			if (this.k < (miGame.scenes[1].asteroids[this.i].radioCols + this.radioDamage)) {
				
				if(this.autor == 1){
					
				miGame.scenes[1].asteroids[this.i].bDamage(this.id,this.damage,true,1);
				}
			}
		}
	}

	//with other enemies
	for (this.i = 1; this.i <= 10; this.i += 1) {
		if (miGame.scenes[1].enemies[this.i].mode & miGame.scenes[1].enemies[this.i].id != this.id) {

			//raiz cuadrada
			this.sx = miGame.scenes[1].enemies[this.i].center.x;
			this.sy = miGame.scenes[1].enemies[this.i].center.y;
			this.k = this.center.getDistancia(this.sx, this.sy);

			if (this.k < this.radioDamage){
				if(this.autor == 1){
					miGame.scenes[1].enemies[this.i].bDamage(this.id,this.damage,this.center.x,this.center.y,2,1);
				}
				
				
			}
			
		}
	}
	//with station
	//with station
	this.sx = miGame.scenes[1].turret.center.x;
	this.sy = miGame.scenes[1].turret.center.y;
	this.k = this.center.getDistancia(this.sx, this.sy);
	if (this.k < (this.radioDamage + miGame.scenes[1].turret.radio)) {

		if (miGame.scenes[1].shield.life > 0) {

			miGame.scenes[1].shield.bDamage(this.id, random(11, 20));
			miGame.scenes[1].shield.counter = 100;

		} else {
			//ya NO hay escudo, dañe a la nave
			miGame.scenes[1].turret.bDamage(this.id, random(11, 20));
			miGame.scenes[1].shield.counter = 100;
		}

	}

}//finde  setdamage

trackExplode.prototype.dead = function () {

	this.mode = false;
	//console.log("mori con radio de " + this.radioDamage);
	this.nLife = 0;
	this.radioDamage = 0;
	
	this.rojo = 255;
	this.verde = 255;
	this.azul = 255;
	this.modeColor=3;
	this.alpa=1.0;
	
}

trackExplode.prototype.clearDamage = function () {

	for (this.i = 1; this.i <= 10; this.i += 1) {
		//todas las explosiones matan siempre a los asteroides
		
		if (miGame.scenes[1].asteroids[this.i].lastCol == this.id) {
			miGame.scenes[1].asteroids[this.i].lastCol = "none";
		}
		
		if (miGame.scenes[1].enemies[this.i].lastCol == this.id) {
			miGame.scenes[1].enemies[this.i].lastCol = "none";
		}
	}
	if (miGame.scenes[1].turret.lastCol == this.id) {

		miGame.scenes[1].turret.lastCol = "none";

	}
}

trackExplode.prototype.update = function () {
	this.nLife += 1;
	if (this.nLife < this.maxLife) {
		
		if (this.radioDamage < this.width) {
			this.radioDamage += 8;
			if(this.alpa > 0.0){this.alpa-=0.01;}else{this.alpa=0.0;}
			//this.aOnda=random(10,20)/100;
			//this.aOnda = 1- (this.nLife / (this.maxLife*2));
			if(this.aOnda > 0.3)this.aOnda = 0.3;
		} else {
			this.setDamage();
			//this.clearDamage();
		}
		this.cSprite+=1;
		if(this.cSprite == 3){
			this.cSprite=0;
			
			if(this.cutY < 23){
				this.cutY+=1;
				//this.cutX=random(4,8);
				//this.alpa-=0.010;
			}
		}
		
		
		if(this.modeColor == 3){
			//de blanco a amarllo
			this.azul-=15;
			if(this.azul <= 0){
				this.azul=0;
				this.modeColor=2;
			}
		}else if(this.modeColor == 2){
			//de amarillo a rojo
			this.verde-=25;
			if(this.verde <= 0){
				this.verde=0;
				this.modeColor=1;
			}
		}else if(this.modeColor == 1){
			//de rojo a negro
			
			this.rojo-=5;
			
			
			
			if(this.rojo < 8){
				this.rojo=0;
				this.verde=0;
				this.azul=0;
				this.modeColor=0;
			}
		}
		
		//manage this points
		for (this.i = 0; this.i <= this.maxParticles; this.i += 1) {

			//this.points[this.i].alpha -= (random(0.01, 0.02));
			//this.points[this.i].alpha -= 0.008;
			this.points[this.i].speed *= 0.95;

			this.points[this.i].center.x += (Math.cos(this.points[this.i].aRads) * (this.points[this.i].speed));
			this.points[this.i].center.y += (Math.sin(this.points[this.i].aRads) * (this.points[this.i].speed));

			this.points[this.i].pos.x = this.points[this.i].center.x - (this.points[this.i].radio / 2);
			this.points[this.i].pos.y = this.points[this.i].center.y - (this.points[this.i].radio / 2);

			this.points[this.i].width = this.points[this.i].radio * 2;
			/*
			this.points[this.i].width=this.points[this.i].r=this.blancoC;
			this.points[this.i].width=this.points[this.i].g=this.amarilloC;
			this.points[this.i].width=this.points[this.i].b=this.rojoC;
			*/
		}

	} else {
		this.clearDamage();
		this.dead();
	}
}

trackExplode.prototype.paint = function () {
	//sparks

	ctx.beginPath();
	for (this.i = 0; this.i <= this.maxParticles; this.i += 1) {

		//ctx.fillStyle="rgba("+this.points[this.i].r+","+this.points[this.i].g+","+this.points[this.i].b+","+this.points[this.i].alpha+")";
		if (app) {
			ctx.fillStyle = "rgba(" + this.rojo + "," + this.verde + "," + this.azul + ",1.0)";
		} else {
			ctx.fillStyle = "rgba(" + this.rojo + "," + this.verde + "," + this.azul + "," + this.alpa + ")";
		}

		ctx.fillRect(this.points[this.i].pos.x, this.points[this.i].pos.y, this.points[this.i].width, this.points[this.i].width);
		ctx.fill();

	}
	ctx.closePath();


	//red, dark
	

	//if(isHD)ctx.globalAlpha = this.alpa;
	if(this.cutY < 23){
		
		ctx.save();
		ctx.translate(this.center.x, this.center.y);

		ctx.rotate(this.aRads);
		ctx.drawImage(miGame.scenes[1].images[this.image],
					this.cutX * this.width, 
					this.cutY * this.width,
					this.width,
					this.width, 
					-this.radio, 
					-this.radio,
					this.width,
					this.width);
		ctx.restore();
		
	}
		
	if(isHD)ctx.globalAlpha = 1.0;
	//radio of damage
	/*
	if(isHD){
		if (this.radioDamage < this.width) {
			ctx.lineWidth = miGame.lineW;
			ctx.strokeStyle = "rgba(119,119,119,"+this.aOnda+")";
			ctx.beginPath();
			ctx.arc(this.center.x, this.center.y, this.radioDamage, 0, Math.PI * 2, true);
			ctx.stroke();
			ctx.closePath();
			ctx.lineWidth = 1;
		}
	}
	*/
	
	/*
	ctx.fillStyle="rgba(94,154,0,1)";
	ctx.font="12Px Arial";
	*/
	//console.log(this.cutX+" , "+this.cutY+" w: "+this.width+" r: "+this.radio);
}


//chorro
function Chorro(j) {
	this.id = "chorro" + j;

	this.mAngle = 0;
	this.minAngle = 0;
	this.maxAngle = 0;
	this.aperture = 0;

	this.mode = false;

	this.ini = {
		x: 0,
		y: 0
	}

	this.i = 0;
	this.j = 0;

	this.width = 0;
	this.maxVel = 0;
	this.particles = [];

	if (isHD) {

		this.maxParticles = 30;
		this.width = 3;
		this.maxVel = 6;

	} else {

		this.maxParticles = 20;
		this.width = 2;
		this.maxVel = 4;

	}

	for (this.i = 0; this.i <= this.maxParticles; this.i += 1) {

		this.particles[this.i] = {
			x: 0,
			y: 0,
			ar: 1.0,
			ag: 0,
			life: 20,
			mode: false,
			v: 0,
			vx: 0,
			vy: 0,
			g: 0,
			p: 0,
			a: 1.0
		}

	}
}

Chorro.prototype.setInit = function () {

	for (this.i = 1; this.i <= this.maxParticles; this.i += 1) {

		this.particles[this.i].life = 30;
		this.particles[this.i].v = random(1, this.maxVel);

		this.j = random(0, this.aperture);

		this.particles[this.i].life -= this.j;

		this.particles[this.i].p = ~~(250 / this.particles[this.i].life);

		if (random(1, 2) == 2) {

			this.particles[this.i].ag = (this.mAngle + this.j);

		} else {

			this.particles[this.i].ag = (this.mAngle - this.j);

		}

		if (this.particles[this.i].ag < 0) this.particles[this.i].ag += 360;
		if (this.particles[this.i].ag > 360) this.particles[this.i].ag -= 360;

		this.particles[this.i].ar = (this.particles[this.i].ag * PI) / 180;

		this.particles[this.i].x = this.ini.x;
		this.particles[this.i].y = this.ini.y;

		this.particles[this.i].mode = true;

	}

}

Chorro.prototype.dead = function () {
	this.mode = false;

	for (this.i = 1; this.i <= this.maxParticles; this.i += 1) {

		this.particles[this.i].life = 20;
		this.particles[this.i].g = 0;
		this.particles[this.i].a = 1.0;

	}

}

Chorro.prototype.isDead = function () {

	for (this.i = 1; this.i <= this.maxParticles; this.i += 1) {

		if (this.particles[this.i].mode) {
			break;
		}
		this.dead();
	}
}

Chorro.prototype.update = function () {

	this.isDead();
	if (!this.mode) return;

	for (this.i = 1; this.i <= this.maxParticles; this.i += 1) {


		this.particles[this.i].life -= 1;
		if (this.particles[this.i].life < 1) {

			this.particles[this.i].mode = false;

		} else {
			/*
			this.particles[this.i].vx=(this.particles[this.i].v*(Math.cos(this.particles[this.i].ar)));
			this.particles[this.i].vy=(this.particles[this.i].v*(Math.sin(this.particles[this.i].ar)));
            
			if(isHD){
			    
			    this.particles[this.i].x=this.ini.x+(this.particles[this.i].vx -1);
			    this.particles[this.i].y=this.ini.y+(this.particles[this.i].vy -1); 
			    
			}else{
			    
			    this.particles[this.i].x=this.ini.x+(this.particles[this.i].vx);
			    this.particles[this.i].y=this.ini.y+(this.particles[this.i].vy); 
			    
			}
			*/
			this.particles[this.i].v *= 0.95;

			this.particles[this.i].a = this.particles[this.i].life / random(20, 30);

			if (this.particles[this.i].a > 1.0) this.particles[this.i].a = 1.0;
			if (this.particles[this.i].a < 0.0) this.particles[this.i].a = 0.0;

			this.particles[this.i].x += (this.particles[this.i].v) * (Math.cos(this.particles[this.i].ar));
			this.particles[this.i].y += (this.particles[this.i].v) * (Math.sin(this.particles[this.i].ar));



			this.particles[this.i].g += this.particles[this.i].p;

			if (this.particles[this.i].g > 250) this.particles[this.i].g = 250;
			//falta revisar si trabajar con transparencia en estas particulas
		}
	}


}

Chorro.prototype.paint = function () {

	ctx.beginPath();
	for (this.i = 1; this.i <= this.maxParticles; this.i += 1) {

		ctx.fillStyle = "rgba(255," + this.particles[this.i].g + ",0," + this.particles[this.i].a + ")";
		ctx.fillRect(this.particles[this.i].x, this.particles[this.i].y, this.width, this.width);
		ctx.fill();
	}
	ctx.closePath();

	ctx.fillStyle = "rgba(255,255,255,1.0)";
}

//humos de destruccion de nave

function Humo(id,padre,image,ind){
	
	this.id="humo"+id;
	this.mode=false;
	this.padre=padre;
	this.restador=10;
	this.sumador1=0;
	this.image=image;
	this.radio=miGame.scenes[this.padre].images[18].height / 2;
	this.width=this.radio * 2;
	//console.log("rad"+this.width);
	this.ship=ind;
	this.center={x:0,y:0};
	this.i=0;
	this.j=0;
	this.k=0;
	this.maxPuntos=20;
	if( isHD){
		this.maxLife=4;//esto por el numero de frames o sea 20		
	}else{
		this.maxLife=3;//esto por el numero de frames o sea 20
	}
	
	this.alpa=1.0;
	this.puntos=[];
	for(this.i=0; this.i <= this.maxPuntos; this.i+=1){
		this.puntos[this.i]={cx:0,cy:0,mode:false,life:0,x:0,y:0}
	}
	
}

Humo.prototype.runPunto=function(){
	//iniciar un nuevo punto
	for(this.i=1; this.i <= this.maxPuntos; this.i+=1){
		if(!this.puntos[this.i].mode){
			this.puntos[this.i].mode=true;
			this.puntos[this.i].life=0;
			this.puntos[this.i].cx=0;
			this.puntos[this.i].cy=0;//ojo, aqui va por random cuando tengas mas filas el sprite
			this.puntos[this.i].x=this.center.x-this.radio;
			this.puntos[this.i].y=this.center.y-this.radio;
			//console.log(this.id + " : se fue punto "+this.i);
			break;
		}
	}
	
}

Humo.prototype.update=function(){
	//Nuevo metodo
	
	this.restador-=1;
	if(this.restador < 1){
		this.runPunto();
		this.restador=6;
	}
	
	//gestionar los puntos
	for(this.i=1; this.i <= this.maxPuntos; this.i+=1){
		if(this.puntos[this.i].mode){
			
			/*
			if(this.puntos[this.i].cx < 11){
				this.puntos[this.i].life+=2;
				
				if(this.puntos[this.i].life == this.maxLife){
					this.puntos[this.i].cx+=1;
					this.puntos[this.i].life=0;
				
					
				}		
			}else{
				this.puntos[this.i].life+=1;
				if(this.puntos[this.i].life == this.maxLife){
					this.puntos[this.i].cx+=1;
					this.puntos[this.i].life=0;
				}
				
				
			}
			*/
			this.puntos[this.i].life+=1;
			if(this.puntos[this.i].life == this.maxLife){
				this.puntos[this.i].cx+=1;
				this.puntos[this.i].life=0;
			}
			
			if(this.puntos[this.i].cx > 20)this.puntos[this.i].mode=false;
		}
	}
	
}//fin de update

Humo.prototype.paint=function(){
	//Nuevo metodo
	ctx.globalAlpha=this.alpa;
	for(this.j=1; this.j <= this.maxPuntos; this.j+=1){
		if(this.puntos[this.j].mode){
			ctx.drawImage(miGame.scenes[1].images[this.image],
						this.puntos[this.j].cx*this.width,
					  	this.puntos[this.j].cy*this.width,
						 this.width,
						 this.width,
						 this.puntos[this.j].x,
						 this.puntos[this.j].y,
						 this.width,
						 this.width);
		}
	}
	ctx.globalAlpha=1.0;
	
}


//luceros

function Lucero(index){
	this.id="lucero"+index;
	this.index=index;
	
	if(isHD){
		this.width=2;			
	}else{
		this.width=1;	

	}
	this.center={x:0,y:0};
	this.pos={x:0,y:0};
	this.color={r:0,g:0,b:0,alpa:0.50,alpMin:(random(20,30))/100,alpMax:(random(80,90))/100,sub:false};
	
	this.color.r=random(50,255);//asignados los colores
	this.color.g=random(50,255);
	this.color.b=random(50,255);
	
	if(random(0,1)==1){
		this.color.sub=false;		
	}else{
		this.color.sub=true;		
	}
	this.center.x=random(0,canvasW);
	this.center.y=random(0,canvasH);
	
	if(isHD){
		this.pos.x=this.center.x -1;			
		this.pos.y=this.center.y -1;			
	}else{
		this.pos.x=this.center.x;			
		this.pos.y=this.center.y;
	}
}

Lucero.prototype.update=function(){
	
	if(this.color.sub){
		if(this.color.alpa < this.color.alpMax){
			this.color.alpa+=0.005;
		}else{
			this.color.sub=false;
		}
	}else{
		if(this.color.alpa > this.color.alpMin){
			this.color.alpa-=0.005;
		}else{
			this.color.sub=true;
		}
	}
	
	
}
Lucero.prototype.paint=function(){
	//Nuevo metodo
	ctx.fillStyle="rgba("+this.color.r+","+this.color.g+","+this.color.b+","+this.color.alpa+")";
	ctx.fillRect(this.pos.x,this.pos.y,this.width,this.width);
	ctx.fill();
	
}