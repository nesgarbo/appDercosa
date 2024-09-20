import { Directive, inject } from '@angular/core';
import { EntityDropdown } from '../../entity-dropdown/entity-dropdown';
import { Dropdown } from 'primeng/dropdown';
import { NgControl } from '@angular/forms';
import { BrokersStore } from '../../../../signal-store/stores/brokers';
import { Translatable } from '../../../../../utils/translation/translatable';
import { Broker } from 'sigalorent5';

@Directive({
  selector: 'p-dropdown[brokers]',
  standalone: true,
})
export class BrokersDropdownDirective extends EntityDropdown<Broker> {
  private brokersStore = inject(BrokersStore);
  constructor(dropdown: Dropdown, control: NgControl) {
    super(dropdown, control);
  }

  getSignalStore() {
    return this.brokersStore;
  }

  protected get placeholder(): Translatable {
    return { translationKey: 'SELECT_AN_AGENT' };
  }

  protected get optionLabel(): keyof Broker {
    return 'nombre';
  }

  protected get searchInFields(): (keyof Broker)[] {
    return [
      'razon',
      'nombre',
      'direccion',
      'email',
      'tel',
      'poblacion',
      'cif',
      'tel',
      'fax',
      'email',
      'observaciones',
    ];
  }
}
