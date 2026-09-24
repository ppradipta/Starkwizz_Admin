import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { EventsService } from 'src/app/services/events.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {

  ref: AngularFireStorageReference;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageSelected: boolean = false;
  id: string;
  imageType: string;
  imagedataSubscribe: any;
  category: any;
  imageURL: string;
  data:any;
  constructor(
    private eventsService: EventsService,
    private storage: AngularFireStorage,
    private navCtrl: Location,
    public firestore: AngularFirestore,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.getImagesData();
  }

  getImagesData() {
    this.imagedataSubscribe = this.eventsService.getImagesDataForUpload().subscribe(data => {
      console.log('img data', data);
      if (null != data) {
        this.imageChangedEvent = data.imageUrl;
        this.imageType = data.imageType;
        this.id = data.id;
        this.data = data.data
        this.fileChangeEvent(this.imageChangedEvent);
        this.imageCropped(this.imageChangedEvent);
      }


    })

  }
  saveUserImg() {
    this.loading.present();
    let encodeImg = this.croppedImage.split(',')[1];
    var cacheMetaData = {
      cacheControl: 'public,max-age=40000',
    }

    if(this.imageType == 'EVENT_IMAGE'){
      this.ref = this.storage.ref('event' + this.category + '/images/' + this.id);
      this.ref.putString(encodeImg, 'base64', cacheMetaData).then(data => {
        this.ref.getDownloadURL().subscribe(iurl => {
            //this.eventsService.setImageForUpload(iurl);
          this.saveEventImage(iurl);
          this.loading.dismiss();
          this.navCtrl.back();
        });
      });
    }
    else if(this.imageType == 'PICTURE_CHOICE'){
      this.eventsService.setQuestionType('PICTURE_CHOICE');
      this.eventsService.setIsGenerateQuestionSequence(false);
      this.eventsService.setQuestion(this.data);
      this.ref = this.storage.ref('event' + this.category + '/images/' + this.id);
      this.ref.putString(encodeImg, 'base64', cacheMetaData).then(data => {
        this.ref.getDownloadURL().subscribe(iurl => {
            this.eventsService.setImageForUpload(iurl);
            this.loading.dismiss();
            this.navCtrl.back();
        });
      });
    }
    else if(this.imageType == 'HUB_IMAGE'){
      this.ref = this.storage.ref('hub' + this.category + '/images/' + this.id);
      this.ref.putString(encodeImg, 'base64', cacheMetaData).then(data => {
        this.ref.getDownloadURL().subscribe(hubImg => {
        this.eventsService.setImageForUpload(hubImg);
          //this.saveHubImage(iurl);
          this.loading.dismiss();
          this.navCtrl.back();
        });
      });
    }
    else if(this.imageType == 'NOTICE_IMAGE'){
      this.ref = this.storage.ref('hub' + this.category + '/images/' + this.id);
      this.ref.putString(encodeImg, 'base64', cacheMetaData).then(data => {
        this.ref.getDownloadURL().subscribe(noticeImg => {
        this.eventsService.setNoticeImgForUpload(noticeImg);
          //this.saveHubImage(iurl);
          this.loading.dismiss();
          this.navCtrl.back();
        });
      });
    }
      
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageSelected = true;
  }

  
  saveEventImage(imageURL){
    if(null != imageURL && this.imageType == 'EVENT_IMAGE'){
      this.firestore.collection(FirebaseCollection.EVENTS).doc(this.id)
        .update({
          imageURL: imageURL
        });
    }
  }

  // saveHubImage(imageURL){
  //   if(null != imageURL && this.imageType == 'HUB_IMAGE'){
  //     this.firestore.collection(FirebaseCollection.HUBS).doc(this.id)
  //       .update({
  //         imageURL: imageURL
  //       });
  //   }
  // }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }


}
