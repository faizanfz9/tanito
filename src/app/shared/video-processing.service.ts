import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VideoProcessingService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  public promptForVideo(): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      // make file input element in memory
      const fileInput: any = this.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.setAttribute('capture', 'camera');
      // fileInput['capture'] = 'camera';
      fileInput.addEventListener('error', (event: any) => {
        reject(event.error);
      });
      fileInput.addEventListener('change', (event: any) => {
        resolve(fileInput.files[0]);
      });
      // prompt for video file
      // fileInput.click();
    });
  }

  public generateThumbnail(videoFile: Blob, isPostVideo: any): Promise<string> {
    const video: HTMLVideoElement = this.document.createElement('video');
    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    return new Promise<string>((resolve, reject) => {
      video.onloadedmetadata = function() {
        if(isPostVideo) {
          if(video.duration > 180) {
            reject("Upload video of less than 180 seconds!")
          }
        }else {
          if(video.duration > 30) {
            reject("Upload video of less than 30 seconds!")
          }
        }
      };
      video.addEventListener('canplay', event => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        resolve(canvas.toDataURL());
      });
      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = window.URL.createObjectURL(videoFile);
      video.load();
    });
  }

}

