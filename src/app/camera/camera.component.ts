import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  public capturedImages: string[] = [];

  ngOnInit(): void {
    this.startCamera();
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.play();
    } catch (error) {
      console.error('Error accessing the camera', error);
    }
  }

  captureImage() {
    const context = this.canvas.nativeElement.getContext('2d');
    context!.drawImage(this.video.nativeElement, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const dataUrl = this.canvas.nativeElement.toDataURL('image/png');
    this.capturedImages.push(dataUrl);

    console.log(this.captureImage)
  }
}
