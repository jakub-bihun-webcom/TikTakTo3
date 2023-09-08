import { TestBed } from '@angular/core/testing';

import { GetRuleFormService } from './get-rule-form.service';

describe('GetRuleFormService', () => {
  let service: GetRuleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRuleFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
