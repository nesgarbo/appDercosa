import { Directive, ElementRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[appRequiredField]',
})
export class RequiredFieldDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    const requiredText = this.translate.instant('REQUIRED');
    this.el.nativeElement.innerHTML += ` <span class="required-field"> (${requiredText})</span>`;
  }
}
