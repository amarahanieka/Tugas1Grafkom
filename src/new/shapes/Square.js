class Square {
    constructor(point1, point3, color){
        const canvasXYratio = 500/800
        this.point1 = point1;
        let dist = Math.abs(point1[1]-point3[1])
        let distx = Math.abs(point1[0]-point3[0])

        let mirrorX = point1[0] > point3[0] ? -1 : 1;
        let mirrorY = point1[1] > point3[1] ? -1 : 1;
        
        if(dist>distx){
            this.point3 = [point1[0]+mirrorX*dist*canvasXYratio,point1[1]+mirrorY*dist,0] 
        }
        else{
            this.point3 = [point1[0]+mirrorX*distx,point1[1]+mirrorY*distx*(1/canvasXYratio),0] 
        }

        this.point2 = [point1[0],this.point3[1],0]
        this.point4 = [this.point3[0],point1[1],0]
        this.color = color;
    }

    render(context, vb, cb){
        context.bindBuffer(context.ARRAY_BUFFER, vb);
        var p1 = this.point1.toString()
        var p2 = this.point2.toString()
        var p3 = this.point3.toString()
        var p4 = this.point4.toString()
        var semua = [];
        var aa = p1+p2+p3+p4
        var b = aa.split(',').map(Number);
        semua.push(b)
        console.log('semua'+semua)
        context.bufferData(gl.ARRAY_BUFFER, new Float32Array(semua), gl.STATIC_DRAW);
        context.bindBuffer(context.ARRAY_BUFFER, cb);
        context.bindBuffer(context.ARRAY_BUFFER, null)

        // gl.clear( gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.LINES, 0, 4);
        gl.drawArrays(gl.POINTS, 0, 4);
        console.log("squareeee")
    }
}