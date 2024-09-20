import { Component, input, OnInit, output } from '@angular/core';
import { IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [IonLabel, IonIcon, IonItem, RouterLink, RouterLinkActive],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent {
  icon = input.required<string>();
  label = input.required<string>();
  routerLink = input<string>();
  onClickEvent = output<string>();
}
