function Raddar() {
    this.dt=0;
    this.minDt=0;
    this.lastDt=canvasW*3;
    this.maxDt=0;
    this.dt=0;
    
    this.dtx=0;
    this.dty=0;
    /*
    el radar detectara:
    1-cuantos enemigos hay
    2-cual esta mas cerca
    3-cual esta mas lejos
    4-cual es mas peligroso, 
      segun la cantidad de fuego disponible de el, sgun el tipo,
    */
    this.i=0;
    this.j=0;
    this.k=0;
    this.center=new vector2D(0,0);
    this.cual=0;
}
Raddar.prototype.reset=function() {
   
    this.minDt=0;
    this.maxDt=0;
    this.dt=0;
    
    this.dtx=0;
    this.dty=0;
   
    this.i=12;
    this.j=0;
    this.k=0;
    this.cual=0;
    this.lastDt=canvasW*3;

    this.aperture=0;//grads to field search enemies
}
Raddar.prototype.enemiIsFrontal=function(ap,ang){
    //ojo con el maxEnemies de la escena de accion
    this.cual=100;
    for(this.i=1; this.i <= 10; this.i+=1){
        
        if(miGame.scenes[1].enemies[this.i].mode){
            
            this.dtx=miGame.scenes[1].enemies[this.i].center.x;
            this.dty=miGame.scenes[1].enemies[this.i].center.y;
            
            this.k=this.center.getAngulo(this.dtx,this.dty);
            
            if(this.k < 0)this.k+=360;

            if(isInField(this.k,ap,ang,false)){
                this.cual = this.i;
                break;
            }
        }//end for view all enemies of these scene
        
    }
   
   return this.cual;
    
}

Raddar.prototype.enemiClose=function(){
    
    for(this.i=1; this.i <= 10; this.i+=1){
        
        if(miGame.scenes[1].enemies[this.i].mode){
            
            this.dtx=miGame.scenes[1].enemies[this.i].center.x;
            this.dty=miGame.scenes[1].enemies[this.i].center.y;
            
            this.dt=this.center.getDistancia(this.dtx,this.dty);

            if (this.dt <= this.lastDt & this.dt > ~~(canvasW / 7)) {

                this.lastDt=this.dt;
                this.cual=this.i;
                //console.log(this.lastDt+"px en-"+this.i);
            }
            //break;
            
        }//end for view all enemies of these scene
        
    }
   
    
    if (this.lastDt > canvasW / 10 & this.cual > 0) {
        //console.log("el mas cerca es " + this.cual + " a " + this.lastDt + "px");
        return this.cual;
    } else {
        //console.log("no habia enemigo");
        return -1;
    }
    
}

Raddar.prototype.enemiFar=function(){
    
}