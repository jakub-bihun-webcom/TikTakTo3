import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayFieldComponent } from './play-field/play-field.component';
import { PlayCellComponent } from './play-cell/play-cell.component';
import { GameManagerComponent } from './game-manager/game-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayFieldComponent,
    PlayCellComponent,
    GameManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
