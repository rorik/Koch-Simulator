import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Coordinate } from 'src/app/shared/logic/logic';
import { Layer } from 'src/app/shared/konva';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  @Input() public data: HistoryElement;
  @Output() onSelected: EventEmitter<HistoryElement> = new EventEmitter<HistoryElement>();
  @Output() onToggleHidden: EventEmitter<HistoryElement> = new EventEmitter<HistoryElement>();
  @Output() onDelete: EventEmitter<HistoryElement> = new EventEmitter<HistoryElement>();

  constructor() {}

  public selected() {
    this.onSelected.emit(this.data);
  }

  public toggleHidden() {
    this.data.setVisible();
    this.onToggleHidden.emit(this.data);
  }

  public delete() {
    this.onDelete.emit(this.data);
  }

}

export class HistoryElement {
  public enabled: boolean = true;
  public hidden: boolean = false;
  constructor(
    public readonly iteration: number,
    public readonly image: string,
    public readonly path: Coordinate[],
    public readonly layer: Layer
  ) {}

  public setVisible(visible: boolean = this.hidden) {
    console.log('setVisible ' + visible)
    this.hidden = !visible;
    if (visible) {
      this.layer.show();
    } else {
      this.layer.hide();
    }
  }
}
