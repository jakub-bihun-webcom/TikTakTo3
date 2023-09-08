import { TestBed } from '@angular/core/testing';

import { TTTBeggarService } from './tttbeggar.service';

describe('TTTBeggarService', () => {
  let service: TTTBeggarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TTTBeggarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
