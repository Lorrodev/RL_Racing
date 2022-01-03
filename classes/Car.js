const MAX_SPEED = 100;
const MAX_STEER = 60;
const MAX_ACCELERATION = 30;
const MAX_BREAKFORCE = 30;

class Car{
    constructor(position, forward){
        this.position = new Vect2d(position.x, position.y);
        this.forward = new Vect2d(forward.x, forward.y);
        this.speed = 0;
        this.steering = new Vect2d(0, 0);
        this.closestWall = null;

        this.isDead = false;

        this.distanceTraveled = 0;

        //cars.push(this);
    }

    update(){
        if(!this.isDead){
            let step = Vect2d.multiply(this.forward, this.speed);
            this.distanceTraveled += step.magnitude();
            this.position.add(step);
    
            if(accelerateInput){
                this.accelerate(1);
            }
            if(breakInput){
                this.accelerate(-1);
            }
            if(leftInput){
                this.steer(-1);
            }
            if(rightInput){
                this.steer(1);
            }

            this.closestWalls = track.getClosestWalls(this.position, 3);

            for(let w = 0; w < this.closestWalls.length; w++){
                this.closestWalls[w].isHit(this);
            }
        }
    }

    //Acceleration [-1..1]
    accelerate(input){
        let acceleration = input * (MAX_ACCELERATION / ups);

        if(this.speed + acceleration < MAX_SPEED && this.speed + acceleration >= 0){
            this.speed += acceleration;
        }else if(this.speed + acceleration >= MAX_SPEED){
            this.speed = MAX_SPEED;
        }else if(this.speed + acceleration <= 0){
            this.speed = 0;
        }
    }

    //Steering [-1..1] (left to right)
    steer(steering){
        let rotation = new Rotation2d(steering * (MAX_STEER / ups));
        rotation.apply(this.forward);
        this.forward.normalize();
    }

    die(){
        this.isDead = true;
        this.speed = 0;
        this.steering = new Vect2d(0, 0);
    }

    draw(){
        if(!this.isDead){
            //+++DEBUG
            if(DEBUG){
                this.forward.debug(this.position, 50);
                
                /*for(let w = 0; w < this.closestWalls.length; w++){
                    mainCtx.lineWidth = 8;
                    mainCtx.strokeStyle = "#FF0000";
                    mainCtx.beginPath();
                    mainCtx.moveTo(this.closestWalls[w].startPos.x, this.closestWalls[w].startPos.y);
                    mainCtx.lineTo(this.closestWalls[w].endPos.x, this.closestWalls[w].endPos.y);
                    mainCtx.stroke();
                }*/
            }
            //---DEBUG

            if(this == generations[GLOBAL_currentGeneration].agents[0].car){
                mainCtx.fillStyle = "#0F0";
            }else{
                mainCtx.fillStyle = "#111";
            }
            mainCtx.strokeStyle = "#111";
            mainCtx.beginPath();
            mainCtx.arc(this.position.x, this.position.y, 15, 0, Math.PI*2);
            mainCtx.fill();
            mainCtx.stroke();
        }
    }
}