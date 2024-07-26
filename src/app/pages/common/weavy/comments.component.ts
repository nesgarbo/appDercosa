import { Component, ElementRef } from '@angular/core';
import { WeavyAppComponent } from './app/app.component';

@Component({
    selector: 'app-comments',
    templateUrl: './app/app.component.html',
    standalone: true,
    styleUrls: ['./app/app.component.scss'],
})
export class CommentsComponent extends WeavyAppComponent {
    protected loadWeavyComponent(container: ElementRef<any>): any {
        return this.weavy.loadComponent(container, 'comments');
    }
}
