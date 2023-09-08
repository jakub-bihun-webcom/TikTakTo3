import { Injectable } from '@angular/core';
import { BasicGameServiceService } from './basic-game-service.service';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TTTBargainService extends BasicGameServiceService{

  constructor() {
    super(new FormBuilder)
   }
}
