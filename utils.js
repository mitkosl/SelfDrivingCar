function lerp(A,B,t){
    return A + (B-A)*t;
}

function getIntersection(A,B,C,D){
    const tTop = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop = (A.x-B.x)*(C.y-A.y)-(A.y-B.y)*(C.x-A.x);
    const bottom = (B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x);

    if(bottom != 0){
        const t = tTop/bottom;
        const u = uTop/bottom;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return{
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }
    return null;
}

function polysIntersect(poly1, poly2){
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let coordinates = {x: x, y: y};
    return coordinates;
}

function getRGBA(value){
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return `rgba(${R},${G},${B},${alpha})`;
}

function getRandomColor() {
    const hue = 290 + Math.random()*260;
    return `hsl(${hue}, 100%, 60%)`;
}