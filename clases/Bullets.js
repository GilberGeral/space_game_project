function Bullet(type,id,father,radio,damage,colour){
    
    this.type=type;//1:amigas / 2: enemigas
    this.id="bullet"+id;
    this.index=id;
    this.father=father;
    
    this.damage=damage;
    this.colour=colour;
    this.aGrads=0;
    this.aRads=1.0;
    if(miGame.resolution == "HD"){
        this.vel=6;
    }else if(miGame.resolution == "SD"){
        this.vel=3;
    }
    this.cutX=0;
    this.cutY=0;
	
    this.r=0;
    this.g=0;
    this.b=0;
	
    this.width=radio;
    this.height=radio;
    this.radio=this.width/2;
    this.eWidth=this.width*2;
    
    this.center=new vector2D(0,0);
    this.center2=new vector2D(0,0);//to trails
    
    this.pos=new vector2D(0,0);
    
    this.origin=new vector2D(0,0);
    this.ended=new vector2D(0,0);
    
    
    this.mode=false;
    //console.log("created bullet "+this.sound);
    this.hipo=1.0;
    this.hipo2=1.0;
    
    this.ax=0;
    this.ay=0;
    this.runer=0;
    
    this.i=0;
    this.j=0;
    this.k=0;
    this.l=0;
    
    this.trail=[];
    for(this.i=0; this.i <= 100; this.i+=1){
        this.trail[this.i]={x:0,y:0,alpa:1.0,life:20,mode:false}
    }
    
    this.born=random(4,6)/100;
	
	switch(this.type){
		case 1:
			this.image=2;
			this.r=255;
			this.g=255;
			this.b=10;
		break;
		case 2:
			this.image=5;
			this.r=255;
    		this.g=10;
    		this.b=5;
		break;
	}
}

