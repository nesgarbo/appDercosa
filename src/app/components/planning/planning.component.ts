import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    contentChild,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    input,
    OnInit,
    output,
    signal,
    TemplateRef,
    viewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
    DatePickerAllModule,
    DateTimePickerAllModule,
} from '@syncfusion/ej2-angular-calendars';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import {
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
import { closest, Internationalization } from '@syncfusion/ej2-base';
import { TestResultViewModel } from 'src/app/shared/test-result';
import { DialogRefDirective } from '../../directives/dialog-ref/dialog-ref.directive';
import { SyncControlsDirective } from '../../directives/sync-controls/sync-controls.directive';
import { ValidationMessagesDirective } from '../../directives/validation-messages/validation-messages.directive';
import { LanguagesService } from '../../services/languages.service';
import { AppStore } from '../../signalStores/stores/appStore';
import { TestResultsStore } from '../../signalStores/stores/testResultsStore';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.scss'],
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
        FormsModule,
        ReactiveFormsModule,
        DatePickerAllModule,
        DateTimePickerAllModule,
        ScheduleAllModule,
        CommonModule,
        TranslateModule,
        ValidationMessagesDirective,
        ValidationMessagesDirective,
        SyncControlsDirective,
        DialogRefDirective,
        NgIconComponent,
        ContextMenuModule,
    ],
})
export class PlanningComponent {
    onMoreEventsClick($event: any) {
        // throw new Error('Method not implemented.');
        console.log('onMoreEventsClick', $event);
    }
    cellWidth = input<string | null>();
    cellHeight = input<string | null>();
    allowResizing = input<boolean>(true);
    allowDragAndDrop = input<boolean>(true);
    views = input<string[]>(['TimelineMonth', 'TimelineWeek', 'Agenda']);

    eventTooltipTemplateRef = contentChild<TemplateRef<any>>(
        'eventTooltipTemplate'
    );

    timelineMonthTemplateRef = contentChild<TemplateRef<any>>(
        'timelineMonthTemplate'
    );

    subjectField = input.required<string>();

    scheduler = viewChild<ScheduleComponent>('schedule');

    public selectedTarget?: Element;

    private readonly consignasStore = inject(TestResultsStore);
    planningEvents = this.consignasStore.planningEvents;

    private translate = inject(TranslateService);

    languagesService = inject(LanguagesService);
    availableLanguages = this.languagesService.getAvailableLanguages();

    onAddEvent = output<TestResultViewModel>();
    onEditEvent = output<TestResultViewModel>();
    onDeleteEvent = output<TestResultViewModel>();

    events = input.required<TestResultViewModel[]>();

    cmSelectedEvent = signal<TestResultViewModel | null>(null);

    private eventSettingsConfig = computed<
        Omit<EventSettingsModel, 'dataSource'>
    >(() => ({
        enableTooltip: true,
        fields: {
            id: 'id',
            subject: { name: this.subjectField() },
            isAllDay: { name: 'isAllDay' },
            startTime: { name: 'date' },
            endTime: { name: 'date' },
        },
    }));

    eventSettings = computed(() => ({
        ...this.eventSettingsConfig(),
        dataSource: this.events(),
    }));

    timeLineMonthViewInterval = 1;

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
        if (['QuickInfo', 'Editor', 'ViewEventInfo'].includes(args.type)) {
            args.cancel = true;
            if (args.data!['dateOfDeparture']) {
                /**
                 * By default, scheduler gets the start of the next day
                 * as the end of the appointment. Fix this substracting
                 * one millisecond to dateOfDeparture
                 */
                (args.data!['dateOfDeparture'] as Date).setMilliseconds(
                    args.data!['dateOfDeparture'].getMilliseconds() - 1
                );
            }
            if (!args.data!['id']) {
                this.onAddEvent.emit(args.data as any);
            } else {
                this.onEditEvent.emit(args.data as any);
            }
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
        const { StartTime, dateOfDeparture } = appointmentData;
        console.log('New start/end date', StartTime, dateOfDeparture);
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

    onContextMenuShow($event: null) {
        this.scheduler()!.eventSettings.enableTooltip = false;
    }

    onContextMenuHide(event: null) {
        this.scheduler()!.eventSettings.enableTooltip = true;
    }
}
