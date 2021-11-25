function Enemi1(id, radiox, radioy, dx, dy, te) {

	this.id = "enemi"+id;
	this.index=id;//indice en el array de enemigos
	this.radiox = radiox;
	this.tipo=1;
	
	this.radioac = radioy * 2;

	this.width = this.radiox * 2;
	this.height = this.radiox * 2;
	this.radioCol=~~(this.radiox * 0.75);
	this.center = new vector2D(dx, dy);
	this.centerF = new vector2D(dx, dy);

	this.pos = new vector2D(0, 0);

	this.canonTip = new vector2D(0, 0);
	this.turbineTip = new vector2D(0, 0);
	this.warHead = new vector2D(0, 0);
	this.frontalCol = new vector2D(0, 0);
	this.score=10;
	this.image = 6; //in Action class array images
	this.mode = false;
	this.HD = false;
	this.dataLife = {
		width: 32,
		acLife: 32,
		height: 2
	}
	this.speed = 1;
	
	if (isHD) {
		this.HD = true;
		this.dataLife = {
			width: 64,
			acLife: 64,
			height: 4
		}
		this.speed = 2;
		this.dPoints = 32;
	}
	
	this.cutX = 0;
	this.state = 0; //state 
	/*
	0:stay, 
	1 : forward
	2 : fast forward
	3 : turn right
	4 : turn left
	5 : forward & turn right
	6 : turn left and formard
	7 : braking
	8 : damaged, ready for exit from world
    
	*/
	this.tShips = te; //how many enemies
	//console.log(this.tShips);
	this.bullets = [];
	this.aRads = 1.0;
	this.aRads2= 1.0;//una vez muerto
	this.aGrads = 0;
	this.aGradCol = 361; //angle with next colider object

	this.target = false; //true if any missil engage me
	this.posTarget = 0; //to registry mi data on array targets
	this.health = 13;
	this.maxHealth = 13;
	this.percentHealth = 100;
	this.lastCol = "none";
	//ojo, mas adelante quitar la opcion de que todas las torretas disparen en todas las direcciones misiles
	//sin estar mirando a los objetvos, las dos primeras DEBEN estar mirando al obtetivo
	//apertuta de 180 grados
	this.i = 0;
	this.j = 0;
	this.k = 0;
	this.l = 0;//en el raycasting
	this.m = 0;//en el raycasting
	
	this.ax = 0;
	this.ay = 0;
	this.radAst=~~(miGame.guiData[4].width/3);//radio de los asteroides que me sirve a mi
		
	this.dx = 0; //for use in pitagoras theorem
	this.dy = 0;
	this.dt = 0;
	this.obx = 0;
	this.oby = 0;
	this.pDangers = 0; //cantidad de puntos de colision que se reportaron como peligrosos

	this.cual1 = 0; //cuando un solo punto es tocado para colision, aqui se decide cual es ?

	this.evasion = 0; //cantidad de grados a girar
	
	this.obColiders = [];
	for (this.i = 0; this.i <= 10; this.i += 1) {
		this.obColiders[this.i] = {
			x: 0,
			y: 0,
			used: false,
			id: "p-" + this.i,
			aGrads: 0,
			name: "p-" + this.i
		}
	}

	this.r = random(10, 255);
	this.g = random(10, 255);
	this.b = random(10, 255);
	this.rafaga=200;
	
	this.flashData={x:0,y:0,w:0,r:0,mode:false,im:3};
	
	//objetos de raycasting
	this.pointRay=new vector2D();
	this.rayData={xi:0,yi:0,xf:0,yf:0};
	this.hipo=0.0001;
	this.disparando=false;
	this.tFront=0;//cuantos enemigos hay al frente ?
	this.qFront="none"
	//para la linea de humos
	//cuando sse daña
	this.humos=[];
	
	this.humos[0]=new Humo(this.id+"1",1,18,this.index);
	this.humos[1]=new Humo(this.id+"2",1,18,this.index);
	this.radHumo1=0;//para definir donde va el punto de origen de humo
	
	this.zombi=false;
	this.angObMorte=0;//angulo con el objeto que me mato
	this.disObMorte=0;//distancia con el objeto que me mato
	this.alpa=1.0;
	this.flyMorte=0;//normal,1 cayendo
	this.adder=0;
	this.adder2=0;
	
	this.pieces=[];
	for(this.i=0; this.i <= 7; this.i+=1){
		this.pieces[this.i]=[];
		for(this.j=0;this.j <= 7; this.j+=1){
			
			this.pieces[this.i][this.j]={x:0,y:0,cx:0,cy:0,w:0,rx:0,aG:0,v:1.1,alpa:1.0,mode:false,con:true};
			this.pieces[this.i][this.j].rx=this.width/16;//radio
			this.pieces[this.i][this.j].w=this.width/8;//ancho
			
		}
	}
	this.pD={w:this.width/8,r:this.width/16};//medidas de cada pieza cuadrada que confdorma a la vane destruida
	this.iDamage=new Image();
	
	miGame.setEnemiDes(1, 23, this.width, 45,this.iDamage);
	//console.log("me cree "+this.id);
}//end of ship definition


