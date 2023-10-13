import { Injectable } from '@angular/core';
import { BasicGameServiceService } from './basic-game-service.service';
import { FormGroup, FormControl} from '@angular/forms';
import { CellData } from '../interfaces/cell-data';
import { PlayCellComponent } from '../components/play-cell/play-cell.component';
import { StrikeData } from '../interfaces/strike-data';

@Injectable({
  providedIn: 'root'
})
export class TTTBeggarService extends BasicGameServiceService{

  override formGameParams : FormGroup = new FormGroup ({
    rowsXcols    : new FormControl(3),
    maxRounds    : new FormControl(3),
    inLine       : new FormControl(3)
  })
  override snapshot = this.formGameParams.getRawValue();

  activeBoards?      : CellData[][][];
  currentBoardIndex? : number;
  override gameSpecificVariables: any[] = [
    this.activeBoards       = [],
    this.currentBoardIndex  = 0
  ];

  constructor() { 
    super()
  }

  override setBoard(){
    this.initialGameState = [];
    for(var b=0; b<this.formGameParams.get("maxRounds")!.value!; b++ ){
      for(var j=0; j < this.formGameParams.get("rowsXcols")!.value!; j++){
        var gameState_row: CellData[] = [];
        for(var i=0; i < this.formGameParams.get("rowsXcols")!.value!; i++){
          const cellData : CellData = {
            cellRef  : null,
            cellID   : (j*this.formGameParams.get('rowsXcols')!.value!)+i,
            cellState: ' '}
          gameState_row.push(cellData);
        }
        this.initialGameState.push(gameState_row);
      }
      this.gameSpecificVariables[0].push(this.initialGameState);
      this.initialGameState = [];
    }
    this.initialGameState = this.gameSpecificVariables[0][0];
  }

  override resetGame(){
    this.gameSpecificVariables[0] = [];
    this.gameSpecificVariables[1] = 0;
    this.currentRound = 1;
    this.currentPlayer = undefined;
    this.setBoard();
    this.currentPlayer = this.determineNextFirst();
  }

  override navBoard(increment: number): void {
    if(this.gameSpecificVariables[0][this.gameSpecificVariables[1]+increment]){
      this.gameSpecificVariables[1]+=increment;
      this.initialGameState = this.gameSpecificVariables[0][this.gameSpecificVariables[1]];
      console.log(this.initialGameState, "Iterated")
    } else if(increment == -1){
      this.gameSpecificVariables[1] = this.gameSpecificVariables[0].length - 1;
      this.initialGameState = this.gameSpecificVariables[0][this.gameSpecificVariables[1]];
      console.log(this.initialGameState, "-1 loop")
    } else if(increment ==  1){
      this.gameSpecificVariables[1] = 0;
      this.initialGameState = this.gameSpecificVariables[0][this.gameSpecificVariables[1]]
      console.log(this.initialGameState, "+1 loop")
    }
  }
  
  removeBoard(index:number){
    this.gameSpecificVariables[0].splice(index,1);
    this.gameSpecificVariables[1] = 0;
    this.initialGameState = this.gameSpecificVariables[0][this.gameSpecificVariables[1]]
    console.log("set 0")
  }

  override clickCell(cell: PlayCellComponent): void {
    cell.cellData.cellState = 'X';
    this.passTurn();
  }

  //TODO: This gets called twice somewhere
  override isWinCondition(gameState : CellData[][]) : ['O'|'X'|' '|'Tie', StrikeData?]{
    let HEIGHT     = gameState.length
    let WIDTH      = gameState[0].length
    let LINE       = (Object.keys(this.formGameParams.controls).includes('inLine')) ?
                      this.formGameParams.get('inLine')!.value! : 3;
    let EMPTY_SLOT = ' ';
    for (let r = 0; r < HEIGHT; r++) {            // iterate rows, bottom to top
        for (let c = 0; c < WIDTH; c++) {         // iterate columns, left to right
            let player = gameState[r][c];
            if (player.cellState == EMPTY_SLOT)
                continue;                         // don't check empty cells

            if (c + (LINE-1) < WIDTH){            // ROWS
              let lineIAR = 0;
              for(let l=0; l<LINE;l++){
                if(player.cellState === gameState[r][c+l].cellState){
                    lineIAR++;
                  if(lineIAR >= LINE){
                    return [' ', this.getStrikeThroughData(player, gameState[r][c+l])]}
                } else continue;
              }
            }

            if (r + (LINE-1) < HEIGHT){            // COLS
              let lineIAR = 0;
              for(let l=0; l<LINE;l++){
                if(player.cellState == gameState[r+l][c].cellState){
                    lineIAR++;
                  if(lineIAR >= LINE){
                    return [' ', this.getStrikeThroughData(player, gameState[r+l][c])]} 
                } else continue;
              }
            }
                
            if (r + (LINE-1) < HEIGHT) {              //DIAGONAL
                if (c + (LINE-1) < WIDTH){
                  let lineIAR = 0;
                  for(let l=0; l<LINE;l++){
                    if(player.cellState == gameState[r+l][c+l].cellState){
                      lineIAR++;
                    if(lineIAR >= LINE) {
                      return [' ', this.getStrikeThroughData(player, gameState[r+l][c+l])]}
                    } else continue;
                  }
                }
                if (c - (LINE-1) >= 0){               //ANTI DIAGONAL
                  let lineIAR = 0;
                  for(let l=0; l<LINE;l++){
                    if(player.cellState == gameState[r+l][c-l].cellState){
                      lineIAR++;
                    if(lineIAR >= LINE) {
                      return [' ', this.getStrikeThroughData(player, gameState[r+l][c-l])]}
                    } else continue;
                  }
                }
            }
        }
    } 
    return [' ']; // no winner found
  }

  override isWinMatch(scoreO:number, scoreX:number):'O'|'X'|undefined{
    if(this.formGameParams.get("maxRounds")!.value! == this.currentRound){
      if(this.currentPlayer == 'X') return 'O'
      else return 'X'
    }
    console.log("Board has been terminated")
    return undefined;
  }

  override advanceRound(): void {
    this.removeBoard(this.gameSpecificVariables[1]);
    this.currentRound ++;
  }
}
