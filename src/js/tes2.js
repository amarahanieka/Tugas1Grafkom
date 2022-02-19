// Vertex shader program
const vsSource = `
attribute vec2 aVertexPosition;
        attribute vec4 vColor;

        varying vec4 fColor;

        void main() {
            gl_Position = vec4(aVertexPosition, 0.0, 1.0);
            gl_PointSize = 10.0;
            fColor = vColor;
        }
`;

const fsSource = `
        precision mediump float;
            uniform vec3 _color_;
            void main(void) {
                gl_FragColor = vec4(_color_, 1.0);
            }
`;

var points = [];
var index = 0;


function initShader(gl, vsSource, fsSource) {
    var p = gl.createProgram();
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    gl.useProgram(program);

    return p;
}

function main() {
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("experimental-webgl");

    // gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    program = initShader(gl, vsSource, fsSource);

    var vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
    gl.bufferData(gl.ARRAY_BUFFER, 8*200, gl.STATIC_DRAW);

    
    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*200, gl.STATIC_DRAW);
    // program.vColor = gl.getAttribLocation(program, "vColor");


    //BUTTON EVENTSSSSSSSS
    document.getElementById("ClearButton").onclick = function () {
        document.getElementById("whichShape").innerHTML = "nothing.";
        ///blom bisa ngapUS GIMANA YA
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearDepth(1.0);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        // render();
    };

    document.getElementById("LineButton").onclick = function () {
        document.getElementById("whichShape").innerHTML = "a line!";
        canvas.addEventListener("mousedown", function(event){

            x=(2*(event.clientX/canvas.width))-1;
            y=(2*(canvas.height-event.clientY)/canvas.height)-0.5;
            // x = event.clientX - canvas.getBoundingClientRect().left;
            // y = event.clientY - canvas.getBoundingClientRect().top;
            var pts = [x, y];
            points.push(pts);
            document.getElementById("whichShape").innerHTML = new Float32Array(pts);
    
            var i = index;
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*i, new Float32Array(pts));
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            index++;
        });
    
        render();
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

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.LINES, 0, index);


    window.requestAnimationFrame(render);           

}

window.onload = main;
