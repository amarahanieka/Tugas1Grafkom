const vsSource = `
    attribute vec2 aVertexPosition;
    attribute vec3 aVertexColor;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    }
`;

const fsSource = `
    void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl");
    // gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

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

    //mulai setang seting gambar
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);  
    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.aVertexPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    program.aVertexColor = gl.getAttribLocation(program, "aVertexColor");
    // gl.vertexAttribPointer(program.aVertexColor, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(program.aVertexColor);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // var var varrrrr
    var currTool = "";
    var isDrawing = false;
    let listObject = [];
    var semua = [];

    // shapessss
    const lineFunctions = new LineFunctions(canvas);
    
    lineFunctions.listen("lineCreated", (line) => {
        listObject.push(line);
        console.log(listObject);
        console.log("lineCreated");
        render();
        // isDrawing = false;
    })

    lineFunctions.listen("lineAborted", () => {
        render();
        console.log("aborted");
    })

    lineFunctions.listen("endPointCreated", () => {
        render();
        console.log("endPointCreated");
    })

    document.getElementById("LineButton").addEventListener("click", function() {
        document.getElementById("whichShape").innerHTML = "a line!";
        isDrawing = true;
        lineFunctions.activate();
        console.log("tesssssss");
    });

    document.getElementById("ClearButton").addEventListener("click", function() {
        document.getElementById("whichShape").innerHTML = "nothing.";
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);
        lineFunctions.deactivate();
        console.log("tesssssss hapos");
        isDrawing = true;
        listObject.length = 0;
        semua.length = 0;
    });


    function render() {
        // listObject.forEach((obj) => obj.render(gl, vBuffer, cBuffer));
        console.log('listObject')      
        console.log(listObject)       
        semua = [];
        listObject.slice().forEach(element => {
            semua.push(element.point1, element.point2)    
        });

        var jumlahObject = semua.length;
        
        // bikin jadi rata
        console.log(jumlahObject)
        semua = semua.flat(2);

        console.log('semua: ');
        console.log(semua);

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
       
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(semua), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        // gl.clear( gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.LINES, 0, 2);
       

        gl.drawArrays(gl.LINES, 0, jumlahObject);
        gl.drawArrays(gl.POINTS, 0, jumlahObject);
        console.log("harusnya kalo sampe sini dah nongol woi")
    }
}



window.onload = main;