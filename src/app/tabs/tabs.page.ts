import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, fileTrayStackedOutline, todayOutline } from 'ionicons/icons';
import { Ability } from '@casl/ability';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {

  public environmentInjector = inject(EnvironmentInjector);

  constructor(private ability: Ability) {
    addIcons({ fileTrayStackedOutline, createOutline, todayOutline });
  }

  canManageVisita = this.ability.can('manage', 'visita')

  canManageInspeccion = this.ability.can('manage', 'inspecciones')
}
