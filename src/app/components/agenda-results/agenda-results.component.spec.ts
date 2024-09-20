import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaResultComponent } from './agenda-results.component';

describe('AgendaResultComponent', () => {
  let component: AgendaResultComponent;
  let fixture: ComponentFixture<AgendaResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendaResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
