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
import { ClientTest, Test } from 'feathers-dercosa';
import { ClientTestsStore } from 'src/app/signalStores/stores/clientTestsStore';
import { addIcons } from "ionicons";
import { caretUpOutline } from "ionicons/icons";
import { caretDownOutline } from "ionicons/icons";
import { addOutline } from "ionicons/icons";

@Component({
  selector: 'app-client-tests',
  templateUrl: './client-tests-list.component.html',
  styleUrls: ['./client-tests-list.component.scss'],
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
export class ClientTestsComponent {
  readonly clientTestsStore = inject(ClientTestsStore);

  route = this.activatedRoute;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
      addIcons({caretUpOutline,caretDownOutline,addOutline});}

  addItem() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editItem(item: ClientTest) {
    this.router.navigate([item.id], {
      state: { item: item },
      relativeTo: this.route,
    });
  }

  deleteItem(resSt: ClientTest) {
    const id = resSt.id;
    this.clientTestsStore.remove(id);
  }

  getLabel(test: Test) {
    return `${test.name} (${test.defaultMin}/${test.defaultMax})${test.measurementUnit}`;
  }
}
