import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
  IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { TestResultsStore } from '../../../signalStores/stores/testResultsStore';
import { ModalController } from '@ionic/angular';
import { TestResultViewModel } from '../../../shared/test-result';
import { CommonModule } from '@angular/common';
import { TestResult } from 'feathers-dercosa';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { IonMenuButton } from '@ionic/angular/standalone';
import { AgendaResultComponent } from '../../../components/agenda-results/agenda-results.component';

@Component({
  selector: 'app-agenda-results-page',
  templateUrl: 'agenda-results.page.html',
  styleUrls: ['agenda-results.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, 
    IonIcon,
    IonModal,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AgendaResultComponent,
    IonButtons,
    IonButton,
    CommonModule,
    RouterOutlet,
    IonModal,
    IonMenuButton,
  ],
  providers: [ModalController],
})
export class AgendaResultPage {
  @ViewChild('schedulerContainer', { static: true })
  schedulerContainer!: ElementRef;

  @ViewChild(AgendaResultComponent, { static: true })
  planningComponent!: AgendaResultComponent;

  route = inject(ActivatedRoute);

  isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

  constructor(private cdr: ChangeDetectorRef, private router: Router) {
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    this.isDarkTheme = darkModeMediaQuery.matches;
    darkModeMediaQuery.addEventListener('change', (event) => {
      this.isDarkTheme = event.matches;
      this.cdr.detectChanges();
    });
  }

  readonly testResultsStore = inject(TestResultsStore);

  events = this.testResultsStore.planningEvents;

  editingEvent = signal<TestResultViewModel | undefined>(undefined);

  editingTestResult = computed(() =>
    this.testResultsStore
      .entities()
      .find((entity) => entity.id === this.editingEvent()?.id)
  );

  ionViewWillEnter() {
    this.planningComponent.enableResizeSensor(this.schedulerContainer);
  }

  async onEditEvent(event: TestResultViewModel) {
    this.editingEvent.set(event);
    this.editItem(this.editingTestResult() as TestResult);
  }

  editItem(item: TestResult) {
    this.router.navigate([item.id], {
      state: { item: item },
      relativeTo: this.route,
    });
  }

  addItem() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
