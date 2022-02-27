class PolygonFunctions {
    constructor(canvas) {
        this.canvas = canvas;
        this.points = [];
        this.isDrawing = false;
        this.clickEvent = (e) => {
            if (this.isDrawing) {
                this.points.push(this.setPoint(e))
            } else {
                this.isDrawing = true;
                this.points.push(this.setPoint(e))
            }
            console.log(this.points);
        };
    };

    setPoint(e) {
        var x = e.clientX;
        var y = e.clientY;
        x = (x - this.canvas.width / 2) / (this.canvas.width / 2);
        y = (this.canvas.height / 2 - y) / (this.canvas.height / 2);

        var pts = [x, y];
        return pts;
    };

    activate() {
        this.canvas.addEventListener(
            "mousedown",
            this.clickEvent
        );
    };

    deactivate() {
        this.isDrawing = false;
        this.points = [];
        this.canvas.removeEventListener(
            "mousedown",
            this.clickEvent
        );
    };

    givePoints() {
        return new Polygon(this.points)
    }
}
