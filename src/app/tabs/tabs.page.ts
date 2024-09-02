import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Ability } from '@casl/ability';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline,
  fileTrayStackedOutline,
  todayOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  router = inject(Router);
  constructor(private ability: Ability) {
    addIcons({ fileTrayStackedOutline, createOutline, todayOutline });
  }

  canManageVisita =
    this.ability.can('manage', 'visita') && this.urlContainsText('visita');

  // canManageInspeccion =
  //   this.ability.can('manage', 'tests') && this.urlContainsText('calidad');

  private urlContainsText(text: string): boolean {
    return this.router.url.includes(text);
  }
}
