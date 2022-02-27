class Line {
    constructor(point1, point2){
        this.point1 = point1;
        this.point2 = point2;
        // this.color = color;
    }

    render(context, vb, cb){
        context.bindBuffer(context.ARRAY_BUFFER, vb);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([this.point1, this.point2]), gl.STATIC_DRAW);
        
        context.bindBuffer(context.ARRAY_BUFFER, cb);

        // gl.clear( gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.LINES, 0, 2);
        gl.drawArrays(gl.POINTS, 0, 2);
    }
}