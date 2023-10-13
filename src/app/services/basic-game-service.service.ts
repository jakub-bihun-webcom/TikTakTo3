import { Injectable } from '@angular/core';
import { CellData } from '../interfaces/cell-data';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { PlayCellComponent } from '../components/play-cell/play-cell.component';
import { StrikeData } from '../interfaces/strike-data';
import { first } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class BasicGameServiceService {
  currentRound   : number = 1;
  currentPlayer? : 'O' | 'X';
  gameNav        : string = "Start";
  gameSpecificVariables : any = [];
  initialGameState : CellData[][] = [];

  formGameParams : FormGroup = new FormGroup ({
    rowsXcols    : new FormControl(3),
    winPoints    : new FormControl(3),
    maxRounds    : new FormControl(3),
    roundOrder   : new FormControl<string>("Random"),
    inLine       : new FormControl(3)
  })

  snapshot = this.formGameParams.getRawValue();
  moveOrderTypes = [];
  setGameParams:any;

  constructor() { 
    this.formGameParams.get('rowsXcols')?.valueChanges.subscribe()
    this.formGameParams.addValidators([this.createWinConValidator(), this.createWinLineValidator()])
  }

  //-----------------------------------DATA & FORM HANDLING----------------------------------------
  snapshotFormGameParams(){
    this.snapshot = this.formGameParams.getRawValue(); 
  }

  onSubmit(){
    this.setGameParams = this.formGameParams.value;
    this.snapshotFormGameParams();
  }


  setBoard(){
    this.initialGameState = [];
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
  }

  resetGame(){
    this.currentRound = 1;
    this.currentPlayer = undefined;
    this.setBoard();
    this.currentPlayer = this.determineNextFirst();
  }

  //TODO: This shouldnt be here. But how else...
  navBoard(increment:number){

  }

  //-----------------------------------WIN & MATCH CONDITIONS----------------------------------------
  isWinCondition(gameState : CellData[][]) : ['O'|'X'|' '|'Tie', StrikeData?]{
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
                    this.getStrikeThroughData(player, gameState[r][c+l]);
                    return [player.cellState, this.getStrikeThroughData(player, gameState[r][c+l])]}
                } else continue;
              }
            }

            if (r + (LINE-1) < HEIGHT){            // COLS
              let lineIAR = 0;
              for(let l=0; l<LINE;l++){
                if(player.cellState == gameState[r+l][c].cellState){
                    lineIAR++;
                    if(lineIAR >= LINE){
                      this.getStrikeThroughData(player, gameState[r+l][c]);
                      return [player.cellState, this.getStrikeThroughData(player, gameState[r+l][c])]}
                } else continue;
              }
            }
                
            if (r + (LINE-1) < HEIGHT) {              //DIAGONAL
                if (c + (LINE-1) < WIDTH){
                  let lineIAR = 0;
                  for(let l=0; l<LINE;l++){
                    if(player.cellState == gameState[r+l][c+l].cellState){
                      lineIAR++;
                      if(lineIAR >= LINE){
                        this.getStrikeThroughData(player, gameState[r+l][c+l]);
                        return [player.cellState, this.getStrikeThroughData(player, gameState[r+l][c+l])]}
                    } else continue;
                  }
                }
                if (c - (LINE-1) >= 0){               //ANTI DIAGONAL
                  let lineIAR = 0;
                  for(let l=0; l<LINE;l++){
                    if(player.cellState == gameState[r+l][c-l].cellState){
                      lineIAR++;
                      if(lineIAR >= LINE){
                        this.getStrikeThroughData(player, gameState[r+l][c-l]);
                        return [player.cellState, this.getStrikeThroughData(player, gameState[r+l][c-l])]}
                    } else continue;
                  }
                }
            }
        }
    }
    for (var row of gameState){
      for (var cell of row){
        if (cell.cellState != 'X' && cell.cellState != 'O'){
          return [' ']; } 
      } 
    } 
    return ['Tie']; // no winner found
  }

  getStrikeThroughData(firstCell : CellData, lastCell: CellData) : StrikeData{
    let firstCenter = [(firstCell.cellRef?.getBoundingClientRect().top! + 
                       firstCell.cellRef?.getBoundingClientRect().bottom!) / 2,
                       (firstCell.cellRef?.getBoundingClientRect().left! + 
                       firstCell.cellRef?.getBoundingClientRect().right!) / 2 
                      ];
    let lastCenter  = [(lastCell.cellRef?.getBoundingClientRect().top! + 
                        lastCell.cellRef?.getBoundingClientRect().bottom!) / 2,
                       (lastCell.cellRef?.getBoundingClientRect().left! + 
                        lastCell.cellRef?.getBoundingClientRect().right!) / 2 
                      ];

    let strikeWidth = Math.hypot(firstCenter[0]-lastCenter[0], firstCenter[1]-lastCenter[1]);
    let strikeAngleDeg = Math.atan2(lastCenter[0]-firstCenter[0], lastCenter[1] -firstCenter[1]) * 180 / Math.PI;

    //Radians
    //console.log(strikeAngle, strikeAngle*180/Math.PI);
    //Degrees
    //console.log(strikeAngle*180/Math.PI);

    let strike : StrikeData = {
      originTop     : firstCenter[0],
      originLeft    : firstCenter[1],
      strikeWidth   : strikeWidth,
      strikeAngle   : strikeAngleDeg 
    } 
    return strike;

  }

  isWinMatch(scoreO:number, scoreX:number):'O'|'X'|'Tie'|undefined{
    if(this.formGameParams.get("maxRounds")!.value! >= 2){
      if(scoreO > (this.formGameParams.get("maxRounds")!.value! / 2)){
        return 'O';} 
      else if (scoreX > (this.formGameParams.get("maxRounds")!.value! / 2)) {
        return 'X';}
    }
    else if(this.formGameParams.get("winPoints")!.value! >= 1){
      if(scoreO >= this.formGameParams.get("winPoints")!.value!){
        return 'O';} 
      else if(scoreX >= this.formGameParams.get("winPoints")!.value!) {
        return 'X';}
    }
    if (this.isNextRound()===false){
      if(scoreX>scoreO){
        return 'X';
      } else if (scoreX<scoreO){
        return 'O'
      } else {
        console.log("Tie")
        return 'Tie'}
    }
    return undefined;
  }

  isNextRound():boolean{
    if(this.currentRound === this.formGameParams.get("maxRounds")!.value){
      return false
    } else return true;
  }

  advanceRound(){
    this.currentRound ++;
  }

