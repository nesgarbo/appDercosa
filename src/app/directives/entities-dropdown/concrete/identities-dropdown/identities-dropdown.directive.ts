import { Directive, inject } from '@angular/core';
import { EntityDropdown } from '../../entity-dropdown/entity-dropdown';
import { Identity } from 'sigalorent5';
import { IdentitiesStore } from '../../../../signal-store/stores/identities';
import { Dropdown } from 'primeng/dropdown';
import { NgControl } from '@angular/forms';
import { Translatable } from '../../../../../utils/translation/translatable';

@Directive({
  selector: 'p-dropdown[identities]',
  standalone: true,
})
export class IdentitiesDropdownDirective extends EntityDropdown<Identity> {
  private identitiesStore = inject(IdentitiesStore);
  constructor(dropdown: Dropdown, control: NgControl) {
    super(dropdown, control);
  }

  getSignalStore() {
    return this.identitiesStore;
  }

  protected get placeholder(): Translatable {
    return { translationKey: 'SELECT_AN_IDENTITY' };
  }

  protected get optionLabel(): keyof Identity {
    return 'name';
  }

  protected get searchInFields(): (keyof Identity)[] {
    return [
      'alias',
      'name',
      'streetAddress',
      'city',
      'zipCode',
      'email',
      'web',
      'taxIdNumber',
      'phone',
    ];
  }
}
