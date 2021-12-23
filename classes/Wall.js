class Wall{
    constructor(startPos, endPos){
        this.startPos = startPos;
        this.endPos = endPos;
        this.vect = Vect2d.subtract(endPos, startPos);
        this.direction = Vect2d.normalize(this.vect);
        this.collisionCheckLength = this.vect.magnitude() * 0.5;
        this.centerPos = Vect2d.add(startPos, Vect2d.multiply(this.direction, Vect2d.divide(this.vect, 2).magnitude()));
    }

    OLD_isInBounds(point){
        //4 possible ways of being inside a box for a wall collision
        var check1 = point.x >= this.startPos.x-10 && point.x <= this.endPos.x+10 && point.y >= this.startPos.y-10 && point.y <= this.endPos.y+10;
        var check2 = point.x <= this.startPos.x+10 && point.x >= this.endPos.x-10 && point.y <= this.startPos.y+10 && point.y >= this.endPos.y-10;
        var check3 = point.x >= this.startPos.x-10 && point.x <= this.endPos.x+10 && point.y <= this.startPos.y+10 && point.y >= this.endPos.y-10;
        var check4 = point.x <= this.startPos.x+10 && point.x >= this.endPos.x-10 && point.y >= this.startPos.y-10 && point.y <= this.endPos.y+10;

        if(check1 || check2 || check3 || check4){
            return true;
        }else{
            return false;
        }
    }

    //NEW!! :D
    isInBounds(point){
        let distToPoint = Vect2d.subtract(this.centerPos, point).magnitude();

        if(distToPoint <= this.collisionCheckLength){
            return true;
        }else{
            return false;
        }
    }

    isHit(car){
        let wallVect = Vect2d.subtract(this.endPos, this.startPos);
        let wallToCarPos = Vect2d.subtract(car.position, this.startPos);
        let wallToNextCarPos = Vect2d.subtract(Vect2d.add(car.position, Vect2d.multiply(car.forward, car.speed)), this.startPos);

        var v1 = [wallVect.x, wallVect.y, 0];
        var v2 = [wallToCarPos.x, wallToCarPos.y, 0];
        var v3 = [wallToNextCarPos.x, wallToNextCarPos.y, 0];

        //Check if the car is on the same side of the wall before and after the next step
        if(Math.sign(crossProduct(v1, v2)[2]) != Math.sign(crossProduct(v1, v3)[2]) || crossProduct(v1, v2)[2] == 0){
            car.die();
        }
    }

    draw(){
        mainCtx.strokeStyle = "#111";
        mainCtx.lineWidth = 6;
        mainCtx.beginPath();
        mainCtx.moveTo(this.startPos.x, this.startPos.y);
        mainCtx.lineTo(this.endPos.x , this.endPos.y);
        mainCtx.stroke();

        if(DEBUG){
            mainCtx.fillStyle = "#F0F";
            mainCtx.beginPath();
            mainCtx.arc(this.centerPos.x, this.centerPos.y, 5, 0, Math.PI * 2);
            mainCtx.fill();
        }
    }
}