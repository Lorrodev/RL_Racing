const POPULATION_SIZE = 10;

const MAX_GENERATION_STEPS = 400;

class Generation{
    constructor(num){
        this.number = num;
        this.agents = [];
        this.mostAgentPoints = -1000;
        this.bestAgent = null;
        this.steps = 0;

        generations.push(this);
    }

    populate(numAgents){
        for(let a = 0; a < numAgents; a++){
            let agent = new Agent(generateCar(GLOBAL_spawnPoint, GLOBAL_spawnForward));
            generateRandomReactions(agent, 1, 5);

            this.agents.push(agent);
        }
    }

    populateWithMutation(agent, numMutations){
        for(let m = 0; m < numMutations - 1; m++){
            let clone = agent.clone();
            clone.mutate();
            this.agents.push(clone);
        }

        //Add best agent from last generation
        this.agents.push(agent.clone());
    }

    removeStandingAgents(){
        for(let a = 0; a < this.agents.length; a++){
            let agent = this.agents[a];
            if(agent.car.distanceTraveled == 0){
                agent.car.die();
            }
        }
    }

    drawAgents(){
        for(let a = 0; a < this.agents.length; a++){
            let agent = this.agents[a];
            agent.draw();
        }
    }

    update(){
        let deadAgents = 0;
        if(this.steps == 50){
            this.removeStandingAgents();
        }

        for(let a = 0; a < this.agents.length; a++){
            let agent = this.agents[a];
            if(agent.car.isDead){
                deadAgents++;
            }else{
                agent.update();
            }
        }

        if((this.steps >= MAX_GENERATION_STEPS || deadAgents >= this.agents.length) && POPULATION_SIZE > 0){
            nextGeneration();
        }

        this.steps++;
    }

    getBestAgent(){
        for(let a = 0; a < this.agents.length; a++){
            let agent = this.agents[a];
            
            if(agent.points > this.mostAgentPoints){
                this.mostAgentPoints = agent.points;
                this.bestAgent = agent;
            }
        }

        return this.bestAgent;
    }
}