import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulatorComponent } from './simulator/simulator.component';
import { ExamplesComponent } from './examples/examples.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: 'simulator', component: SimulatorComponent },
  { path: 'examples/:group/:example', component: ExamplesComponent },
  { path: 'documentation/:group/:section', component: DocumentationComponent },
  { path: '**', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
