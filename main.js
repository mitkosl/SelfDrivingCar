const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);


// const car = new Car(road.getLaneCenter(1),200,30,50,"KEYS");
// const car = new Car(road.getLaneCenter(1),200,30,50,"AI");
const N = 10;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestAICar")){
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestAICar"));
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}

let traffic = [
    new Car(road.getLaneCenter(0),-280,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-670,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-970,30,50,"DUMMY",2,getRandomColor()),
];
// car.draw(context);

animate();

carCanvas.addEventListener('mousedown', e => {
    var coordinates = getCursorPosition(carCanvas, e);
    AddTraffic(coordinates);
})

function save(){
    localStorage.setItem("bestAICar", JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestAICar");
}

function AddTraffic(coords) {
    const laneWidth = carCanvas.width / road.laneCount;
    const laneNumber = Math.floor(coords.x/laneWidth);
    console.log(bestCar.y, carCanvas.height*0.7, coords.y, carCanvas.height*0.7 - coords.y)
    const yCoord =  bestCar.y - (carCanvas.height*0.7 - coords.y)
    console.log(yCoord)
    traffic.push(new Car(road.getLaneCenter(laneNumber),yCoord,30,50,"DUMMY",2));
}

function generateCars(N){
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));     
    }
    return cars;
}

function animate(time){
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders,[]);
    }
    // car.update(road.borders, traffic);
    for (let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    // Fitness function
    // TODO: choos better one fitnes function;
    bestCar = cars.find(x => x.y == Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.save();
    carContext.translate(0, -bestCar.y + carCanvas.height*0.7);

    road.draw(carContext);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carContext, "orange");
    }

    carContext.globalAlpha=0.2;
    // car.draw(carContext, "black");
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carContext, "blue");
    }
    carContext.globalAlpha=1;
    bestCar.draw(carContext, "black",true);

    carContext.restore();

    networkContext.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkContext,bestCar.brain);
    requestAnimationFrame(animate);
}