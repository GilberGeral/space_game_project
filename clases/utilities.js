function tScore(h,rNumx){
	//muestra los puntajes ganados 
	//al destruir asteroides y enemigos
	this.center={x:0,y:0};
	this.pos={x:0,y:0};
	this.value=0;
	this.width=0;
	this.height=h;
	this.radx=0;
	this.rady=this.height/2;
	this.widNums=rNumx;
	this.vy=0;
	this.alpa=1.0;
	this.cutX=0;
	this.cutY=0;
	this.restador=0.01;
	this.mode=false;
}

tScore.prototype.setRun=function(){
	//se autoconfigura segun sus valores para aparecer 
	//en la pantalla
	switch(this.value){
		case 5:
			this.width=this.widNums*2;
			this.radx=this.widNums*2;
			this.cutX=9*this.widNums;
			this.cutY=2*this.height;
			this.restador=0.04;
		break;
		case 10:
			this.width=this.widNums*3;
			this.radx=~~(this.width /2);
			this.cutX=6*this.widNums;
			this.cutY=2*this.height;
			this.restador=0.04;
		break;
		case 20:
			this.width=this.widNums*3;
			this.radx=~~(this.width /2);
			this.cutX=3*this.widNums;
			this.cutY=2*this.height;
			this.restador=0.04;
		break;
		case 50:
			this.width=this.widNums*3;
			this.radx=~~(this.width /2);
			this.cutX=0;
			this.cutY=2*this.height;
			this.restador=0.04;
		break;
		case 100:
			this.width=this.widNums*4;
			this.radx=~~(this.width /2);
			this.cutX=8*this.widNums;
			this.cutY=1*this.height;
			this.restador=0.02;
		break;
		case 200:
			this.width=this.widNums*4;
			this.radx=~~(this.width /2);
			this.cutX=4*this.widNums;
			this.cutY=1*this.height;
			this.restador=0.02;

		break;
		case 500:
			this.width=this.widNums*4;
			this.radx=~~(this.width /2);
			this.cutX=0;
			this.cutY=1*this.height;
			this.restador=0.02;
		break;
	}
	this.alpa=1.0;
	if(this.center.x > (canvasW - this.radx))this.center.x=canvasW - this.radx;
	if(this.center.x < (this.radx))this.center.x=this.radx;
	
	if(this.center.y > (canvasH - this.rady))this.center.y=canvasH - this.rady;
	if(this.center.y < (this.rady))this.center.y=this.rady;
	
	this.pos.x=this.center.x - this.radx;
	this.pos.y=this.center.y - this.rady;
	
	if(this.center.y > (canvasH / 2)){
		this.vy=-2;
		if(!isHD)this.vy=-1;
	}else{
		this.vy=2;
		if(!isHD)this.vy=1;
	}
	//console.log(this.center);
}
tScore.prototype.update=function(){
	
	if(this.alpa > 0.1){
		this.alpa-=0.04;
		this.center.y += (this.vy);
		this.pos.y=this.center.y - this.rady;
	}else{
		this.mode=false;
		this.alpa=0.0;
	}
	
}
tScore.prototype.paint=function(){
	if(!this.mode)return;
	ctx.globalAlpha=this.alpa;
	ctx.drawImage(miGame.scenes[1].images[14],
		this.cutX,
		this.cutY,
		this.width,
		this.height,
		this.pos.x,
		this.pos.y,
		this.width,
		this.height);
		ctx.globalAlpha=1.0;

	
}