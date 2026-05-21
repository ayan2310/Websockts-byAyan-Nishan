import {Component, ElementRef, inject, ViewChild} from '@angular/core';


@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // TODO: inject DrawSocketService

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    window.addEventListener('mouseup', () => this.isDrawing = false);

    // TODO: subscribe to incoming messages and call
    // this.renderLine(data.x1, data.y1, data.x2, data.y2, '#00aeff')
  }

  startDrawing(e: MouseEvent) {
    this.isDrawing = true;
    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
  }

  drawLocal(e: MouseEvent) {
    if (!this.isDrawing) return;
    const currentX = e.offsetX;
    const currentY = e.offsetY;

    this.renderLine(this.lastX, this.lastY, currentX, currentY, '#ff0055');

    // TODO: send the coordinates via the socket service

    [this.lastX, this.lastY] = [currentX, currentY];
  }

  private renderLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
