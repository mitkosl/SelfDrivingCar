class Car {
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed=0;
        this.acc=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0;

        
        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(borders){   
        this.#move();
        this.sensor.update(borders);
    }
    
    draw(context){
        context.save();
        context.translate(this.x,this.y);
        context.rotate(-this.angle);
        context.beginPath();
        context.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
            );
        context.fill();
        context.restore();

        this.sensor.draw(context);
    }

    #move(){
        if(this.controls.forward){
            this.speed += this.acc;
        }
        if(this.controls.reverse){
            this.speed -= this.acc;
        }

        if(this.speed>this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        
        if(this.speed<-this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }

        if(this.speed>0){
           this.speed -= this.friction;
        }
           if(this.speed<0){
            this.speed+=this.friction;
        }

        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip = this.speed>0?1:-1;
        
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }
}