import { Injectable } from '@angular/core';
import { BasicGameServiceService } from './basic-game-service.service';

@Injectable({
  providedIn: 'root'
})
export class LogicTTTClassicService extends BasicGameServiceService{
  constructor() {
    super();
  }
}
