import { CoordinateSequence, VectorSequence, MixedSequence } from './../../shared/logic/logic';
import { Injectable } from '@angular/core';
import { Coordinate, Vector, Sequence } from '../../shared/logic/logic';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {

  private inProgress = false;
  private path: Coordinate[];
  private newPath: Coordinate[];
  private sequence: Sequence;
  private index: number;

  constructor() { }

  public start(path: Coordinate[], sequence: Sequence): void {
    this.path = path;
    this.sequence = sequence;

    this.newPath = [];
    this.index = 1;
    this.inProgress = true;
  }

  public continue(): ProcessorOutput {
    if (!this.inProgress) {
      return;
    }
    if (this.index < this.path.length) {
      const newLine = this.fractalize(this.path[this.index - 1], this.path[this.index]);
      this.newPath = this.newPath.concat(newLine);
      this.index++;
      return {finished: false, path: newLine};
    } else {
      this.inProgress = false;
      return {finished: true, path: this.newPath};
    }
  }

  public stop() {
    this.inProgress = false;
  }

  public isActive(): boolean {
    return this.inProgress;
  }

  public fractalize(start: Coordinate, end: Coordinate): Coordinate[] {
    const targetVector = start.vectorize(end);
    let scale: number;
    if (this.sequence.vector.length === 0) {
      scale = targetVector.length / (this.sequence.boundaries.max.x - this.sequence.boundaries.min.x);
    } else {
      scale = targetVector.length / this.sequence.vector.length;
    }
    const points = [start.copy()];
    let previous = start.copy();
    if (this.sequence instanceof CoordinateSequence) {
      this.sequence.forEach(movement => {
        const vector = Coordinate.zero().vectorize(movement.copy().mutiply(scale));
        vector.rotate(targetVector.theta);
        previous = vector.apply(previous);
        points.push(previous);
      });
    } else if (this.sequence instanceof VectorSequence) {
      this.sequence.forEach(vector => {
        const newVector = vector.copy().scale(scale);
        newVector.rotate(targetVector.theta);
        previous = newVector.apply(previous);
        points.push(previous);
      });
    } else if (this.sequence instanceof MixedSequence) {
      this.sequence.forEach(movement => {
        let newVector: Vector;
        if (movement instanceof Coordinate) {
          newVector = Coordinate.zero().vectorize(movement.copy().mutiply(scale));
        } else {
          newVector = movement.copy().scale(scale);
        }
        newVector.rotate(targetVector.theta);
        previous = newVector.apply(previous);
        points.push(previous);
      });
    } else {
      throw new Error('Unsupported sequence type');
    }
    return points;
  }
}

export interface ProcessorOutput {
  finished: boolean;
  path: Coordinate[];
}
