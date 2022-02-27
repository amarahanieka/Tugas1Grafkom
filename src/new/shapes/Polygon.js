class Polygon {
    constructor(points) {
        this.points = points
    }

    render(context, vb, cb){
        context.bindBuffer(context.ARRAY_BUFFER, vb);
        var initialPoint = this.points[0]
        for (let i = 1; i < points.length-1; i++) {
            const point1 = points[i];
            const point2 = points[i+1]
            const trianglePoints = [initialPoint[0], initialPoint[1], point1[0], point1[1], point2[0], point2[1]]
            context.bufferData(gl.ARRAY_BUFFER, new Float32Array(semua), gl.STATIC_DRAW);
            context.bindBuffer(context.ARRAY_BUFFER, cb);
            context.bindBuffer(context.ARRAY_BUFFER, null)
            gl.drawArrays(gl.TRIANGLE, 0, 3);
        }        
    }
}