import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  videoList: any[] = [];
  tabValue: string = "POSTED";
  constructor(public firestore: AngularFirestore,
    public uploadService: UploadService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getVideoList();
  }


  getVideoList() {
    this.videoList = [];
    this.firestore.collection('video_upload', ref => ref.where('status', '==', this.tabValue)).get().subscribe((videos: any) => {
      if (!videos.empty) {
        videos.forEach(data => {
          this.videoList.push(data.data());
        });
      }
    });
  }
  approved(videos, status) {
    this.uploadService.updatVideoStatusToCollection(videos.id, status, null);
    this.getVideoList();

  }
  rejectUpdate(videos, status, comment) {
    this.uploadService.updatVideoStatusToCollection(videos.id, status, comment);
    this.getVideoList();

  }
  tabChanged(event) {
    console.log(event.detail.value);
    this.tabValue = event.detail.value;
    this.getVideoList();
  }
  async reject(videos, status) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Reject Comment',
      inputs: [
        {
          name: 'Comment',
          type: 'text',
          placeholder: 'Enter your comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (comment) => {
            console.log('Confirm Ok', comment.Comment);
            this.rejectUpdate(videos, status, comment.Comment);
          }
        }
      ]
    });

    await alert.present();
  }

}
