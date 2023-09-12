import { Position } from "./index"
import { errorDisplayer } from "./error.js";

const form = document.querySelector("#intersect-input-form") as HTMLFormElement

const url = new URL(document.URL)

const POINT_X_URL_ID = "pointX"
const POINT_Y_URL_ID = "pointY"
const SCALE_URL_ID = "scale"

const API_ORIGIN = url.origin
const API_BASE = "/~s368899/lab1/server"
const API_INTERSECT_ENDPOINT = "/index.php"
const INVALID_DATA_ERROR_CODE = 422

const urlParams = {
  x: Number(url.searchParams.get(POINT_X_URL_ID)),
  y: Number(url.searchParams.get(POINT_Y_URL_ID)),
  scale: Number(url.searchParams.get(SCALE_URL_ID))
}

const xValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5]

class Point {
  private static DEFAULT_X = 0
  private static DEFAULT_Y = 0
  
  #x: number = Point.DEFAULT_X
  #y: number = Point.DEFAULT_Y

  getX() {
    return this.#x
  }

  getY() {
    return this.#y
  }

  constructor(x?: number, y?: number) {
    this.setX(x)
    this.setY(y)
  }

  setX(x?: number) {
    if (x === undefined || x === null) {
      this.#x = Point.DEFAULT_X
      return;
    }

    const val = closeToValueInSet(x, xValues)
    if (val === undefined) {
      throw new Error(`X should be one of ${xValues.join(" ")}`)
    }

    this.#x = val;

  }

  setY(y?: number) {
    if (y == undefined || y == null) {
      this.#y = Point.DEFAULT_Y
      return;
    }

    if (!(-3 <= y && y <= 5)) {
      throw new Error(`Should be number in range [-3, 5]. Got ${y}`)
    }

    this.#y = y;
  }
}

const scaleValues = [1, 1.5, 2, 2.5, 3]
class FormData {
  public point: Point
  public scale: number
  
  constructor({point = new Point(), scale = 1}: {point?: Point, scale?: number}) {
    this.point = point
    this.scale = scale;
  }

  setScale(scale: number) {
    const val = closeToValueInSet(scale, scaleValues)

    if (val === undefined) {
      throw new Error(`Should be one of the following: ${scaleValues.join(" ")}`)
    }
  }
}

function closeToValueInSet(value: number, valueSet: number[]) {
  for (const possibleValue of valueSet) {
    if (Math.abs(possibleValue - value) <= 0.5) {
      return possibleValue;
    }
  }
}

const formData = new FormData({})

const pointXInput = form.querySelector("#input-point-x") as HTMLDivElement

const ACTIVE_CLASS = "active"

pointXInput.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }

  const value = event.target.getAttribute("value")!
  try {
    formData.point.setX(Number(value))
  } catch (e) {
    const error = e as Error
    displayError(error.message)
    return;
  }
  
  const buttonContainer = <HTMLElement>(event.currentTarget)
  const buttons = buttonContainer.querySelectorAll("button")
  buttons.forEach(button => button.classList.remove(ACTIVE_CLASS))

  event.target.classList.add(ACTIVE_CLASS)

  updateUrl(formData)
})

const pointYInput = form.querySelector("#input-point-y")! as HTMLInputElement
pointYInput.value = formData.point.getY().toString()
pointYInput.addEventListener("input", debounce((event: Event) => {
  const input = event.target as HTMLInputElement
  const pointY = Number(input.value)

  if (input.value.length != 0 && Number.isNaN(pointY)) {
    displayError(`Should be number like 1.123, got ${input.value}`, input)
    return;
  }

  input.setCustomValidity("")
  
  if (input.value.length === 0) {
    return;
  }

  try {
    formData.point.setY(pointY)
  } catch (e) {
    const error = e as Error
    displayError(error.message, input)
  }
  
  updateUrl(formData)

}, 400))

function displayError(message: string = "Something went wrong! Please contact the developer", element?: HTMLInputElement) {
  element?.setCustomValidity(message)
  errorDisplayer.push(new Error(message))
}


const scaleInput = form.querySelector("#scale-input") as HTMLDivElement

const checkboxes = scaleInput.querySelectorAll(`scale > input[type="checkbox"]`) as NodeListOf<HTMLInputElement>
updateCheckbox(checkboxes, formData.scale.toString())

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

  const url = new URL(API_BASE + API_INTERSECT_ENDPOINT, API_ORIGIN)
  const params = buildQueryParams(formData)
  mergeQueryParams(url.searchParams, params)
  
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
    
    const [x, y, scale, result, currentTime, execution_time] = request.responseText.split(";")
    insertRow(x, y, scale, result, currentTime, execution_time)
  })
})

const tableBody = document.querySelector("#results-table > tbody")

function insertRow(x: string, y: string, scale: string, result: string, current_time: string, execution_time: string) {
  const row = document.createElement("tr")
  const x_cell = `<td>${x}</td>`
  const y_cell = `<td>${y}</td>`
  const scale_cell = `<td>${scale}</td>`
  const result_cell = `<td>${result}</td>`
  const current_time_cell = `<td>${current_time}</td>`
  const execution_time_cell = `<td>${execution_time}</td>`

  const cells = [x_cell, y_cell, scale_cell, result_cell, current_time_cell, execution_time_cell]
  for (const cell of cells) {
    row.insertAdjacentHTML("beforeend", cell)
  }

  tableBody?.appendChild(row)
}

function updateUrl(formData: FormData) {
  const queryParams = buildQueryParams(formData)

  const url = new URL(document.URL)
  mergeQueryParams(url.searchParams, queryParams)

  window.history.replaceState({}, "", url)

}

function mergeQueryParams(initialParams: URLSearchParams, updatedParams: URLSearchParams) {
  for (const [key, value] of updatedParams) {
    initialParams.set(key, value)
  }
}

function buildQueryParams(formData: FormData) {
  const url = new URLSearchParams()
  
  url.set(POINT_X_URL_ID, formData.point.getX().toString())
  url.set(POINT_Y_URL_ID, formData.point.getY().toString())
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
