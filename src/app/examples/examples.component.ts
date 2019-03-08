import { Sequence } from 'src/app/shared/logic/logic';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamplesService } from './examples/examples.service';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {

  sequence: Sequence;

  constructor(private route: ActivatedRoute, private examples: ExamplesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sequence = this.examples.getSequence(params.get('group'), params.get('example'));
    });
  }

}
