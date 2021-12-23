const MAX_RAY_LENGTH = 1500;
const RAY_STEP_SIZE = 3;

class RayCast{
    constructor(origin, direction){
        this.origin = new Vect2d(origin.x, origin.y);
        this.headPos = new Vect2d(origin.x, origin.y);
        this.direction = direction;
        this.step = Vect2d.multiply(this.direction, RAY_STEP_SIZE);
        this.hitPosition = null;
        this.length = 0;
        this.isHit = false;
    }

    emit(){
        let result = null;

        while(!this.isHit && this.length < MAX_RAY_LENGTH){
            this.headPos.add(this.step);
            this.length = Vect2d.subtract(this.headPos, this.origin).magnitude();

            result = this.checkHit();
        }

        return result;
    }

    checkHit(){
        let closestWalls = track.getClosestWalls(this.headPos, 1);
        
        for(let w = 0; w < closestWalls.length; w++){
            let wall = closestWalls[w];

            //if(wall.isInBounds(this.headPos)){
                let wallVect = Vect2d.subtract(wall.endPos, wall.startPos);
                let wallToHeadPos = Vect2d.subtract(this.headPos, wall.startPos);
                let wallToNextHeadPos = Vect2d.subtract(Vect2d.add(this.headPos, this.step), wall.startPos);
    
                var v1 = [wallVect.x, wallVect.y, 0];
                var v2 = [wallToHeadPos.x, wallToHeadPos.y, 0];
                var v3 = [wallToNextHeadPos.x, wallToNextHeadPos.y, 0];
    
                //Check if head is on the same side of the wall before and after next step
                //If not (= sign of cross product changes), its a hit
                if(Math.sign(crossProduct(v1, v2)[2]) != Math.sign(crossProduct(v1, v3)[2]) || crossProduct(v1, v2)[2] == 0){
                    this.isHit = true;
                    return new RayHit(this.headPos, wall);
                }
            //}
        }
    }
}

class RayHit{
    constructor(position, object){
        this.position = position;
        this.object = object;

        DEBUG_rayHits.push(this);
    }

    draw(){
        mainCtx.beginPath();
        mainCtx.fillStyle = "#00FF00";
        mainCtx.arc(this.position.x, this.position.y, 8, 0, Math.PI*2);
        mainCtx.fill();
    }
}