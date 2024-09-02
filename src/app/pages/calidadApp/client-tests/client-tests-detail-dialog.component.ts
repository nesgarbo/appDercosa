import { Component } from '@angular/core';
import { ClientTest } from 'feathers-dercosa';
import { ClientTestDetailComponent } from './client-test-detail/client-test-detail.component';
import { BaseDetailDialog } from 'src/app/components/base-detail-dialog/base-detail-dialog';

@Component({
  selector: 'app-client-test-detail-dialog',
  template: '',
  providers: [
    {
      provide: BaseDetailDialog,
      useExisting: ClientTestDetailDialogComponent,
    },
  ],
  standalone: true,
})
export class ClientTestDetailDialogComponent extends BaseDetailDialog<ClientTest> {
  async getDialog() {
    console.log('getDialog', this.getItemFromRouter(), this.operation());
    const modal = await this.modalController
      .create({
        component: ClientTestDetailComponent,
        componentProps: this.getComponentProps(),
      })
      .catch(error => {
        console.log('Error showing modal');
      });
    if (!modal) {
      return;
    }
    this.modal = modal;
    return modal;
  }
}