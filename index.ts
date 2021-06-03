const w : number = window.innerWidth
const h : number = window.innerHeight
const bars : number = 10 
const parts : number = 3  
const scGap : number = 0.02 / parts 
const strokeFactor : number = 90
const barWFactor : number = 12.9
const rot : number = Math.PI / 2 
const delay : number = 20 
const colors : Array<string> = [
    "#f44336",
    "#4A148C",
    "#FF6D00",
    "#00C853",
    "#2962FF"
]
const backColor : string = "#bdbdbd"

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale -  i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawEitherSideBar(context : CanvasRenderingContext2D, scale : number, gap : number, size : number) {
        for (var j = 0; j < 2; j++) {
            const barH : number = gap * ScaleUtil.divideScale(scale, 0, parts)
            context.save()
            context.scale(1, 1 - 2 * j)
            context.rotate(ScaleUtil.divideScale(scale, 2, parts))
            context.translate(0, (h / 2 - gap / 2) * (1 - ScaleUtil.divideScale(scale, 1, parts)))
            context.fillRect(-size / 2, gap - barH, size / 2, barH) 
            context.restore()
        }
    }

    static drawBarRotateToMid(context : CanvasRenderingContext2D, scale : number) {
        const gap : number = w / bars 
        const barW : number = Math.min(w, h) / barWFactor 
        const sf : number = ScaleUtil.sinify(scale)
        context.save()
        for (var j = 0; j < bars; j++) {
            context.save()
            context.translate(gap * j + gap / 2, h / 2)
            DrawingUtil.drawEitherSideBar(context, sf, gap, barW)
            context.restore()
        }
        context.restore()
    }

    static drawBRTMNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBarRotateToMid(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }
    
    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}