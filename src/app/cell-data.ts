import { PlayCellComponent } from "./play-cell/play-cell.component";

export interface CellData {
    cellRef? : PlayCellComponent;
    cellID   : number;
    cellState: 'O' | 'X' | ' ';
}
