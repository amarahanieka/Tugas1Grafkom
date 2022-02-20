const vsSource = `
    attribute vec2 aVertexPosition;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    }
`;

const fsSource = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

var indexGaris = 0;

function main() {
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl");

    var program = gl.createProgram();

    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    gl.useProgram(program);


    //mulai gambar
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
    gl.bufferData(gl.ARRAY_BUFFER, 8*200, gl.STATIC_DRAW);

    
    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*200, gl.STATIC_DRAW);

    //BUTTON EVENTSSSSSSSS
    document.getElementById("ClearButton").onclick = function () {
        document.getElementById("whichShape").innerHTML = "nothing.";
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        indexGaris = 0;
    };

    document.getElementById("LineButton").onclick = function () {
        document.getElementById("whichShape").innerHTML = "a line!";
        // var aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
        var points = [];
        
        canvas.onmousedown = function(e) {
            var x = e.clientX;
            var y = e.clientY;
            x = (x - canvas.width / 2) / (canvas.width / 2);
            y = (canvas.height / 2 - y) / (canvas.height / 2);

            var pts = [x,y];
            points.push(pts)

            var i = indexGaris;
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*i, new Float32Array(pts));
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            indexGaris++;
        }
        
        renderGaris();
        
    };

    document.getElementById("SquareButton").onclick = function () {
        document.getElementById("whichShape").innerHTML = "a square!";
    };

    document.getElementById("RectangleButton").onclick = function () {
        document.getElementById("whichShape").innerHTML = "a rectangle!";
    };

    document.getElementById("PolygonButton").onclick = function () {
        document.getElementById("whichShape").innerHTML = "a polygon!";
    };
}

function onCanvasMouseDown(e, aVertexPosition, canvas, gl) {
    var x = e.clientX;
    var y = e.clientY;
    x = (x - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - y) / (canvas.height / 2);

    gl.vertexAttrib2f(aVertexPosition, x, y);
    gl.drawArrays(gl.LINES, 0, 1);
    gl.drawArrays(gl.points, 0, 1);
    document.getElementById("whichShape").innerHTML = y;
}

function renderGaris(){
    gl.clear( gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, indexGaris);
    gl.drawArrays(gl.POINTS, 0, indexGaris);


    window.requestAnimationFrame(renderGaris);           

}

window.onload = main;
