const HELPER_ROT_LEFT = new Rotation2d(-30);
const HELPER_ROT_RIGHT = new Rotation2d(30);
const INPUT_LENGTH = 3;
const OUTPUT_LENGTH = 2;

class Agent{
    constructor(car){
        this.car = car;
        this.points = 0;
        this.reactions = []; //[[input, value, tolerance, output, value]]
        this.input = [0, 0, 0];

        //agents.push(this);
    }

    update(){
        if(!this.car.isDead){
            this.castRays();
            this.react();
            this.car.update();
    
            this.points = this.car.distanceTraveled;
        }
    }

    castRays(){
        let leftHit = new RayCast(this.car.position, HELPER_ROT_LEFT.apply(new Vect2d(this.car.forward.x, this.car.forward.y))).emit();
        let straightHit = new RayCast(this.car.position, this.car.forward).emit();
        let rightHit = new RayCast(this.car.position, HELPER_ROT_RIGHT.apply(new Vect2d(this.car.forward.x, this.car.forward.y))).emit();

        if(leftHit != null){
            this.input[0] = Vect2d.subtract(leftHit.position, this.car.position).magnitude() / canvasDiagonal;
        }else{
            this.input[0] = 0;
        }

        if(straightHit != null){
            this.input[1] = Vect2d.subtract(straightHit.position, this.car.position).magnitude() / canvasDiagonal;
        }else{
            this.input[1] = 0;
        }
        
        if(rightHit != null){
            this.input[2] = Vect2d.subtract(rightHit.position, this.car.position).magnitude() / canvasDiagonal;
        }else{
            this.input[2] = 0;
        }
    }

    react(){
        let acceleration = 0;
        let steering = 0;

        for(let r = 0; r < this.reactions.length; r++){
            let reaction = this.reactions[r];

            if(reaction.willExecute(this.input)){
                switch (reaction.outputIndex) {
                    case 0:
                        acceleration += reaction.outValue;
                        break;
                
                    case 1:
                        steering += reaction.outValue;
                        break;
                }
            }
        }

        //Capping reactions
        acceleration = acceleration > 1 ? 1 : acceleration;
        acceleration = acceleration < -1 ? -1 : acceleration;

        steering = steering > 1 ? 1 : steering;
        steering = steering < -1 ? -1 : steering;

        this.car.steer(acceleration);
        this.car.accelerate(steering);
    }

    clone(){
        let clone = new Agent(generateCar(GLOBAL_spawnPoint, GLOBAL_spawnForward));
        
        for(let r = 0; r < this.reactions.length; r++){
            clone.reactions[r] = this.reactions[r].clone();
        }

        return clone;
    }

    mutate(){
        //Randomly delete reactions
        /*for(let r = 0; r < this.reactions.length; r++){
            if(Math.random() > 0.75){
                this.reactions.splice(r, 1);
                r--;
            }
        }*/

        //(Randomly) delete less important reactions
        for(let r = 0; r < this.reactions.length; r++){
            let reaction = this.reactions[r];

            if(reaction.importance == 0 || (Math.random() > 0.5 && Math.random() > reaction.importance)){
                this.reactions.splice(r, 1);
                r--;
            }
        }

        //Randomly add reactions
        generateRandomReactions(this, 0, 1);

        //Randomly adjust reactions
        for(let r = 0; r < this.reactions.length; r++){
            let reaction = this.reactions[r];

            reaction.randomlyAdjust();
        }
    }

    draw(){
        this.car.draw();
    }
}
