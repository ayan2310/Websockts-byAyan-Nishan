import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

export interface DrawData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Injectable({
  providedIn: 'root'
})
export class DrawSocketService {
  private socket$: WebSocketSubject<DrawData> = webSocket('ws://localhost:8080');

  public getMessages(): Observable<DrawData> {
    return this.socket$.asObservable();
  }

  public sendMessage(data: DrawData): void {
    this.socket$.next(data);
  }
}