import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  Optional,
  Renderer2,
  ViewContainerRef,
  DestroyRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  ValidationMessage,
  ValidationMessages,
} from '../../shared/validation-messages';
import { FormValidationMessagesComponent } from '../../components/form-validation-messages/form-validation-messages.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[validationMessages]',
  standalone: true,
})
export class ValidationMessagesDirective {
  private ngControl: NgControl;

  private componentsMap = new Map<
    string,
    ComponentRef<FormValidationMessagesComponent>
  >();

  private parent: any;
  private isInputGroup = false;

  @Input() validationMessages: ValidationMessages<any> = {};

  constructor(
    private container: ViewContainerRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Optional() ngControl: NgControl,
    private destroyRef: DestroyRef
  ) {
    if (!ngControl) {
      throw new Error(
        "Can't use [validationMessages] directive out of [(ngModel)] or FormControl"
      );
    }
    this.ngControl = ngControl;
  }

  ngAfterContentInit() {
    this.checkIfIsInputGroup();
    this.ngControl
      .statusChanges!.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateErrorMessages();
      });
  }

  updateErrorMessages() {
    const controlValidationMessages = this.getControlValidationMessages(
      this.ngControl
    );
    controlValidationMessages.forEach(vm => {
      if (this.controlIsTouchedAndHasError(vm.type)) {
        this.createErrorMessage(vm);
      } else {
        this.removeErrorMessage(vm.type);
      }
    });
  }

  controlIsTouchedAndHasError(type: string): boolean {
    return (
      this.ngControl.invalid === true &&
      (this.ngControl.dirty === true || this.ngControl.touched === true) &&
      this.ngControl.hasError(type)
    );
  }

  getControlValidationMessages(control: NgControl): ValidationMessage[] {
    return this.validationMessages[control.name!] || [];
  }

  createErrorMessage(validationMessage: ValidationMessage) {
    if (this.componentsMap.has(validationMessage.type)) {
      return; // already created
    }
    const componentRef = this.container.createComponent(
      FormValidationMessagesComponent
    );
    componentRef.instance.validationMessage.set(validationMessage.message);
    this.componentsMap.set(validationMessage.type, componentRef);
    if (this.isInputGroup) {
      this.renderer.appendChild(
        this.parent,
        componentRef.location.nativeElement
      );
    }
  }

  removeErrorMessage(type: string) {
    if (!this.componentsMap.has(type)) {
      return; // it no longer existed
    }
    const componentRef = this.componentsMap.get(type);
    const index = this.container.indexOf(componentRef!.hostView);
    this.container.remove(index);
    this.componentsMap.delete(type);
  }

  checkIfIsInputGroup() {
    const parent = this.renderer.parentNode(this.elementRef.nativeElement);
    this.isInputGroup = parent.classList.contains('p-inputgroup');
    if (this.isInputGroup) {
      this.parent = this.renderer.parentNode(parent); // two parents up
    }
  }
}
