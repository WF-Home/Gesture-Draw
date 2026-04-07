
export function draw(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.stroke();
}
