function shieldBasic(x, y, wid) {

	this.center = new vector2D(x, y);
	this.pos = new vector2D(0, 0);
	this.width = wid;
	this.radio = ~~(wid / 2);
	this.maxLife = 300;
	this.life = 300;
	this.percentLife = 100;

	this.cutX = 0;
	this.cutY = 2;
	this.image = 5;

	this.alpaVariation = 0.02;
	this.alpha = 1.0;
	this.counter = 0;
	this.touched = false;

	this.mode = true;
	this.color = "rgba(195,0,178,1.0)";
	this.lifeData = {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		mw: 0
	}

	this.lastCol = "none";
}

shieldBasic.prototype.dead = function () {
	this.mode = false;
}
shieldBasic.prototype.setLifeData = function () {
	//Nuevo metodo
	if (isHD) {

		this.lifeData.x = 32;
		this.lifeData.y = 53;
		this.lifeData.w = 200;
		this.lifeData.h = 20;
		this.lifeData.mw = 200;

	} else {

		this.lifeData.x = 15;
		this.lifeData.y = 26;
		this.lifeData.w = 100;
		this.lifeData.h = 11;
		this.lifeData.mw = 100;

	}

}

shieldBasic.prototype.restart = function () {

	this.mode = true;
	this.maxLife = 100;
	this.life = 100;
	this.percentLife = 100;

	this.cutX = 0;
	this.cutY = 2;
	this.image = 5;

	this.alpaVariation = 0.02;
	this.alpha = 1.0;
	this.counter = 0;
	this.touched = false;

}

shieldBasic.prototype.bDamage = function (quien, cuanto) {
	//Nuevo metodo

	if (quien != this.lastCol) {
		//console.log(quien + " le hizo daño al escudo : " + cuanto);
		this.lastCol = quien;
		this.life -= cuanto;
		if (this.life < 0) this.life = 0;
	}

}

shieldBasic.prototype.update = function () {
		//for trigger animation, change value of  "counter", when class that crash with station
		if (this.counter > 0) {
			this.counter -= 1;
			this.alpaVariation = random(-0.10, 0.10);
			this.alpha = this.counter / 100;
			if (this.counter > 50) this.alpha += (this.alpaVariation);
		} else {
			this.alpha = 1.0;
			this.lastCol = "none";
			miGame.scenes[miGame.sceneActive].turret.damageEx = "none";
		}

		this.pos.x = this.center.x - this.radio;
		this.pos.y = this.center.y - this.radio;

		this.percentLife = ~~((this.maxLife * this.life) / 100);

		if (this.percentLife > 75) {
			this.cutX = 0;
		} else if (this.percentLife > 50 & this.percentLife <= 75) {
			this.cutX = 1;
		} else if (this.percentLife > 25 & this.percentLife <= 50) {
			this.cutX = 2;
		} else if (this.percentLife <= 25) {
			this.cutX = 3;
		}
		//the percent life

		this.percentLife = ~~((this.life * 100) / this.maxLife);
		if (this.percentLife < 0) this.percentLife = 0;
		this.lifeData.w = ~~((this.percentLife * this.lifeData.mw) / 100);
	} //end of method update bi shield basic

shieldBasic.prototype.paint = function () {
	if (this.life < 1) return;
	if (this.counter > 0) {

		ctx.globalAlpha = this.alpha;
		ctx.drawImage(miGame.scenes[miGame.sceneActive].images[this.image],
			this.cutX * this.width,
			this.cutY * this.width,
			this.width,
			this.width,
			this.pos.x,
			this.pos.y,
			this.width,
			this.width);
		ctx.globalAlpha = 1.0;

	}

}