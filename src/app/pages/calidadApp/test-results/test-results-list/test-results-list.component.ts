import { CommonModule } from '@angular/common';
import { Component, computed, inject, model } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonNote,
  IonRow,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ClientTest, TestResult } from 'feathers-dercosa';
import { TimezonedDatetimepickerComponent } from 'src/app/components/timezoned-datetimepicker/timezoned-datetimepicker.component';
import { TestResultsStore } from 'src/app/signalStores/stores/testResultsStore';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results-list.component.html',
  styleUrls: ['./test-results-list.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonToggle,
    IonFooter,
    IonButton,
    IonChip,
    IonText,
    IonNote,
    IonCol,
    IonRow,
    IonGrid,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonModal,
    IonIcon,
    IonFabButton,
    IonFab,
    IonItem,
    IonLabel,
    IonList,
    IonContent,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonMenuButton,
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    TimezonedDatetimepickerComponent,
  ],
})
export class TestResultsComponent {
  readonly testResultsStore = inject(TestResultsStore);

  testName = (test: ClientTest) => test.test.name;

  route = this.activatedRoute;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  addItem() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  filters = model<{ dateFrom: Date; dateTo: Date; partida: string } | null>(
    {dateFrom: new Date(), dateTo: new Date(), partida: ''}
  );
  filtersForm = new FormGroup({
    dateFrom: new FormControl<Date>(new Date(), [Validators.required]),
    dateTo: new FormControl<Date>(new Date(), [Validators.required]),
    partida: new FormControl<string>('', [Validators.required]),
  });
  testResultsFilteredEntities = computed(() => {
    const filters = this.filters();
    if (!filters) {
      return this.testResultsStore.entities();
    }

    return this.testResultsStore.entities().filter((testResult) => {
      const testDate = new Date(testResult.updatedAt || testResult.createdAt!);
      const testPartida = testResult.partida?.toLowerCase() || '';
      return (
        this.isDateInRange(
          testDate,
          new Date(filters.dateFrom),
          new Date(filters.dateTo)
        ) && testPartida.includes(filters.partida.toLowerCase())
      );
    });
  });

  setFilters() {
    this.filters.set(this.filtersForm.value as any);
  }

  clearFilters() {
    this.filters.set(null);
    this.filtersForm.reset({
      dateFrom: new Date(),
      dateTo: new Date(),
      partida: '',
    });
  }

  editItem(item: TestResult) {
    this.router.navigate([item.id], {
      state: { item: item },
      relativeTo: this.route,
    });
  }

  changeDate() {}

  deleteItem(resSt: TestResult) {
    const id = resSt.id;
    this.testResultsStore.remove(id);
  }

  private isDateInRange(testDate: Date, dateFrom: Date, dateTo: Date): boolean {
    const testDateOnly = new Date(
      testDate.getFullYear(),
      testDate.getMonth(),
      testDate.getDate()
    );
    const fromDateOnly = new Date(
      dateFrom.getFullYear(),
      dateFrom.getMonth(),
      dateFrom.getDate()
    );
    const toDateOnly = new Date(
      dateTo.getFullYear(),
      dateTo.getMonth(),
      dateTo.getDate()
    );

    return testDateOnly >= fromDateOnly && testDateOnly <= toDateOnly;
  }
}
