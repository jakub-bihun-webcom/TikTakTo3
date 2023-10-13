import { Component, EventEmitter, HostListener, Input, Output, AfterViewInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CellData } from '../../interfaces/cell-data';
import { PlayFieldComponent } from '../play-field/play-field.component';

@Component({
  selector: 'app-play-cell',
  templateUrl: './play-cell.component.html',
  styleUrls: ['./play-cell.component.css']
})



export class PlayCellComponent implements AfterViewChecked{
  
  @Input() cellData! : CellData;
  @Output() wasClicked = new EventEmitter<PlayCellComponent>();

  @ViewChild('cell') cell!: Element;

  @HostListener("click") markCell(){
    if(this.cellData.cellState == ' '){
      this.wasClicked.emit(this);
    };
  }
  //TODO: Either make the Bid into an interface or make the cell dumb
  additionalProperties = [];
  setBid  : boolean  = false;
  maxBid  : number = 0;
  minBid  : number = 0;
  

  ngAfterViewChecked(){
    this.cellData.cellRef = document.getElementById(`${this.cellData.cellID}`);
  }

  clampBid(ele:HTMLInputElement, valueStr : string){
    let value : number = parseInt(valueStr); 
    console.log(value);
    if(value > this.maxBid) ele.value = String(this.maxBid);
    else if (value < this.minBid) ele.value = String(0);
  }
}
