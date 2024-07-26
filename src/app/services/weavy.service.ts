import {
  ElementRef,
  inject,
  Injectable,
  OnDestroy,
  computed,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppStore } from '../signalStores/stores/appStore';

type weavyAppTypes =
  | 'messenger'
  | 'files'
  | 'posts'
  | 'tasks'
  | 'comments'
  | 'search';

// The Weavy class must be declared for usage
declare let Weavy: any;

@Injectable({
  providedIn: 'root',
})
export class WeavyService implements OnDestroy {
  public weavyStarted = signal(false);
  private weavy: any;
  private space = {
    id: environment.defaultSpaceId,
    name: environment.defaultSpaceName,
  };
  private weavySpace: any;

  private readonly appStore = inject(AppStore);
  private weavyToken = computed(() => this.appStore.user()?.weavyToken);
  private startWeavy = effect(() => {
    const token = this.weavyToken();
    if (token) {
      untracked(async () => {
        await this.start(token);
        this.weavyStarted.set(true);
      });
    }
  });

  private async start(token: string) {
    this.weavy = new Weavy({ jwt: token, lang: 'es' });
    console.log('Weavy started', this.weavy);

    this.weavySpace = this.weavy.space({
      id: this.space.id,
      name: this.space.name,
    });

    console.log('Weavy space started', this.weavySpace);

    this.weavy.on('badge', (e: any, data: any) => {
      // this.store.dispatch(setChatNotificationsCounter({counters: data}));
    });
    this.weavy.on('ready', function () {
      document.querySelector('#weavy-container')?.classList.add('body-dark');
    });
    await this.weavy.init();
  }

  public loadComponent(container: ElementRef, type: weavyAppTypes) {
    const t = type === 'messenger' ? 'chat' : type;
    return this.weavySpace.app({
      type: type,
      key: `dercosa-${t}`,
      name: `Dercosa ${t}`,
      container: container.nativeElement,
    });
  }

  ngOnDestroy(): void {
    this.weavy.destroy();
  }
}
