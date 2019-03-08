import { ExamplesService } from './examples/examples/examples.service';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'koch-simulator';
  items: MenuItem[] = [
    { label: 'Home', icon: 'fas fa-home', routerLink: ['/index'], routerLinkActiveOptions: { exact: true } },
    { label: 'Simulator', icon: 'fas fa-pencil-alt', routerLink: ['/simulator'], routerLinkActiveOptions: { exact: true } },
    {
      label: 'Examples',
      icon: 'fas fa-bookmark',
      items: [
        {
          label: 'Quadratic',
          icon: 'fas fa-vector-square',
          items: [
            { label: 'Type 1', routerLink: ['/examples', 'quadratic', 'type1']},
            { label: 'Type 2', routerLink: ['/examples', 'quadratic', 'type2']},
            { label: 'Type 3', routerLink: ['/examples', 'quadratic', 'type3']},
            { label: 'Type 4', routerLink: ['/examples', 'quadratic', 'type4']},
            { label: 'Asymmetric 1', routerLink: ['/examples', 'quadratic', 'asymmetric1']},
            { label: 'Asymmetric 2', routerLink: ['/examples', 'quadratic', 'asymmetric2']},
            { label: 'Asymmetric 3', routerLink: ['/examples', 'quadratic', 'asymmetric3']},
            { label: 'Type 1 mirrored', routerLink: ['/examples', 'quadratic', 'type1s']},
          ]
        },
        {
          label: 'Angled',
          icon: 'fas fa-draw-polygon',
          items: [
            { label: 'Koch snowflake', routerLink: ['/examples', 'curves', 'koch']},
            { label: 'Cesàro fractal', routerLink: ['/examples', 'curves', 'cesaro']},
            { label: 'Crown', routerLink: ['/examples', 'curves', 'crown']},
          ]
        },
        {
          label: 'Polygon',
          icon: 'far fa-star',
          items: [
            { label: 'Triangle', routerLink: ['/examples', 'polygon', 'triangle']},
            { label: 'Square', routerLink: ['/examples', 'polygon', 'square']},
            { label: 'Pentagon', routerLink: ['/examples', 'polygon', 'pentagon']},
            { label: 'Hexagon', routerLink: ['/examples', 'polygon', 'hexagon']},
          ]
        },
        {
          label: 'Infinite',
          icon: 'fas fa-stroopwafel',
          items: [
            { label: 'Heart', routerLink: ['/examples', 'infinite', 'heart']},
          ]
        }
      ]
    },
    {
      label: 'Documentation',
      icon: 'fas fa-book',
      items: [
        {
          label: 'Simulator',
          icon: 'fas fa-pencil-alt',
          items: [
            { label: 'Sequence', routerLink: ['/documentation/simulator/sequence']},
            { label: 'Simulating', routerLink: ['/documentation/simulator/simulating']}
          ]
        }
      ]
    },
    {
      label: 'About',
      icon: 'fas fa-question-circle',
      items: [
        { label: 'Authors', icon: 'fas fa-user', routerLink: ['/about/authors'] },
        { label: 'Source Code', icon: 'fab fa-github', url: 'https://github.com/rorik/Koch-Simulator', target: '_blank' },
      ]
    }
  ];
  constructor(public router: Router) {}
}
