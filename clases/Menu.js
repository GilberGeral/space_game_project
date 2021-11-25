function Menu(){
    
    this.allObjects=8;
    this.objectsLoaded=0;
    
    this.loading=true;
    this.playing=false;
    this.bloqued=false;//flag to orientation device
    this.runSome=false;
    
    this.buttons=[];
    this.sounds=[];
    this.images=[];
    this.idata=[];
    this.idata[0]={x:0,y:0,alpa:1.0}
    
    this.i=0;//for use in for structures
    this.j=0;
    this.k=0;
    
    this.doing="none";
    this.frame=0;
    this.maxLights=1000;
    this.radGrad;
    this.restator1=0;
    
 
    this.dataFsocial={width:0,height:0,radiox:0,alpa:1.0,wid2:1,radioBot:0}
    this.HD=false;
	this.res=0;
    if(miGame.resolution == "HD")this.HD=true;
}

Menu.prototype.setImData=function(cual){
    
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

Menu.prototype.constructor=function(){
    //this.images[0]=new dImage();
    this.images[0]=new Image();
    this.images[1]=new Image();
    this.images[2]=new Image();//imagen de fondo de menu
    this.images[3]=new Image();//menu optios
    this.images[4]=new Image();//f Social when touched
    this.images[5]=new Image();//f Menu when toched
    this.images[6]=new Image();//Canon
	

    
    this.images[0].onload=function(){
        
        miGame.scenes[0].objectsLoaded+=1;
        
        miGame.scenes[0].setImData(0);
        
        
        this.x=(canvasW / 2)-(~~(this.width /2));
        this.y=canvasH/20;
    
    }
	
    this.images[0].src=miGame.resolution+"/bSocials.png";
   
    this.images[1].onload=function(){
        
        miGame.scenes[0].objectsLoaded+=1;
        miGame.scenes[0].setImData(1);
        
        this.x=(canvasW / 2)-(~~(this.width /2));
        this.y=(canvasH / 2)-(~~(this.height /2));
    
    }
    
    this.images[1].src=miGame.resolution+"/rotate.png";
    
    this.images[2].onload=function(){
        miGame.scenes[0].objectsLoaded+=1;
        
        miGame.scenes[0].setImData(2);
        
        this.x=(canvasW / 10)-(~~(this.width /2));
        
        this.y=((canvasH )-(canvasH / 3)-(~~(this.height /2)));
        
    }
    
    this.images[2].src=miGame.resolution+"/planeta1b.png";
    
    this.images[3].onload=function(){
        miGame.scenes[0].objectsLoaded+=1;
        miGame.scenes[0].dataFsocial.wid2=this.width+(this.height/16);
		miGame.scenes[0].dataFsocial.radioBot=this.width/2;

    }
    
    this.images[3].src=miGame.resolution+"/es/bMenu.png";//idioma
        
    this.images[4].onload=function(){
        miGame.scenes[0].objectsLoaded+=1;
        
        miGame.scenes[0].dataFsocial.width=this.width/5;
        miGame.scenes[0].dataFsocial.height=this.height/2;
        miGame.scenes[0].dataFsocial.radiox=this.width/10;
        
    }
    
    this.images[4].src=miGame.resolution+"/bSocials.png";
    
    
    //usar esta imagen en otra funcion
    this.images[5].onload=function(){
        //ojo, usar esta para otra cosa
        miGame.scenes[0].objectsLoaded+=1;
        
    }
    this.images[5].src=miGame.resolution+"/canon.png";
    
    this.images[6].onload=function(){
        miGame.scenes[0].objectsLoaded+=1;
    }
    this.images[6].src=miGame.resolution+"/canon.png";
	
	
	
    
    
    //end declarations of images
    //ud,sx,sy,cx,cy,im,cl,tx,father,doing,type
    this.buttons[0]=new simpleButton(0,0,canvasH/10,0,0,3,null,null,0,"play",0);//play
    this.buttons[1]=new simpleButton(0,0,(canvasH/10)+(~~(canvasH/10)),0,1,3,null,null,0,"select",0);//select level
    this.buttons[2]=new simpleButton(0,0,(canvasH/10)+(~~(canvasH/10)*2),0,2,3,null,null,0,"howTo",0);//howto
    this.buttons[3]=new simpleButton(0,0,(canvasH/10)+(~~(canvasH/10)*3),0,3,3,null,null,0,"moreGa",0);//more games,store <->
    
    
    this.buttons[4]=new simpleButton(1,(canvasW/10),(canvasH)-(~~(canvasH/12)),0,0,4,null,null,0,"bSound",1);//sound
    this.buttons[5]=new simpleButton(1,((canvasW/10)*2),(canvasH)-(~~(canvasH/12)),1,0,4,null,null,0,"bMusic",1);//music
    this.buttons[6]=new simpleButton(1,((canvasW/10)*3),(canvasH)-(~~(canvasH/12)),2,0,4,null,null,0,"bconfi",1);//config
    this.buttons[7]=new simpleButton(1,((canvasW/10)*4),(canvasH)-(~~(canvasH/12)),3,0,4,null,null,0,"bShare",1);//share
    this.buttons[8]=new simpleButton(1,((canvasW/10)*5),(canvasH)-(~~(canvasH/12)),4,0,4,null,null,0,"bFace",1);//face
    this.buttons[9]=new simpleButton(1,((canvasW/10)*6),(canvasH)-(~~(canvasH/12)),2,1,4,null,null,0,"bHelp",1);//help
    
    
    //el noveno boton sera more games, y falta store
}

Menu.prototype.createBackGround=function(){
    
    
    //console.log("llego a create back");
    ctx2.clearRect(0,0,canvasW,canvasH);
    ctx2.fillStyle=miGame.colours[0];
    ctx2.fillRect(0,0,canvasW,canvasH);
    ctx2.fill();
    //lights
    
    for(this.i=1;this.i<=1000;this.i++){
        
        
        if(miGame.resolution=="HD")this.j=random(2,3);
        if(miGame.resolution=="SD")this.j=random(1,1);
        ctx2.beginPath();
        ctx2.fillStyle=miGame.colours[4];
        ctx2.fillRect(random(0,canvasW),random(0,canvasH),1,1);
        ctx2.closePath();
        ctx2.fill();
    }
    
    //planet
    
    ctx2.drawImage(this.images[2],0,0,canvasW,canvasH,0,0,canvasW,canvasH);
    
    
    
}//end craet bagr

Menu.prototype.control=function(){
    
    this.restator1=20;
    this.doing="play";
    this.loading=false;
    this.playing=true;
    
    for(this.i=0; this.i <= 3; this.i+=1){
        if(this.HD){
            this.buttons[this.i].center.x=canvasW-(this.images[3].width/2);
            
        }else{
            this.buttons[this.i].center.x=canvasW-(this.images[3].width/2);
            
        }
        this.buttons[this.i].pos.x = this.buttons[this.i].center.x -(this.buttons[this.i].width /2);
    }
    
    for(this.i=4; this.i <= 9; this.i+=1){
        
        this.buttons[this.i].center.x+=(miGame.guiData[0].width);
       
        this.buttons[this.i].pos.x = this.buttons[this.i].center.x -(this.buttons[this.i].width /2);
    }
    if(!miGame.enabledMusic)this.buttons[5].cutY=1;
	
}//fin de control

Menu.prototype.goGame=function(){
    miGame.sceneActive=1;
    miGame.scenes[1].loading=true;
}


Menu.prototype.setMusic=function(){
	console.log("eer");
	switch(miGame.enabledMusic){
		case true:
			miGame.enabledMusic=false;
			localStorage.setItem("music","0");
			this.buttons[5].cutY=1;
			miGame.mData.lVol=miGame.sFondo.volume;
			miGame.mData.step=miGame.sFondo.volume/100;
			miGame.mData.fadeOut=true;

		break;
		case false: 
			miGame.enabledMusic=true;
			localStorage.setItem("music","1");
			this.buttons[5].cutY=0;
			miGame.mData.fadeIn=true;
		break;
	}
	
}

Menu.prototype.setAction=function(){
    //ojo, cambia a action el nombre de este metodo
    
    switch(this.doing){
        case "play":
            this.restator1=10;
            //console.log("aqui fue");
            this.goGame();
        break;
		case "bMusic":
			this.restator1=10;
			if(!miGame.mData.fadeIn & !miGame.mData.fadeOut){
				this.setMusic();
			}
			
		break;
    }
}

Menu.prototype.up=function(){
    
}

Menu.prototype.down=function(){
    
}

Menu.prototype.left=function(){
    
}

Menu.prototype.right=function(){
    
}

Menu.prototype.stop=function(){
    
}
//ww
Menu.prototype.update=function(){
	
    if(this.bloqued)return;
    if(this.loading){
        if(this.objectsLoaded >= this.allObjects){
            this.createBackGround();
            this.control();            
        }else{
            //console.log("not yet loaded");
        }
    }
    
    if(this.playing){
        this.frame+=1;
        this.dataFsocial.alpa=(random(50,60))/100;
        if(this.runSome){
            
            this.restator1-=1;
            if(this.restator1 < 2){console.log("here");
                this.runSome=false;
                this.setAction();
            }
            
        }
        if(this.runSome)return;//waiting for eject a action
        
        
        for(this.i=0;this.i<=9;this.i++){
            //first touch in a button
            if(this.buttons[this.i].touch()){
                
                this.doing=this.buttons[this.i].id;
                
            }
        }
        
        if(touchesB[0].x !== 0 | touchesB[0].y !== 0){
            //se solto el toque
            
            for(this.i=0;this.i<=9;this.i++){
                //first touch in a button
                if(this.buttons[this.i].touchB()){
                    this.runSome=true;
                    //break;
                }
            }
            touchesB[0].x=0;
            touchesB[0].y=0;
        }
        
		if(miGame.mData.fadeOut){
			
			if(miGame.sFondo.volume > 0.01){
				miGame.sFondo.volume -= miGame.mData.step;
				
			}else{
				
				miGame.sFondo.volume=0.0;
				miGame.mData.fadeOut=false;
				//console.log("termino de apagar ");
			}
		}
		if(miGame.mData.fadeIn & miGame.enabledMusic){
			
			if(miGame.sFondo.volume < miGame.mData.lVol){
				miGame.sFondo.volume += miGame.mData.step;
				
			}else{
				
				miGame.sFondo.volume=miGame.mData.lVol;
				miGame.mData.fadeIn=false;
				//console.log("termino de encender "+miGame.mData.fadeIn);
			}
		}
    }//end of playing in update loop
    
}
//a
Menu.prototype.paint=function(){
    
    ctx.clearRect(0,0,canvasW,canvasH);
    if(this.bloqued){
        ctx.fillStyle=miGame.colours[0];
        ctx.beginPath();
        ctx.fillRect(0,0,canvasH,canvasW);
        ctx.fill();
        ctx.closePath();
        ctx.drawImage(this.images[1],this.images[1].y,this.images[1].x);
        
    }
    
    ctx.fillStyle="rgba(255,45,255,1)";
    ctx.font=miGame.tTxt+"px Arial";
   	//ctx.fillText(this.doing,50,100);
    //ctx.fillText(miGame.sFondo.volume,50,130);
    //ctx.fillText(miGame.sFondo.loop,50,160);
    if(touches[0] != null){
        //ctx.fillText(touches[0].x+" , "+touches[0].y,50,200);
    }
    if(this.bloqued)return;
    
    //ctx.fillText(touchesB[0].x+" , "+touchesB[0].y,50,300);
   
    
    if(this.loading){
        ctx.fillStyle="rgba(255,45,255,1)";
   		ctx.font=miGame.tTxt+"px Arial";
   		ctx.fillText("cargando",(canvasW/2)-100,canvasH/2);
    }
    if(this.playing){
        
        //ctx.drawImage(this.images[0],this.images[0].x,this.images[0].y);
        
        
        ctx.fillStyle="rgba(255,255,255,1)";
        ctx.font="20Px Arial";
        //ctx.fillText(this.doing,50,50);
        //ctx.fillText("app ? "+app,300,50);
        this.buttons[0].paint();
        this.buttons[1].paint();
        this.buttons[2].paint();
        this.buttons[3].paint();
        this.buttons[4].paint();
        this.buttons[5].paint();
        this.buttons[6].paint();
        this.buttons[7].paint();
        this.buttons[8].paint();
        this.buttons[9].paint();
    }
}