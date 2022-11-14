class Road{
    constructor(x,width,laneCount=5)
    {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x-width/2;
        this.right = x+width/2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;
    }

    draw(cont){
        cont.lineWidth=5;
        cont.strokeStyle="white";

       for(let i=0;i<=this.laneCount;i++){
            const x = lerp(this.left,this.right,i/this.laneCount);

            if(i>0 && i <this.laneCount)
                cont.setLineDash([20,20]);
            else
                cont.setLineDash([]);

            cont.beginPath();
            cont.moveTo(x,this.top);
            cont.lineTo(x,this.bottom);
            cont.stroke();
       }
    }
}