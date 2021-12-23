class Vect2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalize(){
        let mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v){
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(s){
        this.x *= s;
        this.y *= s;
        return this;
    }

    divide(s){
        this.x /= s;
        this.y /= s;
        return this;
    }

    static normalize(v){
        let res = new Vect2d(NaN, NaN);
        let mag = v.magnitude();
        res.x = v.x / mag;
        res.y = v.y / mag;
        return res;
    }

    static add(v1, v2){
        let res = new Vect2d(NaN, NaN);
        res.x = v1.x + v2.x;
        res.y = v1.y + v2.y;
        return res;
    }

    static subtract(v1, v2){
        let res = new Vect2d(NaN, NaN);
        res.x = v1.x - v2.x;
        res.y = v1.y - v2.y;
        return res;
    }

    static multiply(v, s){
        let res = new Vect2d(NaN, NaN);
        res.x = v.x * s;
        res.y = v.y * s;
        return res;
    }

    static divide(v, s){
        let res = new Vect2d(NaN, NaN);
        res.x = v.x / s;
        res.y = v.y / s;
        return res;
    }

    static intermediateAngleDeg(v1, v2){
        let deg1 = Math.atan2(v1.x, v1.y);
        let deg2 = Math.atan2(v2.x, v2.y);
        return (deg1 - deg2)*(180/Math.PI);
    }

    static random(){
        let xMult = Math.random() > 0.5 ? 1 : -1;
        let yMult = Math.random() > 0.5 ? 1 : -1;
        return new Vect2d(Math.random()*xMult, Math.random()*yMult).normalize();
    }

    debug(position, scale=1, color="#FF00FF"){
        mainCtx.strokeStyle = color;
        mainCtx.beginPath();
        mainCtx.arc(position.x, position.y, 5, 0, Math.PI*2);
        mainCtx.moveTo(position.x, position.y);
        mainCtx.lineTo(position.x + this.x*scale, position.y + this.y*scale);
        mainCtx.stroke();
    }
}

class Rotation2d{
    constructor(angleDeg){
        let angleRad = angleDeg * (Math.PI/180);
        this.matrix = [];

        this.matrix.push([Math.cos(angleRad), -Math.sin(angleRad)]);
        this.matrix.push([Math.sin(angleRad), Math.cos(angleRad)]);
    }

    apply(v){
        let vx = v.x;
        let vy = v.y;
        v.x = this.matrix[0][0]*vx + this.matrix[0][1]*vy;
        v.y = this.matrix[1][0]*vx + this.matrix[1][1]*vy;
        return v;
    }
}

function crossProduct(v1, v2){
	var x = v1[1]*v2[2] - v2[1]*v1[2];
	var y = v1[0]*v2[2] - v2[0]*v1[2];
	var z = v1[0]*v2[1] - v2[0]*v1[1];

	return [x, -y, z];
}