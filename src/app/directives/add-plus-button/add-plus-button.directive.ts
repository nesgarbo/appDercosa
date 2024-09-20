import {
  Directive,
  OnInit,
  Input,
  AfterContentInit,
  ComponentRef,
  Renderer2,
  createComponent,
  EnvironmentInjector,
  ElementRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { BaseDetail } from '../../../shared/base-detail';
import { NgControl } from '@angular/forms';
import { PlusInputGroupComponent } from '../../components/plus-input-group/plus-input-group.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[addPlusButton]',
  standalone: true,
})
export class AddPlusButtonDirective implements OnInit, AfterContentInit {
  private destroyRef = inject(DestroyRef);

  private _detailDialog: BaseDetail<any>;
  @Input({ required: true }) set detailDialog(dialog: BaseDetail<any>) {
    this._detailDialog = dialog;
  }

  protected componentRef: ComponentRef<PlusInputGroupComponent>;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private environmentInjector: EnvironmentInjector,
    private ngControl: NgControl
  ) {}

  ngOnInit() {
    this.componentRef = createComponent(PlusInputGroupComponent, {
      environmentInjector: this.environmentInjector,
    });
    const inputGroupDiv =
      this.componentRef.instance.inputGroupDiv.nativeElement;
    const plusButton = this.componentRef.instance.plusButton.nativeElement;
    const parentNode = this.renderer.parentNode(this.elementRef.nativeElement);
    this.renderer.insertBefore(
      parentNode,
      this.componentRef.location.nativeElement,
      this.elementRef.nativeElement
    );
    this.renderer.insertBefore(
      inputGroupDiv,
      this.elementRef.nativeElement,
      plusButton
    );
    this.componentRef.hostView.detectChanges();
    this.subscribeToDialogHide();
    this.subscribeToItemAddedId();
  }

  ngAfterContentInit(): void {
    this.subscribeToButtonClicks();
  }

  subscribeToButtonClicks() {
    this.componentRef.instance.onPlusClick
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._detailDialog.showModal();
      });
  }

  subscribeToDialogHide() {
    this._detailDialog.onDialogHide
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('dialog hide');
      });
  }

  subscribeToItemAddedId() {
    this._detailDialog.onAddedId
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id => {
        if (!this.ngControl) {
          throw new Error(
            'ngControl not available. You forgot to use the controlHost directive, [(ngModel)] or formControlName'
          );
        }
        this.ngControl.control!.setValue(id);
        console.log('item added with id', id);
      });
  }
}
