class Line {
    constructor(point1, point2){
        this.point1 = point1;
        this.point2 = point2;
        // this.color = color;
    }

    render(context, vb, cb){
        context.bindBuffer(context.ARRAY_BUFFER, vb);
        var p1 = this.point1.toString()+',0.0,'
        var p2 = this.point2.toString()+',0.0,'
        var semua = [];
        var aa = p1+p2
        var b = aa.split(',').map(Number);
        semua.push(b)
        console.log('semua'+semua)
        context.bufferData(gl.ARRAY_BUFFER, new Float32Array(semua), gl.STATIC_DRAW);
        context.bindBuffer(context.ARRAY_BUFFER, cb);
        context.bindBuffer(context.ARRAY_BUFFER, null)

        // gl.clear( gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.LINES, 0, 2);
        gl.drawArrays(gl.POINTS, 0, 2);
        console.log("harusnya kalo sampe sini dah nongol woi")
    }
}