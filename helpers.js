//+++CARS
function generateCar(position, forward){
    return new Car(position, forward);
}
//--CARS

//+++GENERATIONS
function nextGeneration(){
    let gen = new Generation(GLOBAL_currentGeneration+1);

    gen.populateWithMutation(generations[GLOBAL_currentGeneration].getBestAgent(), POPULATION_SIZE);

    GLOBAL_currentGeneration++;
}
//---GENERATIONS

//+++REACTIONS
function generateRandomReactions(agent, min, max){
    for(let i = 0; i < Math.round(Math.random() * (max - min) + min); i++){
        let inputIndex = Math.floor(Math.random() * INPUT_LENGTH);
        let inValue = Math.random();
        let toleracne = Math.random();
        let outputIndex = Math.floor(Math.random() * OUTPUT_LENGTH);
        let outValue = Math.random() * 2 - 1;

        agent.reactions.push(new Reaction(inputIndex, inValue, toleracne, outputIndex, outValue));
    }
}
//---REACTIONS