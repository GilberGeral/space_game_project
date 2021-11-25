
function numeroGrande(val, cifras, ancho, alto, label, imagen, id, padre,cor){

    this.id="numerG"+id;
    this.val=val;
    if(label != null){
        
        this.sx=miGame.scenes[padre].labels[label].cex+(alto/2)+(cor);
        this.sy=miGame.scenes[padre].labels[label].cey;
        
    }else if(label == null){
        this.sx=0;
        this.sy=0;
    }
    
    this.center=new vector2D(this.sx,this.sy);
    
    this.padre=padre;
    this.imagen=imagen;
    
    this.alto=alto;
    this.ancho=ancho;
    
    this.radiox=~~(this.ancho/2);
    this.radioy=~~(this.alto/2);
    
    this.cifras=cifras;
    
    this.unidad=0;
    this.decena=0;
    this.centena=0;
    this.milena=0;
    
    this.posUn={x:0,y:0}
    this.posDe={x:0,y:0}
    this.posCe={x:0,y:0}
    this.posMi={x:0,y:0}
    

    this.sVal=String(this.val);
    this.unidades=[];
    if(this.val > 0)this.unidades=this.sVal.split("");
    this.sx=null;
    this.sy=null;
    //console.log(this.unidades);
    //this.unidades=null;
}

numeroGrande.prototype.setVal=function(){

    switch(this.cifras){

        case 1:

            this.unidad=this.val;
            this.posUn.x=this.center.x - this.radiox;
            this.posUn.y=this.center.y - this.radioy;
            
        break;
        case 2:
			
			if(this.val > 0){
				
				this.decena=this.unidades[0];
            	this.unidad=this.unidades[1];	
				
			}else{
				
				this.decena=0;
            	this.unidad=0;
				
			}
            
            
            this.posDe.x=this.center.x - this.ancho;
            this.posDe.y=this.center.y - this.radioy;

            this.posUn.x=this.center.x;
            this.posUn.y=this.center.y - this.radioy;

        break;
        case 3:

            this.centena=this.unidades[0];
            this.decena=this.unidades[1];
            this.unidad=this.unidades[2];
         
            this.posCe.x=this.center.x - (this.ancho + this.radiox);
            this.posCe.y=this.center.y - this.radioy;

            this.posDe.x=this.center.x - this.radiox;
            this.posDe.y=this.center.y - this.radioy;

            this.posUn.x=this.center.x + (this.radiox);
            this.posUn.y=this.center.y - this.radioy;

        break;
        case 4:
            if(this.val > 0){
            //si arranv¿cara en mas de cero, por ahora solo es score emplea 4 cifras
                this.milena=this.unidades[0];
                this.centena=this.unidades[1];
                this.decena=this.unidades[2];
                this.unidad=this.unidades[3];
            }else{
                this.milena=0;
                this.centena=0;
                this.decena=0;
                this.unidad=0;
            }
            this.posMi.x=this.center.x - (this.ancho * 2);
            this.posMi.y=this.center.y - this.radioy;

            this.posCe.x=this.center.x - (this.ancho);
            this.posCe.y=this.center.y - this.radioy;

            this.posDe.x=this.center.x ;
            this.posDe.y=this.center.y - this.radioy;

            this.posUn.x=this.center.x + (this.ancho);
            this.posUn.y=this.center.y - this.radioy;
            
        break;
        default:
            console.log("error en numero "+this.id+", tiene mas de 4 fifras ("+this.cifras+")");
        break;
    }
}//fin de setVal

numeroGrande.prototype.substract=function(){

    switch(this.cifras){
        case 1:
            this.val-=1;
            if(this.val < 0)this.val=0;
            this.unidad=String(this.val);
        break;
        case 2:
           if(this.val > 0){
               this.val-=1;
                this.unidad-=1;
                if(this.unidad < 0 ){
                    if(this.decena > 0){
                        this.decena-=1;
                        this.unidad=9;
                    }else if(this.decena==0){
                        this.unidad=9;
                    }
                    
                }
            }
        break;
        case 3:
            if(this.val > 0){
                this.val-=1;
                this.unidad-=1;
                if(this.unidad < 0){
                    this.unidad=9;
                    this.decena-=1;
                    if(this.decena < 0 ){
                        this.decena=9;
                        this.centena-=1;
                    }
                }
                if(this.centena < 0)this.centena=0;
            }
        break;
    
    }
}//fin de substract

numeroGrande.prototype.add=function(how) {
    this.val+=how;
    
}

numeroGrande.prototype.paint=function(){
    
    switch(this.cifras){
        case 1:
           ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.unidad*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posUn.x,
            this.posUn.y,
            this.ancho,
            this.alto
           );
           
        break;
        case 2:
            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.decena*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posDe.x,
            this.posDe.y,
            this.ancho,
            this.alto
           );
            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.unidad*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posUn.x,
            this.posUn.y,
            this.ancho,
            this.alto
           );
        
        break;
        case 3:
            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.centena*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posCe.x,
            this.posCe.y,
            this.ancho,
            this.alto
           );

            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.decena*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posDe.x,
            this.posDe.y,
            this.ancho,
            this.alto
           );
            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.unidad*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posUn.x,
            this.posUn.y,
            this.ancho,
            this.alto
           );
        break;
        case 4:
            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.milena*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posMi.x,
            this.posMi.y,
            this.ancho,
            this.alto
           );

            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.centena*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posCe.x,
            this.posCe.y,
            this.ancho,
            this.alto
           );

            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.decena*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posDe.x,
            this.posDe.y,
            this.ancho,
            this.alto
           );
            ctx.drawImage(miGame.scenes[this.padre].images[this.imagen],
            this.unidad*this.ancho,
            0,
            this.ancho,
            this.alto,
            this.posUn.x,
            this.posUn.y,
            this.ancho,
            this.alto
           );
        break;
        default:
            
        break;
    }
}
