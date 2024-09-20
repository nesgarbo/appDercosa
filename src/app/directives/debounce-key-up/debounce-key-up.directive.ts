import {
  DestroyRef,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Directive({
  selector: 'input[appDebounceKeyUp]',
  standalone: true,
})
export class DebounceKeyUpDirective implements OnInit {
  private destroyRef = inject(DestroyRef);
  @Input() debounceTime = 200;
  @Output() onDebounced = new EventEmitter<KeyboardEvent>();

  // emission data
  private emitEvent$ = new Subject<KeyboardEvent>();
  public keyup$ = this.emitEvent$.asObservable();

  @HostListener('keyup', ['$event'])
  private OnKeyUp(ev: KeyboardEvent) {
    this.emitEvent$.next(ev);
  }

  constructor() {}

  ngOnInit() {
    this.subscribeToEvent();
  }

  private emitChange(value: any): void {
    this.onDebounced.emit(value);
  }

  private subscribeToEvent() {
    this.keyup$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        tap(value => this.emitChange(value))
      )
      .subscribe();
  }
}
