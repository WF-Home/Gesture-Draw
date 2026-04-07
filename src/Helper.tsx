  
export function drawLandmark(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#006800";
    ctx.fill();
}

export function drawLine(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#5b0000";
    ctx.lineWidth = 2;
    ctx.stroke();
}