import { Coordinate, Vector } from './logic';

describe('Logic.Coordinate', () => {
  it('should create an instance', () => {
    expect(Coordinate.zero()).toBeTruthy();
  });
});

describe('Logic.Vector', () => {
  it('should create an instance', () => {
    expect(new Vector(0, 0)).toBeTruthy();
  });
});
