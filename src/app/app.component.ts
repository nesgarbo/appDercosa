import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  beakerOutline,
  caretDownOutline,
  caretUpOutline,
  chatboxEllipsesOutline,
  chatboxOutline,
  chatbubblesOutline,
  checkboxOutline,
  checkmarkCircle,
  createSharp,
  documentOutline,
  flaskOutline,
  homeOutline,
  listOutline,
  logOutOutline,
  radioButtonOff,
  scanOutline,
  searchOutline,
  todayOutline,
} from 'ionicons/icons';
import { MenuComponent } from './components/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, MenuComponent],
  providers: [ModalController],
})
export class AppComponent {
  constructor() {
    addIcons({
      homeOutline,
      logOutOutline,
      searchOutline,
      chatboxEllipsesOutline,
      chatboxOutline,
      chatbubblesOutline,
      listOutline,
      documentOutline,
      addOutline,
      checkboxOutline,
      caretDownOutline,
      caretUpOutline,
      radioButtonOff,
      checkmarkCircle,
      createSharp,
      scanOutline,
      beakerOutline,
      flaskOutline,
      todayOutline,
    });
  }
}