//-----------------------------------GAME FLOW----------------------------------------
  clickCell(cell : PlayCellComponent){
    cell.cellData.cellState = this.currentPlayer!;
    this.passTurn();
  }

  passTurn(){
    this.currentPlayer = (this.currentPlayer == 'X') ? 'O' : 'X';
  }


  determineNextFirst(winner?:'O' | 'X'):'O'|'X'{
    if(this.currentPlayer === undefined){
      let nextPlayer : 'O' | 'X' = (Math.round(Math.random()) === 0) ? 'O' : 'X';
        return nextPlayer;
    } else {
      switch(this.setGameParams.get("roundOrder")!.value){
        case "Random":
          let nextPlayer : 'O' | 'X' = (Math.round(Math.random()) === 0) ? 'O' : 'X';
          return nextPlayer;

        case "Winner":
          if(winner !== undefined){
            return winner;
          } 
          else {
            let nextPlayer : 'O' | 'X' = (Math.round(Math.random()) === 0) ? 'O' : 'X';
            return nextPlayer;
          }

        case "Loser":
          if(winner !== undefined){
            if (winner === 'O') return 'X';
            else return 'O';
          }
          else {
            let nextPlayer : 'O' | 'X' = (Math.round(Math.random()) === 0) ? 'O' : 'X';
            return nextPlayer;
          }
          
        case "Alternating":
          if (this.currentPlayer === 'O'){
            return 'X' 
          } 
          else return 'O'
      }
    }
    console.log("Came to end of Determine Next First")
    return 'O'
  }

//----------------------------VALIDATORS TODO: MOVE THIS SEPERATE----------------------------------------
  createWinConValidator(): ValidatorFn{
    return (control:AbstractControl) : ValidationErrors | null => {
      let score  = control.get('winPoints');
      let rounds = control.get('maxRounds');
      if(score && rounds){
        let hasScoreSet  = score.value >= 1;
        let hasRoundsSet = rounds.value >= 2;
        let winConValid = hasScoreSet == true || hasRoundsSet == true;
        //console.log(winConValid, hasScoreSet, hasRoundsSet);
        return !winConValid ? {winCon:"No WinCon is set"}:null;
      }
      //console.log("heyho does not Wincon");
      return {winCon:false}
    }
  }
  // TODO: Match logic of games to work with line
  createWinLineValidator(): ValidatorFn{
    return (control:AbstractControl) : ValidationErrors | null => {
      let size  = control.get('rowsXcols');
      let line  = control.get('inLine');
      if(size && line){
        let winConValid = size.value >= line.value && line.value >= 3
        //console.log(winConValid, size.value, line.value);
        return !winConValid ? {winCon:"No WinCon is set"}:null;
      }
      return {winCon:false}
    }
  }


}
