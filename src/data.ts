import { AXIS_UNIT, drawPoint, reDraw } from "./draw.js";
import { errorDisplayer } from "./error.js";
import { MAX_FLOAT_INPUT_LENGTH, Point, TPoint, closeToValueInSet, toPreciseString } from "./point.js";
import { mergeQueryParams } from "./queryParams.js";
import { clearTable, insertRow } from "./table.js";

const form = document.querySelector("#intersect-input-form") as HTMLFormElement

const url = new URL(document.URL)

const POINT_X_URL_ID = "pointX"
const POINT_Y_URL_ID = "pointY"
const SCALE_URL_ID = "scale"

const DEBOUNCE_TIME = 400

const API_ORIGIN = url.origin
const API_BASE = ""
const API_INTERSECT_ENDPOINT = "/app"
const INVALID_DATA_ERROR_CODE = 422

const urlParams: TPoint = {
  x: Number(url.searchParams.get(POINT_X_URL_ID)) || undefined!,
  y: Number(url.searchParams.get(POINT_Y_URL_ID)) || undefined!,
  scale: Number(url.searchParams.get(SCALE_URL_ID)) || undefined!
}

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


const scaleValues = [1, 1.5, 2, 2.5, 3]
class FormData {
  public point: Point
  public scale: number = 1
  
  constructor({x, y, scale = 1}: TPoint) {
    this.point = new Point(x, y) ?? new Point()
    this.setScale(scale);
  }

  setScale(scale: number) {
    console.log(scale)
    const val = closeToValueInSet(scale, scaleValues)

    if (val === undefined) {
      throw new Error(`Should be one of the following: ${scaleValues.join(" ")}`)
    }

    this.scale = val
  }
}

const formData = new FormData(urlParams)
const pointXInput = form.querySelector("#input-point-x") as HTMLInputElement
pointXInput.value = toPreciseString(formData.point.getX())
pointXInput.addEventListener("input", onNumberInput(DEBOUNCE_TIME, "X", (value) => {
  formData.point.setX(value)
  updateUrl(formData)
}))

const pointYInput = form.querySelector("#input-point-y")! as HTMLInputElement
pointYInput.value = toPreciseString(formData.point.getY())
pointYInput.addEventListener("input", onNumberInput(DEBOUNCE_TIME, "Y", (value) => {
  formData.point.setY(value)
  updateUrl(formData)
}))

function onNumberInput(debounceMs: number, name: string, callback: (value: number) => void) {
  return debounce((event: Event) => {
    const input = event.target as HTMLInputElement
    const value = Number(input.value)
  
    if (input.value.length != 0 && Number.isNaN(value)) {
      displayError(`Should be number like 1.123, got ${input.value}`, input)
      return;
    }
  
    if (input.value.length > MAX_FLOAT_INPUT_LENGTH) {
      displayError(`Too large ${name} input. Try shorter numbers`, input)
      return;
    }
  
    input.setCustomValidity("")
    
    if (input.value.length === 0) {
      return;
    }
  
    try {
      callback(value)
    } catch (e) {
      const error = e as Error
      displayError(error.message, input)
    }
  }, debounceMs)
}

function displayError(message: string = "Something went wrong! Please contact the developer", element?: HTMLInputElement) {
  element?.setCustomValidity(message)
  errorDisplayer.push(new Error(message))
}


const scaleInput = form.querySelector("#scale-input") as HTMLDivElement

const checkboxes = scaleInput.querySelectorAll(`scale > input[type="checkbox"]`) as NodeListOf<HTMLInputElement>

updateCheckbox(checkboxes, formData.scale.toString())
updateUrl(formData)

scaleInput.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  if (event.target.type !== "checkbox") {
    return;
  }

  const { target } = event
  const scale = Number(target.value)
  formData.scale = scale;

  updateCheckbox(checkboxes, target.value)

  updateUrl(formData)
})

form.addEventListener("submit", event => {
  event.preventDefault()

  const request = new XMLHttpRequest()
  const tableBody = document.querySelector("#results-table > tbody") as HTMLTableElement
  const url = new URL(API_BASE + API_INTERSECT_ENDPOINT, API_ORIGIN)
  const params = buildQueryParams(formData)
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
      insertRow(tableBody, point.x.toString(), point.y.toString(), point.scale.toString(), result.toString(), new Date(calculatedAt).toLocaleTimeString("ru-RU"), calculationTime.toString())
    }
  })
})

const canvas = document.querySelector("#plot") as HTMLCanvasElement;
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect(); 
  const x = (event.clientX - rect.left - rect.width / 2) / AXIS_UNIT * formData.scale; 
  const y = (event.clientY - rect.top - rect.height / 2) / -AXIS_UNIT * formData.scale;
  
  console.log(x, y)
  formData.point.setX(x)
  formData.point.setY(y)

  pointXInput.value = toPreciseString(formData.point.getX())
  pointYInput.value = toPreciseString(formData.point.getY())
  updateUrl(formData)
  form.requestSubmit()
})

form.requestSubmit()

function updateUrl(formData: FormData) {
  const queryParams = buildQueryParams(formData)

  const url = new URL(document.URL)
  mergeQueryParams(url.searchParams, queryParams)

  window.history.replaceState({}, "", url)

}

function buildQueryParams(formData: FormData) {
  const url = new URLSearchParams()
  
  url.set(POINT_X_URL_ID, toPreciseString(formData.point.getX()))
  url.set(POINT_Y_URL_ID, toPreciseString(formData.point.getY()))
  url.set(SCALE_URL_ID, formData.scale.toString())

  return url
}

function updateCheckbox(checkboxes: NodeListOf<HTMLInputElement>, value: string) {
  checkboxes.forEach(checkbox => {
    if (checkbox.value === value) {
      checkbox.checked = true
      return;
    }

    checkbox.checked = false
  })
}

function debounce<T extends Function>(callback: T, timeoutMs: number) {
  let timerId: number | undefined = undefined

  return ((...args: any) => {
    window.clearTimeout(timerId)
    timerId = setTimeout(() => callback(...args), timeoutMs) as unknown as number
  })
}
