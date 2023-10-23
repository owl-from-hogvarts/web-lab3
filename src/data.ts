import { AXIS_UNIT, drawPoint, reDraw } from "./draw.js";
import { displayError } from "./error.js";
import { buildQueryParams, form, init, pointXInput, pointYInput, scaleInput, updateX, updateY, update } from "./input-form.js";
import { MAX_FLOAT_INPUT_LENGTH, TPoint } from "./point.js";
import { mergeQueryParams, url } from "./url.js";
import { clearTable, insertRow } from "./table.js";

const state = init(url)

const DEBOUNCE_TIME = 400

const API_ORIGIN = url.origin
const API_BASE = ""
const API_INTERSECT_ENDPOINT = "/app"
const INVALID_DATA_ERROR_CODE = 422

type AreaCheckResult = {
  point: TPoint,
  result: boolean,
  calculationTime: number,
  calculatedAt: number
}

type AreaCheckResponse = {
  user: {
    points: AreaCheckResult[]
  }
}


// init
// update state
pointXInput.addEventListener("input", onNumberInput(DEBOUNCE_TIME, "X", (value) => {
  state.point.setX(value)
  updateX(state)
}))

// init
// update state
pointYInput.addEventListener("input", onNumberInput(DEBOUNCE_TIME, "Y", (value) => {
  state.point.setY(value)
  updateY(state)
}))

function onNumberInput(debounceMs: number, name: string, callback: (value: number) => void) {
  return debounce((event: Event) => {
    const input = event.target as HTMLInputElement
  
    const result = validateNumberInput(input.value, name)
    if (result instanceof Error) {
      const error = result
      displayError(error.message, input)
      return;
    }
  
    try {
      callback(result)
    } catch (e) {
      const error = e as Error
      displayError(error.message, input)
    }
  }, debounceMs)
}

function validateNumberInput(input: string, filedName: string): Error | number {
  const value = Number(input)
  
  if (input.length != 0 && Number.isNaN(value)) {
    return new Error(`Should be number like 1.123, got ${input}`);
  }

  if (input.length > MAX_FLOAT_INPUT_LENGTH) {
    return new Error(`Too large ${filedName} input. Try shorter numbers`)
  }
  
  if (input.length === 0) {
    return value;
  }

  return value
}

scaleInput.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  if (event.target.type !== "checkbox") {
    return;
  }

  const { target } = event
  const scale = Number(target.value)
  state.setScale(scale);

  update(state)
})

form.addEventListener("submit", event => {
  event.preventDefault()

  const request = new XMLHttpRequest()
  const tableBody = document.querySelector("#results-table > tbody") as HTMLTableElement
  const url = new URL(API_BASE + API_INTERSECT_ENDPOINT, API_ORIGIN)
  const params = buildQueryParams(state)
  mergeQueryParams(url.searchParams, params)
  url.searchParams.set("isJson", "")
  
  request.open("GET", url)
  request.send()
  request.addEventListener("load", response => {
    if (request.status !== 200) {
      if (request.status === INVALID_DATA_ERROR_CODE) {
        displayError("Invalid data! Check input")
        return;
      }
      displayError()
      return;
    }
    

    const { points } = (JSON.parse(request.responseText) as AreaCheckResponse).user;
    points.reverse()

    clearTable(tableBody)

    reDraw()
    for (const {point, result, calculatedAt, calculationTime} of points) {
      drawPoint(point, result)
      insertRow(tableBody, point, result.toString(), new Date(calculatedAt).toLocaleTimeString("ru-RU"), calculationTime.toString())
    }
  })
})

const canvas = document.querySelector("#plot") as HTMLCanvasElement;
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect(); 
  const x = (event.clientX - rect.left - rect.width / 2) / AXIS_UNIT * state.scale; 
  const y = (event.clientY - rect.top - rect.height / 2) / -AXIS_UNIT * state.scale;
  
  state.point.setX(x)
  updateX(state)
  state.point.setY(y)
  updateY(state)

  update(state)
  form.requestSubmit()
})


function debounce<T extends Function>(callback: T, timeoutMs: number) {
  let timerId: number | undefined = undefined

  return ((...args: any) => {
    window.clearTimeout(timerId)
    timerId = setTimeout(() => callback(...args), timeoutMs) as unknown as number
  })
}

// ------- dots -------
// ---- init phase ----
// request current list of dots

// ---- input phase ----
// on new dot pushed to server, re-request list

// ---- update phase ----
// redraw points
// refill table
