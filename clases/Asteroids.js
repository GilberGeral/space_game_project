function Asteroid(radio, damage, cry, father, id) {
	this.id = "Astreoid" + id;
	this.index = id;
	this.origin = new vector2D(0, 0);
	this.center = new vector2D(random(0, canvasW), random(0, canvasH));
	this.pos = new vector2D(0, 0);

	this.width = radio;
	this.radio = this.width / 2;
	this.radioCols = ~~(this.width / 3);
	this.aGrads = 0;
	this.aRads = 1.0;
	this.cutX = random(0, 7);
	this.cutY = cry;

	this.colour = aColours[this.cutY].value;
	this.fire = aColours[this.cutY].fire;
	this.mode = false;
	this.damage = damage;

	this.health = aColours[this.cutY].health;
	this.image = 4;
	this.father = father;
	this.speed = 0;
	//console.log(this);
	this.i = 0;
	this.j = 0;
	this.k = 0;

	this.radioCol = 0; //radio for collisions
	this.sx = 0;
	this.sy = 0;
	this.lastCol = "none";
}

Asteroid.prototype.dead = function (f,sc) {

	//call a explode
	//rx,ry,rar,fire,vel,father,radio
	miGame.scenes[1].runExplode(this.center.x, this.center.y, this.aRads, this.fire, this.speed, this.cutY, this.radio, f,sc);
	this.mode = false;
	this.health = aColours[this.cutY].health;
	
	if(sc == 1){
		//provocada por el jugador
		miGame.scenes[1].runTscore(this.center.x,this.center.y,5);
	}
	
	//console.log("mori soy "+this.id);
	this.center.x = borders[0].y1;
	this.center.x = borders[0].x1;

	this.pos.x = this.center.x - this.radio;
	this.pos.y = this.center.y - this.radio;

	this.radioCol = 0; //radio for collisions
	this.sx = 0;
	this.sy = 0;
	this.lastCol = "none";
	miGame.scenes[1].totalAst -= 1;
	
}

Asteroid.prototype.exit = function (t) {

	this.mode = false;
	this.health = aColours[this.cutY].health;
	//console.log("mori soy "+this.id);
	if(t){
		//provocada por el jugador
		miGame.scenes[1].runTscore(this.center.x,this.center.y,5);
	}
	
	this.center.x = borders[0].y1;
	this.center.x = borders[0].x1;

	this.pos.x = this.center.x - this.radio;
	this.pos.y = this.center.y - this.radio;

	this.radioCol = 0; //radio for collisions
	this.sx = 0;
	this.sy = 0;
	this.lastCol = "none";
	miGame.scenes[1].totalAst -= 1;
}

Asteroid.prototype.bDamage=function(who,many,hf,sc){
	//Nuevo metodo
	if(this.lastCol != who){
		this.lastCol=who;
		this.health-=many;
		if(this.health < 1)this.dead(hf,sc);
	}
	
}

Asteroid.prototype.update = function () {

	this.center.x += Math.cos(this.aRads) * this.speed;
	this.center.y += Math.sin(this.aRads) * this.speed;

	if (miGame.range(this)) {
		//out of limits, dead
		this.exit(false);
	} else {
		//yet in world
		this.pos.x = this.center.x - this.radio;
		this.pos.y = this.center.y - this.radio;

		//collission with others asteroids
		for (this.k = 1; this.k <= 10; this.k += 1) {
			if (miGame.scenes[1].asteroids[this.k].id != this.id & miGame.scenes[1].asteroids[this.k].mode) {
				this.sx = miGame.scenes[1].asteroids[this.k].center.x;
				this.sy = miGame.scenes[1].asteroids[this.k].center.y;
				this.radioCol = this.center.getDistancia(this.sx, this.sy);
				if (this.radioCol < this.radio) {
					//console.log("soy "+this.id+", colisione con "+miGame.scenes[1].asteroids[this.k].id)
					this.dead(false,2);
					miGame.scenes[1].asteroids[this.k].dead(false,2);
				}

			} //end of avoid collision with me
		}
		if (!this.mode) return;

		//collision with station
		this.sx = miGame.scenes[1].turret.center.x;
		this.sy = miGame.scenes[1].turret.center.y;

		this.radioCol = this.center.getDistancia(this.sx, this.sy);
		if (this.radioCol < (this.width)) {
			//console.log("soy "+this.id+" colisione con la estacion")

			//sacudir el escudo del canon, restar vida del escudo
			if (miGame.scenes[1].shield.life > 0) {
				miGame.scenes[1].shield.bDamage(this.id, this.damage);
			} else {
				miGame.scenes[1].turret.bDamage(this.id, this.damage);
			}

			miGame.scenes[1].shield.counter = 100;

			this.dead(true,1);
		}

		if (!this.mode) return;
		//colision with enemies ships
		for(this.k=1; this.k<=maxEne; this.k+=1){
			if(miGame.scenes[1].enemies[this.k].mode){
				//el enemigo esta activo
				//colisione con el ?
				this.sx = miGame.scenes[1].enemies[this.k].center.x;
				this.sy = miGame.scenes[1].enemies[this.k].center.y;
				
				this.radioCol = this.center.getDistancia(this.sx, this.sy);
				if (this.radioCol < (this.radio*2)) {
					//console.log("soy "+this.id+", colisione con "+miGame.scenes[1].asteroids[this.k].id)
					this.dead(true,2);
					miGame.scenes[1].enemies[this.k].bDamage(this.id,this.damage,this.center.x,this.center.y,1,2);
				}
			}
		}
	} //end of yet in world


}

Asteroid.prototype.paint = function () {

	//console.log("ss");
	if (!this.mode) return;
	ctx.drawImage(miGame.scenes[this.father].images[this.image],
		this.cutX * this.width,
		this.cutY * this.width,
		this.width,
		this.width,
		this.pos.x,
		this.pos.y,
		this.width,
		this.width
	);

	//circle of collision
	/*
	ctx.strokeStyle="rgba(255,0,0,1.0)";
	ctx.beginPath();
	ctx.arc(this.center.x,this.center.y,this.radioCols,0,Math.PI*2,true);
	ctx.stroke();
	ctx.closePath();
    
	//mi id in display
	/*
	ctx.fillStyle="rgba(255,255,255,1)";
	ctx.font="12Px Arial";
	ctx.fillText("cx "+this.health,this.center.x,this.pos.y);
	*/
}