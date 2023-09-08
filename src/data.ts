import { Position } from "./index"

const form = document.querySelector("#intersect-input-form") as HTMLFormElement

type TFormData = {
  point: Position
  scale: number
}

const url = new URL(document.URL)

const POINT_X_URL_ID = "pointX"
const POINT_Y_URL_ID = "pointY"
const SCALE_URL_ID = "scale"

const API_ORIGIN = url.origin
const API_BASE = "/~s368899/lab1/server"
const API_INTERSECT_ENDPOINT = "/index.php"

const formData: TFormData = {
  point: {
    x: Number(url.searchParams.get(POINT_X_URL_ID) ?? 0),
    y: Number(url.searchParams.get(POINT_Y_URL_ID) ?? 0),
  },
  scale: Number(url.searchParams.get(SCALE_URL_ID) ?? 1)
}

const pointXInput = form.querySelector("#input-point-x") as HTMLDivElement

pointXInput.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }

  const value = event.target.getAttribute("value")!
  formData.point.x = Number(value)

  updateUrl(formData)
})

const pointYInput = form.querySelector("#input-point-y")! as HTMLInputElement
pointYInput.value = formData.point.y.toString()
pointYInput.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement
  const pointY = Number(input.value)

  if (input.value.length != 0 && Number.isNaN(pointY)) {
    input.setCustomValidity(`Should be number like 123.456, got ${input.value}`)
    return;
  }

  if (!(-3 <= pointY && pointY <= 5)) {
    input.setCustomValidity(`Should be number in range [3, 5]. Got ${pointY}`)
    return;
  }

  input.setCustomValidity("")
  
  if (input.value.length === 0) {
    return;
  }

  formData.point.y = pointY
  
  updateUrl(formData)

})


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

function updateUrl(formData: TFormData) {
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

function buildQueryParams(formData: TFormData) {
  const url = new URLSearchParams()
  
  url.set(POINT_X_URL_ID, formData.point.x.toString())
  url.set(POINT_Y_URL_ID, formData.point.y.toString())
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