Enemi1.prototype.dead = function (lx,ly,pod,sc) {
	
	
	miGame.setEnemiDes(1, 23, this.width, this.aGrads,this.iDamage);
	this.setDestroy();
	this.mode = false;
	this.zombi=true;//activa el modo zombie para salir con los daños
	//this.health=13;
	this.maxHealth = 13;
	this.percentHealth = 100;
	if(sc == 1){
		//muerte provocada por el jugador
		//console.log(this.id+" mori lance "+sc);
		miGame.scenes[1].runTscore(this.pos.x,this.pos.y,10);
	}
	
	//console.log("Mori "+this.id+" , "+this.mode);
	miGame.scenes[1].totalEne -= 1; //resta uno a LOS actuales En pantalla
	miGame.scenes[1].maxEnemies.substract(); //resta uno a LOS vivos en LA mision
	this.lastCol = "none";
	this.flyMorte=0;
	this.angObMorte=this.center.getAngulo(lx,ly);
	this.disObMorte=this.center.getDistancia(lx,ly);
	if(this.disObMorte > this.radiox){
		if(isHD){
			this.disObMorte=this.radiox - (random(10,15));
		}else{
			this.disObMorte=this.radiox - (random(5,10));

		}
		
	}
	if(pod == 1){
		//lanzar un humo
		if(isInMid(this.aGrads, this.angObMorte)){
			this.radHumo1 = this.disObMorte;
		}else{
			this.radHumo1 = -this.disObMorte;
			
		}
		
		this.humos[0].mode=true;
		
	}else if(pod == 2){
		//lanzar 2 humos
		//el humo 2 siempre va en el centro
		if(isInMid(this.aGrads, this.angObMorte)){
			this.radHumo1 = this.disObMorte;
			
		}else{
			this.radHumo1 = -this.disObMorte;
			

		}
		
		this.humos[0].mode=true;
		this.humos[1].mode=true;
		
	}
	this.humos[0].center.x = this.center.x + (Math.cos(this.aRads) * (this.radHumo1));
	this.humos[0].center.y = this.center.y + (Math.sin(this.aRads) * (this.radHumo1));
	
	this.cutX=random(0,2);
	this.cutY=8;
	this.adder=random(1,2);
	//console.log(this.adder);
}//fin de dead de la nave

Enemi1.prototype.exit = function (morir) {
	this.mode = false;
	//this.health=13;
	this.maxHealth = 13;
	this.percentHealth = 100;
	
	miGame.scenes[1].totalEne -= 1; //resta uno a LOS actuales En pantalla
	//console.log("Sali "+this.id+" , "+this.mode);
	this.lastCol = "none";
	if(morir != null & morir == true){
		this.zombi=false;
	}
}

Enemi1.prototype.point1 = function (d) {
	//que hacer cuando solo 1 puno se reporto como 
	//peligro de colisionar

	switch (d) {
	case 1:
		if (this.aGradCol < this.aGrads) {
			//gire a la derecha
			this.evasion = 20;
			this.state = 5;

		} else if (this.aGradCol > this.aGrads) {
			//gire a la izquierda
			this.evasion = -20;
			this.state = 6;

		} else if (this.aGradCol == this.aGrads) {
			//eliga al azar, mas grados
			if (random(0, 1) == 1) {
				this.evasion = 20;
				this.state = 5;
			} else {
				this.evasion = -20;
				this.state = 6;
			}
		}
		break;
	case 2:
		this.evasion = -8;
		this.state = 6;
		break;
	case 3:
		this.evasion = -6;
		this.state = 6;
		break;

	case 4:
		this.evasion = -4;
		this.state = 6;
		break;

	case 10:
		this.evasion = 8;
		this.state = 5;
		break;
	case 9:
		this.evasion = 6;
		this.state = 5;
		break;

	case 8:
		this.evasion = 4;
		this.state = 5;
		break;
	default:
		//pensar en acelerar un poquito
		this.evasion = 10;
		this.state = 2;
		break;
	}
}

