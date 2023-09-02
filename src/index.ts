const canvas = document.querySelector("#plot") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

type Position = { x: number; y: number };

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

drawAxis(context, false);
drawAxis(context, true);

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
  arrowBody.moveTo(0, canvasHeight / 2);
  arrowBody.lineTo(canvasWidth, canvasHeight / 2);

  const arrowTip = new Path2D();
  const arrowTipWidthPercents = 3;
  const arrowTipHalfHeightPercents = 1;

  arrowTip.moveTo(canvasWidth, canvasHeight / 2);
  arrowTip.lineTo(
    canvasWidth - widthPercents(arrowTipWidthPercents),
    canvasHeight / 2 - heightPercents(arrowTipHalfHeightPercents)
  );
  
  arrowTip.lineTo(
    canvasWidth - widthPercents(arrowTipWidthPercents),
    canvasHeight / 2 + heightPercents(arrowTipHalfHeightPercents)
  );

  if (isVertical) {
    // context.translate(0, canvasHeight);
    context.rotate(-Math.PI / 2);
    console.log(context.getTransform())
  }

  context.stroke(arrowBody);
  context.fill(arrowTip);

  const axisNumericSize = widthPercents(80)

  const unitMark: Position = {
    x: (canvasWidth + axisNumericSize)/2,
    y: canvasHeight/2,
  }

  const halfUnitMarker: Position = {
    x: (canvasWidth + axisNumericSize/2)/2,
    y: canvasHeight/2
  }

  context.save()
  // context.translate(canvasWidth/2, canvasHeight/2)
  // context.rotate(Math.PI)
  // context.translate(-canvasWidth/2, -canvasHeight/2)
  context.translate(canvasWidth, 0)
  context.scale(-1, 1)
  context.fillRect(0,0,10,10)
  drawUnitMark(context, unitMark)
  drawUnitMark(context, halfUnitMarker)
  
  context.restore()

  drawUnitMark(context, unitMark)
  drawUnitMark(context, halfUnitMarker)

  context.restore();
}

function drawUnitMark(context: CanvasRenderingContext2D, unitMark: Position, isHorizontal: boolean) {
  const unitMarkHalfHeight = heightPercents(2)
  const unitMarkHalfWidth = widthPercents(0.3)

  context.fillRect(unitMark.x - unitMarkHalfWidth, unitMark.y - unitMarkHalfHeight, unitMarkHalfWidth*2, unitMarkHalfHeight*2)

  const textMargin = heightPercents(3)
  context.save()
  // console.log(transformation.e, transformation.f)
  // context.setTransform(0, 0, 0, 0, transformation.e, transformation.f)
  context.fillText("R", unitMark.x - unitMarkHalfWidth, unitMark.y + unitMarkHalfHeight + textMargin)
  context.restore()

  if (isHorizontal) {
    
  }
}

