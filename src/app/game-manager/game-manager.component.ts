import { Component,HostListener, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { PlayFieldComponent } from '../play-field/play-field.component';
import { CellData } from '../cell-data';
import { LogicTTTClassicService } from '../logic-tttclassic.service';
import { BasicGameServiceService } from '../basic-game-service.service';
import { GameModeData } from '../game-mode-data';
import { TTTBeggarService } from '../tttbeggar.service';
import { TTTBargainService } from '../tttbargain.service';

@Component({
  selector: 'app-game-manager',
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.css']
})

export class GameManagerComponent {
  currentPlayer? : 'O'|'X';
  currentGame!   : GameModeData | undefined;
  //TODO: Service for extracting a from of rules out of an array of params in gamelogic
  settingRules   : boolean = false; 
  player_O = 0;
  player_X = 0;
  isLoaded = false;
  isGameFinished : boolean = false;

  //TODO: Get this into a Service
  allGameModes : GameModeData[] = [
    {displayName : "Classic TikTakToe",
     gameLogic   : new LogicTTTClassicService},
    {displayName : "Beggar's TikTakToe",
     gameLogic   : new TTTBeggarService},
    {displayName : "Bargain TikTakToe",
     gameLogic   : new TTTBargainService},
  ]

  @ViewChild(PlayFieldComponent) playField! : PlayFieldComponent;


  ngOnInit(){
    this.gameStart();
  }
  
  selectGameMode(value:string){
    for(let mode of this.allGameModes){
      if(mode.displayName === value){
        this.currentGame = mode;
        console.log("Selected")
      }
    }

    this.settingRules = true;
  }

  setRules(){
    this.currentGame!.gameLogic.onSubmit();
    this.settingRules = false;
  }

  gameStart(){
    console.log("Game Started");
    this.declareFirst();
    this.isGameFinished = false;
  }

  gameReset(){

  }

  declareFirst(){
    this.currentPlayer = (Math.round(Math.random()) == 0) ? 'O' : 'X';
    console.log(`The first Move goes to ${this.currentPlayer}!`);
  }


  handleVerdict(verdict: CellData['cellState']){
    if(verdict === 'O') this.player_O ++;
    if(verdict === 'X') this.player_X ++;

    this.playField.clearAllCells();
    console.log("Game Finished")
    
  }

  declareWinner(){
    this.isGameFinished = true;
    console.log("Heyho. You won");
    //setTimeout(this.playField.clearBoard, 500);
  }

  declareTie(){
    this.isGameFinished = true;
    console.log("The Match ended in a Tie!");
  }

}
