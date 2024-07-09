import { TestBed } from '@angular/core/testing';

import { FeathersClientService } from './feathers-service.service';

describe('FeathersServiceService', () => {
  let service: FeathersClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeathersClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
