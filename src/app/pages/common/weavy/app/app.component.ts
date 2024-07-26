import {
    CUSTOM_ELEMENTS_SCHEMA,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    computed,
    effect,
    inject,
    viewChild,
} from '@angular/core';
import { WeavyService } from 'src/app/services/weavy.service';
import { AppStore } from 'src/app/signalStores/stores/appStore';
import { IonContent, IonHeader, IonButtons, IonToolbar, IonTitle } from "@ionic/angular/standalone";

@Component({
    selector: 'app-weavy-app',
    standalone: true,
    imports: [],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export abstract class WeavyAppComponent implements OnDestroy {
    protected weavy = inject(WeavyService);
    readonly appStore = inject(AppStore);
    private token = computed(() => this.appStore.user()?.weavyToken);
    private weavyContainer = viewChild<ElementRef>('weavyContainer');
    private loadComponent = effect(() => {
        const weavyContainer = this.weavyContainer();
        const weavyInitialized = this.weavy.weavyStarted();
        const token = this.token();
        if (weavyContainer && weavyInitialized && token) {
            this.weavyApp = this.loadWeavyComponent(weavyContainer);
        }
    });

    protected abstract loadWeavyComponent(weavyContainer: ElementRef<any>): any;

    private weavyApp: any;

    ngOnDestroy(): void {
        this.weavyApp?.remove();
    }
}
