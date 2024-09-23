import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DatePickerAllModule,
  DateTimePickerAllModule,
} from '@syncfusion/ej2-angular-calendars';
import {
  ActionEventArgs,
  AgendaService,
  DragAndDropService,
  DragEventArgs,
  EventRenderedArgs,
  EventSettingsModel,
  PopupOpenEventArgs,
  ResizeEventArgs,
  ResizeService,
  ScheduleAllModule,
  ScheduleComponent,
  TimelineMonthService,
  TimelineViewsService,
  View,
} from '@syncfusion/ej2-angular-schedule';
import { Internationalization } from '@syncfusion/ej2-base';
import { ResizeSensor } from 'css-element-queries';
import { SyncControlsDirective } from '../../directives/sync-controls/sync-controls.directive';
import { ValidationMessagesDirective } from '../../directives/validation-messages/validation-messages.directive';
import { LanguagesService } from '../../services/languages.service';
import { TestResultViewModel } from '../../shared/test-result';
import { AppStore } from '../../signalStores/stores/appStore';
import { TestResultsStore } from '../../signalStores/stores/testResultsStore';
import { effect } from '@angular/core';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-agenda-results',
  templateUrl: './agenda-results.component.html',
  styleUrls: ['./agenda-results.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    TimelineViewsService,
    TimelineMonthService,
    AgendaService,
    ResizeService,
    DragAndDropService,
  ],
  imports: [
    DatePickerAllModule,
    DateTimePickerAllModule,
    ScheduleAllModule,
    CommonModule,
    TranslateModule,
    ValidationMessagesDirective,
    SyncControlsDirective,
    NgIconComponent,
  ],
})
export class AgendaResultComponent {
  private readonly testResultsStore = inject(TestResultsStore);

  @ViewChild('schedule', { static: true }) public scheduler!: ScheduleComponent;
  planningEvents = this.testResultsStore.planningEvents;
  planningEffect = effect(() => {
    console.log('planningEvents', this.planningEvents());
  });
  resizeSensor?: ResizeSensor;

  languagesService = inject(LanguagesService);
  availableLanguages = this.languagesService.getAvailableLanguages();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAddEvent = new EventEmitter<TestResultViewModel>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onEditEvent = new EventEmitter<TestResultViewModel>();

  events = input.required<TestResultViewModel[]>();

  private eventSettingsConfig = signal<Omit<EventSettingsModel, 'dataSource'>>({
    enableTooltip: true,
    fields: {
      id: 'id',
      subject: { name: 'partida' },
      isAllDay: { name: 'isAllDay' },
      startTime: { name: 'date' },
      endTime: { name: 'date' }
    },
  });

  eventSettings = computed(() => ({
    ...this.eventSettingsConfig(),
    dataSource: this.events(),
  }));

  timeLineMonthViewInterval = 12;

  public instance: Internationalization = new Internationalization();

  appStore = inject(AppStore);
  language = this.appStore.languageCode;

  public selectedDate: Date = new Date(2021, 0, 10);
  public currentView: View = 'TimelineMonth';
  public workDays: number[] = [0, 1, 2, 3, 4, 5];

  private dragStartValue: any;
  private resizeStartValue: any;

  constructor() {}

  async onPopupOpen(args: PopupOpenEventArgs) {
    args.cancel = true;
    //this.handlePopupOpen(args.data as any);
    if (!args.data!['id']) {
      this.onAddEvent.emit(args.data as any);
    } else {
      this.onEditEvent.emit(args.data as any);
    }
  }

  async onResizeStop(args: ResizeEventArgs) {
    console.log(
      '🚀 ~ file: planning.component.ts:65 ~ PlanningComponent ~ onResizeStop ~ args:',
      args
    );
    await this.handleStartEndChange(args.data);
    this.resizeStartValue = undefined;
    console.groupEnd();
  }

  async onDragStop(args: DragEventArgs) {
    console.log(
      '🚀 ~ file: planning.component.ts:70 ~ PlanningComponent ~ onDragStop ~ args:',
      args
    );
    await this.handleStartEndChange(args.data);
    this.dragStartValue = undefined;
    console.groupEnd();
  }

  private async handleStartEndChange(appointmentData: any) {
    const { StartTime, updatedAt } = appointmentData;
    console.log('New start/end date', StartTime, updatedAt);
  }

  async onResizeStart(args: ResizeEventArgs) {
    console.group('resize');
    console.log('Event resize started. Initial values', args.data);
    this.resizeStartValue = args.data;
  }

  async onDragStart(args: DragEventArgs) {
    console.group('drag');
    console.log('Event drag started. Initial values', args.data);
    this.dragStartValue = args.data;
  }

  async onActionComplete(args: ActionEventArgs) {
    if (args.requestType !== 'eventCreated') {
      return;
    }

    console.group('event created');
    console.log('Event data', args.data);
    console.groupEnd();
  }

  getDateHeaderText(value: Date) {
    return this.instance.formatDate(value, { skeleton: 'MMMd' });
  }

  onEventRendered(args: EventRenderedArgs): void {
    const backgroundColor: string = args.data['backgroundColor'];
    if (!args.element || !backgroundColor) {
      return;
    }
    args.element.style.backgroundColor = backgroundColor;

    const textColor: string = args.data['textColor'];
    if (!args.element || !textColor) {
      return;
    }
    args.element.style.color = textColor;
  }

  enableResizeSensor(element: ElementRef) {
    console.log('enableResizeSensor', element);
    this.resizeSensor = new ResizeSensor(element.nativeElement, (size) => {
      this.scheduler.height = '600px';
      this.scheduler.height = '100%';
    });
  }
}
