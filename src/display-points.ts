import { reDraw, drawPoint } from "./draw.js";
import { TPoint } from "./point.js";
import { clearTable, insertRow } from "./table.js";

const tableBody = document.querySelector("#results-table > tbody") as HTMLTableElement

export type AreaCheckResult = {
  point: TPoint;
  result: boolean;
  calculationTime: number;
  calculatedAt: number;
};

export function updatePlot(points: AreaCheckResult[] = []) {
  reDraw();
  for (const { point, result } of points) {
    // draw last point in front most plane
    drawPoint(point, result);
  }
}

export function updateTable(
  points: AreaCheckResult[],
  tableBody: HTMLTableElement
) {
  points.reverse();

  clearTable(tableBody);
  for (const { point, result, calculatedAt, calculationTime } of points) {
    insertRow(
      tableBody,
      point,
      result.toString(),
      new Date(calculatedAt).toLocaleTimeString("ru-RU"),
      calculationTime.toString()
    );
  }
}

export function updatePoints(currentScale: number, points?: AreaCheckResult[]) {
  updatePlot(points?.filter(point => point.point.scale === currentScale))
  if (points) {
    updateTable(points, tableBody)
  }
}

// ------- dots -------
// ---- init phase ----
// request current list of dots

// ---- input phase ----
// on new dot pushed to server, re-request list

// ---- update phase ----
// redraw points
// refill table
