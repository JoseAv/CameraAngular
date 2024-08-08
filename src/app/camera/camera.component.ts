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
  public videoDevices: MediaDeviceInfo[] = [];
  public selectedDeviceId: string = '';

  ngOnInit(): void {
    this.enumerateDevices();
  }

  async enumerateDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.videoDevices = devices.filter(device => device.kind === 'videoinput');
    if (this.videoDevices.length > 0) {
      this.selectedDeviceId = this.videoDevices[0].deviceId;
      this.startCamera();
    }
  }

  async startCamera() {
    if (!this.selectedDeviceId) {
      console.error('No video device selected');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: this.selectedDeviceId } }
      });
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

    console.log(this.capturedImages);
  }

  onDeviceChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedDeviceId = target.value;
      this.startCamera();
    }
  }
}
