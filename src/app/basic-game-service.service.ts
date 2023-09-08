import { Injectable } from '@angular/core';
import { CellData } from './cell-data';
import { FormBuilder } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})

export class BasicGameServiceService {
  rows!:number;
  cols!:number;
  initialGameState : CellData[][] = [];
  formGameParams = this.formBuilder.group({
    rows : '',
    cols : '',
    winPoints : '',
    maxRounds : ''
  })
  setGameParams:any;
  constructor(public formBuilder : FormBuilder) { 
    
  }

  onSubmit(){
    this.setGameParams = this.formGameParams.value;
    console.log("Game Rules have been set");
    console.log(this.setGameParams);
  }

  isWinCondition(gameState : CellData[][], currentPlayer:CellData['cellState']):boolean{
    console.log("BASIC WIN HIT");
    return false;
  }

  isTie(gameState:CellData[][]):boolean{
    console.log("BASIC TIE HIT");
    return false;
  }
}
