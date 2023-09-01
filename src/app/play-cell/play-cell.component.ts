import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CellData } from '../cell-data';

@Component({
  selector: 'app-play-cell',
  templateUrl: './play-cell.component.html',
  styleUrls: ['./play-cell.component.css']
})



export class PlayCellComponent{
  //TODO: Pretty sure the GameState updates on its own. Not sure if Output necessary here
  imageID?:string;
  @Input() cellData! : CellData;
  @Input() currentPlayer? : 'O' | 'X';
  @Output() changeInCellData = new EventEmitter<CellData>();

  @HostListener("click") markCell(){
    if(this.designateCell(this.currentPlayer!)){
      this.changeInCellData.emit(this.cellData);
    };
  }

  designateCell(owner:'O'|'X') : boolean{
    if(this.cellData.cellState == 'none'){
      this.cellData.cellState = owner;
      this.imageID = owner;
      return true;
    } else return false;
    
  }
  
  clearSelf(){
    this.cellData.cellState = 'none';
    this.imageID = 'none';
    this.changeInCellData.emit(this.cellData);
  }
}
