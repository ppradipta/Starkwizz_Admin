import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorageReference } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, IonModal, ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Events } from 'src/app/model/events';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { EventsService } from 'src/app/services/events.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocationComponent } from '../location/location.component';
import { AddEventsComponent } from './add-events/add-events.component';
import { CalculateRankComponent } from './calculate-rank/calculate-rank.component';
// import { DateUtilService } from '.../common/util/date-util.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  @ViewChild(IonModal) eventDescriptionModal: IonModal = {} as IonModal;
  @ViewChild(IonModal) eventInfoModal: IonModal = {} as IonModal;
  @ViewChild(IonModal) eventInstructionModal: IonModal = {} as IonModal;
  ref: AngularFireStorageReference;
  selectedSegment: string = "today";
  eventDetails: Events[] = [];
  boardEdit = false;
  isFilterEvent: boolean = false;
  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  allBoardDetails: BoardOfEducation[] = [];
  examSegmentValue: string = "ACTIVE";
  filterBoardId: string;
  filterClassId: string;
  filterSubjectId: string;
  filterModuleId: string;
  eventDate: string;
  queryRef = this.firestore.collection(FirebaseCollection.EVENTS).ref;
  cleanupEvents: any[] = [];
  actionType = 'SEARCH';
  isInstructionModalOpen: boolean = false;
  isInfoModalOpen: boolean = false;
  isDescriptionModalOpen: boolean = false;
  selectedEvent: any = {};
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private eventsService: EventsService,
    private alertController: AlertController,
    private toastController: ToastController,
    private dateUtilService: DateUtilService,
    private loaderService: LoadingService
  ) {
  }

  ngOnInit() {
    this.getAllBoards();
    //  this.handleOnBasisOfSegmentValue();
    //this.getUpcomingEvents();
  }

  async addEvents(actionType) {
    const modal = await this.modalController.create({
      component: AddEventsComponent,
      componentProps: {
        actionType: actionType
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }

  async cleanEvent(actionType) {
    this.actionType = actionType;
    this.cleanupEvents = [];
    if (this.filterBoardId && this.filterClassId && this.filterSubjectId) {
      let query = this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('classId', '==', this.filterClassId)
        .where('type', '==', 'EVENT')
        .where('subjectId', '==', this.filterSubjectId);
      query.get().then((eventDetail: any) => {
        if (!eventDetail.empty) {
          eventDetail.forEach(data => {
            this.cleanupEvents.push(data.data());
          });
        }
      });
    }
  }

  goToDeleteEvents(event) {
    let userevents = [];
    this.firestore.collection(FirebaseCollection.USER_EVENTS, ref => ref.where("eventId", "==", event.id)).get().subscribe((events: any) => {
      if (!events.empty) {
        events.forEach(res => {
          userevents.push(res.data());
        });
        this.deleteEventForUserEvents(event);
      } else {
        this.firestore.collection(FirebaseCollection.EVENTS).doc(event.id).delete().then(res => {
          this.presentToast('Event Deleted Sucessfully ' + event.eventName);
        })
      }

    });

  }



  goToAddQuestions(event) {
    this.router.navigate(['home/questionPreview']);
    this.eventsService.setEventData(event);
  }
  onClickBoard(event, action) {
    if (action == 'EDIT') {
      this.boardEdit = !this.boardEdit;
    } else {
      this.boardEdit = !this.boardEdit;
      this.firestore.collection('events').doc(event.id)
        .update(JSON.parse(JSON.stringify(event)));
    }
  }

  async deleteEventForUserEvents(event) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: "Confirm Alert",
      message: "Are you sure want to delete event as it already appeared by some users",
      buttons: [
        {
          text: "Cancel Event",
          role: "CANCEL",
          cssClass: "secondary",
          handler: (CANCEL) => {
          }
        },
        {
          text: "Delete Event",
          role: "DELETE",
          handler: (DELETE) => {
            if (null != event && null != event.id) {
              this.firestore.collection('events').doc(event.id).delete().then(() => {
                this.presentToast('Event DELETED SuccessFully !!!.');
              });
            } else {
              this.presentToast('Something went wrong !!');
            }

          }
        }
      ]
    });
    await alert.present();
  }

  async deleteEvent(event) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: "Confirm Alert",
      message: "Are you Sure ?",
      buttons: [
        {
          text: "Cancel Event",
          role: "CANCEL",
          cssClass: "secondary",
          handler: (CANCEL) => {
            return this.firestore.collection(FirebaseCollection.EVENTS).doc(event.id)
              .update({
                status: 'CANCELLED'
              }).then(() => {
                this.presentToast('Event Marked as CANCELLED !!!.');
              });
          }
        },
        {
          text: "Delete Event",
          role: "DELETE",
          handler: (DELETE) => {
            if (null != event && null != event.id) {
              this.firestore.collection('events').doc(event.id).delete().then(() => {
                this.search();
                this.presentToast('Event DELETED SuccessFully !!!.');
              });
            } else {
              this.presentToast('Something went wrong !!');
            }

          }
        }
      ]
    });
    await alert.present();
  }

  async linkSchoolForEvent(event) {
    this.eventsService.setTabValue('SCHOOLS');
    const modal = await this.modalController.create({
      component: LocationComponent,
      componentProps: {
        actionType: 'LINK_SCHOOL',
        event: event
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }

  fileChangeEvent(event: any, eventDetail) {
    let items = {
      imageType: 'EVENT_IMAGE',
      imageUrl: event,
      id: eventDetail.id
    }
    this.eventsService.setImagesDataForUpload(items);
    this.router.navigate(['imageUpload']);
  }



  getAllBoards() {
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref.get().then((board: any) => {
      if (!board.empty) {
        board.forEach(data => {
          this.allBoardDetails.push(data.data());
        });
      }
    })
  }

  selectBoard(event) {
    this.classes = [];
    this.filterBoardId = event.detail.value.id;
    let arr = [];
    this.firestore.collection("classes", ref => ref.where("boardId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        arr.push(res.data());
      });
      this.classes = arr.sort((a, b) => (a.displayName - b.displayName));
    });
  }

  selectClass(event) {
    this.filterClassId = event.detail.value.id;
    this.subjects = [];
    this.firestore.collection("subjects", ref => ref.where("classId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.subjects.push(res.data());
      })
    });
  }

  selectSubject(event) {
    this.filterSubjectId = event.detail.value.id;
    this.modules = [];
    this.firestore.collection("modules", ref => ref.where("subjectId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.modules.push(res.data());
      })
    });
  }

  selectModule(event) {
    this.filterModuleId = event.detail.value.id;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  eventTabChanged(event) {
    this.examSegmentValue = event.detail.value;
    this.eventDetails = [];
    this.search();
  }


  async search() {
    this.loaderService.present();
    this.eventDetails = [];
    let query;
    if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId) {

      query = this.eventDate != null ? this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('classId', '==', this.filterClassId)
        .where('subjectId', '==', this.filterSubjectId)
        .where('moduleId', '==', this.filterModuleId)
        .where('eventStartDate', '==', this.eventDate)
        .where('status', '==', this.examSegmentValue)
        .where('type', '==', 'EVENT')
        .orderBy('className') :
        this.queryRef
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('status', '==', this.examSegmentValue)
          .where('type', '==', 'EVENT')
          .orderBy('className')
    } else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId) {
      query = this.eventDate != null ? this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('classId', '==', this.filterClassId)
        .where('subjectId', '==', this.filterSubjectId)
        .where('moduleId', '==', this.filterModuleId)
        .where('eventStartDate', '==', this.eventDate)
        .where('status', '==', this.examSegmentValue)
        .where('type', '==', 'EVENT')
        .orderBy('className') : this.queryRef
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('status', '==', this.examSegmentValue)
          .where('type', '==', 'EVENT')
          .orderBy('className')
    }

    else if (this.filterBoardId && this.filterClassId && this.filterSubjectId) {
      query = this.eventDate != null ? this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('classId', '==', this.filterClassId)
        .where('subjectId', '==', this.filterSubjectId)
        .where('eventStartDate', '==', this.eventDate)
        .where('status', '==', this.examSegmentValue)
        .where('type', '==', 'EVENT')
        .orderBy('className') :
        this.queryRef
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('status', '==', this.examSegmentValue)
          .where('type', '==', 'EVENT')
          .orderBy('className')
    }
    else if (this.filterBoardId && this.filterClassId) {
      query = this.eventDate != null ? this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('classId', '==', this.filterClassId)
        .where('eventStartDate', '==', this.eventDate)
        .where('status', '==', this.examSegmentValue)
        .where('type', '==', 'EVENT')
        .orderBy('className') :
        this.queryRef
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('status', '==', this.examSegmentValue)
          .where('type', '==', 'EVENT')
          .orderBy('className')
    }
    else if (this.filterBoardId) {
      query = this.eventDate != null ? this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('eventStartDate', '==', this.eventDate)
        .where('status', '==', this.examSegmentValue)
        .where('type', '==', 'EVENT')
        .orderBy('className') :
        this.queryRef
          .where('boardId', '==', this.filterBoardId)
          .where('status', '==', this.examSegmentValue)
          .where('type', '==', 'EVENT')
          .orderBy('className')

    } else {
      query = this.queryRef
        .where('eventStartDate', '==', this.eventDate)
        .where('status', '==', this.examSegmentValue)
        .where('type', '==', 'EVENT')
        .orderBy('className');
    }

    query.get().then((eventDetail: any) => {
      if (!eventDetail.empty) {
        eventDetail.forEach(data => {
          this.eventDetails.push(data.data());
        });
        this.eventDetails = this.dateUtilService.sortingBasedOnEventDate(this.eventDetails);
      }
    });
  }

  editEvent(event) {
    this.eventsService.setEventData(event);
    this.addEvents('EDIT');
  }
  changeEventStatus(target, event) {
    event.status = target.detail.value;
    this.firestore.collection('events').doc(event.id).update(JSON.parse(JSON.stringify(event)));
  }

  async calculateRank(event) {
    const modal = await this.modalController.create({
      component: CalculateRankComponent,
      componentProps: {
        event: event,
        eventType: 'EVENTS'
      },
      cssClass: 'center-modal',
      backdropDismiss: false
    });
    await modal.present();

  }

  viewRank(event) {
    this.eventsService.setEventData(event);
    this.router.navigate(['home/rank'], { queryParams: { EVENTTYPE: 'EVENT'} });

  }

  eventsActivity(event) {
    this.eventsService.setEventData(event);
    this.router.navigate(['home/event-activity']);
  }

  changeDownloadOptionForEvent(event) {
    let value: boolean = event.isDownloadAnsAllow != null || !event.isDownloadAnsAllow ? !event.isDownloadAnsAllow : true;
    this.firestore.collection('events').doc(event.id).update({
      isDownloadAnsAllow: value
    });
  }

  changeLeaderBoardDisplayAllowForEvent(event) {
    let value: boolean = event.isLeaderBoardAllow != null || !event.isLeaderBoardAllow ? !event.isLeaderBoardAllow : true;
    this.firestore.collection('events').doc(event.id).update({
      isLeaderBoardAllow: value
    });
  }

  changeReviewAnsForEvent(event) {
    let value: boolean = event.isReviewAnsAllow != null || !event.isReviewAnsAllow ? !event.isReviewAnsAllow : true;
    this.firestore.collection('events').doc(event.id).update({
      isReviewAnsAllow: value
    });
  }

  changePublishRankForEvent(event) {
    let value: boolean = event.isPublishRankAllow != null || !event.isPublishRankAllow ? !event.isPublishRankAllow : true;
    this.firestore.collection('events').doc(event.id).update({
      isPublishRankAllow: value
    });
  }
  modalDismiss() {
    this.isInstructionModalOpen = false;
    this.isInfoModalOpen = false;
    this.isDescriptionModalOpen = false;
    this.eventInstructionModal.dismiss(null, 'cancel');
    this.eventInfoModal.dismiss(null, 'cancel');
    this.eventDescriptionModal.dismiss(null, 'cancel');
  }


  onClickInstructionModal(event) {
    this.loaderService.present();
    this.selectedEvent = event;
    this.firestore.collection("event_instructions").doc(event.id).get().subscribe((eventInsDetails: any) => {
      this.isInstructionModalOpen = true;
      if (eventInsDetails.exists) {
        const record = eventInsDetails.data();
        this.selectedEvent.instruction = record.instruction;
        event.instruction = record.instruction;
      } else {
        this.selectedEvent.instruction = {};
        event.instruction = {};
      }

    });

  }

  onConfirmInstruction() {
    this.loaderService.present();
    let instruction = {
      id: this.selectedEvent.id,
      instruction: this.selectedEvent.instruction
    }
    this.firestore.collection('event_instructions').doc(this.selectedEvent.id).set(JSON.parse(JSON.stringify(instruction)), { merge: true }).then(result => {
      this.isInstructionModalOpen = false;
      this.modalDismiss();
      this.presentToast('Event Instruction added sucessfully!!!');

    })
  }

  onClickInfoModal(event) {
    this.loaderService.present();
    this.selectedEvent = event;
    this.firestore.collection("event_information").doc(event.id).get().subscribe((eventInsDetails: any) => {
      this.isInfoModalOpen = true;
      if (eventInsDetails.exists) {
        const record = eventInsDetails.data();
        this.selectedEvent.information = record.information;
        event.information = record.information;
      } else {
        event.information = {};
        this.selectedEvent.information = {};
      }

    });
  }


  onConfirmInformation() {
    this.loaderService.present();
    let info = {
      id: this.selectedEvent.id,
      information: this.selectedEvent.information
    }
    this.firestore.collection('event_information').doc(this.selectedEvent.id).set(JSON.parse(JSON.stringify(info)), { merge: true }).then(result => {
      this.isInfoModalOpen = false;
      this.modalDismiss();
      this.presentToast('Event Information added sucessfully!!!');

    })

  }


  onClickDescriptionModal(event) {
    this.loaderService.present();
    this.selectedEvent = event;
    this.firestore.collection("event_description").doc(event.id).get().subscribe((eventInsDetails: any) => {
      this.isDescriptionModalOpen = true;
      if (eventInsDetails.exists) {
        const record = eventInsDetails.data();
        this.selectedEvent.description = record.description;
        event.description = record.description;
      } else {
        this.selectedEvent.description = {};
        event.description = {};
      }

    });
  }

  onConfirmDescription() {
    this.loaderService.present();
    let desc = {
      id: this.selectedEvent.id,
      description: this.selectedEvent.description
    }
    this.firestore.collection('event_description').doc(this.selectedEvent.id).set(JSON.parse(JSON.stringify(desc)), { merge: true }).then(result => {
      this.isDescriptionModalOpen = false;
      this.modalDismiss();
      this.presentToast('Event Description added sucessfully!!!');

    })

  }
}
