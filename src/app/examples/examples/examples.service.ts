import { VectorSequence, Vector, MixedSequence, Coordinate } from './../../shared/logic/logic';
import { Injectable } from '@angular/core';
import { Sequence, pointsToCoordinateSequence } from 'src/app/shared/logic/logic';

const examples: {[group: string]: ExamplesEntry} = {
  quadratic: {
    label: 'Quadratic',
    icon: 'fas fa-vector-square',
    children: {
      type1: {sequence: [[1, 0], [0, -1], [1, 0], [0, 1], [1, 0]], label: 'Type 1'},
      type2: {sequence: [[1, 0], [0, -1], [1, 0], [0, 1], [0, 1], [1, 0], [0, -1], [1, 0]], label: 'Type 2'},
      type3: {sequence: [[1, 0], [0, -1], [1, 0], [0, 1], [0, 1], [1, 0], [0, -1], [0, -1], [1, 0], [0, 1], [1, 0]], label: 'Type 3'},
      type4: {sequence: [[1, 0], [0, -1], [1, 0], [1, 0], [0, 1], [-1, 0], [0, 1], [1, 0], [1, 0], [0, -1], [1, 0]], label: 'Type 4'},
      type1s: {sequence: [[1, 0], [0, -1], [1, 0], [0, 1], [-1, 0], [0, 1], [1, 0], [0, -1], [1, 0]], label: 'Type 1 mirrored'},
      asymmetric1: {sequence: [[1, 0], [0, -1], [1, 0], [0, 1], [1, 0], [1, 0]], label: 'Assymetric 1'},
      asymmetric2: {sequence: [[1, 0], [0, -1], [1, 0], [0, -1], [1, 0], [0, 1], [0, 1], [1, 0]], label: 'Assymetric 2'},
      asymmetric3: {
        sequence: [[1, 0], [0, -1], [1, 0], [1, 0], [0, 1], [-1, 0], [0, 1], [1, 0], [1, 0], [0, -1], [0, -1], [1, 0], [0, 1], [1, 0]],
        label: 'Assymetric 3'
      }
    }
  },
  curves: {
    label: 'Angled',
    icon: 'fas fa-draw-polygon',
    children: {
      koch: {
         sequence: new MixedSequence([new Coordinate(1, 0), new Vector(1, -Math.PI / 3), new Vector(1, Math.PI / 3), new Coordinate(1, 0)]),
        label: 'Koch snowflake'
      },
      cesaro: {
        sequence: [[1, 0], [0.08715574274766, -0.99619469809175], [0.08715574274766, 0.99619469809175], [1, 0]],
        label: 'Cesàro fractal'
      },
      crown: {
        sequence: [
          [1, 0], [0, -1],
          [0.70710678118655, 0.70710678118655], [0.70710678118655, -0.70710678118655],
          [0.70710678118655, 0.70710678118655], [0.70710678118655, -0.70710678118655],
          [0, 1], [1, 0]
        ],
        label: 'Crown'}
    }
  },
  polygon: {
    label: 'Polygon',
    icon: 'far fa-star',
    children: {
      triangle: {sequence: [[0.5, -0.86602540378444], [0.5, 0.86602540378444], [-1, 0]], label: 'Triangle'},
      square: {sequence: [[0, -1], [1, 0], [0, 1], [-1, 0]], label: 'Square'},
      pentagon: {
        sequence: new VectorSequence([
          new Vector(1, Math.PI / -5), new Vector(1, Math.PI / 5),
          new Vector(1, Math.PI * 3 / 5), new Vector(1, -Math.PI),
          new Vector(1, Math.PI * -3 / 5)
        ]),
        label: 'Pentagon'
      },
      hexagon: {
        sequence: new VectorSequence([
          new Vector(1, Math.PI / -3), new Vector(1, 0),
          new Vector(1, Math.PI / 3), new Vector(1, Math.PI * 2 / 3),
          new Vector(1, Math.PI), new Vector(1, Math.PI * -2 / 3)
        ]),
        label: 'Pentagon'
      },
    }
  },
  infinite: {
    label: 'Infinite',
    icon: 'fas fa-stroopwafel',
    children: {
      heart: {sequence: [[1, 0], [0, -1], [-2, 0], [0, 4], [4, 0], [0, -4], [-2, 0], [0, 1], [1, 0]], label: 'Heart'},
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class ExamplesService {

  constructor() { }

  public getSequence(group: string, example: string): Sequence {
    const fgroup = examples[group];
    if (fgroup) {
      const fexample = fgroup.children[example];
      if (fexample) {
        if (fexample.sequence instanceof Sequence) {
          return fexample.sequence;
        }
        return pointsToCoordinateSequence(fexample.sequence);
      }
    }
    return null;
  }

  public getIndex(): IndexEntry[] {
    const result: IndexEntry[] = [];
    for (const group in examples) {
      if (examples.hasOwnProperty(group)) {
        result.push(this.getIndexEntry(examples[group]));
      }
    }
    return result;
  }

  private getIndexEntry(entry: ExamplesEntry): IndexEntry {
    const indexEntry: IndexEntry = {label: entry.label};
    if (entry.icon) {
      indexEntry.icon = entry.icon;
    }
    if (entry.children && Object.keys(entry.children).length > 0) {
      const children: IndexEntry[] = [];
      for (const child in entry.children) {
        if (entry.children.hasOwnProperty(child)) {
          children.push(this.getIndexEntry(entry.children[child]));
        }
      }
      indexEntry.children = children;
    }
    return indexEntry;
  }
}

export interface IndexEntry {
  children?: IndexEntry[];
  label: string;
  icon?: string;
}

export interface ExamplesEntry {
  children?: {[child: string]: ExamplesEntry};
  sequence?: Sequence|number[][];
  label: string;
  icon?: string;
}

