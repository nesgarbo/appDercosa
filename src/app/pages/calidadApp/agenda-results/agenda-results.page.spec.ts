import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaResultPage } from './agenda-results.page';

describe('AgendaResultPage', () => {
  let component: AgendaResultPage;
  let fixture: ComponentFixture<AgendaResultPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(AgendaResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
