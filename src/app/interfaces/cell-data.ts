import { ElementRef } from "@angular/core";
import { PlayCellComponent } from "../components/play-cell/play-cell.component";

export type PlayerBid = {
    bidder : 'O' | 'X';
    bidCell: PlayCellComponent;
    amount : number;
};

export interface CellData {
    cellRef   : HTMLElement|null;
    cellID    : number;
    cellState : 'O' | 'X' | ' '
};
