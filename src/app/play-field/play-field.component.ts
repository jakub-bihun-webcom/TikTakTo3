import { Input, Component, Output, EventEmitter, ViewChildren, QueryList, OnInit} from '@angular/core';
import { PlayCellComponent } from '../play-cell/play-cell.component';
import { CellData } from '../cell-data';
import { LogicTTTClassicService } from '../logic-tttclassic.service';
import { BasicGameServiceService } from '../basic-game-service.service';

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
  @Input() currentPlayer? : 'O'|'X';
  @Output() sendVerdict = new EventEmitter<CellData['cellState']>();

  @ViewChildren(PlayCellComponent) allCells! : QueryList<PlayCellComponent>;

  constructor(){
                         
  }

  ngOnInit(){
    this.loadGame();
  }

  loadGame(){
    this.gameState = this.gameLogic!.initialGameState;
    this.isLoaded = true;
  }

  // -- GAME FLOW -- // TODO: Technically you could do this with an Interface
  updateGameState(){
    if(this.gameLogic !== undefined){
      console.log(this.gameLogic.initialGameState)
      if(this.gameLogic.isWinCondition(this.gameState, this.currentPlayer!)){
        this.sendVerdict.emit(this.currentPlayer);
      } else if (this.gameLogic.isTie(this.gameState)){
        this.sendVerdict.emit(' ');
      } else this.changeCurrentPlayer();
    } 
  };

  changeCurrentPlayer(){
    this.currentPlayer = (this.currentPlayer == 'X') ? 'O' : 'X';
    console.log(`It is ${this.currentPlayer}s turn!`);
  }


  // -- CELL BEHAVIOUR -- // 
  markCell(cell:PlayCellComponent){
    if(this.canAct == true) {
      cell.cellData.cellState = this.currentPlayer!;
      this.updateGameState();
    }
  }

  clearCell(cell:PlayCellComponent){
    cell.cellData.cellState = ' ';
  }

  // TODO: Raising Flag is kinda cumbersome. Easier way?
  clearAllCells(){
    this.canAct = false;
    setTimeout(():void => {
      this.canAct = true;
    }, 200*this.allCells.length-1);
    for(let i = 0; i < this.allCells.length ; i++){
      setTimeout(this.clearCell, 200*i, this.allCells.get(i));
    } 
  }

}
