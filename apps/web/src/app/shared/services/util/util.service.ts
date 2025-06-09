import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  get isMobile() {
    return window.innerWidth < 640;
  }

}
