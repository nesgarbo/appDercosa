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

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.scss'],
  standalone: true,
  imports: [SelectPartidaComponent],
  providers: [ModalController],
})
export class EstadoComponent {
  estado = signal<Estado[]>([]);

  loadingController = inject(LoadingController);

  alertController = inject(AlertController);

  modalController = inject(ModalController);

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
    console.log('Cogiendo estado', partida.epartida.toUpperCase());

    for (let i = 0; i < 10; i++) {
      try {
        console.log('Intento: ', i);
        await loading.present();
        // Utiliza la función de estadoConTimeout aquí
        const estado = await this.estadoConTimeout(partida.epartida);
        console.log('Estado: ', estado);
        this.estado.set(estado);
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
