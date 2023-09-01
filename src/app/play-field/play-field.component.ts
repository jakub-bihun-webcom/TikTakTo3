import { Input, Component, ViewChild, ViewContainerRef, Output, EventEmitter, ViewChildren, QueryList, OnInit} from '@angular/core';
import { PlayCellComponent } from '../play-cell/play-cell.component';
import { CellData } from '../cell-data';

@Component({
  selector: 'app-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css']
})

export class PlayFieldComponent{
  gameState: CellData[][] = [];
  @Input() currentPlayer? : 'O'|'X';
  @Output() sendSimplifiedGameState = new EventEmitter<string[][]>();

  @ViewChildren(PlayCellComponent) allCells! : QueryList<PlayCellComponent>;

  constructor(){
    
    this.gameState = [];                                    
    for(var j=0; j <= 2; j++){
      var gameState_row: CellData[] = [];
      for(var i=1; i <= 3; i++){
        const cellData : CellData = {
          cellID : (j*3)+i,
          cellState: 'none'}
        gameState_row.push(cellData);
      }
      this.gameState.push(gameState_row);
    }
  }

  updateGameState(){
    this.toGameState_simple(this.gameState);
  }

  clearBoard(){
    for(var cell of this.allCells){
      console.log(this.allCells);
      cell.clearSelf();
    }
  }

  // TODO: I doubt this is even necessarry... 
  //       Might aswell just do it in strings, since we dont use cell index for anything
  toGameState_simple(gameState:CellData[][]){
    let gameState_simple : string[][] = [];
    for(var row of gameState){
      let gameState_simple_row:string[] = [];
      for(var cell of row){
        if(cell.cellState == 'O') gameState_simple_row.push('O');
        else if(cell.cellState == 'X') gameState_simple_row.push('X');
        else gameState_simple_row.push(' ');
        }
      gameState_simple.push(gameState_simple_row);
    }
    this.sendSimplifiedGameState.emit(gameState_simple);
  }
}