Enemi1.prototype.collider = function () {
		//registrar a todos los demas objetos del juego
	
	for (this.i = 1; this.i <= 10; this.i += 1) {
		//console.log(this.obColiders[this.i].x);

		this.obColiders[this.i].aGrads = this.aGrads + ((this.i * 36) - 36);
		if (this.obColiders[this.i].aGrads > 359) {
			this.obColiders[this.i].aGrads -= 359;
		}

		//calcular el punto para ubicar 
		this.obx = ~~((this.radioac) * Math.cos((this.obColiders[this.i].aGrads * 3.14159) / 180));
		this.oby = ~~((this.radioac) * Math.sin((this.obColiders[this.i].aGrads * 3.14159) / 180));

		this.obColiders[this.i].x = this.center.x + (this.obx);
		this.obColiders[this.i].y = this.center.y + (this.oby);

	}
	//obtener las amenazas
	//primero la torreta 
	for (this.i = 1; this.i <= 10; this.i += 1) {

		this.dx = this.obColiders[this.i].x - (canvasW / 2);
		this.dy = this.obColiders[this.i].y - (canvasH / 2);

		this.dt = (Math.sqrt((this.dx * this.dx) + (this.dy * this.dy)) - (this.radiox));
		if (this.dt < 1) {
			this.obColiders[this.i].used = true;
			this.obColiders[this.i].id = "turret";
		} else {
			this.obColiders[this.i].used = false;
			this.obColiders[this.i].id = "none";
		}
	}

	//ahora las demas naves
	for (this.i = 1; this.i <= 10; this.i += 1) {
		for (this.j = 1; this.j <= this.tShips; this.j += 1) {

			if (this.id != miGame.scenes[1].enemies[this.j].id & miGame.scenes[1].enemies[this.j].mode) {

				//
				this.dx = this.obColiders[this.i].x - miGame.scenes[1].enemies[this.j].centerF.x;
				this.dy = this.obColiders[this.i].y - miGame.scenes[1].enemies[this.j].centerF.y;

				this.dt = (Math.sqrt((this.dx * this.dx) + (this.dy * this.dy)) - (this.radiox));

				if (!this.obColiders[this.i].used) {

					if (this.dt < 1) {

						this.aGradCol = this.center.getAngulo(miGame.scenes[1].enemies[this.j].centerF.x, miGame.scenes[1].enemies[this.j].centerF.y);
						if (this.aGradCol < 0) {
							this.aGradCol = 180 - this.aGradCol;
						}

						//console.log("sw "+this.aGradCol);

						if (isInField(this.aGradCol, 75, miGame.scenes[1].enemies[this.j].aGrads, true)) {
							//console.log("sw "+this.aGradCol);
							this.obColiders[this.i].used = true;
							this.obColiders[this.i].id = miGame.scenes[1].enemies[this.j].id;

						} else {
							//esta cerca pero NO es un peligro
							this.obColiders[this.i].used = false;
							this.obColiders[this.i].id = miGame.scenes[1].enemies[this.j].id;
							this.aGradCol = 361;
						}
						/*
						 this.obColiders[this.i].used=true;
						 this.obColiders[this.i].id=miGame.scenes[1].enemies[this.j].id; 
						 */
					} else {
						//esta lejos
						this.obColiders[this.i].used = false;
						this.obColiders[this.i].id = "none";
					}
				}

			}

			}
		} //fin de con las demas naves

		//aqui faltaria mirar las torretas enemigas
		//recordar que estas rorretas son como la protagonista, solo con estar cerca SON peligrosas

		//ahora vamos a analizar la cantidad de puntos y actuar en consecuencia

		for (this.i = 1; this.i <= 10; this.i += 1) {
			if (this.obColiders[this.i].used) this.pDangers += 1;
		}

		switch (this.pDangers) {
		case 1:
			//un solo punto de colision
			//cual fue ?
			for (this.i = 1; this.i <= 10; this.i += 1) {

				if (this.obColiders[this.i].used) this.cual1 = this.i;

			}
			this.point1(this.cual1);

			break;
		}

		this.pDangers = 0;
	} //fin del metodo collider

