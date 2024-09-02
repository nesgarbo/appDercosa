import { Component } from '@angular/core';
import { Test } from 'feathers-dercosa';
import { TestDetailComponent } from './test-detail/test-detail.component';
import { BaseDetailDialog } from 'src/app/components/base-detail-dialog/base-detail-dialog';

@Component({
  selector: 'app-test-detail-dialog',
  template: '',
  providers: [
    {
      provide: BaseDetailDialog,
      useExisting: TestDetailDialogComponent,
    },
  ],
  standalone: true,
})
export class TestDetailDialogComponent extends BaseDetailDialog<Test> {
  async getDialog() {
    console.log('getDialog', this.getItemFromRouter(), this.operation());
    const modal = await this.modalController
      .create({
        component: TestDetailComponent,
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