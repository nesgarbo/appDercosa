import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
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
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonText,
  IonChip,
} from '@ionic/angular/standalone';
import { ClientTest, Test, TestResult } from 'feathers-dercosa';
import { TestResultsStore } from 'src/app/signalStores/stores/testResultsStore';
import { TestsStore } from 'src/app/signalStores/stores/testsStore';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results-list.component.html',
  styleUrls: ['./test-results-list.component.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class TestResultsComponent {
  readonly testResultsStore = inject(TestResultsStore);

  testName = (test: Test | ClientTest) =>
    (test as Test).name !== undefined
      ? (test as Test).name
      : (test as ClientTest).test.name;

  route = this.activatedRoute;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  addItem() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editItem(item: TestResult) {
    this.router.navigate([item.id], {
      state: { item: item },
      relativeTo: this.route,
    });
  }

  deleteItem(resSt: TestResult) {
    const id = resSt.id;
    this.testResultsStore.remove(id);
  }
}
