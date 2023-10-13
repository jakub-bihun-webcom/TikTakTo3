import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { PlayFieldComponent } from '../play-field/play-field.component';
import { CellData } from '../../interfaces/cell-data';
import { LogicTTTClassicService } from '../../services/logic-tttclassic.service';
import { BasicGameServiceService } from '../../services/basic-game-service.service';
import { GameModeData } from '../../interfaces/game-mode-data';
import { TTTBeggarService } from '../../services/tttbeggar.service';
import { TTTBargainService } from '../../services/tttbargain.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { StrikeData } from 'src/app/interfaces/strike-data';

@Component({
  selector: 'app-game-manager',
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.css'],
  animations:[
    trigger('isPopUp', [
      state('Display', 
        style({opacity: 1.0, transform: 'translateY(0)', pointerEvents: 'auto'})
      ),
      state('noDisplay', 
        style({opacity: 0.0, transform: 'translateY(100%)', pointerEvents: 'none'})
      ),
      transition('noDisplay => Display', [
        animate('0.3s')
      ]), 
      transition('Display => noDisplay', [
        animate('0.3s')
      ])
    ]),

    trigger('shoveUp', [
      state('shoved', 
        style({opacity: 1, top:'5%'})
      ),
      state('none', 
        style({opacity: 1})
      ),
      transition('* => *', [
        animate('0.2s')
      ]), 
      
    ]),

    trigger('blendIn', [
      state('blended', 
        style({opacity: 1, transform:'translateY(5%)'})
      ),
      transition('* => blended', [
        animate('0.2s')
      ]), 
    ]),

    trigger('awardPoint', [
      state('standBy', 
        style({opacity: 0.0, scale:1})
      ),
      state('pulsing', 
        style({opacity: 0, scale: 8})
      ),
      transition('standBy => pulsing', [
        animate('1s', keyframes([
          style({ opacity: 1.0, scale: 0.5,  offset: 0 }),
          style({ opacity: 0.8, scale: 6,  offset: 0.3 }),
          style({ opacity: 0.0, scale: 10, offset: 1 })])) 
      ])
    ]),

    trigger('strike', [
      state('active', 
        style({opacity: 1, width:'{{widthOfStrike}}px', top:'calc({{originTop}}px - 2%)', left:'{{originLeft}}px',
               transform:'rotate({{strikeAngle}}deg)'}),
        {params:{widthOfStrike : 500, originTop : 400, originLeft:400, strikeAngle:0}}),
      
      transition('void => active',[
        animate('0.16s ease-out', keyframes([
          style({opacity: 0, width:'0', top:'calc({{originTop}}px - 2%)', left:'{{originLeft}}px',
                transform:'rotate({{strikeAngle}}deg)', offset:0}),
          style({opacity: 1, width:'{{widthOfStrike}}px', offset:1})])
        )
      ], {params:{widthOfStrike : 500, originTop : 400, originLeft:400, strikeAngle:0}})
    ]),
  ]

})

export class GameManagerComponent {
  Object = Object;

  currentPlayer? : 'O'|'X';
  currentGame?   : GameModeData | undefined;
  selectedGame!  : GameModeData | undefined;

  @Output() selectedGameChange = new EventEmitter<GameModeData>();

  //TODO: Service for extracting a from of rules out of an array of params in gamelogic
  settingRules   : boolean = false; 
  player_O = 0;
  player_X = 0;
  isLoaded = false;
  isGameFinished : boolean = false;

  //TODO: Get this into a Service
  allGameModes : GameModeData[] = [
    {displayName : "Classic TikTakToe",
     gameLogic   : inject(LogicTTTClassicService)},
    {displayName : "Beggar TikTakToe",
     gameLogic   : inject(TTTBeggarService)},
    {displayName : "Bargain TikTakToe",
     gameLogic   : inject(TTTBargainService)},
  ]

