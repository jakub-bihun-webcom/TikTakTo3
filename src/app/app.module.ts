import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayFieldComponent } from './components/play-field/play-field.component';
import { PlayCellComponent } from './components/play-cell/play-cell.component';
import { GameManagerComponent } from './components/game-manager/game-manager.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { TypeofPipe } from './pipes/typeof.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlayFieldComponent,
    PlayCellComponent,
    GameManagerComponent,
    TypeofPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
