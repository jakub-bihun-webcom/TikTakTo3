import { Component, EventEmitter, HostListener, Input, Output, AfterViewInit } from '@angular/core';
import { CellData } from '../cell-data';

@Component({
  selector: 'app-play-cell',
  templateUrl: './play-cell.component.html',
  styleUrls: ['./play-cell.component.css']
})



export class PlayCellComponent implements AfterViewInit{
  
  @Input() cellData! : CellData;
  @Output() wasClicked = new EventEmitter<PlayCellComponent>();
  @HostListener("click") markCell(){
    if(this.cellData.cellState == ' '){
      this.wasClicked.emit(this);
    };
  }
  
  ngAfterViewInit(){
    this.cellData.cellRef = this;
  }
}
