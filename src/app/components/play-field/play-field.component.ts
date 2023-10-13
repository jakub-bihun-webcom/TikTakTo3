import { Input, Component, Output, EventEmitter, ViewChildren, QueryList, OnInit, ElementRef, ViewContainerRef} from '@angular/core';
import { PlayCellComponent } from '../play-cell/play-cell.component';
import { CellData } from '../../interfaces/cell-data';
import { LogicTTTClassicService } from '../../services/logic-tttclassic.service';
import { BasicGameServiceService } from '../../services/basic-game-service.service';
import { StrikeData } from 'src/app/interfaces/strike-data';

@Component({
  selector: 'app-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css'],
  providers: [LogicTTTClassicService]
})


export class PlayFieldComponent{
  gameState : CellData[][] = [];
  canAct    : boolean      = true;
  isLoaded  : boolean      = false;
  @Input () gameLogic : BasicGameServiceService | undefined;
  @Output() sendVerdict = new EventEmitter<['O'|'X'|' '|'Tie', StrikeData?]>();
  @ViewChildren(PlayCellComponent) allCells! : QueryList<PlayCellComponent>;

  ngOnInit(){
    this.loadGame(true);
  }

  loadGame(state:boolean){
    if(state === true){
      if(this.gameLogic!==undefined){
      this.gameState = this.gameLogic!.initialGameState;
      this.isLoaded = true;
      }
    } else if (state === false){
      this.gameState = [];
      this.isLoaded = false;
    }
  }

  // -- GAME FLOW -- // TODO: Technically you could do this with in logic
  evaluateGameState(){
    if(this.gameLogic){
      switch(this.gameLogic.isWinCondition(this.gameLogic.initialGameState)[0]){
        case 'O':{
          console.log("hasWinO");
          this.sendVerdict.emit(this.gameLogic.isWinCondition(this.gameLogic.initialGameState));
          break
        }
        case 'X':{
          console.log("hasWinX");
          this.sendVerdict.emit(this.gameLogic.isWinCondition(this.gameLogic.initialGameState));
          break
        }
        case ' ':{
          this.sendVerdict.emit(this.gameLogic.isWinCondition(this.gameLogic.initialGameState));
          break
        }
        case 'Tie':{
          console.log("hasTie");
          this.sendVerdict.emit(['Tie']);
          break
        }
      }
    }
  }

  // -- CELL BEHAVIOUR -- // 
  markCellClicked(cell:PlayCellComponent){
    if(this.canAct === true) {
      if(this.gameLogic){
        this.gameLogic.clickCell(cell);
        this.evaluateGameState();}
    }
  }

  clearCell(cell:PlayCellComponent){
    cell.cellData.cellState = ' ';
  }

  clearAllCells(){
    let j = 0;
    for(let i = 0; i < this.allCells.length ; i++){
      if(this.allCells.get(i)?.cellData.cellState !== ' '){
        setTimeout(this.clearCell, 100*j, this.allCells.get(i));
        j++;}
      if(i==this.allCells.length-1){
        setTimeout(():void => {
        this.canAct = true;
        }, 200*1*j);
      }
    }
     
  }

}