Enemi1.prototype.bDamage = function (who,many,lx,ly,pod,sc) {
	//
	if (this.lastCol != who) {
		
		this.health -= many;
		this.lastCol = who;
		//console.log("el ultimo que me golpeo fue "+this.lastCol+" con un dano de "+many);
		if (this.health < 1) this.dead(lx,ly,pod,sc);
	}



}

Enemi1.prototype.getPosLine=function(){
	//Nuevo metodo
	this.ax=((1.0 - this.hipo)* this.rayData.xi) + (this.hipo * this.rayData.xf);
    this.ay=((1.0 - this.hipo)* this.rayData.yi) + (this.hipo * this.rayData.yf);
    
    this.pointRay.x= ~~(this.ax);
    this.pointRay.y= ~~(this.ay);
	
}

Enemi1.prototype.frontFriend=function(){
	//alguna nave aliada (de los malos) esta en frente mio ?
	for(this.l=1; this.l <= 99; this.l+=1){
		this.hipo=this.l/100;
		this.getPosLine();
		
		for(this.m=1; this.m <= maxEne; this.m+=1){
			if(miGame.scenes[1].enemies[this.m].mode & miGame.scenes[1].enemies[this.m].id != this.id){
				if(this.pointRay.getDistancia(miGame.scenes[1].enemies[this.m].center.x,miGame.scenes[1].enemies[this.m].center.y) <= this.radiox){
					//console.log("en frente esta : "+miGame.scenes[1].enemies[this.m].id);
					this.l=100;
					this.qFront="friend";
					
					break;
				}
			}//fin de recorrer todos los enemigos activos y que NO soy yo mismo
		}
	}
	if(this.qFront=="friend")return true;
	//this.disparando=false;
	return false;
}

Enemi1.prototype.frontAster=function(){
	//hay algun asteroide
	
	for(this.l=1; this.l <= 99; this.l+=1){
		this.hipo=this.l/100;
		this.getPosLine();
		
		for(this.m=1; this.m <= maxAst; this.m+=1){
			if(miGame.scenes[1].asteroids[this.m].mode){
				if(this.pointRay.getDistancia(miGame.scenes[1].asteroids[this.m].center.x,miGame.scenes[1].asteroids[this.m].center.y) <= this.radAst){
					this.disparando=true;
					//ojo aqui analizador de conveniencia de 
					//disparo para otras naves
					this.qFront="Asteroide";
					this.l=100;
					break;
				}
			}//fin de los asteroieds estan vivos ?
		}//fin de recorrer todos los asteroides
		
	}//fin de recorrer toda la linea de ray casting
	if(this.qFront=="Asteroide")return true;
	//this.disparando=false;
	return false;
}

Enemi1.prototype.frontTurret=function(){
		
	//if(this.disparando)return;
	//esta en frente la torreta ?
	for(this.l=1; this.l <= 99; this.l+=1){
		this.hipo=this.l/100;
		this.getPosLine();
		if(this.pointRay.getDistancia(canvasW/2,canvasH/2) <= this.radiox){
			this.disparando=true;
			//ojo aqui analizador de conveniencia de 
			//disparo para torreta
			this.l=100;
			this.qFront="torreta";
			break;
		}
			
	}
	if(this.qFront=="torreta")return true;
	this.disparando=false;
	return false;
	
}//fin de getRay

