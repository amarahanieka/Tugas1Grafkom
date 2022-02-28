class LineFunctions {
    constructor(canvas) {
        this.canvas = canvas;

        this._callbackFunctions = {
            lineCreated: [],
            startPointCreated: [],
            endPointCreated: [],
            lineAborted: [],
        };

        this.startpoint = null;
        this.endpoint = null;

        this.isDrawing = false;

        this.clickEvent = (e) => {
            if (this.isDrawing) {
                if (this.endpoint == null) {
                    this.sendEvent("lineAborted", null);
                }
                this.sendEvent(
                    "lineCreated",
                    new Line(this.startpoint, this.endpoint, document.getElementById("colorValue").value)
                );

                this.isDrawing = false;
                this.startpoint = null;
                this.endpoint = null;
            } else {
                this.isDrawing = true;
                this.startpoint = this.setPoint(e);
                this._fireEvent = ("startPointCreated", this.startpoint);
            }
        };

        this.nextClickEvent = (e) => {
            if (this.isDrawing){
                this.endpoint = this.setPoint(e);
                // console.log("masuk ke next click event")
                this._fireEvent = ("endPointCreated", this.endpoint);
                
            }
            
            
        };
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


        // const x = (2 * e.clientX) / this.canvas.width - 1;
        // const y = (-2 * e.clientY) / this.canvas.height + 1;

        var pts = [x, y, 0];
        return pts;
    };

    givePoint(){
        return [this.startpoint, this.endpoint];
    };
}
