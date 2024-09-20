import { Component, input, output } from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { IonListHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [IonListHeader, MenuItemComponent],
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent {
  header = input.required<string>();
  items = input.required<{ icon: string, label: string, routerLink?: string }[]>();
  onClickEvent = output<string>();
}