Enemi1.prototype.upZombie=function(){
	//maneja la salida del mundo una vez ha sido destruido
	//forward
	if (miGame.range(this))this.exit(true);
	
	switch(this.flyMorte){
		case 0:
			//girando y cayendo hacia el planeta
			if( this.adder == 1){
				this.aGrads+=1;	
			}else{
				this.aGrads-=1;	
			}

			if(this.aGrads < 0)this.aGrads+=359;
			if(this.aGrads > 359)this.aGrads-=359;

			this.aRads=(this.aGrads * PI)/180;

			this.alpa-=0.001;
			if(this.alpa < 0.01)this.alpa=0.01;

			this.speed*=0.997;
			this.center.x += (Math.cos(this.aRads) * this.speed);
			this.center.y += (Math.sin(this.aRads) * this.speed);

			this.centerF.x = ~~(this.center.x);
			this.centerF.y = ~~(this.center.y);
			if(this.speed < 0.050)this.exit(true);
			//console.log("debi empezar a girar");

			this.adder2+=1;
			if(this.adder2 > 30){
				this.radiox-=2;
				this.width=this.radiox * 2;
				this.adder2=0;
				if(this.radHumo1 > 0 ){
					this.radHumo1-=2;			
				}else if(this.radHumo1 < 0){
					this.radHumo1+=2;
				}

			}
		break;
		case 1:
			//cayendo en linea recta
			
		break;
		case 2:
			//explosion completa
			
		break;
	}
	
	
	this.pos.x = this.centerF.x - this.radiox;
	this.pos.y = this.centerF.y - this.radiox;
	
	this.humos[0].center.x = this.center.x + (Math.cos(this.aRads) * (this.radHumo1));
	this.humos[0].center.y = this.center.y + (Math.sin(this.aRads) * (this.radHumo1));
	this.humos[0].alpa=this.alpa;
	if(this.humos[1].mode){
		
		this.humos[1].center.x = this.center.x;
		this.humos[1].center.y = this.center.y;
		this.humos[1].alpa=this.alpa;

	}
	
	
	
	this.humos[0].update();
	this.humos[1].update();
}

Enemi1.prototype.setDestroy=function(){
	//inicializa la destruccion por pedazos de la nave
	for(this.i=0; this.i <= 7; this.i+=1){
		for(this.j=0;this.j <= 7; this.j+=1){
			
			//{x:0,y:0,cx:0,cy:0,rx:0,aG:0,aR:0.001,v:1.1,alpa:1.0,mode:false,wCon:true}
			
			this.pieces[this.i][this.j].x=this.pos.x + (this.pD.r * this.i);
			this.pieces[this.i][this.j].y=this.pos.y + (this.pD.r * this.j);
			
			this.pieces[this.i][this.j].cx=this.pieces[this.i][this.j].x + this.pD.r;
			this.pieces[this.i][this.j].cy=this.pieces[this.i][this.j].y + this.pD.r;
			
			//definir el angulo en grados
			this.pieces[this.i][this.j].aG=this.center.getAngulo(this.pieces[this.i][this.j].cx,this.pieces[this.i][this.j].cy);
			
		}
	}
	
	
}
Enemi1.prototype.update = function () {

	if (miGame.range2(this.center)) this.exit(false);

	if (!this.mode) return;

	this.aRads = (this.aGrads * 3.141519) / 180;


	switch (this.state) {

		case 1:

			//forward
			this.center.x += (Math.cos(this.aRads) * this.speed);
			this.center.y += (Math.sin(this.aRads) * this.speed);

			this.centerF.x = ~~(this.center.x);
			this.centerF.y = ~~(this.center.y);
			//console.log(this.centerF.x+" , "+this.centerF.y);
			this.collider();
			break;
		case 2:

			//forward fast
			this.center.x += (Math.cos(this.aRads) * (this.speed + 0.5));
			this.center.y += (Math.sin(this.aRads) * (this.speed + 0.5));

			if (this.evasion > 0) {
				this.evasion -= 1;

			} else if (this.evasion == 0) {
				this.state = 1;

			}

			break;
		case 3:

			//advanced fast
			this.center.x += (Math.cos(this.aRads) * (this.speed + 0.5));
			this.center.y += (Math.sin(this.aRads) * (this.speed + 0.5));



			break;
		case 4:

			//advanced fast
			this.center.x += (Math.cos(this.aRads) * (this.speed + 0.5));
			this.center.y += (Math.sin(this.aRads) * (this.speed + 0.5));
			break;
		case 5:

			//advanced  turn clock
			if (this.evasion > 0) {
				this.evasion -= 1;
				this.aGrads += 1;
			} else if (this.evasion == 0) {
				this.state = 1;
				this.aGradCol = 0;
			}
			if(this.aGrads > 359)this.aGrads=0;
			this.collider();
			this.center.x += (Math.cos(this.aRads) * (this.speed - 0.5));
			this.center.y += (Math.sin(this.aRads) * (this.speed - 0.5));
			break;
		case 6:

			if (this.evasion < 0) {
				this.evasion += 1;
				this.aGrads -= 1;
				if(this.aGrads < 0)this.aGrads=359;
			} else if (this.evasion == 0) {
				this.state = 1;
				this.aGradCol = 0;
			}
			//advanced +turn anti-clock
			this.center.x += (Math.cos(this.aRads) * (this.speed - 0.5));
			this.center.y += (Math.sin(this.aRads) * (this.speed - 0.5));
			
			break;

	}//fin del swicth

	if (this.state != 9) {
		//No esta muerto
		//ship its forward
		//cutx

		this.cutX += 1;
		if (this.cutX > 2) this.cutX = 0;


		this.warHead.x = this.center.x + (Math.cos(this.aRads) * ((this.radiox)));
		this.warHead.y = this.center.y + (Math.sin(this.aRads) * ((this.radiox)));

		this.frontalCol.x = this.center.x + (Math.cos(this.aRads) * ((this.width)));
		this.frontalCol.y = this.center.y + (Math.sin(this.aRads) * ((this.width)));


	}
	if(this.aGrads < 0)this.aGrads+=359;
	
	this.pos.x = this.centerF.x - this.radiox;
	this.pos.y = this.centerF.y - this.radiox;

	this.percentHealth = ~~(this.health * 100 / this.maxHealth);
	this.dataLife.acLife = (this.percentHealth * this.dataLife.width) / 100;
	
	
	
	if(this.rafaga > 0){
		this.rafaga-=1;
	}
	//set de raycasting
	this.rayData.xi=this.warHead.x;
	this.rayData.yi=this.warHead.y;
	
	this.ax=(canvasW/2 )*Math.cos(this.aRads);
    this.ay=(canvasW/2 )*Math.sin(this.aRads);
    
    this.rayData.xf=~~((this.rayData.xi+(this.ax)));
    this.rayData.yf=~~((this.rayData.yi+(this.ay)));
	if(!this.frontFriend()){
		//al frente NO hay ninguna nave aliada (de los otros malos)
		//hay algun asteroide ?
		if(this.frontAster()){
			
			this.disparando=true;
			
		}else if(this.frontTurret()){
			
			this.disparando=true;
			
		}
		
	}else{
		//this.disparando=false;
		this.qFront="amigo";
	}
	
	if(this.disparando & this.rafaga == 0){
		
		miGame.scenes[1].runEneBullet(this.warHead.x,this.warHead.y,this.aGrads);
		this.rafaga=10;
		
		this.flashData.mode=true;
		
		this.flashData.x=this.warHead.x - this.flashData.r;
		this.flashData.y=this.warHead.y - this.flashData.r;
		this.disparando=false;
	}
	this.tFront=0;
	if (this.health < 1) this.dead();
	
	
}//fin de update de ship

