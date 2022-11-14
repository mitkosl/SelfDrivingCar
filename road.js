class Road{
    constructor(x,width,laneCount=3)
    {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x-width/2;
        this.right = x+width/2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        const topLeft={x:this.left, y: this.top};
        const topRight={x:this.right, y: this.top};
        const bottomLeft={x:this.left, y: this.bottom};
        const bottomRight={x:this.right, y: this.bottom};
        this.borders = [
            [topLeft, bottomLeft],
            [topRight,bottomRight]
        ]
    }

    getLaneCenter(laneIndex)
    {
        const laneWidth = this.width/this.laneCount;
        return this.left+laneWidth/2 +
         Math.min(laneIndex,this.laneCount -1)*laneWidth;
    }

    draw(cont){
        cont.lineWidth=5;
        cont.strokeStyle="white";

       for(let i=1;i<=this.laneCount-1;i++){
            const x = lerp(this.left,this.right,i/this.laneCount);

            cont.setLineDash([20,20]);
            cont.beginPath();
            cont.moveTo(x,this.top);
            cont.lineTo(x,this.bottom);
            cont.stroke();
        }
        cont.setLineDash([]);
        this.borders.forEach(border =>
            {
                cont.beginPath();
                cont.moveTo(border[0].x,border[0].y);
                cont.lineTo(border[1].x,border[1].y);
                cont.stroke();
            });
    }
}