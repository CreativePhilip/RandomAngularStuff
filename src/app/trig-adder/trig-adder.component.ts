import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";



@Component({
  selector: 'app-trig-adder',
  templateUrl: './trig-adder.component.html',
  styleUrls: ['./trig-adder.component.scss']
})
export class TrigAdderComponent implements OnInit
{

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>
  @ViewChild('data', {static: true}) dataDiv: ElementRef<HTMLDivElement>

  context: CanvasRenderingContext2D
  options: CanvasOptions
  drawer: CanvasDrawer

  form: FormGroup
  currentMousePos = {x: "0", y: "0"}
  constructor(private fb: FormBuilder)
  {
  }

  ngOnInit(): void
  {
    this.context = this.canvas.nativeElement.getContext('2d')
    this.canvas.nativeElement.width = this.dataDiv.nativeElement.offsetWidth * .65
    this.canvas.nativeElement.height = this.dataDiv.nativeElement.offsetHeight

    this.options = new CanvasOptions(this.canvas.nativeElement)
    this.drawer = new CanvasDrawer(this.canvas.nativeElement, this.context, this.options)

    this.form = this.fb.group({
      functions: this.fb.array([]),
      drawComponents: [false],
      drawResult: [true]
    })
    this.form.valueChanges.subscribe(() => this.onFormChange())

    this.drawer.drawCoordinateFrame()
  }

  addFunction()
  {
    const form = this.functionForms.at(this.functionForms.length - 1)
    let magnitude = 1
    let period = 1

    if (form)
    {
      magnitude = form["controls"].magnitude.value
      period = form["controls"].period.value + 1
    }

    const trig = this.fb.group({
      magnitude: [magnitude],
      period: [period]
    })

    this.functionForms.push(trig)
  }

  deleteFunction(i)
  {
    this.functionForms.removeAt(i)
  }

  onFormChange()
  {
    const s = this.form.controls.functions.value
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    this.drawer.drawCoordinateFrame()
    if (this.form.controls.drawComponents.value) this.drawer.drawMultipleSins(s, .1, 1)
    if (this.form.controls.drawResult.value) this.drawer.drawSummedCurve(s, .1, 5)
  }

  get functionForms()
  {
    return this.form.get('functions') as FormArray
  }

  canvasMouseMoveHandler(e: MouseEvent)
  {
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    this.currentMousePos = this.options.screenSpaceToCanvasSpace(mouseX, mouseY)

    this.onFormChange()
    this.drawer.drawLineGlobally(
      [mouseX, 0],
      [mouseX, this.canvas.nativeElement.height],
      {lineWidth: .5})

    this.drawer.drawLineGlobally(
      [0, mouseY],
      [this.canvas.nativeElement.clientWidth, mouseY],
      {lineWidth: .5})
  }

  canvasOnMouseExitHandler()
  {
    this.onFormChange()
  }

  keyPressHandler(e: KeyboardEvent)
  {
    if (e.key === 'n')
      this.addFunction()
  }
}


class CanvasOptions
{
  private offset = {x: null, y: null}
  private scale = {x: 70, y: 70}

  constructor(canvas: HTMLCanvasElement)
  {
    this.offset.x = canvas.width / 2
    this.offset.y = canvas.height / 2
  }

  get scaleX()
  {
    return this.scale.x
  }

  get scaleY()
  {
    return this.scale.y
  }

  get offsetX()
  {
    return this.offset.x
  }

  get offsetY()
  {
    return this.offset.y
  }


  screenSpaceToCanvasSpace(x, y)
  {
    return {
      x: ((x - this.offsetX) / this.scaleX).toFixed(2),
      y: ((y - this.offsetY) / -this.scaleY).toFixed(2)
    }
  }
}


class CanvasDrawer
{
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  options: CanvasOptions

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, options: CanvasOptions)
  {
    this.canvas = canvas
    this.context = context
    this.options = options
  }

  drawCoordinateFrame()
  {
    this.drawLine([Math.PI * -2, 0], [Math.PI * 2, 0], {})
    this.drawLine([0, 3], [0, -3], {})
  }

  drawLine([x1, y1], [x2, y2], {color = "#000", lineWidth = 2})
  {
    this.context.beginPath()
    this.context.strokeStyle = color
    this.context.lineWidth = lineWidth
    this.context.moveTo((x1 * this.options.scaleX) + this.options.offsetX, (y1 * this.options.scaleY) + this.options.offsetY)
    this.context.lineTo((x2 * this.options.scaleX) + this.options.offsetX, (y2 * this.options.scaleY) + this.options.offsetY)
    this.context.stroke()
  }

  drawLineGlobally([x1, y1], [x2, y2], {color = "#000", lineWidth = 2})
  {
    this.context.beginPath()
    this.context.strokeStyle = color
    this.context.lineWidth = lineWidth
    this.context.moveTo(x1, y1)
    this.context.lineTo(x2, y2)
    this.context.stroke()
  }

  drawSin(magnitude: number, period: number, step = 0.1, lineWidth = 1, color = "#000")
  {
    let lastPoint = -2 * Math.PI

    while (lastPoint < 2 * Math.PI)
    {
      let currentPoint = lastPoint + step
      this.drawLine(
        [lastPoint, magnitude * Math.sin(period * lastPoint)],
        [currentPoint, magnitude * Math.sin(period * currentPoint)],
        {color: color, lineWidth: lineWidth})
      lastPoint = currentPoint
    }
    this.context.strokeStyle = "#000"
  }

  drawMultipleSins(arr, step = 0.1, lineWidth = 2)
  {
    const color = colors[2]
    arr.forEach(e => this.drawSin(parseInt(e.magnitude), parseInt(e.period), step, lineWidth, color))
  }

  drawSummedCurve(arr, step = 0.1, lineWidth = 3)
  {
    if (arr.length === 0) return
    let lastPoint = -2 * Math.PI
    const col = colors[3]

    while (lastPoint < 2 * Math.PI)
    {
      const y1 = CanvasDrawer.sumSinsForX(arr, lastPoint)
      const x2 = lastPoint + step
      const y2 = CanvasDrawer.sumSinsForX(arr, x2)

      this.drawLine(
        [lastPoint, y1],
        [x2, y2],
        {color: col, lineWidth: lineWidth}
      )


      lastPoint = x2
    }
  }

  private static sumSinsForX(arr, x)
  {
    let sum = 0
    for (let item of arr)
    {
      sum += item.magnitude * Math.sin(item.period * x)
    }
    return sum / arr.length
  }
}


const colors = [
  "#fe4a49",
  "#2ab7ca",
  "#ffc011",
  "#7bc043",
  "#0392cf",
]
