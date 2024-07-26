import { Component, ElementRef } from '@angular/core';
import { WeavyAppComponent } from './app/app.component';

@Component({
    selector: 'app-chat',
    templateUrl: './app/app.component.html',
    standalone: true,
    styleUrls: ['./app/app.component.scss'],
})
export class ChatComponent extends WeavyAppComponent {
    protected loadWeavyComponent(container: ElementRef<any>): any {
        return this.weavy.loadComponent(container, 'messenger');
    }
}
