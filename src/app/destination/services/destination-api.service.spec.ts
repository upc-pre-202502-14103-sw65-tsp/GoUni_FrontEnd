import { TestBed } from '@angular/core/testing';

import { DestinationApiService } from './destination-api.service';

describe('DestinationApiService', () => {
  let service: DestinationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestinationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
