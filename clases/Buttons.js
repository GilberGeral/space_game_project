function simpleButton(ud,sx,sy,cx,cy,im,cl,tx,father,doing,type){
    
    this.center=new vector2D(sx,sy);
    this.pos=new vector2D();
    this.touched=new vector2D(0,0);
    this.width=miGame.guiData[ud].width;
    this.height=miGame.guiData[ud].height;
    this.radioX=~~(this.width/2);
    this.radioY=~~(this.height/2);
    this.cutX=cx;
    this.cutY=cy;
    this.image=im;
    this.color=cl || 4;
    this.text=tx || "None";
    this.type=type;//0 main menu, 1 social button
    this.pos.x=this.center.x-(~~(this.width/2));
    this.pos.y=this.center.y-(~~(this.height/2));
    this.father=father;
    this.id=doing;
    //console.log(this);
    
}

simpleButton.prototype.touch=function(){
    
    for(miGame.w=0;miGame.w<=touches.length;miGame.w+=1){
        if(touches[miGame.w] != null){
                if(this.pos.x < touches[miGame.w].x &&
                    this.pos.x+this.width > touches[miGame.w].x &&
                    this.pos.y < touches[miGame.w].y &&
                    this.pos.y+this.height > touches[miGame.w].y){
                    //console.log("me tocaron soy el boton "+this.id);
                    //activo=this.id;
                    this.touched.x=touches[miGame.w].x;
                    this.touched.y=touches[miGame.w].y;
                    return true;
                }
                //return false;
            }
    }
        return false;
    
}

simpleButton.prototype.touchB=function(){
    
    for(miGame.w=0;miGame.w<=1;miGame.w+=1){
        if(touchesB[miGame.w].x !== 0 & touchesB[miGame.w].y !== 0){
            if(this.pos.x < touchesB[miGame.w].x &&
                this.pos.x+this.width > touchesB[miGame.w].x &&
                this.pos.y < touchesB[miGame.w].y &&
                this.pos.y+this.height > touchesB[miGame.w].y){
                //console.log("me tocaron soy el boton "+this.id);
                //activo=this.id;
                
                return true;
            }
            //return false;
        }
    }
        return false;
    
}

simpleButton.prototype.paint=function(){
    
    
    //image of button
    if(miGame.scenes[this.father].doing === this.id){
        
        if(this.type == 0){
            //fondo azul del menu
            ctx.beginPath();
            
            ctx.lineWidth=miGame.lineW;
            
            ctx.fillStyle="rgba(0,255,255,"+miGame.scenes[this.father].dataFsocial.alpa+")";
            ctx.strokeStyle="rgba(255,147,0,1.0)";
            ctx.fillRect(this.pos.x,this.pos.y,miGame.scenes[this.father].dataFsocial.wid2,this.height);
            ctx.strokeRect(this.pos.x,this.pos.y,miGame.scenes[this.father].dataFsocial.wid2,this.height);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
           
            
                        
        }else if(this.type == 1){
            
            //fondo redondo
            ctx.globalAlpha=miGame.scenes[this.father].dataFsocial.alpa;
            ctx.drawImage(miGame.scenes[this.father].images[this.image],
                        3*this.width,
                        1*this.height,
                        this.width,
                        this.height,
                        this.pos.x,
                        this.pos.y,
                        this.width,
                        this.height
                        );
        }
        
        
    }
    
    ctx.globalAlpha=1.0;
    ctx.lineWidth=1.0;
    if(this.image != null){
        ctx.drawImage(miGame.scenes[this.father].images[this.image],
                        this.cutX*this.width,
                        this.cutY*this.height,
                        this.width,
                        this.height,
                        this.pos.x,
                        this.pos.y,
                        this.width,
                        this.height
                        );
    }else{
        
        ctx.lineWidth=miGame.lineW;
        ctx.strokeStyle=miGame.colours[this.color];
        ctx.beginPath();
        ctx.strokeRect(this.pos.x,this.pos.y,this.width,this.height);
        ctx.stroke();
        ctx.closePath();
        ctx.linw=1;
        
        
    }
    //return;
    
    
    //if this touched
    
    
}
simpleButton.prototype.paint2=function(){
    
    //image of button
    if(this.image != null){
        ctx.drawImage(miGame.scenes[this.father].images[this.image],
                        this.cutX*this.width,
                        this.cutY*this.height,
                        this.width,
                        this.height,
                        this.pos.x,
                        this.pos.y,
                        this.width,
                        this.height
                        );
    }else{
        
        ctx.lineWidth=miGame.lineW;
        ctx.strokeStyle=miGame.colours[this.color];
        ctx.beginPath();
        ctx.strokeRect(this.pos.x,this.pos.y,this.width,this.height);
        ctx.stroke();
        ctx.closePath();
        ctx.linw=1;
        
    }
   
    //name of button
    /*
    ctx.fillStyle="rgba(255,255,255,1.0)";
    
    ctx.font="12Px Arial";
    ctx.fillText(this.id,this.pos.x,this.center.y);
    */
}