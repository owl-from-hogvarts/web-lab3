const canvas = document.querySelector("#plot") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

type Position = { x: number; y: number };
type UnitMark = Position & {label: string, isHorizontal: boolean}

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

  const axisNumericSize = widthPercents(80);
  const axisUnit = axisNumericSize / 2
  const axisHalfUnit = axisUnit / 2
  const unitMark: UnitMark = {
    x: isVertical ? 0 : axisUnit,
    y: isVertical ? axisUnit : 0,
    label: "R",
    isHorizontal: isVertical
  };

  const halfUnitMarker: UnitMark = {
    x: isVertical ? 0 : axisHalfUnit,
    y: isVertical ? axisHalfUnit : 0,
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
  
  console.log(unitMarkNegative)
  
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
