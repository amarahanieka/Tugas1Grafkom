const vsSource = `
    attribute vec2 aVertexPosition;
    attribute vec3 aVertexColor;
    varying vec3 vColor;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
        vColor = aVertexColor;
    }
`;

const fsSource = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;

var isPointVisible = false;

function main() {

    var canvas = document.getElementById("gl-canvas");
    canvas.onselectstart = function () { return false; }
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) 
    console.log(gl.getProgramInfoLog(program))
    var error_log = gl.getShaderInfoLog(fs);
    console.log(error_log);

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
    console.log(program.aVertexColor)
    gl.vertexAttribPointer(program.aVertexColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.aVertexColor);

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
    var closePoints = [];
    var closePointsSquare = [];
    var pointAwal = null;

    // shapessss
    const lineFunctions = new LineFunctions(canvas);
    
    lineFunctions.listen("lineCreated", (line) => {
        listObject.push(line);
        console.log(listObject);
        console.log("lineCreated");
        render();
        // isDrawing = false;
    })


    lineFunctions.listen("endPointCreated", () => {
        render();
        console.log("endPointCreated");
    })

    lineFunctions.listen("pointAwalChosen", (pointawal) => {
        pointAwal = pointawal;
        var batas = 0.05;
        // var i = 0;

        for (let j = 0; j < listObject.length; j++) {
            if (listObject[j].constructor.name == "Line") {
                var cekpoint1 = distance(pointawal, listObject[j].point1);
                var cekpoint2 = distance(pointawal, listObject[j].point2);
    
                if (cekpoint1 < batas && cekpoint1 != NaN){
                    closePoints.push([j, "point1"]);
                    break;
                }
                else  if (cekpoint2 < batas && cekpoint2 != NaN){
                    closePoints.push([j, "point2"]);
                    break;
                }
            }

        };

    })

    lineFunctions.listen("pointAkhirChosen", (pointakhir) => {

        for (let j = 0; j < listObject.length; j++) {
            if (j == closePoints[0][0]) {
                if (closePoints[0][1] == "point1"){
                    listObject[j].point1 = pointakhir;
                    break;
                }
                else if (closePoints[0][1] == "point2"){
                    listObject[j].point2 = pointakhir;
                    break;
                }
            } 
        };
        
        closePoints = [];
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);
        render();
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

    squareFunctions.listen("endPointCreated", () => {
        render();
        console.log("endPointCreated");
    })

    squareFunctions.listen("pointAwalChosen", (pointawal) => {
        pointAwal = pointawal;
        var batas = 0.05;
        // var i = 0;

        for (let j = 0; j < listObject.length; j++) {
            if (listObject[j].constructor.name == "Square") {
                var cekpoint1 = distance(pointawal, listObject[j].point1);
                // var cekpoint2 = distance(pointawal, listObject[j].point2);
                var cekpoint3 = distance(pointawal, listObject[j].point3);
                // var cekpoint4 = distance(pointawal, listObject[j].point4);
    
                if (cekpoint1 < batas && cekpoint1 != NaN){
                    closePointsSquare.push([j, "point1"]);
                    break;
                }
                // else  if (cekpoint2 < batas && cekpoint2 != NaN){
                //     closePoints.push([j, "point2"]);
                //     break;
                // }
                else  if (cekpoint3 < batas && cekpoint3 != NaN){
                    closePointsSquare.push([j, "point3"]);
                    break;
                }
                // else  if (cekpoint4 < batas && cekpoint4 != NaN){
                //     closePoints.push([j, "point4"]);
                //     break;
                // }
            }

        };
        
    })

    squareFunctions.listen("pointAkhirChosen", (pointakhir) => {
        for (let j = 0; j < listObject.length; j++) {
            if (j == closePointsSquare[0][0]) {
                if (closePointsSquare[0][1] == "point1"){
                    var tempP3 = listObject[j].point3;
                    var tempcolorP3 = listObject[j].color;
                    listObject.splice(j, 1);
                    listObject.push(new Square(pointakhir, tempP3, tempcolorP3));
                    break;
                }
                else if (closePointsSquare[0][1] == "point3"){
                    var tempP1 = listObject[j].point1;
                    var tempcolorP1 = listObject[j].color;
                    listObject.splice(j, 1);
                    listObject.push(new Square(tempP1, pointakhir, tempcolorP1));
                    break;
                }
            } 
        };
        
        closePointsSquare = [];
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);
        render();
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

    rectFunctions.listen("endPointCreated", () => {
        render();
        console.log("endPointCreated");
    })

    const polyFunctions = new PolygonFunctions(canvas);

    // polygon
    window.addEventListener('keydown', (e) => {
        if(e.key == 'Enter' && polyFunctions.isDrawing) {
            listObject.push(polyFunctions.givePoints())
            render();
            polyFunctions.deactivate();
            polyFunctions.activate();
        }
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
        polyFunctions.deactivate();
        lineFunctions.deactivateMover();
        squareFunctions.deactivateMover();
        isDrawing = false;
    }

    document.getElementById("ControlButton").addEventListener("click", function() {
        controlHelp();
        resetBorderColor();
        this.classList.add("selectedtool");
        isDrawing = false;
        deactivateAll();
        lineFunctions.activateMover();
        squareFunctions.activateMover();
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
        polyFunctions.activate();
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
        console.log(listObject)
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
            else if(element.constructor.name == "Line")
            {
                datatext += element.point1.toString();
                datatext += ";"
                datatext += element.point2.toString();
            }
            else{
                for(let k = 0;k<element.points.length;k++)
                {
                    datatext += element.points[k].toString();
                    datatext += ";"
                }
            }
            datatext += "\n";

            // Color:
            datatext += element.color.substr(1,6);
            datatext += "\n";

            console.log("saving... ",datatext)
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

                for (let k = 0; k < arrfile.length; k+=3) {
                    let shape = arrfile[k];
                    let arrtemp = arrfile[k+1].split(';');
                    let arrpoints = []
                    let tempcolor = "#" + arrfile[k+2]
                    console.log("parse ",k)

                    for (let j = 0; j < arrtemp.length; j+=1) {
                        let tempval = arrtemp[j].split(',')
                        let x = parseFloat(tempval[0], 32)
                        let y = parseFloat(tempval[1], 32)
                        arrpoints.push([x,y,0]);
                    }

                    if(shape == "Line"){
                        let obj = new Line(arrpoints[0], arrpoints[1], tempcolor);
                        listObject.push(obj);
                    }

                    else if(shape == "Square"){
                        let obj = new Square(arrpoints[0], arrpoints[2], tempcolor);
                        listObject.push(obj);
                    }

                    else if(shape == "Rectangle"){
                        let obj = new Rectangle(arrpoints[0], arrpoints[2], tempcolor);
                        listObject.push(obj);
                    }
                    else{
                        let obj = new Polygon(arrpoints, tempcolor);
                        listObject.push(obj);
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
        document.getElementById("toolDetail").innerHTML = "<p>How to use: <ol> <li>Click one of the tools from the menu on the right side of the screen. Detailed instructions on how to use the tool will show up on the bottom of the screen.</li> <li>Use the tool by clicking inside the canvas area.</li> <li>The [Show help] button can be used to show this instructions on the screen again.</li> </ol> </p> <p>List of tools: <ul> <li><img src='img/icon_control.png'><b>Control:</b> Use to pick a shape and edit its colors/position.</li> <li><img src='img/icon_line.png'><b>Line:</b> Creates a straight line.</li> <li><img src='img/icon_square.png'><b>Square:</b> Creates a square.</li> <li><img src='img/icon_rect.png'><b>Rectangle:</b> Creates a rectangle.</li> <li><img src='img/icon_polygon.png'><b>Polygon:</b> Creates a polygon.</li> <li><img src='img/icon_undo.png'><b>Undo Draw:</b> Deletes last created shape.</li> <li><img src='img/icon_clear.png'><b>Clear:</b> Cleares the screen (WARNING: action cannot be undone).</li> <li><img src='img/icon_load.png'><b>Load file:</b> Loads canvas from a saved file.</li> <li><img src='img/icon_save.png'><b>Save current file:</b> Saves current canvas into a file.</li> <li><img src='img/icon_export.png'><b>Export:</b> Saves current canvas into an image.</li> <li><img src='img/icon_fill.png'><b>Fill color:</b> Changes the fill color of a shape (square, rectangle, polygon) according to color input.</li> <li><img src='img/icon_stroke.png'><b>Stroke color:</b> Changes the stroke color of a shape (applicable to all shapes) according to color input.</li> <li><img src='img/icon_help.png'><b>Show help:</b> Shows this help menu.</li> <li><img src='img/icon_point.png'><b>Toggle points:</b> Shows/hides all control points.</li> </ul> </p>";
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
        document.getElementById("toolDetail").innerHTML = "<p>Creates a polygon. Click on the canvas to mark the startpoint of the polygon, then keep clicking on the canvas for every vertex of the polygon. Click enter to render it.";
    }

    document.getElementById("HelpButton").addEventListener("click", function() {
        showHelp();
    });

    document.getElementById("PointButton").addEventListener("click", function() {
        isPointVisible = !isPointVisible;
        console.log("IS POINT VIS: ",isPointVisible)
        gl.clear(gl.COLOR_BUFFER_BIT||gl.DEPTH_BUFFER_BIT||gl.STENCIL_BUFFER_BIT)
        render();
    });


    function render() {
        // listObject.forEach((obj) => obj.render(gl, vBuffer, cBuffer));
        console.log('listObject')      
        console.log(listObject)       
        semua = [];
        lines = [];
        linescolor = [];
        squares = [];
        sqcolor = [];
        rectangles = [];
        rectcolor = [];
        polygons = [];
        polycolor = [];

        listObject.slice().forEach(element => {
            // console.log(element.constructor.name)
            if(element.constructor.name == "Square")
            {
                squares.push([element.point1, element.point2, element.point2, element.point3, element.point3, element.point4, element.point4, element.point1])   
                let tmp = hexToRGBA(element.color)
                sqcolor.push(tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp)
                
            }
            else if (element.constructor.name == "Rectangle"){
                rectangles.push([element.point1, element.point2, element.point2, element.point3, element.point3, element.point4, element.point4, element.point1])
                let tmp = hexToRGBA(element.color)
                rectcolor.push(tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp)
            }
            else if (element.constructor.name == "Line")
            {
                lines.push(element.point1,element.point2)
                let tmp = hexToRGBA(element.color)
                linescolor.push(tmp,tmp)
            }
            else if (element.constructor.name == "Polygon")
            {
                polygons.push(element.points)
                console.log("banyak vertex",element.points.length)
                let tmp = hexToRGBA(element.color)
                for (let i = 0; i < element.points.length; i++) {
                    polycolor.push(tmp)
                }
            }
            
        });

        renderSquare(squares, sqcolor);
        renderSquare(rectangles, rectcolor);
        renderPolygon(polygons);
        renderLine(lines);

        lines = [];
        linescolor = [];
        squares = [];
        sqcolor = [];
        rectangles = [];
        rectcolor = [];
        polygons = [];
        polycolor = [];
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
        linescolor = linescolor.flat(2);
        console.log("linescolor:",linescolor)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linescolor), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        // gl.clear( gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.LINES, 0, 2);
       
        gl.drawArrays(gl.LINES, 0, jumlahLine);
        if(isPointVisible)
        {
            gl.drawArrays(gl.POINTS, 0, jumlahLine);
        }
        
    };

    function hexToRGBA(hex){
        let R = parseInt(hex.substr(1, 2),16)/255;
        let G = parseInt(hex.substr(3, 2),16)/255;
        let B = parseInt(hex.substr(5, 2),16)/255;
        let A = 1.0;

        console.log("RGBA: ",R,G,B,A)
        return [R, G, B];
    }

    function renderSquare(a, c) {
        // console.log(a);

        c = c.flat(2);
        counter = 0
        a.forEach(element => {
            console.log("masuk foreach")
            var jumlahSq = element.length;
            element = element.flat(2);
            console.log("flatter");
            console.log(element);
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
       
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element), gl.STATIC_DRAW);
            console.log("element: ",element)

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            console.log("sq/rectcolor: ",c)

            if(counter>0)
            {
                c.splice(0, 24);
            }
            
            counter = counter + 1

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(c), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null)

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);

            if(isPointVisible)
        {
            gl.drawArrays(gl.POINTS, 0, 8);
        }
            // gl.drawArrays(gl.POINTS, 0, 8);
        });
        
    }

    function renderPolygon(polygons) {
        for (let i = 0; i < polygons.length; i++) {
            const points = polygons[i];
            const initialPoint = points[0]
            for (let j = 1; j < points.length-1; j++) {
                const point1 = points[j];
                
                for (let k = 1; k < points.length-1; k++) {
                    const point2 = points[k+1];
                    
                    const element = [initialPoint[0], initialPoint[1], 0, point1[0], point1[1], 0, point2[0], point2[1], 0]

                    console.log(element);
                    
                    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element), gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null)
                    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                    polycolor = polycolor.flat(2);
                    console.log("polycolor:",polycolor)


                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polycolor), gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null)
                    gl.drawArrays(gl.TRIANGLES, 0, 3);
                    if(isPointVisible)
                    {
                        gl.drawArrays(gl.POINTS, 0, 3);
                    }
                }
            }
            console.log("POINTS on polygon ",points.length)
            polycolor.splice(0, points.length*3);


        }
    }

    function distance(point1, point2) {
        return (Math.sqrt(Math.pow(Math.abs(point2[0] - point1[0]), 2) + Math.pow(Math.abs(point2[1] - point1[1]), 2)));
    }
        
}




window.onload = main;