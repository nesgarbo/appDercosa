import { Component } from '@angular/core';
import { TestResult } from 'feathers-dercosa';
import { TestResultDetailComponent } from './test-result-detail/test-result-detail.component';
import { BaseDetailDialog } from 'src/app/components/base-detail-dialog/base-detail-dialog';

@Component({
  selector: 'app-test-result-detail-dialog',
  template: '',
  providers: [
    {
      provide: BaseDetailDialog,
      useExisting: TestResultDetailDialogComponent,
    },
  ],
  standalone: true,
})
export class TestResultDetailDialogComponent extends BaseDetailDialog<TestResult> {
  async getDialog() {
    console.log('getDialog', this.getItemFromRouter(), this.operation());
    const modal = await this.modalController
      .create({
        component: TestResultDetailComponent,
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