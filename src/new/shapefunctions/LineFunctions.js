class LineFunctions {
    constructor(canvas) {
        this.canvas = canvas;

        this._callbackFunctions = {
            lineCreated: [],
            startPointCreated: [],
            endPointCreated: [],
            lineAborted: [],
            pointAwalChosen: [],
            pointAkhirChosen: [],
        };

        this.startpoint = null;
        this.endpoint = null;
        this.pointAwal = null;
        this.pointAkhir = null;

        this.isDrawing = false;
        this.isMoving = false;
        this.x = 0;
        this.y = 0;

        this.clickEvent = (e) => {
            if (this.isDrawing) {
                if (this.endpoint == null) {
                    this.sendEvent("lineAborted", null);
                }
                if(this.endpoint)
                {
                    this.sendEvent(
                        "lineCreated",
                        new Line(this.startpoint, this.endpoint, document.getElementById("colorValue").value)
                    );
                }

                this.isDrawing = false;
                this.startpoint = null;
                this.endpoint = null;
            } else {
                this.isDrawing = true;
                this.startpoint = this.setPoint(e);
                this.sendEvent("startPointCreated", this.startpoint);
            }
        };

        this.nextClickEvent = (e) => {
            this.endpoint = this.setPoint(e);
            // console.log("masuk ke next click event")
            this.sendEvent("endPointCreated", this.endpoint);                
        };

        this.chooseNewPoint = (e) => {
            if(e.shiftKey){
                this.pointAwal = this.setPoint(e);
                this.sendEvent("pointAwalChosen", this.pointAwal);
                this.isMoving = true;
            }
        }

        this.chooseTargetPoint = (e) => {
            if(e.shiftKey && this.isMoving==true){
                console.log("lagi pindah")
                // this.drawLine(canvas, this.x, this.y, e.offsetX, e.offsetY);
            }
        }

        this.endTargetPoint = (e) => {
            if(e.shiftKey && this.isMoving==true){
                // this.drawLine(canvas, this.x, this.y, e.offsetX, e.offsetY);
                // console.log("lagi pindah")
                console.log("stop")
                this.pointAkhir = this.setPoint(e);
                this.sendEvent("pointAkhirChosen", this.pointAkhir);
                this.isMoving = false;
            }
        }

        
    };

    sendEvent(event, data) {
        this._callbackFunctions[event].forEach((callback) => callback(data));
    };

    listen(event, callback) {
        this._callbackFunctions[event].push(callback);
    };

    activate() {
        this.canvas.addEventListener(
            "mousedown",
            this.clickEvent
        );
        this.canvas.addEventListener(
            "mousemove",
            this.nextClickEvent
        );
    };

    deactivate() {
        this.drawing = false;
        this.startpoint = null;
        this.endpoint = null;
        this.canvas.removeEventListener(
            "mousedown",
            this.clickEvent
        );
        this.canvas.removeEventListener(
            "mousemove",
            this.nextClickEvent
        );
    };

    

    setPoint(e) {
        var x = e.clientX;
        var y = e.clientY;
        x = (x - this.canvas.width / 2) / (this.canvas.width / 2);
        y = (this.canvas.height / 2 - y) / (this.canvas.height / 2);


        var pts = [x, y, 0];
        return pts;
    };

    drawLine(context, x1, y1, x2, y2) {
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
      }

    givePoint(){
        return [this.startpoint, this.endpoint];
    };

    activateMover(){
        this.canvas.addEventListener("mousedown", this.chooseNewPoint);
        this.canvas.addEventListener("mousemove", this.chooseTargetPoint);
        this.canvas.addEventListener("mouseup", this.endTargetPoint);
    }
    
    deactivateMover(){
        this.drawing = false;
        this.startpoint = null;
        this.endpoint = null;
        this.pointAwal = null;
        this.canvas.removeEventListener(
            "click",
            this.chooseNewPoint
        );
    }
}