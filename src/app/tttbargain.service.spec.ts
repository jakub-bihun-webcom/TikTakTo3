import { TestBed } from '@angular/core/testing';

import { TTTBargainService } from './tttbargain.service';

describe('TTTBargainService', () => {
  let service: TTTBargainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TTTBargainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
