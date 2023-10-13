import { Injectable } from '@angular/core';
import { GameModeData } from './game-mode-data';

@Injectable({
  providedIn: 'root'
})

export class GetRuleFormService {

  constructor() { }

  getForm(gameMode : GameModeData) {
    return gameMode.gameLogic.formGameParams;
  }
}
