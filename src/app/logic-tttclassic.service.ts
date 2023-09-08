import { Injectable } from '@angular/core';
import { CellData } from './cell-data';
import { BasicGameServiceService } from './basic-game-service.service';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LogicTTTClassicService extends BasicGameServiceService{
  //TODO: Have CSS Adjust Size of Cells according to This
  override rows = 3;
  override cols = 3;
  override initialGameState : CellData[][] = [];

  constructor() {
    super(new FormBuilder); 
    for(var j=0; j < this.cols!; j++){
      var gameState_row: CellData[] = [];
      for(var i=0; i < this.rows; i++){
        const cellData : CellData = {
          cellID : (j*3)+i,
          cellState: ' '}
        gameState_row.push(cellData);
      }
      this.initialGameState.push(gameState_row);
    }
  }

  override isWinCondition(gameState : CellData[][], currentPlayer:CellData['cellState']) : boolean{
    for(let playState_row of gameState){
      if(         // Checks Rows
        playState_row[0].cellState == currentPlayer && 
        playState_row[1].cellState == currentPlayer &&
        playState_row[2].cellState == currentPlayer  
        ) return true;

      else if(    // Checks Diagonal
        gameState[0][0].cellState == currentPlayer && 
        gameState[1][1].cellState == currentPlayer &&
        gameState[2][2].cellState == currentPlayer  
      ) return true; 

      else if(     // Checks Anti-Diagonal
        gameState[0][2].cellState == currentPlayer && 
        gameState[1][1].cellState == currentPlayer &&
        gameState[2][0].cellState == currentPlayer  
        ) return true;

      else for(var i = 0; i<=2; i++){
        if(         // Checks Cols
          gameState[0][i].cellState == currentPlayer && 
          gameState[1][i].cellState == currentPlayer &&
          gameState[2][i].cellState == currentPlayer
          ) return true;  
      }
    } return false;
  }


  override isTie(gameState:CellData[][]):boolean{
    for (var row of gameState){
      for (var cell of row){
        if (cell.cellState != 'X' && cell.cellState != 'O'){
          return false;
        } 
      } 
    } return true;
  }

}
