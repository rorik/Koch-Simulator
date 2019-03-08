import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { IndexComponent } from './index/index.component';
import { ExamplesComponent } from './examples/examples.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { HistoryComponent } from './simulator/history/history.component';

/** PrimeNG */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { SlideMenuModule } from 'primeng/slidemenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';

/** Konva */

@NgModule({
  declarations: [
    AppComponent,
    DocumentationComponent,
    IndexComponent,
    ExamplesComponent,
    SimulatorComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    CheckboxModule,
    SlideMenuModule,
    PanelMenuModule,
    ButtonModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
