import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {DrawData, DrawSocketService} from '../draw-socket.service';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private socketService = inject(DrawSocketService);
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    window.addEventListener('mouseup', () => this.isDrawing = false);

    this.socketService.getMessages().subscribe({
      next: (data: DrawData) => {
        this.renderLine(data.x1, data.y1, data.x2, data.y2, '#00aeff');
      },
      error: (err) => console.error('WebSocket Error:', err),
      complete: () => console.warn('WebSocket connection closed cleanly.')
    });
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
    this.socketService.sendMessage({
      x1: this.lastX, y1: this.lastY,
      x2: currentX, y2: currentY
    });
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