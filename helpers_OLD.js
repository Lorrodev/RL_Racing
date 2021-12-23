function generateRandomProgram(subject, programLength){
    let program = [];

    for(let c = 0; c < programLength; c++){
        program.push(generateRandomCommand(subject));
    }

    return program;
}

function generateRandomCommand(subject){
    let orders = ["F","L","E","C"];
    let order = orders[Math.floor(Math.random()*orders.length)];
    let number;

    if(order == "F" || order == "L"){
        number = Math.floor(Math.random()*subject.fixators.length);
    }else if(order == "E" || order == "C"){
        number = Math.floor(Math.random()*subject.connectors.length);
    } 

    return order+""+number;
}

function generateRandomSubject(id, position, size, minFixators = 2, maxFixators = 2, numConnectors = 0){
    let sub = new Subject(id);
    
    for(let f = 0; f < Math.round(Math.random()*2+2); f++){
        sub.addFixator(Vect2d.multiply(Vect2d.random(), Math.random()*(size/2)));
    }
    
    for(let f = 0; f < sub.fixators.length; f++){
        let fixator = sub.fixators[f];
        for(let o = 0; o < sub.fixators.length; o++){
            let other = sub.fixators[o];
            if(f != o && !sub.connectorExists(fixator, other) && Math.random() > 0.5){
                sub.addConnector(fixator, other);
            }
        }
    }
    
    //Check if every fixator has at least one connector
    //This needs to be optimised.. but it only runs on generation and does the job
    for(let f = 0; f < sub.fixators.length; f++){
        let isConnected = false;
        let fixator = sub.fixators[f];
        for(let o = 0; o < sub.fixators.length; o++){
            let other = sub.fixators[o];
            if(f != o && sub.connectorExists(fixator, other)){
                isConnected = true;
            }
        }

        //Connect to neighbour in array if no connection was found
        if(!isConnected){
            if(f+1 < sub.fixators.length){
                sub.addConnector(fixator, sub.fixators[f+1]);
            }else{
                sub.addConnector(fixator, sub.fixators[0]);
            }
        }
    }
    
    sub.program = generateRandomProgram(sub, 8);
    sub.position = sub.fixators[0].position;

    return sub;
}

function cloneSubject(originalSubject){
    let clone = new Subject("-");

    for(f = 0; f < originalSubject.fixators.length; f++){
        let fixator = originalSubject.fixators[f];

        //We are only intereset in the position relative to the first fixator
        clone.addFixator(new Vect2d(fixator.spawnPosition.x, fixator.spawnPosition.y));
    }

    for(c = 0; c < originalSubject.connectors.length; c++){
        let connector = originalSubject.connectors[c];

        //Get original fixator ids
        let fId1 = -10;
        let fId2 = -10;
        for(f = 0; f < originalSubject.fixators.length; f++){
            let fixator = originalSubject.fixators[f];
            if(fixator == connector.fixator1){
                fId1 = f;
            }else if(fixator == connector.fixator2){
                fId2 = f;
            }
        }

        //Connect fixators corresponding to original
        clone.addConnector(clone.fixators[fId1], clone.fixators[fId2]);
    }

    //Clone the program
    for(c = 0; c < originalSubject.program.length; c++){
        clone.program.push(originalSubject.program[c]);
    }

    return clone;
}

function mutateSubject(subject){
    let mutation = cloneSubject(subject);

    //Randomly remove existing fixators
    for(f = 0; f < mutation.fixators.length; f++){
        let fixator = mutation.fixators[f];

        if(Math.random() < 0.02){

            //Remove connectors with fixator
            for(c = 0; c < mutation.connectors.length; c++){
                let connector = mutation.connectors[c];
                
                if(connector.fixator1 == fixator || connector.fixator2 == fixator){
                    mutation.connectors.splice(c, 1);
                    c--;
                }
            }

            //Remove Fixator
            mutation.fixators.splice(f, 1);
            f--;
        }
    }

    //Randomly add new fixators
    for(let f = 0; f < Math.round(Math.random()*2); f++){
        mutation.addFixator(Vect2d.add(mutation.position, Vect2d.multiply(Vect2d.random(), Math.random()*(50))));
    }
    
    //Check if every fixator has at least one connector
    //This needs to be optimised.. but it only runs on generation and does the job
    for(let f = 0; f < mutation.fixators.length; f++){
        let isConnected = false;
        let fixator = mutation.fixators[f];
        for(let o = 0; o < mutation.fixators.length; o++){
            let other = mutation.fixators[o];
            if(f != o && mutation.connectorExists(fixator, other)){
                isConnected = true;
            }
        }

        //Connect to neighbour in array if no connection was found
        if(!isConnected){
            if(f+1 < mutation.fixators.length){
                mutation.addConnector(fixator, mutation.fixators[f+1]);
            }else{
                mutation.addConnector(fixator, mutation.fixators[0]);
            }
        }
    }

    for(c = 0; c < mutation.program.length; c++){
        //Check if commands refernce removed fixator numbers
        if(mutation.program[c][0] == "F" || mutation.program[c][0] == "L"){
            if(mutation.program[c][1] > mutation.fixators.length-1){
                mutation.program[c] = generateRandomCommand(mutation);
            }
        }

        //Check if commands refernce removed connector numbers
        if(mutation.program[c][0] == "E" || mutation.program[c][0] == "C"){
            if(mutation.program[c][1] > mutation.connectors.length-1){
                mutation.program[c] = generateRandomCommand(mutation);
            }
        }

        //Random chance for a mutation
        if(Math.random() < 0.05){
            mutation.program[c] = generateRandomCommand(mutation);
        }
    }

    if(mutation.connectors.length <= 0 || mutation.fixators.length <= 1){
        return null;
    }else{
        return mutation;
    }
}

function nextGeneration(){
    let gen = new Generation();

    gen.populateWithMutation(generations[GLOBAL_currentGeneration].getBestSubject(), 200);

    GLOBAL_currentGeneration++;
}


//DEBUG function for browser
/*
for(s = 0; s < generations[1].subjects.length; s++){
	let subject = generations[1].subjects[s]; 

    for(c = 0; c < subject.program.length; c++){
		let command = subject.program[c];
		if(command[0] == "E" && command[1] > subject.connectors.length-1 || command[0] == "C" && command[1] > subject.connectors.length-1){
            console.log("Subject "+s+" with command "+command);
        }
    }
}
*/