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
  IonToolbar, IonGrid, IonRow, IonCol, IonNote, IonText, IonChip } from '@ionic/angular/standalone';
import { Test } from 'feathers-dercosa';
import { TestsStore } from 'src/app/signalStores/stores/testsStore';

@Component({
  selector: 'app-tests',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss'],
  standalone: true,
  imports: [IonChip, IonText, IonNote, IonCol, IonRow, IonGrid, 
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
export class TestsComponent {
  readonly testsStore = inject(TestsStore);

  route = this.activatedRoute;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  addItem() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editItem(item: Test) {
    this.router.navigate([item.id], {
      state: { item: item },
      relativeTo: this.route,
    });
  }

  deleteItem(resSt: Test) {
    const id = resSt.id;
    this.testsStore.remove(id);
  }

  getLabel(test: Test) {
    return `${test.name} (${test.defaultMin}/${test.defaultMax})${test.measurementUnit}`;
  }
}
