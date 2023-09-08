import { TestBed } from '@angular/core/testing';

import { LogicTTTClassicService } from './logic-tttclassic.service';

describe('LogicTTTClassicService', () => {
  let service: LogicTTTClassicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogicTTTClassicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
