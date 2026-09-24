import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment-timezone';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Events, Parameters } from 'src/app/model/events';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
})
export class AddEventsComponent implements OnInit {
  @Input() actionType: string;
  @Input() quizType: string;

  boardDetails: any[] = [];
  classDetails: any[] = [];
  subjectDetails: any[] = [];
  moduleDetails: any[] = [];
  parameterData: Parameters[] = [];
  eventDetails: Events = new Events();
  eventStartDate: any;
  eventEndDate: any;
  eventType: any;
  eventTypes: any[] = [];
  eventCategories: any[] = [];
  eventCategory: any;
  category: any;
  categories: any[] = [];
  public minDate = moment().format();
  public maxDate = moment().add(400, 'd').format();
  questionPatterns: any[] = [];
  applicableTypes: any[] = [];

  stateList: any = [] = [];
  districts: any[] = [];
  cities: any[] = [];
  schools: any = [] = [];
  actionSheetState = {
    header: 'States',
  };
  actionSheetDistrict = {
    header: 'Districts',
  };
  actionSheetCity = {
    header: 'Cities',
  };
  actionSheetSchool = {
    header: 'Schools',
  };
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    public eventsService: EventsService,
    private toastController: ToastController,
    private dateUtil: DateUtilService,
  ) { }

  ngOnInit() {
    this.getAllBoardData();
    if (this.actionType == 'EDIT') {
      this.eventsService.getEventData().subscribe(event => {
        this.eventDetails = event;
        if (null != event) {
          let indexapt = this.applicableTypes.findIndex(at => at.id === event.applicableType);
          if (indexapt == -1) {
            this.applicableTypes.push({
              id: event.applicableType,
              displayName: event.applicableType
            });
          }
          let indexqp = this.questionPatterns.findIndex(at => at.id === event.questionPattern);
          if (indexqp == -1) {
            this.questionPatterns.push({
              id: event.questionPattern,
              displayName: event.questionPattern
            });
          }
          let indexet = this.eventTypes.findIndex(at => at.id === event.typeId);
          if (indexet == -1) {
            this.eventTypes.push({
              id: event.typeId,
              displayName: event.type
            });
          }
          let indexcid = this.categories.findIndex(at => at.id === event.categoryId);
          if (indexcid == -1) {
            this.categories.push({
              id: event.categoryId,
              displayName: event.category
            });
          }
          let indexecid = this.eventCategories.findIndex(at => at.id === event.eventCategoryId);
          if (indexecid == -1) {
            this.eventCategories.push({
              id: event.eventCategoryId,
              displayName: event.eventCategory
            });
          }

          // this.boardDetails.findIndex(at => at.id === event.boardId);
          // if (indexboard == -1) {
          //   this.boardDetails.push({
          //     id: event.boardId,
          //     displayName: event.boardName
          //   });
          // }

          let indexclass = this.classDetails.findIndex(at => at.id === event.classId);
          if (indexclass == -1) {
            this.classDetails.push({
              id: event.classId,
              displayName: event.className
            })
          }
          let indexsubjectid = this.subjectDetails.findIndex(at => at.id === event.subjectId);
          if (indexsubjectid == -1) {
            this.subjectDetails.push({
              id: event.subjectId,
              displayName: event.subjectName
            })
          }
          let indexmoduleid = this.moduleDetails.findIndex(at => at.id === event.moduleId);
          if (indexmoduleid == -1) {
            this.moduleDetails.push({
              id: event.moduleId,
              displayName: event.moduleName
            })
          }
        }

      });
    }

  }

  close() {
    this.modalController.dismiss();
  }

  getAllBoardData() {
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref
      .get().then((boards: any) => {
        this.boardDetails = [];
        if (!boards.empty) {
          boards.forEach(data => {
            this.boardDetails.push(data.data());
          });
        }
      })
  }

  selectBoard(event) {

  }

  selectClass(event) {
    let boarddetls = this.boardDetails.find(cld => cld.id == this.eventDetails.boardId);
    if (boarddetls) {
      this.eventDetails.boardName = boarddetls.name;
    }
    this.classDetails = [];
    this.firestore.collection("classes", ref => ref.where("boardId", "==", this.eventDetails.boardId)).get().subscribe(data => {
      data.forEach(res => {
        this.classDetails.push(res.data());
        this.classDetails = this.classDetails.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
      })
    });

  }

  seleEventCategory() {
    let docId = 'eventcategoryname';
    this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId).get().subscribe(records => {
      this.eventCategories = [];
      if (records.exists) {
        let fetchData = records.data();
        this.eventCategories = fetchData['values'];
        if(this.quizType == 'QUIZWHIZZ') {
          this.eventCategories = this.eventCategories.filter(ass => ass.id == 'quizwhizz')
        } else {
          this.eventCategories = this.eventCategories.filter(ass => ass.id != 'quizwhizz')
        }
      }
    });

  }
  selectSubject(event) {
    let classdetls = this.classDetails.find(cld => cld.id == this.eventDetails.classId);
    if (classdetls) {
      this.eventDetails.className = classdetls.name;
    }
    if (this.eventDetails.eventCategoryId) {
      let evtcatdetl = this.eventCategories.find(catg => catg.id == this.eventDetails.eventCategoryId);
      if (evtcatdetl) {
        this.eventDetails.eventCategory = evtcatdetl.displayName;
      }
    }
    this.subjectDetails = [];
    if (null != this.eventDetails.eventCategory) {
      this.firestore.collection("subjects", ref => ref
        .where("classId", "==", this.eventDetails.classId)
        .where("category", "==", this.eventDetails.eventCategory))
        .get().subscribe(data => {
          data.forEach(res => {
            this.subjectDetails.push(res.data());
          })
        });
    } else {
      this.presentToast('Please select Event Category');
    }

  }

  selectModule(event) {
    // this.eventDetails.moduleName = event.detail.value.displayName;
    // this.eventDetails.moduleId = event.detail.value.id;
    let subjetls = this.subjectDetails.find(subj => subj.id == this.eventDetails.subjectId);
    if (subjetls) {
      this.eventDetails.subjectName = subjetls.displayName;
      this.eventDetails.colorCode = subjetls.colorCode;
    }

    this.moduleDetails = [];
    this.firestore.collection("modules", ref => ref.where("subjectId", "==", this.eventDetails.subjectId)).get().subscribe(data => {
      data.forEach(res => {
        this.moduleDetails.push(res.data());
      })
    });
  }

  saveEvent() {
    if (null == this.eventDetails.eventCategoryId && null == this.eventDetails.typeId) {
      this.presentToast("Event Category and Event Type can't be empty");
    } else {
      if (this.eventDetails.moduleId) {
        let moduldtl = this.moduleDetails.find(modul => modul.id == this.eventDetails.moduleId);
        if (moduldtl) {
          this.eventDetails.moduleName = moduldtl.displayName;
        }
      }
      if (this.eventDetails.categoryId) {
        let catdetl = this.categories.find(catg => catg.id == this.eventDetails.categoryId);

        if (catdetl) {
          this.eventDetails.category = catdetl.displayName;
        }
      }

      if (this.eventDetails.eventCategoryId) {
        let evtcatdetl = this.eventCategories.find(catg => catg.id == this.eventDetails.eventCategoryId);
        if (evtcatdetl) {
          this.eventDetails.eventCategory = evtcatdetl.displayName;
        }
      }

      if (this.eventDetails.typeId) {
        let evttype = this.eventTypes.find(catg => catg.id == this.eventDetails.typeId);
        if (evttype) {
          this.eventDetails.type = evttype.displayName;
        }
      }

      if (this.eventDetails.stateId) {
        let selectState = this.stateList.find(st => st.id == this.eventDetails.stateId);
        if (selectState) {
          this.eventDetails.stateName = selectState.displayName;
        }
      }

      if (this.eventDetails.districtId) {
        let selectDistrict = this.districts.find(dist => dist.id == this.eventDetails.districtId);
        if (selectDistrict) {
          this.eventDetails.districtName = selectDistrict.displayName;
        }
      }

      if (this.eventDetails.cityId) {
        let selectCity = this.cities.find(city => city.id == this.eventDetails.cityId);
        if (selectCity) {
          this.eventDetails.cityName = selectCity.displayName;
        }
      }

      if (this.eventDetails.schoolId) {
        let selectSchool = this.schools.find(school => school.id == this.eventDetails.schoolId);
        if (selectSchool) {
          this.eventDetails.schoolName = selectSchool.displayName;
        }
      }

      let eventData = this.eventsService.populateEventDetailsToCollection(this.eventDetails);
      eventData.status = 'NOQUESTION';
      this.eventsService.setEventDetailsToCollecton(eventData).then((data) => {
        this.presentToast("Event Details saved Successfully !!!");
      });
    }

    this.close();
  }



  selectEventType() {
    let docId = 'eventeventtype';
    this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId).get().subscribe(records => {
      this.eventTypes = [];
      if (records.exists) {
        let fetchData = records.data();
        this.eventTypes = fetchData['values'];
        if(this.quizType == 'QUIZWHIZZ') {
          this.eventTypes = this.eventTypes.filter(ass => ass.id == 'quizwhizzexam' || ass.id == 'quizwhizz2exam')
          console.log('this.eventTypes: ', this.eventTypes);
        } else {
          this.eventTypes = this.eventTypes.filter(ass => ass.id != 'quizwhizzexam' && ass.id != 'quizwhizz2exam')
          console.log('this.eventTypes: ', this.eventTypes);
        }
      }
    });

  }

  selectCategory() {
    let docId = 'event';
    if (this.eventCategory) {
      docId = docId + this.eventCategory.id;
    } else {
      docId = docId + 'scholastic';
    }

    this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId).get().subscribe(records => {
      this.categories = [];
      if (records.exists) {
        let fetchData = records.data();
        this.categories = fetchData['values'];
      }
    });
  }

  selectApplicableType(event) {
    let docId = 'applicabletype';
    this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId).get().subscribe(records => {
      // this.categories = [];
      if (records.exists) {
        let fetchData = records.data();
        this.applicableTypes = fetchData['values'];
      }
    });
  }

  selectQuestionPattern(event) {
    let docId = 'questionpattern';
    this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId).get().subscribe(records => {
      // this.categories = [];
      if (records.exists) {
        let fetchData = records.data();
        this.questionPatterns = fetchData['values'];
      }
    });
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  eventStartDateChange(value) {
    this.eventDetails.eventStartDate = this.dateUtil.getFormatDate(value);
  }

  eventEndDateChange(value) {
    this.eventDetails.eventEndDate = this.dateUtil.getFormatDate(value);
  }

  
  selectState(event: any) {
    this.stateList = [];
    this.eventDetails.stateId = null;
    this.eventDetails.stateName = null;
    this.eventDetails.districtName = null;
    this.eventDetails.districtId = null;
    this.eventDetails.districtName = null;
    this.eventDetails.cityId = null;
    this.eventDetails.cityName = null;
    this.eventDetails.schoolId = null;
    this.eventDetails.schoolName = null;

    this.firestore.collection('state', ref => ref.orderBy("name", "asc")).get().subscribe((staes: any) => {
      if (!staes.empty) {
        staes.forEach((state: any) => {
          let stateData: any = state.data();
          let index = this.stateList.findIndex(sl => sl.name == stateData.name);
          if (index == -1) {
            this.stateList.push(stateData);
          }
        });
      }
    });
  }
  selectDistrict(event: any) {
    this.districts = [];
    this.eventDetails.districtName = null;
    this.eventDetails.districtId = null;
    this.eventDetails.cityId = null;
    this.eventDetails.cityName = null;
    this.eventDetails.schoolId = null;
    this.eventDetails.schoolName = null;
    this.firestore.collection("district", ref => ref.where("stateid", "==", this.eventDetails.stateId).orderBy("name", "asc")).get().subscribe(data => {
      data.forEach(res => {
        let districtData: any = res.data();
        let index = this.districts.findIndex(sl => sl.name == districtData.name);
        if (index == -1) {
          this.districts.push(districtData);
        }
      })
    });
  }
  selectCity(event: any) {
    this.cities = [];
    this.schools = [];
    this.eventDetails.cityId = null;
    this.eventDetails.cityName = null;
    this.eventDetails.schoolId = null;
    this.eventDetails.schoolName = null;
    this.firestore.collection("cities", ref => ref.where("districtid", "==", this.eventDetails.districtId).orderBy("name", "asc")).get().subscribe(data => {
      data.forEach(res => {
        let cityData: any = res.data();
        let index = this.cities.findIndex(sl => sl.name == cityData.name);
        if (index == -1) {
          this.cities.push(cityData);
        }
      });
    });
  }

  selectSchool(event: any) {
    this.schools = [];
    this.eventDetails.schoolId = null;
    this.eventDetails.schoolName = null;

    if (this.eventDetails.boardId) {
      let selectBoard = this.boardDetails.find(board => board.id == this.eventDetails.boardId);
      if (selectBoard) {
        this.eventDetails.boardName = selectBoard.displayName;
      }
    }
    
    this.firestore.collection("school", ref => ref
      .where("districtid", "==", this.eventDetails.districtId)
      .where("board", "==", this.eventDetails.boardName)
      .orderBy("name", "desc")
    ).get().subscribe(data => {
      data.forEach(res => {
        let schoolData: any = res.data();
        let index = this.schools.findIndex(sl => sl.name == schoolData.name);
        if (index == -1) {
          this.schools.push(res.data());
        }
      });
    });
  }

}
