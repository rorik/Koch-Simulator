import { HistoryElement } from './history/history.component';
import { ProcessorService } from './processor/processor.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Coordinate, Sequence, pointsToCoordinateSequence } from '../shared/logic/logic';
import { Stage, Layer, Line } from '../shared/konva';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit, OnChanges {
  private stage: Stage;
  private layer: Layer;
  private readonly stageWidth = 1000;
  private readonly stageHeight = 700;

  public iteration: number;
  @Input() private sequence: Sequence = pointsToCoordinateSequence([[1, 0], [0, -1], [1, 0], [0, 1], [1, 0]]);
  private path: Coordinate[];
  private scale = -1;
  public history: HistoryElement[] = [];

  options = {
    clear: true,
    draw: true,
    color: false
  };

  constructor(private processor: ProcessorService) {}

  ngOnInit() {
    this.init();
    if (this.sequence instanceof Array) {
      this.sequence = pointsToCoordinateSequence(this.sequence);
    }
    this.iteration = 0;
    const boundariesDiff = {
      x: this.sequence.boundaries.max.x - this.sequence.boundaries.min.x,
      y: this.sequence.boundaries.max.y - this.sequence.boundaries.min.y
    };
    const available = {x: this.stageWidth / 2, y: this.stageHeight / 2};
    const canvasRatio = this.stageWidth / this.stageHeight;
    const boundariesRatio = boundariesDiff.x / boundariesDiff.y;
    let end: Coordinate;
    if (boundariesRatio >= canvasRatio) {
      this.scale = available.x / boundariesDiff.x;
    } else {
      this.scale = available.y / boundariesDiff.y;
    }
    const start: Coordinate = new Coordinate(this.stageWidth / 2 + this.scale * (boundariesDiff.x / 2 - this.sequence.boundaries.max.x),
      this.stageHeight / 2 + this.scale * (boundariesDiff.y / 2 - this.sequence.boundaries.max.y));

    if (this.sequence.vector.length === 0) {
      end = start.copy().add([this.scale * boundariesDiff.x, 0]);
    } else {
      const sequenceEnd = this.sequence.vector.apply(Coordinate.zero());
      end = start.copy().add(sequenceEnd.mutiply(this.scale));
    }
    this.path = [start, end];

    this.drawPath();
    this.saveStep();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.iteration === 0 && !this.processor.isActive()) {
      this.restart();
    }
  }

  public init() {
    this.stage = new Stage({
      container: 'canvas-container',
      width: this.stageWidth,
      height: this.stageHeight
    });

    this.layer = new Layer({});
    this.stage.add(this.layer);

    this.scaleCanvas();
    window.addEventListener('resize', () => this.scaleCanvas());
  }

  private scaleCanvas() {
    const canvasContainer: HTMLElement = document.querySelector('#canvas-row');
    const containerWidth = canvasContainer.offsetWidth;
    const containerHeight = canvasContainer.offsetHeight;
    const scale = Math.min(containerWidth / this.stageWidth, containerHeight / this.stageHeight);

    this.stage.width(this.stageWidth * scale);
    this.stage.height(this.stageHeight * scale);
    this.stage.scale({ x: scale, y: scale });
    this.stage.draw();
  }

  public async drawPath(path?: Coordinate[], clear: boolean = true) {
    if (clear) {
      this.layer.destroyChildren();
    }
    if (!path) {
      path = this.path;
    }
    if (path.length > 0) {
      let color: string;
      if (this.options.color) {
        color = '#' + Math.random().toString(16).slice(2, 8);
      } else {
        color = '#000';
      }
      const points = [];
      path.forEach(coordinate => {
        points.push(coordinate.x, coordinate.y);
      });
      const redLine: Line = new Line({
        points,
        stroke: color,
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
      });
      this.layer.add(redLine);
      this.stage.draw();
    }
  }

  public step(): void {
    if (this.processor.isActive()) {
      return;
    }
    if (this.sequence instanceof Array) {
      this.sequence = pointsToCoordinateSequence(this.sequence);
    }

    this.processor.start(this.path, this.sequence);

    if (this.options.draw) {
      this.continue();
    } else {
      setTimeout(() => {
        this.finish();
      }, 0);
    }
  }

  private continue(): void {
    setTimeout(() => {
      const output = this.processor.continue();
      if (output) {
        if (!output.finished) {
          this.drawPath(output.path, false);
          this.continue();
        } else {
          this.iteration++;
          this.path = output.path;
          this.saveStep();
        }
      }
    }, 0);
  }

  private finish(): void {
    let output = this.processor.continue();
    while (!output.finished) {
      output = this.processor.continue();
    }
    this.iteration++;
    this.path = output.path;
    this.drawPath(this.path, false);
    this.saveStep();
  }

  private saveStep(): void {
    this.history = this.history.filter(step => step.enabled);
    this.history.forEach(step => {
      if (this.options.clear) {
        step.setVisible(false);
      }
    })
    const image = this.stage.toDataURL({});
    this.history.push(new HistoryElement(this.iteration, image, this.path, this.layer));
    this.layer = new Layer({});
    this.stage.add(this.layer);
  }

  public loadStep(step: HistoryElement): void {
    this.path = step.path;
    this.iteration = step.iteration;
    this.history.forEach(element => {
      if (element.iteration > step.iteration) {
        element.enabled = false;
      }
    });
    this.drawPath();
  }

  public stop(): void {
    this.processor.stop();
  }

  public restart(): void {
    this.stop();
    this.history = [];
    this.ngOnInit();
  }
}
