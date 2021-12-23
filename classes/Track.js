class Track{
    constructor(){
        this.segments = [];
        this.walls = [];
    }

    spawnCircleTrack(r, offset){
        let from = new Vect2d(r,0);
        let rot = new Rotation2d(15);

        for(let a = 0; a < 360; a += 15){
            let to = rot.apply(new Vect2d(from.x, from.y));

            let vect = Vect2d.subtract(to, from);

            this.segments.push([Vect2d.add(from, offset), vect]);

            from = to;
        }

        this.createWalls();
    }

    spawnZeroTrack(r, offset){
        let from = new Vect2d(r,45);
        let rot = new Rotation2d(15);

        this.segments.push([new Vect2d(1500, 650), new Vect2d(0,500)]);

        for(let a = 0; a < 180; a += 15){
            let to = rot.apply(new Vect2d(from.x, from.y));

            let vect = Vect2d.subtract(to, from);

            this.segments.push([Vect2d.add(from, Vect2d.add(offset, new Vect2d(0, 400))), vect]);

            from = to;
        }

        /*for(let i = 0; i < 10; i++){
            let to = Vect2d.add(from, new Vect2d(0, -20));
            this.segments.push([from, to]);
            from = to
        }*/

        rot = new Rotation2d(15);
        for(let a = 180; a > 0; a -= 15){
            let to = rot.apply(new Vect2d(from.x, from.y));

            let vect = Vect2d.subtract(to, from);

            this.segments.push([Vect2d.add(from, Vect2d.add(offset, new Vect2d(0, -400))), vect]);

            from = to;
        }

        this.createWalls();
    }

    createWalls(){
        let rotLeft = new Rotation2d(90);
        let rotRight = new Rotation2d(-90);
        let roadWidth = 180;
        
        let leftOffsetVect = rotLeft.apply(Vect2d.normalize(this.segments[0][1])).multiply(roadWidth/2);
        let rightOffsetVect = rotRight.apply(Vect2d.normalize(this.segments[0][1])).multiply(roadWidth/2);

        let startPosLastLeftWall = Vect2d.add(this.segments[0][0], leftOffsetVect);
        let startPosLastRightWall = Vect2d.add(this.segments[0][0], rightOffsetVect);

        for(let s = 0; s < this.segments.length; s++){
            let segment = this.segments[s];

            leftOffsetVect = rotLeft.apply(Vect2d.normalize(segment[1])).multiply(roadWidth/2);
            rightOffsetVect = rotRight.apply(Vect2d.normalize(segment[1])).multiply(roadWidth/2);

            let endPosLeftWall = Vect2d.add(segment[0], Vect2d.add(segment[1], leftOffsetVect));
            let endPosRightWall = Vect2d.add(segment[0], Vect2d.add(segment[1], rightOffsetVect));

            this.walls.push(new Wall(startPosLastLeftWall, endPosLeftWall));
            this.walls.push(new Wall(startPosLastRightWall, endPosRightWall));

            startPosLastLeftWall = endPosLeftWall;
            startPosLastRightWall = endPosRightWall;
        }
    }
    
    getClosestWalls(point, numWalls){
        let smallestDistances = [];
        let closestWalls = [];

        for(let i = 0; i < numWalls; i++){
            smallestDistances.push(Infinity);
            closestWalls.push(this.walls[0]);
        }
        let DEBUG_array = [];

        for(let w = 0; w < this.walls.length; w++){
            let writtenFlag = false;
            let wall = this.walls[w];

            let distCenter = Vect2d.subtract(point, wall.centerPos).magnitude();

            for(let i = 0; i < numWalls; i++){
                if(distCenter < smallestDistances[i] && !writtenFlag){

                    for(let omg = numWalls-1; omg > i; omg--){
                        smallestDistances[omg] = smallestDistances[omg-1];
                        closestWalls[omg] = closestWalls[omg-1];
                    }
                    smallestDistances[i] = distCenter;
                    closestWalls[i] = wall;
                    writtenFlag = true;

                    DEBUG_array.push(w+" @ "+i+" with dist "+distCenter);
                }
            }
        }
        //console.log(DEBUG_array);

        return closestWalls;
    }

    draw(){
        
        for(let w = 0; w < this.walls.length; w++){
            this.walls[w].draw();
            
            if(DEBUG){
                mainCtx.fillStyle = "#0F0";
                mainCtx.font = "30px Arial";
                mainCtx.fillText(w, this.walls[w].centerPos.x+10, this.walls[w].centerPos.y+10);

                /*for(let s = 0; s < this.segments.length; s++){
                    let segment = this.segments[s];
                    segment[1].debug(segment[0]);
                }*/
            }
        }
    }
}