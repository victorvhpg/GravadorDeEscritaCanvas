var GravadorDeEscritaCanvas =  {
    // //flag de controle se esta no automatico
    AUTO : false,
    //flag de controle se  escreve no canvas ou nao 
    //se estiver mousedown
    ESCREVE : false,
    //guarda as coordenadas x,y 
 
    objCoordenada : { 
        //a atual posicao que esta escrevendo
        x : 0,
        y : 0,
        timestamp: 0 
    } ,
               
    //objeto HTMLCanvasElement
    canvas : null ,
    //objeto CanvasRenderingContext2D do canvas
    ctx : null ,
    //vetor de vetCoordenada 
    //guarda todas as vetCoordenada de todas as escritas continua inclusive a cor
    vetTodasCoordenadas : [],
    //vetor de objCoordenada da escrita desenhada
    //guarda cada posicao durante uma escrita continua
    vetCoordenada : [],
    //escrita
    escrita : function(objCoordenada){
        if(this.vetCoordenada.length == 0){
            //inicia uma escrita
            this.ctx.beginPath();
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.lineWidth =  6;
            this.ctx.strokeStyle = "rgb(0,0,0)";
            this.ctx.moveTo(objCoordenada.x  , objCoordenada.y);
        }
        // console.log("x:"+objCoordenada.x + "y:"+objCoordenada.y);
        //escreve a linha
        this.ctx.lineTo(objCoordenada.x, objCoordenada.y);
        this.ctx.stroke();
            
        //guarda a copia da coordenada da escrita  continua
        this.vetCoordenada[this.vetCoordenada.length] = $.extend({} ,objCoordenada) ;
    // console.log(JSON.stringify( this.vetCoordenada));
    },
                
    executar : function(vetTodasCoordenadas){
        if(this.AUTO){
            alert("aguarde a escrita automatica acabar...");
            return;
        }
        //limpa a tela 
        this.canvas.width =  this.canvas.width;
        var that = this;
        var i=0 , j=0 ;
        var timestamp = +new Date();
        var espera = 0;
        this.AUTO = true;
        var  escreve =function(){
            if( i < vetTodasCoordenadas.length){//ainda nao acabou todas as coordenadas
                if(j ==0){
                    //inicia uma escrita continua
                    that.ctx.beginPath();
                    that.ctx.lineCap = "round";
                    that.ctx.lineJoin = "round";
                    that.ctx.lineWidth =  6;
                    that.ctx.strokeStyle = "rgb(0,0,0)";
                //console.log("inicia escrita");//
                }
                if( j < vetTodasCoordenadas[i].vetCoordenada.length ){//ainda esta numa escrita
                    that.objCoordenada=vetTodasCoordenadas[i].vetCoordenada[j++] ;
                    espera = that.objCoordenada.timestamp - timestamp;
                    if(espera  < 0 ){
                        espera  = 0;
                    }
                    //console.log(espera);
                    setTimeout(function(){
                        that.escrita(that.objCoordenada);
                        timestamp = that.objCoordenada.timestamp;
                        escreve();
                    },espera);
                }else{
                    that.ctx.closePath();
                    // console.log("fecha escrita");//
                    //proxima escrita contínua
                    i++;
                    j =0 ; 
                    escreve();
                }
            }else{
                that.ctx.closePath();
                that.AUTO = false;
                that.vetTodasCoordenadas = [];
                that.vetCoordenada  = [];
                //limpa a tela 
                that.canvas.width =  that.canvas.width;
                alert("fim");
            }
        }
        escreve(); 
    },
    //inicializacao
    init  : function(config) {
        var that = this;
        $.extend(this ,config);
        this.ctx = this.canvas.getContext('2d');
                 
        //MOUSEDOWN
        $(this.canvas).on("mousedown" , function(e){
            if(that.AUTO){
                return;
            }
            that.ESCREVE = true;
        });
        //MOUSEMOVE
        $(this.canvas).on("mousemove" , function(e){
            if(!that.ESCREVE || that.AUTO){
                return;
            }
            //a atual posicao que esta escrevendo
            that.objCoordenada  ={ 
                x : e.pageX - this.offsetLeft,
                y : e.pageY - this.offsetTop,
                timestamp: +new Date() // getTime() implicito js ;)
            } 
            that.escrita(that.objCoordenada);
        });
        //MOUSEUP
        $(this.canvas).on("mouseup" , function(e){
            if(that.AUTO){
                return;
            }
            that.ESCREVE = false;
            that.ctx.closePath();
            that.vetTodasCoordenadas[that.vetTodasCoordenadas.length] = {
                cor : "rgb(0,0,0)",
                vetCoordenada : that.vetCoordenada
            };
            that.vetCoordenada =[]; 
            if ( window.JSON && window.JSON.stringify ) {
                that.$logCoordenadas.val(JSON.stringify(that.vetTodasCoordenadas));
            }else{
                that.$logCoordenadas.val("SEU NAVEGADOR NAO SUPORTA :(  use chrome ou firefox ");
            } 
        });
                    
        $(this.canvas).on("mouseleave" , function(e){
            if(that.AUTO){
                return;
            }
            if(that.ESCREVE){
                $(this).trigger("mouseup");
            }
        });
    }
};