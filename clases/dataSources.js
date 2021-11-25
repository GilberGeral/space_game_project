//to ship colision prevention
var laterals=[];
laterals[1]=[2,10];
laterals[2]=[3,1];
laterals[3]=[2,4];
laterals[4]=[5,3];
laterals[5]=[6,4];
laterals[6]=[7,5];
laterals[7]=[8,9];
laterals[8]=[9,7];
laterals[9]=[10,8];
laterals[10]=[1,9];


var opposeds=[];
opposeds[0]=0;
opposeds[1]=6;
opposeds[2]=7;
opposeds[3]=8;
opposeds[4]=9;
opposeds[5]=10;
opposeds[6]=1;
opposeds[7]=2;
opposeds[8]=3;
opposeds[9]=4;
opposeds[10]=5;

var rOpposeds=[];
var eqm=0;
function rOpo() {
    for(eqm=0;eqm <= 359; eqm+=1){
        rOpposeds[eqm]=eqm+180;
        if(rOpposeds[eqm] > 359){
            rOpposeds[eqm]-=360;
        }
    }
   
}

//enemies index for destroyeds
var desEneIm=[];
desEneIm[0]=0;
desEneIm[1]=23;//imagen en el array de imagenes de la escena 1, actionjs