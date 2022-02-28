class Rectangle {
    constructor(point1, point3, color){
        this.point1 = point1;
        this.point3 = point3;
        this.point2 = [point1[0],point3[1],0]
        this.point4 = [point3[0],point1[1],0]
        this.color = color;
    }

    // render(context, vb, cb){
    //     context.bindBuffer(context.ARRAY_BUFFER, vb);
    //     var p1 = this.point1.toString()+',0.0,'
    //     var p2 = this.point2.toString()+',0.0,'
    //     var p3 = this.point3.toString()+',0.0,'
    //     var p4 = this.point4.toString()+',0.0,'
    //     var semua = [];
    //     var aa = p1+p2+p3+p4
    //     var b = aa.split(',').map(Number);
    //     semua.push(b)
    //     console.log('semua'+semua)
    //     context.bufferData(gl.ARRAY_BUFFER, new Float32Array(semua), gl.STATIC_DRAW);
    //     context.bindBuffer(context.ARRAY_BUFFER, cb);
    //     context.bindBuffer(context.ARRAY_BUFFER, null)

    //     // gl.clear( gl.COLOR_BUFFER_BIT);
    //     gl.drawArrays(gl.LINES, 0, 4);
    //     gl.drawArrays(gl.POINTS, 0, 4);
    //     console.log("rectangleee")
    // }
}