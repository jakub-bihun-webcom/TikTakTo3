import { BasicGameServiceService } from "./basic-game-service.service";
import { LogicTTTClassicService } from "./logic-tttclassic.service";

export interface GameModeData {
    displayName : string;
    gameLogic   : BasicGameServiceService
}
