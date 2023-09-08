import { TestBed } from '@angular/core/testing';

import { BasicGameServiceService } from './basic-game-service.service';

describe('BasicGameServiceService', () => {
  let service: BasicGameServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicGameServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
