import { Component, inject, signal } from '@angular/core';
import { Estado } from 'feathers-dercosa';
import {
  selectedOutputType,
  SelectPartidaComponent,
} from 'src/app/components/select-partida/select-partida.component';
import {
  LoadingController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { EstadosStore } from 'src/app/signalStores/stores/estadosStore';
import { ModalEstadoComponent } from 'src/app/modals/modal-estado/modal-estado.component';
import { IonModal, IonLoading } from '@ionic/angular/standalone';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.scss'],
  standalone: true,
  imports: [IonLoading, IonModal, SelectPartidaComponent],
  providers: [ModalController],
})
export class EstadoComponent {
  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  readonly estadosStore = inject(EstadosStore);

  async presentAlert(str?: string) {
    const alert = await this.alertController.create({
      header: str || 'No se han encontrado registros',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async openModal(partida: selectedOutputType) {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });

    for (let i = 0; i < 3; i++) {
      try {
        console.log('Intento: ', i);
        await loading.present();
        // Utiliza la función de estadoConTimeout aquí
        const estado = await this.estadoConTimeout(partida.epartida);
        console.log('Estado: ', estado);
        await loading.dismiss();
        if (estado.length === 0) {
          let ep = partida.epedido;
          let epedido = ep ? ep.toString().substring(0, 5) : '';
          let linea = ep ? ep.toString().substring(5) : '';
          this.presentAlert(
            `No se encuentra Partida: ${partida.epartida}, Pedido: ${epedido}, Linea: ${linea}`
          );
          return;
        }
        if (partida.epedido) {
          const epedidoBase = partida.epedido.slice(0, -2);
          const epedidoLastTwo = partida.epedido.slice(-2);
          const epedidoNumber = Number(epedidoLastTwo);
          const epedidoString = epedidoNumber.toString();
          const epedidoFinal = epedidoBase + epedidoString;
          let pedido = partida.epartida + epedidoFinal;
          console.log('Nombre: ', pedido);
          if (this.estadosStore.ids().includes(pedido)) {
            this.estadosStore.selectById(pedido);
          } else {
            this.presentAlert('No se ha encontrado el pedido');
            return;
          }
        }
        const modal = await this.modalController.create({
          component: ModalEstadoComponent,
        });
        return await modal.present();
      } catch (error: any) {
        console.log('Error: ', error.message); // Muestra el mensaje de error
        if (i === 9) {
          await loading.dismiss();
          this.presentAlert('Ha ocurrido un error');
        }
      }
    }
  }

  async estadoConTimeout(epartida: string, timeout = 7000) {
    return new Promise<Estado[]>(async (resolve, reject) => {
      // Timeout handler
      const timer = setTimeout(() => {
        reject(new Error('La petición ha superado el tiempo máximo permitido'));
      }, timeout);

      resolve(
        (await this.estadosStore.find({
          query: { EPARTIDA: epartida.toUpperCase() },
        })) as any
      );
    });
  }
}
