import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly counter = signal(0);
  readonly isLoading = computed(() => this.counter() > 0);

  show() {
    this.counter.update((value) => value + 1);
  }

  hide() {
    this.counter.update((value) => Math.max(0, value - 1));
  }
}
