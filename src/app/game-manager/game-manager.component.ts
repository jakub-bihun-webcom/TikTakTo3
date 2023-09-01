import { Component,HostListener, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { PlayFieldComponent } from '../play-field/play-field.component';

@Component({
  selector: 'app-game-manager',
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.css']
})
export class GameManagerComponent {
  currentPlayer? : 'O'|'X';
  lastGameState? : string[][];
  isGameFinished : boolean = false;
  @ViewChild(PlayFieldComponent) playField! : PlayFieldComponent;

  ngOnInit(){
    this.gameStart();
  }
  
  gameStart(){
    console.log("Game Started");
    this.declareFirst();
    this.isGameFinished = false;
  }

  declareFirst(){
    this.currentPlayer = (Math.round(Math.random()) == 0) ? 'O' : 'X';
    console.log(`The first Move goes to ${this.currentPlayer}!`);
  }

  changeCurrentPlayer(){
    this.currentPlayer = (this.currentPlayer == 'X') ? 'O' : 'X';
    console.log(`It is ${this.currentPlayer}s turn!`);
  }

  playerActed(in_gameState : string[][]){
    if(this.isWinCondition(in_gameState)) {
      this.declareWinner();
      //this.playField.clearBoard();
    } else if (this.isTie(in_gameState)){
      this.declareTie();
    } else {
      this.lastGameState = in_gameState;
      this.changeCurrentPlayer();
    }
  }

  isWinCondition(gameState_simple : string[][]) : boolean{
    for(let playState_row of gameState_simple){
      if(         // Checks Rows
        playState_row[0] == this.currentPlayer && 
        playState_row[1] == this.currentPlayer &&
        playState_row[2] == this.currentPlayer  
        ) return true;

      else if(    // Checks Diagonal
        gameState_simple[0][0] == this.currentPlayer && 
        gameState_simple[1][1] == this.currentPlayer &&
        gameState_simple[2][2] == this.currentPlayer  
      ) return true; 

      else if(     // Checks Anti-Diagonal
        gameState_simple[0][2] == this.currentPlayer && 
        gameState_simple[1][1] == this.currentPlayer &&
        gameState_simple[2][0] == this.currentPlayer  
        ) return true;

      else for(var i = 0; i<=3; i++){
        if(         // Checks Cols
          gameState_simple[0][i] == this.currentPlayer && 
          gameState_simple[1][i] == this.currentPlayer &&
          gameState_simple[2][i] == this.currentPlayer
          ) return true;  
      }
    } return false;
  }


  isTie(gameState:string[][]):boolean{
    for (var row of gameState){
      for (var cell of row){
        if (cell != 'X' && cell != 'O'){
          return false;
        } 
      } 
    } return true;
  }

  declareWinner(){
    this.isGameFinished = true;
    console.log("Heyho. You won");
    setTimeout(this.playField.clearBoard, 500);
  }

  declareTie(){
    this.isGameFinished = true;
    console.log("The Match ended in a Tie!");
  }

}