  @ViewChild(PlayFieldComponent) playField! : PlayFieldComponent;
  //TODO: Save keys of currentgame rules locally to iterate on ngFor

  isPopUp  = false;
  isShoved = false;
  setPulseO = false;
  setPulseX = false;
  hasStrikeThrough : StrikeData|undefined = undefined;

  //TODO: Interface for popup data 
  popUpData : string = "Test MAssage";

  constructor(){
  }

  ngOnInit(){
    //this.gameStart();
  }
  
  selectGameMode(value:string, ruleMenu : boolean){
    for(let mode of this.allGameModes){
      if(mode.displayName === value){
        this.selectedGame = mode;
      }
    }

    this.settingRules = ruleMenu;
  }

  setRules(){
    if(this.currentGame !== undefined){
      this.currentGame.gameLogic.resetGame();
      this.playField.clearAllCells();}

    this.currentGame = this.selectedGame;
    this.currentGame!.gameLogic.onSubmit();
    this.currentGame!.gameLogic.resetGame();
    if(this.playField !== undefined){
      this.playField.loadGame(true);}
    /* for(let key of Object.keys(this.selectedGame!.gameLogic.formGameParams.controls)){
      console.log(key); */
    
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


  handleVerdict(verdict: ['O'|'X'|' '|'Tie', StrikeData?]){
    this.awardPoint(verdict);

    if(verdict[1]||verdict[0]=='Tie'){
      setTimeout(()=> {
      if(this.currentGame?.gameLogic.isWinMatch(this.player_O,this.player_X)===undefined){
        this.playField.clearAllCells();
        this.currentGame!.gameLogic.advanceRound();
      } 
      else{
        this.declareWinner(this.currentGame?.gameLogic.isWinMatch(this.player_O,this.player_X)!)
      }
      }, 1050)
    }
  }

  awardPoint(awardTo: ['O'|'X'|' '|'Tie', StrikeData?]){
    if(awardTo[0] === 'O'){
      this.playField.canAct = false;
      this.hasStrikeThrough = awardTo[1];
      setTimeout(()=> {
        this.hasStrikeThrough = undefined;
        this.sendPulse('O');
        this.player_O ++;
      }, 1000)
      
    } 
    if(awardTo[0] === 'X'){
      this.playField.canAct = false;
      this.hasStrikeThrough = awardTo[1];
      setTimeout(()=> {
        this.hasStrikeThrough = undefined;
        this.sendPulse('X');
        this.player_X ++;
      }, 1000)
    }

    if(awardTo[0] === ' '){
      if(awardTo[1]){
        this.playField.canAct = false;
        this.hasStrikeThrough = awardTo[1];
        setTimeout(()=> {
          this.hasStrikeThrough = undefined;
        }, 1000)
      };
    }
  }

  declareWinner(winner : 'O'|'X'|' '|'Tie'){
    if(winner == 'O' || winner == 'X'){
      this.popUpData = `Oh Jolly! ${winner} won!`;
      console.log(`Oh Jolly! ${winner} won`);
    }
    if(winner == ' '||winner=='Tie'){
      this.popUpData = `The game ended in a Tie`;
      console.log("No winner")
    }
    this.isPopUp = true;
  }

  dismissPopUp(){
    this.isGameFinished = true;
    this.currentGame!.gameLogic.resetGame();
    this.player_O = 0;
    this.player_X = 0;
    this.playField.clearAllCells();
    this.playField.loadGame(true);
    this.isPopUp = false;
    this.hasStrikeThrough = undefined;
  }

  setShoved(value:true){
    setTimeout(()=> {
      this.isShoved = value;
    }, 50)
  }

  sendPulse(player:'O'|'X'){
    if(player == 'O'){
      this.setPulseO = true;
      setTimeout(()=> {
        this.setPulseO = false;
      }, 1000)
    } else {
      this.setPulseX = true;
      setTimeout(()=> {
        this.setPulseX = false;
      }, 1000)
    }
  }

}
