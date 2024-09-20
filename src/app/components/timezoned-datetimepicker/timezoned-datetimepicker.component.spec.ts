import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimezonedDatetimepickerComponent } from './timezoned-datetimepicker.component';

describe('TimezonedDatetimepickerComponent', () => {
  let component: TimezonedDatetimepickerComponent;
  let fixture: ComponentFixture<TimezonedDatetimepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimezonedDatetimepickerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimezonedDatetimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
