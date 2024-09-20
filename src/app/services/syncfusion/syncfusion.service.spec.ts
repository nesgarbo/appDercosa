import { TestBed } from '@angular/core/testing';

import { SyncfusionService } from './syncfusion.service';

describe('SyncfusionService', () => {
  let service: SyncfusionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncfusionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
