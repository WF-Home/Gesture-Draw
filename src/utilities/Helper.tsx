export const HAND_CONNECTIONS: number[][] = [
[0, 1], [1, 2], [2, 3], [3, 4],       // thumb
[0, 5], [5, 6], [6, 7], [7, 8],       // index
[5, 9], [9,10], [10,11], [11,12],     // middle
[9,13], [13,14], [14,15], [15,16],    // ring
[13,17], [17,18], [18,19], [19,20],   // pinky
[0,17]                                // palm base
];  

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