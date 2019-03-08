export class Coordinate {
  public x: number;
  public y: number;

  public static zero(): Coordinate {
    return new Coordinate(0, 0);
  }

  constructor(x: number | number[], y?: number) {
    if (x instanceof Array) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = x;
      this.y = y;
    }
  }

  public equals(coordinate: Coordinate): boolean {
    return this.x === coordinate.x && this.y === coordinate.y;
  }

  public copy(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  public add(move: Coordinate | number[]): Coordinate {
    if (move instanceof Coordinate) {
      this.x += move.x;
      this.y += move.y;
    } else {
      this.x += move[0];
      this.y += move[1];
    }
    return this;
  }

  public substract(move: Coordinate | number[]): Coordinate {
    if (move instanceof Coordinate) {
      this.x -= move.x;
      this.y -= move.y;
    } else {
      this.x -= move[0];
      this.y -= move[1];
    }
    return this;
  }

  public mutiply(move: Coordinate | number[] | number): Coordinate {
    if (move instanceof Coordinate) {
      this.x *= move.x;
      this.y *= move.y;
    } else if (move instanceof Array) {
      this.x *= move[0];
      this.y *= move[1];
    } else {
      this.x *= move;
      this.y *= move;
    }
    return this;
  }

  public divide(move: Coordinate | number[] | number): Coordinate {
    if (move instanceof Coordinate) {
      this.x /= move.x;
      this.y /= move.y;
    } else if (move instanceof Array) {
      this.x /= move[0];
      this.y /= move[1];
    } else {
      this.x /= move;
      this.y /= move;
    }
    return this;
  }

  public vectorize(head: Coordinate): Vector {
    return new Vector([this, head]);
  }

  public toString(): string {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

export class Vector {
  constructor(length: number | Coordinate[], theta: number = NaN) {
    if (length instanceof Array) {
      const diff = length[1].copy().substract(length[0]);
      if (diff.x === 0) {
        this.length = diff.y;
      } else if (diff.y === 0) {
        this.length = diff.x;
      } else {
        this.length = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
      }
      if (isNaN(theta)) {
        this.theta = Math.atan2(diff.y, diff.x);
      } else {
        this.theta = theta;
      }
    } else {
      this.length = length;
      if (isNaN(theta)) {
        this.theta = 0;
      } else {
        this.theta = theta;
      }
    }
    this.length = Math.abs(this.length);
  }
  public length: number;
  public theta: number;
  public apply(coordinate: Coordinate): Coordinate {
    return coordinate.copy().add([Math.cos(this.theta) * this.length, Math.sin(this.theta) * this.length]);
  }

  public add(vector: Vector): Vector {
    const thetaDiff = vector.theta - this.theta;
    this.length = Math.sqrt(this.length * this.length +
        vector.length * vector.length +
        2 * this.length * vector.length * Math.cos(thetaDiff));
    this.theta = this.theta + Math.atan2(vector.length * Math.sin(thetaDiff), this.length + vector.length * Math.cos(thetaDiff));
    return this;
  }

  public rotate(theta: number): Vector {
    this.theta += theta;
    return this;
  }

  public scale(ratio: number): Vector {
    this.length *= ratio;
    return this;
  }

  public copy(): Vector {
    return new Vector(this.length, this.theta);
  }

  public toString(): string {
    return '(r=' + this.length + ', ∠θ=' + this.theta + ')';
  }
}

export abstract class Sequence {
  public readonly vector: Vector;
  public readonly boundaries: {min: Coordinate, max: Coordinate};
  constructor(vector: Vector) {
    this.vector = vector;
    this.boundaries = {min: Coordinate.zero(), max: Coordinate.zero()};
  }
}

export class CoordinateSequence extends Sequence {
  constructor(private sequence: Coordinate[]) {
    super(new Vector([Coordinate.zero(), sequence.reduce((sum, move) => sum.copy().add(move))]));
    const position = Coordinate.zero();
    this.sequence.forEach(move => {
      position.add(move);
      if (position.x > this.boundaries.max.x) {
        this.boundaries.max.x = position.x;
      } else if (position.x < this.boundaries.min.x) {
        this.boundaries.min.x = position.x;
      }
      if (position.y > this.boundaries.max.y) {
        this.boundaries.max.y = position.y;
      } else if (position.y < this.boundaries.min.y) {
        this.boundaries.min.y = position.y;
      }
    });
  }

  public forEach(callbackfn: (value: Coordinate, index: number, array: Coordinate[]) => void, thisArg?: any) {
    this.sequence.forEach(callbackfn, thisArg);
  }
}

export class VectorSequence extends Sequence {
  constructor(private sequence: Vector[]) {
    super(new Vector(1, 0));
    let previous = Coordinate.zero();
    this.sequence.forEach(vector => {
      const newVector = vector.copy();
      previous = newVector.apply(previous);
    });
    const endVector = Coordinate.zero().vectorize(previous);
    if (endVector.length < 10e-10) {
      endVector.scale(0);
    }
    this.vector.scale(endVector.length);
    this.vector.rotate(endVector.theta);
    let position = Coordinate.zero();
    this.sequence.forEach(vector => {
      position = vector.apply(position);
      if (position.x > this.boundaries.max.x) {
        this.boundaries.max.x = position.x;
      } else if (position.x < this.boundaries.min.x) {
        this.boundaries.min.x = position.x;
      }
      if (position.y > this.boundaries.max.y) {
        this.boundaries.max.y = position.y;
      } else if (position.y < this.boundaries.min.y) {
        this.boundaries.min.y = position.y;
      }
    });
  }

  public forEach(callbackfn: (value: Vector, index: number, array: Vector[]) => void, thisArg?: any) {
    this.sequence.forEach(callbackfn, thisArg);
  }
}

export class MixedSequence extends Sequence {
  constructor(private sequence: (Vector|Coordinate)[]) {
    super(new Vector(1, 0));
    let position = Coordinate.zero();
    this.sequence.forEach(movement => {
      if (movement instanceof Coordinate) {
        position.add(movement);
      }
    });

    this.sequence.forEach(vector => {
      if (vector instanceof Vector) {
        position = vector.apply(position);
      }
    });
    const newVector = new Vector([Coordinate.zero(), position]);
    this.vector.scale(newVector.length);
    this.vector.rotate(newVector.theta);

    position = Coordinate.zero();
    this.sequence.forEach(movement => {
      if (movement instanceof Coordinate) {
        position.add(movement);
      } else {
        position = movement.apply(position);
      }
      if (position.x > this.boundaries.max.x) {
        this.boundaries.max.x = position.x;
      } else if (position.x < this.boundaries.min.x) {
        this.boundaries.min.x = position.x;
      }
      if (position.y > this.boundaries.max.y) {
        this.boundaries.max.y = position.y;
      } else if (position.y < this.boundaries.min.y) {
        this.boundaries.min.y = position.y;
      }
    });
  }

  public forEach(callbackfn: (value: Vector|Coordinate, index: number, array: (Vector|Coordinate)[]) => void, thisArg?: any) {
    this.sequence.forEach(callbackfn, thisArg);
  }
}

export function pointsToCoordinateSequence(sequence: number[][]): CoordinateSequence {
  return new CoordinateSequence(sequence.map(point => new Coordinate(point)));
}
