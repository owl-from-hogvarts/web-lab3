import { TPoint } from "./point.js";

const canvas = document.querySelector("#plot") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

export type Position = { x: number; y: number };
type UnitMark = Position & {label: string, isHorizontal: boolean}

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

const AXIS_NUMERIC_SIZE = widthPercents(80);
export const AXIS_UNIT = AXIS_NUMERIC_SIZE / 2
export const AXIS_HALF_UNIT = AXIS_UNIT / 2

const FIGURE_COLOR = "#3399ff"
const POINT_COLOR = {
  intersects: "#2F4",
  notIntersects: "#570000"
}
const POINT_RADIUS = 5

export function reDraw() {
  context.clearRect(0, 0, canvasWidth, canvasHeight)
  context.save()
  context.translate(canvasWidth/2, canvasHeight/2)
  context.scale(1, -1)
  context.save()
  drawRect(context)
  context.rotate(Math.PI)
  drawCircle(context)
  context.restore()
  context.save()
  context.scale(1, -1)
  drawTriangle(context, AXIS_UNIT)
  context.restore()
  
  context.restore()
  
  drawAxis(context, false);
  drawAxis(context, true);  
}


export function drawPoint(point: TPoint, result: boolean) {
  context.save()
  context.translate(canvasWidth/2, canvasHeight/2)
  context.scale(1, -1)

  const x = AXIS_UNIT*point.x/point.scale
  const y = AXIS_UNIT*point.y/point.scale

  context.translate(x, y)
  const circle = new Path2D()
  circle.moveTo(0, 0)
  circle.arc(0, 0, POINT_RADIUS, 0, Math.PI*2)

  context.fillStyle = result ? POINT_COLOR.intersects : POINT_COLOR.notIntersects;
  context.fill(circle)
  context.restore()
}

function drawTriangle(context: CanvasRenderingContext2D, size: number) {
  context.save()
  const triangle = new Path2D()
  triangle.moveTo(0,0)
  triangle.lineTo(0, size)
  triangle.lineTo(size, 0)
  
  context.fillStyle = FIGURE_COLOR
  context.fill(triangle)
  context.restore();
}

function drawCircle(context: CanvasRenderingContext2D) {
  context.save()
  const arc = new Path2D()
  arc.moveTo(0,0)
  arc.arc(0, 0, AXIS_HALF_UNIT, -Math.PI/2, 0)

  context.fillStyle = FIGURE_COLOR
  context.fill(arc)
  context.restore()
}

function drawRect(context: CanvasRenderingContext2D) {
  context.save()

  const rect = new Path2D()
  rect.moveTo(0,0)
  rect.rect(0,0, AXIS_UNIT, AXIS_UNIT)

  context.fillStyle = FIGURE_COLOR
  context.fill(rect)
  context.restore()
}

function widthPercents(percents: number): number {
  return (canvasWidth / 100) * percents;
}

function heightPercents(percents: number): number {
  return (canvasHeight / 100) * percents;
}

function drawAxis(
  context: CanvasRenderingContext2D,
  isVertical: boolean = false
) {
  context.save();

  const arrowBody = new Path2D();


  if (isVertical) {
    const arrowTipPosition: Position = {
      x: widthPercents(50),
      y: 0
    }
    
    arrowBody.moveTo(arrowTipPosition.x, arrowTipPosition.y)
    arrowBody.lineTo(arrowTipPosition.x, canvasHeight)

    context.save()
    context.translate(arrowTipPosition.x, arrowTipPosition.y)
    context.rotate(-Math.PI/2)
    drawArrowTip(context)
    context.restore()

  } else {
    const arrowTipPosition: Position = {
      x: canvasWidth,
      y: canvasHeight/2
    }

    arrowBody.moveTo(0, arrowTipPosition.y);
    arrowBody.lineTo(arrowTipPosition.x, arrowTipPosition.y);

    context.save()
    context.translate(arrowTipPosition.x, arrowTipPosition.y)
    drawArrowTip(context)
    context.restore()
  }

  context.stroke(arrowBody);

  const unitMark: UnitMark = {
    x: isVertical ? 0 : AXIS_UNIT,
    y: isVertical ? AXIS_UNIT : 0,
    label: "R",
    isHorizontal: isVertical
  };

  const halfUnitMarker: UnitMark = {
    x: isVertical ? 0 : AXIS_HALF_UNIT,
    y: isVertical ? AXIS_HALF_UNIT : 0,
    label: "R/2",
    isHorizontal: isVertical
  };

  context.save()
  context.translate(canvasWidth/2, canvasHeight/2)

  drawUnitMark(context, unitMark);
  drawUnitMark(context, halfUnitMarker);
  
  const mirrorAxis: keyof Position = isVertical ? "y" : "x"

  const unitMarkNegative = {...unitMark, [mirrorAxis]: unitMark[mirrorAxis]*(-1)}
  const halfUnitMarkerNegative = {...halfUnitMarker, [mirrorAxis]: halfUnitMarker[mirrorAxis]*(-1)}
    
  drawUnitMark(context, unitMarkNegative)
  drawUnitMark(context, halfUnitMarkerNegative)
  
  context.restore()
  context.restore();
}

function drawArrowTip(context: CanvasRenderingContext2D) {
  const arrowTip = new Path2D();
  const arrowTipWidthPercents = 3;
  const arrowTipHalfHeightPercents = 1;

  arrowTip.moveTo(0,0)
  arrowTip.lineTo(
    -widthPercents(arrowTipWidthPercents),
    -heightPercents(arrowTipHalfHeightPercents)
  );

  arrowTip.lineTo(
    -widthPercents(arrowTipWidthPercents),
    heightPercents(arrowTipHalfHeightPercents)
  );

  context.fill(arrowTip);
}

function drawUnitMark(
  context: CanvasRenderingContext2D,
  unitMark: UnitMark,
) {
  const unitMarkHalfHeight = heightPercents(1.8);
  const unitMarkHalfWidth = widthPercents(0.1);

  const textMargin = heightPercents(3);
  context.save()
  context.translate(unitMark.x, unitMark.y)
  context.save()
  context.rotate(unitMark.isHorizontal ? Math.PI / 2 : 0)
  context.fillRect(
    -unitMarkHalfWidth,
    -unitMarkHalfHeight,
    unitMarkHalfWidth * 2,
    unitMarkHalfHeight * 2
  );
  context.restore()
  context.fillText(
    unitMark.label,
    unitMarkHalfWidth + (unitMark.isHorizontal ? textMargin : 0),
    unitMarkHalfHeight + (!unitMark.isHorizontal ? textMargin : 0)
  );
  context.restore()
}
