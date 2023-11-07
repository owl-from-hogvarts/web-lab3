import { AXIS_UNIT } from "./draw.js";
import { displayError } from "./error.js";
import { updateX, updateY } from "./input-form.js";
import { AreaCheckResult, updatePoints } from "./display-points.js";

declare const points: AreaCheckResult[]
declare const scale: number
declare function updateBeanValues(): void;
declare global {
  function updatePoints(currentScale: number, points: AreaCheckResult[]): void;
}

window.updatePoints = updatePoints

updatePoints(scale, points)

const canvas = document.querySelector("#plot") as HTMLCanvasElement;
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect(); 
  const x = (event.clientX - rect.left - rect.width / 2) / AXIS_UNIT * scale; 
  const y = (event.clientY - rect.top - rect.height / 2) / -AXIS_UNIT * scale;

  const button = document.getElementById("intersect-input-form:submit-button")!

  try {
    updateX(x)
    updateY(y)
    updateBeanValues()
  } catch (e) {
    displayError((<Error>e).message)
  }
})



