import { Injectable } from '@angular/core';
import { BasicGameServiceService } from './basic-game-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { PlayCellComponent } from '../components/play-cell/play-cell.component';
import { PlayerBid, CellData } from '../interfaces/cell-data';

@Injectable({
  providedIn: 'root'
})

export class TTTBargainService extends BasicGameServiceService{
  //Type this
  override gameNav : string = "canMove";
  selectedCell? : PlayCellComponent;
  currentBids : PlayerBid[] = [];

  override formGameParams : FormGroup = new FormGroup ({
    rowsXcols  : new FormControl(3),
    winPoints  : new FormControl(3),
    maxRounds  : new FormControl(3),
    roundOrder : new FormControl<string>("Random"),
    currency   : new FormControl(100)
  })

  override snapshot = this.formGameParams.getRawValue();
  constructor() {
    super()

  }

//-------------SETUP-----------------
  override onSubmit(){
    this.setGameParams = this.formGameParams;
    this.gameSpecificVariables.push({player:'O' , currency: this.setGameParams.get("currency")!.value})
    this.gameSpecificVariables.push({player:'X' , currency: this.setGameParams.get("currency")!.value})
    console.log("Game Rules have been set");
  }
  
  override resetGame(){
    this.currentRound = 1;
    this.currentPlayer = undefined;
    for(let GSV of this.gameSpecificVariables){
      if(GSV.hasOwnProperty('currency')){
        GSV.currency = this.snapshot.currency;}
    }
    this.setBoard();
    this.currentPlayer = this.determineNextFirst();
  }

  override advanceRound(): void {
    this.currentRound ++;
    for(let GSV of this.gameSpecificVariables){
      if(GSV.hasOwnProperty('currency')){
        GSV.currency = this.snapshot.currency;}
    }
  }
//--------------------------------------------------------------
  override clickCell(cell : PlayCellComponent){
    switch(this.gameNav){
      case "canMove": {
        this.selectedCell = cell;
        this.selectedCell.setBid = true;
        for(let GSV of this.gameSpecificVariables){
          if(GSV.hasOwnProperty('currency')){
            if(GSV.player === this.currentPlayer){
              this.selectedCell.maxBid = GSV.currency;
            }
          }
        }
        this.gameNav = "isBidding"
        break;
      }

      case "isBidding": {
        if(this.selectedCell === cell){
          //TODO: Dont Elemnt by ID
          let input = document.getElementById("bidAmount") as HTMLInputElement;
          let bidAmount = parseInt(input.value);
          if(bidAmount){
            console.log(bidAmount)
            this.bidOnCell(this.selectedCell, bidAmount);
            this.settleBid();
            cell.setBid = false;
            this.gameNav = "canMove";
            this.passTurn();
            break;
          } else {
            console.log("bid invalid")
          } 
        }
        else {
          this.selectedCell!.setBid = false;
          this.selectedCell!.maxBid = 0;
          this.selectedCell = undefined;
          this.gameNav = "canMove";
          break;
        }
      }
    }
  }

  bidOnCell(selectedCell : PlayCellComponent, bidAmount : number){
    let bid : PlayerBid = {
      bidder : this.currentPlayer!,
      bidCell: selectedCell,
      amount : bidAmount
    }
    this.currentBids.push(bid);
  }

  settleBid(){
    if(this.currentBids.length >= 2){
      let highestBid:PlayerBid = this.currentBids[0]; 
      for(let bid of this.currentBids){
        if(this.currentBids[0].amount === this.currentBids[1].amount){
          this.currentBids = [];
          console.log("The Bids are tied")
          return;
        }
        if(highestBid.amount < bid.amount){
          highestBid = bid;
        }  
      }
      for(let GSV of this.gameSpecificVariables){
        if(GSV.hasOwnProperty('currency')){
          if(GSV.player === highestBid.bidder){
            GSV.currency -= highestBid.amount;
          } else GSV.currency += highestBid.amount;
        }
      }
      highestBid.bidCell.cellData.cellState = highestBid.bidder;
      this.currentBids = [];
    }
  }

}
