class Car {
    constructor(x,y,width,height,controlType,maxSpeed=3, color="lightBlue"){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed=0;
        this.acc=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;

        this.useAI = controlType == "AI";

        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new Controls(controlType);

        this.image = new Image();
        this.image.src = "car.png";
        this.mask = document.createElement("canvas");
        this.mask.width = this.width;
        this.mask.height = this.height;

        const maskContext = this.mask.getContext("2d");
        this.image.onload = () => {
            maskContext.fillStyle = color;
            maskContext.rect(0,0,this.width, this.height);
            maskContext.fill();

            maskContext.globalCompositeOperation = "destination-atop";
            maskContext.drawImage(this.image,0,0,this.width,this.height);
        }
    }

    update(borders, traffic){  
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assesDamage(borders,traffic);
        }
        if(this.sensor){
            this.sensor.update(borders,traffic);
            const offsets = this.sensor.readings.map(r => r==null ? 0 : 1-r.offset);
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if(this.useAI){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #assesDamage(borders, traffic){
        for (let i = 0; i < borders.length; i++) {
            if(polysIntersect(this.polygon,borders[i])){
                return true; 
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true; 
            }
        }
        return false;
    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width,this.height)/2
        const alpha = Math.atan2(this.width,this.height);
        points.push({
            x: this.x - Math.sin(this.angle-alpha)*rad,
            y: this.y - Math.cos(this.angle-alpha)*rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle+alpha)*rad,
            y: this.y - Math.cos(this.angle+alpha)*rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI+this.angle-alpha)*rad,
            y: this.y - Math.cos(Math.PI+this.angle-alpha)*rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI+this.angle+alpha)*rad,
            y: this.y - Math.cos(Math.PI+this.angle+alpha)*rad,
        });

        return points;
    }

    draw(context, drawSensor=false){
        // if(this.damaged){
        //     context.fillStyle = "red";
        // } else {
        //     context.fillStyle = color;
        // }
        // context.beginPath();
        // context.moveTo(this.polygon[0].x,this.polygon[0].y);
        // for (let i = 1; i < this.polygon.length; i++) {
        //     context.lineTo(this.polygon[i].x,this.polygon[i].y);
        // }
        // context.fill();
        
         if(this.sensor && drawSensor){
            this.sensor.draw(context);
        }
        context.save();
        context.translate(this.x,this.y);
        context.rotate(-this.angle);
        if(!this.damaged) {
            context.drawImage(this.mask, -this.width/2, -this.height/2, this.width, this.height);
            context.globalCompositeOperation = "multiply";
        }
        context.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        context.restore();
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