import { BasicGameServiceService } from "../services/basic-game-service.service";

export interface GameModeData {
    displayName : string;
    gameLogic   : BasicGameServiceService;
}
