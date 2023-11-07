import { clearError } from "./error.js";




export function updateX(x: number) {
  const pointXInput = document.getElementById("graphSelect:graph-x") as HTMLInputElement
  setField(pointXInput, x)
}

export function updateY(y: number) {
  const pointYInput = document.getElementById("graphSelect:graph-y") as HTMLInputElement
  setField(pointYInput, y)
}

function setField(element: HTMLInputElement, value: number) {
  element.value = toPreciseString(value)
  clearError(element)
}

const MAX_FLOAT_INPUT_LENGTH = 10

function toPreciseString(num: number) {
  const str = num.toString()
  if (str.length > MAX_FLOAT_INPUT_LENGTH) {
    return num.toFixed(MAX_FLOAT_INPUT_LENGTH - 3)
  }

  return str
}
