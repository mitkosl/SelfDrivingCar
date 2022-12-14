class Sensor {
    constructor(car){
        this.car = car;
        this.rayCount = 10;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    update(borders,traffic){
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(this.#getReadings(this.rays[i],borders,traffic));            
        }
    }

    #getReadings(ray, borders, traffic){
        let touches = [];

        for (let i = 0; i < borders.length; i++) {
            const touch = getIntersection(ray[0], ray[1], borders[i][0], borders[i][1]);
            if(touch){
                touches.push(touch);
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for (let j = 0; j < poly.length; j++) {
                const t = getIntersection(ray[0], ray[1], poly[j], poly[(j+1)%poly.length]);
                if(t){
                    touches.push(t);
                }
            }
        }

        if(touches.length == 0){
            return null;
        }
        else{
            const offsets = touches.map(t => t.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(t => t.offset == minOffset);
        }
    }

    #castRays(){
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount == 1 ? 0.5 : i/(this.rayCount-1)
            ) + this.car.angle;

            const start = {x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - Math.sin(rayAngle)*this.rayLength,
                y:this.car.y - Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]);
        }
    }
    
    draw(cont){
        for (let i = 0; i < this.rayCount; i++) {

            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }

            cont.beginPath();
            cont.lineWidth = 1.5;
            cont.strokeStyle = "yellow";
            cont.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            cont.lineTo(end.x, end.y);
            cont.stroke();

            cont.beginPath();
            cont.lineWidth = 1.5;
            cont.strokeStyle = "red";
            cont.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            cont.lineTo(end.x, end.y);
            cont.stroke();
        }
    }
}