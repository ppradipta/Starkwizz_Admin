import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';


@Component({
  selector: 'posted-video-modal',
  templateUrl: './posted-video-modal.component.html',
  styleUrls: ['./posted-video-modal.component.scss'],
})
export class PostedVideoModalComponent implements OnInit {

  @Input() video: any;


  constructor(
    public modalController: ModalController,
    public firestore: AngularFirestore,
    private router: Router,
    private dateUtilService: DateUtilService
  ) { }

  ngOnInit() {

  }




  approveVideo() {
    this.firestore.collection('video_upload').doc(this.video.id)
      .update({
        status: 'APPROVED',
        publishdate: this.dateUtilService.getCurrentDateWithTime(),
        publishBy: 'ADMIN'
      });
  }


  rejectVideo() {
    this.firestore.collection('video_upload').doc(this.video.id)
      .update({
        status: 'REJECTED',
        rejectedDate: this.dateUtilService.getCurrentDateWithTime(),
        rejectedBy: 'ADMIN'
      });

  }

  onClickClose() {
    this.modalController.dismiss();
  }


  


}

