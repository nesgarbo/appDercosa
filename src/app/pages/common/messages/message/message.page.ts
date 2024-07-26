import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonText } from '@ionic/angular/standalone';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AppStore } from 'src/app/signalStores/stores/appStore';
import { Router } from '@angular/router';

export type Options = {
  titleColor: string,
  title: string,
  btn: {
    text: string,
    fn: () => void,
  },
}

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
  standalone: true,
  imports: [IonText, IonButton, IonContent, CommonModule, LottieComponent, CommonModule],
  
})
export abstract class MessagePage {
  readonly appStore = inject(AppStore);
  router = inject(Router);

  returnBtn = input<boolean>(true);
  abstract options(): Options;
  private animationItem: AnimationItem | undefined;

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  goToHome() {
    const homeUrl = this.appStore.user()?.appHomeUrl;
    if (homeUrl) {
      this.router.navigate([homeUrl]);
    }
  }
  protected lottie: AnimationOptions = {
    path: '/assets/lotties/cross.json',
    loop: false,
    autoplay: true,
  }
}
