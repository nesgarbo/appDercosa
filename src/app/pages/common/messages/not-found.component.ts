import { Component } from '@angular/core';
import { MessagePage, Options } from './message/message.page';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './message/message.page.html',
  standalone: true,
  styleUrls: ['./message/message.page.scss'],
  imports: [IonContent, IonButton, LottieComponent, CommonModule],
})
export class NotFoundComponent extends MessagePage {
  override options(): Options {
    return {
      titleColor: 'red',
      title: 'Not Found',
      btn: {
        text: 'Volver al Inicio',
        fn: () => this.goToHome(),
      },
    };
  }

  override lottie: AnimationOptions = {
    path: '/assets/lotties/cross.json',
    loop: false,
    autoplay: true,
  }
}
