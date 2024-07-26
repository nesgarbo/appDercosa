import { Component, ElementRef } from '@angular/core';
import { WeavyAppComponent } from './app/app.component';

@Component({
    selector: 'app-tasks',
    templateUrl: './app/app.component.html',
    standalone: true,
    styleUrls: ['./app/app.component.scss'],
})
export class TasksComponent extends WeavyAppComponent {
    protected loadWeavyComponent(container: ElementRef<any>): any {
        return this.weavy.loadComponent(container, 'tasks');
    }
}
