import { CommonModule } from '@angular/common';
import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
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
  IonToolbar,
  IonFooter,
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
    FormsModule,
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

  dateFilter = model<Date>(new Date());
  dayTestResults = computed(() => {
    const date = new Date(this.dateFilter());
    return this.testResultsStore.entities().filter((testResult) => {
      if (!testResult.createdAt) return false;
      const testDate = new Date(testResult.createdAt);
      return (
        testDate.getDate() === date.getDate() &&
        testDate.getMonth() === date.getMonth() &&
        testDate.getFullYear() === date.getFullYear()
      );
    });
  });

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
}