Enemi1.prototype.paint2=function(){
	//pinta la salida de la nave cuando ya fue destruida
	//ctx.drawImage(this.iDamage,this.pos.x,this.pos.y);
	ctx.save();
	ctx.translate(this.center.x, this.center.y);

	ctx.rotate(this.aRads);
	ctx.globalAlpha=this.alpa;
	ctx.drawImage(miGame.scenes[miGame.sceneActive].images[this.image],
		this.cutX * this.height,
		this.cutY * this.height,
		this.height,
		this.height, 
		  -this.radiox, 
		  -this.radiox,
		this.width,
		this.width);
	ctx.restore();
	
	this.humos[0].paint();
	if(this.humos[1].mode)this.humos[1].paint();
	ctx.globalAlpha=1.0;
	/*
	ctx.fillStyle = "rgba(255,255,14,1.0)";
	ctx.beginPath();
	ctx.fillRect(this.humos[1].center.x-3, this.humos[1].center.y-3, 6,6);
	ctx.fill();
	ctx.fillStyle = "rgba(255,2,246,1.0)";
	ctx.beginPath();
	ctx.fillRect(this.humos[0].center.x-3, this.humos[0].center.y-3, 6,6);
	ctx.fill();
	*/
	
}

Enemi1.prototype.paint = function () {
	
	ctx.save();
	ctx.translate(this.center.x, this.center.y);

	ctx.rotate(this.aRads);
	ctx.drawImage(miGame.scenes[miGame.sceneActive].images[this.image],
		this.cutX * this.width,
		this.state * this.height,
		this.width,
		this.height, -this.radiox, -this.radiox,
		this.width,
		this.height);
	ctx.restore();

	ctx.fillStyle = "rgba(255,255,20,1.0)";
	//ctx.font = miGame.tTxt + "Px Arial";

	//ctx.fillText(this.qFront, this.pos.x, this.centerF.y);
	//ctx.fillText(this.disparando,this.pos.x,this.centerF.y+20);

	//ctx.fillText(this.id, this.pos.x, this.pos.y + 5);
	//ctx.fillText(this.health,this.pos.x,this.center.y);

	//paint life
	
	ctx.fillStyle = "rgba(0,0,0,1.0)";
	ctx.beginPath();
	ctx.fillRect(this.pos.x, this.pos.y, this.dataLife.width, this.dataLife.height);
	ctx.fill();
	ctx.fillStyle = "rgba(136,207,0,1.0)";
	ctx.fillRect(this.pos.x, this.pos.y, this.dataLife.acLife, this.dataLife.height);
	ctx.fill();
	ctx.closePath();
	/*
	ctx.fillStyle = "rgba(115,255,41,1.0)";
	ctx.beginPath();
	ctx.fillRect(this.warHead.x - 2, this.warHead.y - 2, 4, 4);
	ctx.fill();
	ctx.closePath();
	*/
	//radio interno
	/*
	ctx.lineWidth = miGame.lineW;
	ctx.strokeStyle = "rgba(" + this.r + "," + this.g + "," + this.b + ",0.2)";
	ctx.beginPath();
	//ctx.arc(this.center.x,this.center.y,this.radiox,0,2*Math.PI,true);
	ctx.strokeRect(this.pos.x,this.pos.y,this.width,this.width);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1;
	*/
	//detector de colision
	/*
	ctx.strokeStyle="rgba(25,12,241,1.0)";
	ctx.beginPath();
	ctx.arc(this.frontalCol.x,this.frontalCol.y,this.radiox,0,Math.PI*2,true);
	ctx.stroke();
	ctx.closePath();
	
	//redio externo
	ctx.strokeStyle="rgba(115,50,41,1.0)";
	ctx.beginPath();
	ctx.arc(this.center.x,this.center.y,this.radioac,0,Math.PI*2,true);
	ctx.stroke();
	ctx.closePath();

	ctx.lineWidth=1;  
	//puntos de colision, NO de raycasting
	*/
		for (this.k = 1; this.k <= 10; this.k += 1) {

			if (this.obColiders[this.k].used) {
				ctx.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + ",1.0)";

				ctx.beginPath();
				ctx.fillRect(this.obColiders[this.k].x - 3, this.obColiders[this.k].y - 3, 6, 6);
				ctx.fill();
				ctx.fillStyle = "rgba(255,255,255,1.0)";

				ctx.font = "15px Arial";

				//ctx.fillText(this.obColiders[this.k].id, this.obColiders[this.k].x + 5, this.obColiders[this.k].y + 5);

				ctx.closePath();
			} else {
				/*
            ctx.fillStyle="rgba(255,255,255,1.0)";
        
            ctx.beginPath();
            ctx.fillRect(this.obColiders[this.k].x-3,this.obColiders[this.k].y-3,6,6);
            ctx.fill();
            
            ctx.fillStyle="rgba(255,255,255,1.0)";
            ctx.font=miGame.tTxt+"px Arial";
            ctx.fillText(this.obColiders[this.k].name,this.obColiders[this.k].x+5,this.obColiders[this.k].y+5);
            */
			}
		}
	
	//linea de colision raycasting
	/*
	ctx.lineWidth=miGame.lineW;
	ctx.strokeStyle="rgba("+this.r+","+this.g+","+this.b+",0.10)";
	ctx.moveTo(this.rayData.xi,this.rayData.yi);
	ctx.lineTo(this.rayData.xf,this.rayData.yf);
	ctx.stroke();
	ctx.beginPath();

	ctx.lineWidth=1;
	
	//cuadro donde se detecto una colision en el ray casting
	ctx.fillStyle="rgba("+this.r+","+this.g+","+this.b+",1.0)";
    ctx.beginPath();
	ctx.fillRect(this.pointRay.x-3,this.pointRay.y-3,6,6);
	ctx.fill();
	ctx.closePath();
	*/
	//flash del diparo
	if (this.flashData.mode) {
		ctx.drawImage(miGame.scenes[1].images[3],this.flashData.w,0,this.flashData.w,this.flashData.w,this.flashData.x,this.flashData.y,this.flashData.w,this.flashData.w);
		this.flashData.mode=false;
	}
	this.qFront="none";
} //fin de pintar de nave1