Bullet.prototype.clearDamage = function () {

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

Bullet.prototype.dead=function(u){
    
	this.clearDamage();
    miGame.scenes[miGame.sceneActive].runSpark(this.center.x,this.center.y,this.id,this.r,this.g,this.b);
    this.mode=false;
    this.runer=0;
    //console.log("mori "+this.id);
    this.born=random(4,6)/100;
    
    for(this.i=1; this.i <= 100; this.i+=1){
        
        this.trail[this.i].alpa=1.0;
        this.trail[this.i].life=random(16,20);
        this.trail[this.i].mode=false;
        
    }
}

Bullet.prototype.exit=function(){
    
    this.runer=0;
    this.mode=false;
    this.born=random(4,6)/100;
    
    //console.log("sali "+this.id);
    
    for(this.i=1; this.i <= 100; this.i+=1){
        
        this.trail[this.i].alpa=1.0;
        this.trail[this.i].life=random(16,20);
        this.trail[this.i].mode=false;
    }
    //console.log("created bullet "+this.id);
   //please watch here:
  
}

Bullet.prototype.setEnded=function () {
    
    this.ax=(canvasW )*Math.cos(this.aRads);
    this.ay=(canvasW )*Math.sin(this.aRads);
    
    this.ended.x=~~((this.origin.x+(this.ax))); 
    this.ended.y=~~((this.origin.y+(this.ay)));
    
    this.hipo=0.0;
    this.hipo2=0.0;
    
    this.ax=0;
    this.ay=0;
    
}

Bullet.prototype.getPosLine=function() {
    
    this.ax=((1.0 - this.hipo)* this.origin.x) + (this.hipo * this.ended.x);
    this.ay=((1.0 - this.hipo)* this.origin.y) + (this.hipo * this.ended.y);
    
    this.center.x= ~~(this.ax);
    this.center.y= ~~(this.ay);
    
}

Bullet.prototype.getPosLineTrail=function() {
    
    
    this.ax=((1.0 - this.hipo2)* this.origin.x) + (this.hipo2 * this.ended.x);
    this.ay=((1.0 - this.hipo2)* this.origin.y) + (this.hipo2 * this.ended.y);
    
    
    this.center2.x= ~~(this.ax);
    this.center2.y= ~~(this.ay);
    
}

Bullet.prototype.update=function(){
    this.hipo+=0.018;
    this.hipo2+=0.014;
    this.getPosLine();
    
    
    if(this.hipo > this.born){
        
        this.runer+=1;
        this.getPosLineTrail(this.hipo-0.21);
        this.trail[this.runer].x = this.center2.x - this.width;
        this.trail[this.runer].y = this.center2.y - this.width;
        this.trail[this.runer].mode=true;
    }
    for(this.i=1; this.i <= 100; this.i+=1){
        
        if(this.trail[this.i].mode){
            
            if(isHD){
                this.trail[this.i].life-=1;
            }else{
                this.trail[this.i].life-=2;
            }
            
            
            this.trail[this.i].alpa=(this.trail[this.i].life/20);
            if(this.trail[this.i].life < 1){
                this.trail[this.i].mode=false;
            }
       }
        
    }
    
    this.pos.x = this.center.x - this.radio;
    this.pos.y = this.center.y - this.radio;
    
    if(this.hipo > 0.50){
        if(miGame.range(this)){
            this.exit();
        }
    }
    if(!this.mode)return;
    //collision with asteroids
    for(this.l=1;this.l <= 10; this.l+=1){
        if(miGame.scenes[this.father].asteroids[this.l].mode){
            //raiz cuadrada
            this.k=this.center.getDistancia(miGame.scenes[this.father].asteroids[this.l].center.x,miGame.scenes[this.father].asteroids[this.l].center.y);
            
            if(this.k < miGame.scenes[this.father].asteroids[this.l].radioCols){
                this.dead(true);
				if(this.type == 1){
					 miGame.scenes[1].asteroids[this.l].bDamage(this.id,this.damage,false,1);		
				}else if(this.type == 2){
					 miGame.scenes[1].asteroids[this.l].bDamage(this.id,this.damage,false,2);
				}
				
               
                
            }
        }
    }
	
	//collision with ships
    for(this.l=1;this.l <= maxEne; this.l+=1){
        if(miGame.scenes[this.father].enemies[this.l].mode){
            //raiz cuadrada
            this.k=this.center.getDistancia(miGame.scenes[this.father].enemies[this.l].center.x,miGame.scenes[this.father].enemies[this.l].center.y);
            
            if(this.k < miGame.scenes[this.father].enemies[this.l].radioCol){
                this.dead(true);
				
				if(this.type == 1){
					miGame.scenes[1].enemies[this.l].bDamage(this.id,this.damage,this.center.x,this.center.y,1,1);		
				}else if(this.type == 2){
					miGame.scenes[1].enemies[this.l].bDamage(this.id,this.damage,this.center.x,this.center.y,1,2);
				}
                
                
            }
        }
    }
	
	//colision con la estacion
	if(this.type == 2){
		
		this.k=this.center.getDistancia(canvasW/2,canvasH/2);
		if(this.k < miGame.scenes[this.father].turret.width){
		this.dead(true);
		if (miGame.scenes[1].shield.life > 0) {
			miGame.scenes[1].shield.bDamage(this.id, this.damage);
		} else {
			miGame.scenes[1].turret.bDamage(this.id, this.damage);
		}

		miGame.scenes[1].shield.counter = 90;
			
	}
	
            
	

	}
}//find eupdate de la bala

Bullet.prototype.paint=function(){
    /*
    ctx.lineWidth=miGame.lineW;
    ctx.strokeStyle="rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.moveTo(this.origin.x,this.origin.y);
    ctx.lineTo(this.center.x,this.center.y);
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth=1;
    */
    for(this.i=1; this.i <= 100; this.i+=1){
        
        if(this.trail[this.i].mode){
            
            ctx.globalAlpha=this.trail[this.i].alpa;
            
            ctx.drawImage(miGame.scenes[1].iCreated[3],
                  this.cutX*this.eWidth,
                  this.cutY*this.eWidth,
                  this.eWidth,
                  this.eWidth,
                  this.trail[this.i].x,
                  this.trail[this.i].y,
                  this.eWidth,
                  this.eWidth);
                  ctx.globalAlpha=1.0;
                  
            
       }
        
    }
    
    ctx.drawImage(miGame.scenes[1].iCreated[this.image],
                  this.cutX*this.width,
                  this.cutY*this.height,
                  this.width,
                  this.height,
                  this.pos.x,
                  this.pos.y,
                  this.width,
                  this.height);
                  
}

//Enemies bullets
