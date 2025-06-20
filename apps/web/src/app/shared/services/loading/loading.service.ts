import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingState = new BehaviorSubject<boolean>(false);

  escutarLoadingState(): Observable<boolean> {
    return this.loadingState.asObservable();
  }

  show(): void {
    this.loadingState.next(true);
  }

  hide(): void {
    this.loadingState.next(false);
  }

}
