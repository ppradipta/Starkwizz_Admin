import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';
import { Hub, HubNotices, HubOffer } from 'src/app/model/hub';
import { EventsService } from 'src/app/services/events.service';
import { HubService } from 'src/app/services/hub.service';

@Component({
  selector: 'app-add-hubs',
  templateUrl: './add-hubs.component.html',
  styleUrls: ['./add-hubs.component.scss'],
})
export class AddHubsComponent implements OnInit {
  days = [
    { name: 'Sunday' },
    { name: 'Monday' },
    { name: 'Tuesday' },
    { name: 'Wednesday' },
    { name: 'Thursday' },
    { name: 'Friday' },
    { name: 'Saturday' },
  ];
  time: string;
  hub: Hub = new Hub();
  hubOffer: HubOffer = new HubOffer();
  hubNotice: HubNotices = new HubNotices();
  imgUrl: string;
  isEdit: boolean = false;
  selectStartTimeType: string = 'AM';
  selectendTimeType: string = 'PM';
  constructor(
    private hubService: HubService,
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute,
    public navCtrl: NavController,
    private generateKeyService: GenerateKeyService
  ) { }

  ngOnInit() {
    this.isEdit = this.route.snapshot.params.isEdit;
    this.eventsService.getHubDetails().subscribe(hub => {
      if (hub) {
        this.hub = hub;
      }
    });

    this.eventsService.getImageForUpload().subscribe(hubImg => {
      if (hubImg) {
        this.hub.imgUrl = hubImg;
      }
    })

    this.eventsService.getNoticeImgForUpload().subscribe(noticeImg => {
      if (noticeImg) {
        this.hubNotice.noticeImgUrl = noticeImg;
      }
    })

    if (this.hub.workingDays.length == 0) {
      this.days.forEach(hubworkingday => {
        let workingDay = {
          name: hubworkingday.name,
          startTime: "8:00 AM",
          endTime: "9:00 PM",
          isWorkingDay: true
        }
        this.hub.workingDays.push(workingDay);
      });
    }
  }
  ngOnDestroy() {
    this.eventsService.setHubDetails(null);
  }

  selectWorkingDay(event, workingday) {
    let index = this.hub.workingDays.findIndex(schl => schl.name === workingday.name);
    this.hub.workingDays[index].isWorkingDay = event.detail.checked;
  }



  selectStartTime(workingday) {
    let index = this.hub.workingDays.findIndex(schl => schl.name === workingday.name);
    this.hub.workingDays[index].startTime = workingday.startTime;
  }



  selectEndTime(workingday) {
    let index = this.hub.workingDays.findIndex(schl => schl.name === workingday.name);
    this.hub.workingDays[index].endTime = workingday.endTime;
  }

  save() {
    if (!this.isEdit) {
      let hubsDetails = this.hubService.populateHubDetails(this.hub);
      let hubOffer = this.hubService.populateHubOffersDetails(this.hub, hubsDetails.id)
      this.hubNotice.hubId=this.hub.id;

      this.hubService.setHubToCollection(hubsDetails);
      this.hubService.setHubOfferToCollection(hubOffer);
      this.hubService.setHubNoticesToCollection(this.hubNotice);
      this.eventsService.setHubDetails(null);
      this.router.navigate(['home/hubs']);

    } else {
      this.hubService.updateHubToCollection(this.hub).then(() => {
        this.router.navigate(['home/hubs']);
        this.eventsService.setHubDetails(null);
      })
    }
  }

  selectHubImage(event: any, hub) {
    let items = {
      imageType: 'HUB_IMAGE',
      imageUrl: event,
      id: hub.id,
      data: this.hub
    }
    this.eventsService.setImagesDataForUpload(items);
    this.router.navigate(['imageUpload']);
  }

  selectNoticeImage(event: any) {
    if (null == this.hubNotice.id) {
      this.hubNotice.id = this.generateKeyService.generateUniqueFirestoreId();
    }
    let items = {
      imageType: 'NOTICE_IMAGE',
      imageUrl: event,
      id: this.hubNotice.id,
      data: this.hubNotice
    }
    this.eventsService.setImagesDataForUpload(items);
    this.router.navigate(['imageUpload']);
  }

  goBack() {
    this.navCtrl.back();
  }
  onClickDeleteImage(hub) {
    hub.imgUrl = null;
  }

  onClickDeleteImageForNotice(hubNotice) {
    hubNotice.noticeImgUrl = null;
  }
}
