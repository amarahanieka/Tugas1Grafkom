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
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
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
    var isDrawing = false;
    let listObject = [];
    var semua = [];
    var lines = [];
    var squares = [];
    var rectangles = [];
    var polygons = [];

    // shapessss
    const lineFunctions = new LineFunctions(canvas);
    
    lineFunctions.listen("lineCreated", (line) => {
        listObject.push(line);
        console.log(listObject);
        console.log("lineCreated");
        render();
        // isDrawing = false;
    })

    // lineFunctions.listen("lineAborted", () => {
    //     render();
    //     console.log("aborted");
    // })

    lineFunctions.listen("endPointCreated", () => {
        render();
        console.log("endPointCreated");
    })

    //square
    const squareFunctions = new SquareFunctions(canvas);
    
    squareFunctions.listen("squareCreated", (square) => {
        listObject.push(square);
        console.log(listObject);
        console.log("squareCreated");
        render();
        // isDrawing = false;
    })

    // squareFunctions.listen("squareAborted", () => {
    //     render();
    //     console.log("aborted");
    // })

    squareFunctions.listen("endPointCreated", () => {
        render();
        console.log("endPointCreated");
    })

    //rect
    const rectFunctions = new RectangleFunctions(canvas);
    
    rectFunctions.listen("rectCreated", (rect) => {
        listObject.push(rect);
        console.log(listObject);
        console.log("rectCreated");
        render();
        // isDrawing = false;
    })

    // rectFunctions.listen("rectAborted", () => {
    //     render();
    //     console.log("aborted");
    // })

    rectFunctions.listen("endPointCreated", () => {
        render();
        console.log("endPointCreated");
    })

    function resetBorderColor(){
        document.getElementById("ControlButton").classList.remove("selectedtool");
        document.getElementById("LineButton").classList.remove("selectedtool");
        document.getElementById("SquareButton").classList.remove("selectedtool");
        document.getElementById("RectangleButton").classList.remove("selectedtool");
        document.getElementById("PolygonButton").classList.remove("selectedtool");
    }

    function deactivateAll(){
        lineFunctions.deactivate();
        squareFunctions.deactivate();
        rectFunctions.deactivate();
    }

    document.getElementById("ControlButton").addEventListener("click", function() {
        controlHelp();
        resetBorderColor();
        this.classList.add("selectedtool");
        isDrawing = false;
        deactivateAll();
        console.log("tesssssss");
    });

    document.getElementById("LineButton").addEventListener("click", function() {
        lineHelp();
        resetBorderColor();
        this.classList.add("selectedtool");
        isDrawing = true;
        deactivateAll();
        lineFunctions.activate();
        console.log("tesssssss");
    });
    
    document.getElementById("SquareButton").addEventListener("click", function() {
        squareHelp();
        resetBorderColor();
        this.classList.add("selectedtool");
        isDrawing = true;
        deactivateAll();
        squareFunctions.activate();
        console.log("tesssssss");
    });

    document.getElementById("RectangleButton").addEventListener("click", function() {
        rectHelp();
        resetBorderColor();
        this.classList.add("selectedtool");
        isDrawing = true;
        deactivateAll();
        rectFunctions.activate();
        console.log("tesssssss");
    });

    document.getElementById("PolygonButton").addEventListener("click", function() {
        polygonHelp();
        resetBorderColor();
        this.classList.add("selectedtool");
        isDrawing = true;
        deactivateAll();
        //polygonFunctions.activate();
    });

    document.getElementById("UndoButton").addEventListener("click", function() {
        resetBorderColor();
        listObject.pop();
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);
        render();
    });

    document.getElementById("ClearButton").addEventListener("click", function() {
        clearAll();
    });

    function clearAll(){
        resetBorderColor();
        showHelp();
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);
        deactivateAll();
        isDrawing = true;
        listObject.length = 0;
        semua.length = 0;
    }

    // File Menu buttons
    document.getElementById("SaveButton").addEventListener("click", function() {
        var savedata = document.createElement("a");
        savedata.setAttribute("download", "canvas_data.cad");
        var datatext = "data:text/cad,";
        listObject.forEach(element => {
            datatext += element.constructor.name;
            datatext += "\n";
            if(element.constructor.name == "Square" || element.constructor.name == "Rectangle")
            {
                datatext += element.point1.toString();
                datatext += ";"
                datatext += element.point2.toString();
                datatext += ";"
                datatext += element.point3.toString();
                datatext += ";"
                datatext += element.point4.toString();
            }
            else
            {
                datatext += element.point1.toString();
                datatext += ";"
                datatext += element.point2.toString();
            }
            datatext += "\n";
        });
        savedata.setAttribute("href", datatext);
        document.body.appendChild(savedata);
        savedata.click();
    });

    document.getElementById("LoadButton").addEventListener("click", function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.cad';

        input.onchange = e => { 
            var f = e.target.files[0]; 
            var read = new FileReader();
            read.readAsText(f,'UTF-8');
            read.onload = readerEvent => {
                var isifile = readerEvent.target.result;
                arrfile = isifile.split('\n')
                console.log(arrfile);
                
                clearAll();

                for (let k = 0; k < arrfile.length; k+=2) {
                    let shape = arrfile[k];
                    let arrtemp = arrfile[k+1].split(';');
                    let arrpoints = []
                    console.log("parse ",k)

                    for (let j = 0; j < arrtemp.length; j+=1) {
                        let tempval = arrtemp[j].split(',')
                        let x = parseFloat(tempval[0], 32)
                        let y = parseFloat(tempval[1], 32)
                        arrpoints.push([x,y,0]);
                    }

                    if(shape == "Line"){
                        let obj = new Line(arrpoints[0], arrpoints[1]);
                        listObject.push(obj);
                    }

                    else if(shape == "Square"){
                        let obj = new Square(arrpoints[0], arrpoints[2]);
                        listObject.push(obj);
                    }

                    else if(shape == "Rectangle"){
                        let obj = new Rectangle(arrpoints[0], arrpoints[2]);
                        listObject.push(obj);
                    }
                    else{
                        //..Polygon...
                    }
                }

                render();
            }
        }

        input.click();
    });

    document.getElementById("ExportButton").addEventListener("click", function() {
        console.log(canvas.toDataURL());
        let imgdata = document.createElement("a");
        imgdata.download = 'canvas_img.png';
        imgdata.href = canvas.toDataURL();
        imgdata.click();
        imgdata.delete;
    });

    // Misc. Menu buttons
    function showHelp(){
        document.getElementById("whichShape").innerHTML = "<img src='img/icon_help.png'>Instructions / Help";
        document.getElementById("toolDetail").innerHTML = "<p>How to use: <ol> <li>Click one of the tools from the menu on the right side of the screen. Detailed instructions on how to use the tool will show up on the bottom of the screen.</li> <li>Use the tool by clicking inside the canvas area.</li> <li>The [Show help] button can be used to show this instructions on the screen again.</li> </ol> </p> <p>List of tools: <ul> <li><b>Control:</b> Use to pick a shape and edit its colors/position.</li> <li><b>Line:</b> Creates a straight line.</li> <li><b>Square:</b> Creates a square.</li> <li><b>Rectangle:</b> Creates a rectangle.</li> <li><b>Polygon:</b> Creates a polygon.</li> <li><b>Undo Draw:</b> Deletes last created shape.</li> <li><b>Clear:</b> Cleares the screen (WARNING: action cannot be undone).</li> <li><b>Load file:</b> Loads canvas from a saved file.</li> <li><b>Save current file:</b> Saves current canvas into a file.</li> <li><b>Fill color:</b> Changes the fill color of a shape (square, rectangle, polygon) according to color input.</li> <li><b>Stroke color:</b> Changes the stroke color of a shape (applicable to all shapes) according to color input.</li> <li><b>Show help:</b> Shows this help menu.</li> </ul> </p>";
    }

    function controlHelp(){
        document.getElementById("whichShape").innerHTML = "<img src='img/icon_control.png'>Control Tool";
        document.getElementById("toolDetail").innerHTML = "<p>Click on a shape on the canvas to start editing the shape. You can change the position of the shape, move the vertices, or change the shape color. To change the color, simply pick the shape with the [Control Tool], then pick a color using the color input. Finally, select either [Fill color] or [Stroke color] depending on which one you want to change.</p>";
    }

    function lineHelp(){
        document.getElementById("whichShape").innerHTML = "<img src='img/icon_line.png'>Line Tool";
        document.getElementById("toolDetail").innerHTML = "<p>Creates a straight line. Click on the canvas to mark a startpoint, then click again on the canvas to mark an endpoint.</p>";
    }

    function squareHelp(){
        document.getElementById("whichShape").innerHTML = "<img src='img/icon_square.png'>Square Tool";
        document.getElementById("toolDetail").innerHTML = "<p>Creates a square. Click on the canvas to mark a vertex, then click again on the canvas to mark a second vertex. A square will be made based on these two vertices.</p>";
    }

    function rectHelp(){
        document.getElementById("whichShape").innerHTML = "<img src='img/icon_rect.png'>Rectangle Tool";
        document.getElementById("toolDetail").innerHTML = "<p>Creates a rectangle. Click on the canvas to mark a vertex, then click again on the canvas to mark a second vertex. A rectangle will be made based on these two vertives.</p>";
    }

    function polygonHelp(){
        document.getElementById("whichShape").innerHTML = "<img src='img/icon_polygon.png'>Polygon Tool";
        document.getElementById("toolDetail").innerHTML = "<p>Creates a polygon. Click on the canvas to mark the startpoint of the polygon, then keep clicking on the canvas for every vertex of the polygon. Right-click on the canvas to close the polygon.";
    }

    document.getElementById("HelpButton").addEventListener("click", function() {
        showHelp();
    });


    function render() {
        // listObject.forEach((obj) => obj.render(gl, vBuffer, cBuffer));
        console.log('listObject')      
        console.log(listObject)       
        semua = [];
        lines = [];
        squares = [];
        rectangles = [];
        polygons = [];

        listObject.slice().forEach(element => {
            // console.log(element.constructor.name)
            if(element.constructor.name == "Square")
            {
                squares.push(element.point1, element.point2, element.point2, element.point3, element.point3, element.point4, element.point4, element.point1)    
            }
            else if (element.constructor.name == "Rectangle"){
                rectangles.push(element.point1, element.point2, element.point2, element.point3, element.point3, element.point4, element.point4, element.point1)    
            }
            else if (element.constructor.name == "Line")
            {
                lines.push(element.point1,element.point2)
            }
            else if (element.constructor.name == "Polygon")
            {
                lines.push(element.point1,element.point2)
            }
            
        });

        renderLine(lines);
        renderSquare(squares);
        renderSquare(rectangles);
    }

    function renderLine(lines) {
        console.log("render line")
        console.log(lines);
        var jumlahLine = lines.length;

        lines = lines.flat(3);
        console.log("flat");
        console.log(lines.flat(3));

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
       
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        // gl.clear( gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.LINES, 0, 2);
       
        gl.drawArrays(gl.LINES, 0, jumlahLine);
        gl.drawArrays(gl.POINTS, 0, jumlahLine);
    };

    function renderSquare(lines) {
        console.log("render PERKOTAKAN")
        console.log(lines);
        var jumlahLine = lines.length;

        lines = lines.flat(3);
        console.log("flat");
        console.log(lines.flat(3));

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
       
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        // gl.clear( gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.LINES, 0, 2);
       
        gl.drawArrays(gl.LINES, 0, jumlahLine);
    }
}




window.onload = main;