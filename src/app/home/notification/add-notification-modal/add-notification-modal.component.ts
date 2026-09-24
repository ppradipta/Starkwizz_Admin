import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';

@Component({
  selector: 'app-add-notification-modal',
  templateUrl: './add-notification-modal.component.html',
  styleUrls: ['./add-notification-modal.component.scss'],
})
export class AddNotificationModalComponent implements OnInit {
  @Input() notification: any = {};

  stateId: any;
  districtId: any;
  cityId: string;
  boardId: string;
  schoolId: string;
  classId: string;
  subjectId: string;
  moduleId: string;

  stateList: any = [] = [];
  districts: any[] = [];
  cities: any[] = [];
  schools: any[] = [];
  boards: any[] = [];
  classDetails: any[] = [];
  subjects: any[] = [];
  subjectModules: any[] = [];
  notificationTypes: any[] = [];
  notificationText: string;
  name: string;
  functionType: string;
  notificationType: string = 'PUSH';
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private dateUtilService: DateUtilService
  ) { }

  ngOnInit() {
    if (null != this.notification) {

      this.stateId = this.notification.stateId;
      this.districtId = this.notification.districtId;
      this.cityId = this.notification.cityId;
      this.boardId = this.notification.boardId;
      this.schoolId = this.notification.schoolId;
      this.classId = this.notification.classId;
      this.subjectId = this.notification.subjectId;
      this.moduleId = this.notification.moduleId;
      this.name = this.notification.name;
      this.functionType = this.notification.functionType;
      this.notificationType = this.notification.notificationType;
      this.notificationText = this.notification.msg;
      this.stateList = [{
        displayName: this.notification.stateName,
        id: this.notification.stateId,
        name: this.notification.stateName
      }];
      this.districts = [{
        displayName: this.notification.districtName,
        id: this.notification.districtId,
        name: this.notification.districtName
      }];

      this.cities = [{
        displayName: this.notification.cityName,
        id: this.notification.cityId,
        name: this.notification.cityName
      }];
      this.schools = [{
        displayName: this.notification.schoolName,
        id: this.notification.schoolId,
        name: this.notification.schoolName
      }];
      this.boards = [{
        displayName: this.notification.boardName,
        id: this.notification.boardId,
        name: this.notification.boardName
      }];
      this.classDetails = [{
        displayName: this.notification.className,
        id: this.notification.classId,
        name: this.notification.className
      }];

      this.subjects = [{
        displayName: this.notification.subjectName,
        id: this.notification.subjectId,
        name: this.notification.subjectName
      }];
      this.subjectModules = [{
        displayName: this.notification.moduleName,
        id: this.notification.moduleId,
        name: this.notification.moduleName
      }];
    }

  }

  close() {
    this.modalController.dismiss();
  }

  notificationNameChange(event) {
    let val = event.target.value;
    this.functionType = val.replace(/\s+/g, '-').toUpperCase();
  }
  selectNotificationType() {
    let docId = 'notificationtypes';
    this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId).get().subscribe(records => {
      this.notificationTypes = [];
      if (records.exists) {
        let fetchData = records.data();
        this.notificationTypes = fetchData['values'];
      }
    });

  }

  selectState(event) {
    this.stateList = [];
    this.districts = [];
    this.cities = [];
    this.schools = [];
    this.classDetails = [];
    this.subjects = [];
    this.subjectModules = [];
    this.firestore.collection('state').get().subscribe((staes: any) => {
      if (!staes.empty) {
        staes.forEach(state => {
          this.stateList.push(state.data());
        });
        this.stateList = this.stateList.sort((a, b) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      }
    });
  }

  selectModule(event) {
    this.subjectModules = [];
    this.firestore.collection("modules", ref => ref.where("subjectId", "==", this.subjectId)).get().subscribe(data => {
      data.forEach(res => {
        this.subjectModules.push(res.data());
      })
    });
  }
  selectSubject(event) {
    this.subjects = [];
    this.subjectModules = [];
    this.firestore.collection("subjects", ref => ref
      .where("classId", "==", this.classId))
      .get().subscribe(data => {
        data.forEach(res => {
          this.subjects.push(res.data());
        })
      });
  }

  selectClass(event) {
    this.classDetails = [];
    this.subjects = [];
    this.subjectModules = [];
    this.firestore.collection("classes", ref => ref.where("boardId", "==", this.boardId)).get().subscribe(data => {
      data.forEach(res => {
        this.classDetails.push(res.data());
        this.classDetails = this.classDetails.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
      })
    });

  }
  selectBoard(event) {
    this.boards = [];
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref
      .get().then((boards: any) => {
        if (!boards.empty) {
          boards.forEach(data => {
            let board = data.data();
            let indexboard = this.boards.findIndex(at => at.id === board.id);
            if (indexboard == -1) {
              this.boards.push(board);
            }
          });
        }
      })
  }

  selectSchool(event) {
    this.schools = [];
    this.classDetails = [];
    this.subjects = [];
    this.subjectModules = [];
    let board = this.boards.find(bo => bo.id === this.boardId);
    this.firestore.collection("school", ref => ref.where("districtid", "==", this.districtId)
      .where("board", "==", board.name)).get().subscribe(data => {
        data.forEach(res => {
          this.schools.push(res.data());
        })
        this.schools = this.schools.sort((a, b) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      });
  }
  selectCity(event) {
    this.cities = [];
    this.schools = [];
    this.classDetails = [];
    this.subjects = [];
    this.subjectModules = [];
    this.firestore.collection("cities", ref => ref.where("districtid", "==", this.districtId)).get().subscribe(data => {
      data.forEach(res => {
        this.cities.push(res.data());
      });
      this.cities = this.cities.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
          return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
          return -1;
        return 0;
      });
    });
  }
  selectDistrict(event) {
    this.districts = [];
    this.cities = [];
    this.schools = [];
    this.classDetails = [];
    this.subjects = [];
    this.subjectModules = [];
    this.firestore.collection("district", ref => ref.where("stateid", "==", this.stateId)).get().subscribe(data => {
      data.forEach(res => {
        this.districts.push(res.data());
      })

      this.districts = this.districts.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
          return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
          return -1;
        return 0;
      });
    });
  }

  saveNotification() {
    let state = this.stateList.find(st => st.id == this.stateId);
    let district = this.districts.find(st => st.id == this.districtId);
    let city = this.cities.find(st => st.id == this.cityId);
    let board = this.boards.find(st => st.id == this.boardId);
    let school = this.schools.find(st => st.id == this.schoolId);
    let classdetail = this.classDetails.find(st => st.id == this.classId);
    let subject = this.subjects.find(st => st.id == this.subjectId);
    let module = this.subjectModules.find(st => st.id == this.moduleId);

    let notification = {
      stateId: this.stateId,
      stateName: null != state ? state.name : '',
      districtId: this.districtId,
      districtName: null != district ? district.name : '',
      cityId: this.cityId,
      cityName: null != city ? city.name : '',
      boardId: this.boardId,
      boardName: null != board ? board.name : '',
      schoolId: this.schoolId,
      schoolName: null != school ? school.name : '',
      classId: this.classId,
      className: null != classdetail ? classdetail.name : '',
      subjectId: this.subjectId,
      subjectName: null != subject ? subject.name : '',
      moduleId: this.moduleId,
      moduleName: null != module ? module.name : '',
      msg: this.notificationText,
      type: this.notificationType,
      name: this.name,
      functionType: this.functionType,
      createDate: this.dateUtilService.getCurrentDateWithTime()
    }
    if (null != this.notification && null != this.notification.id) {
      this.firestore.collection('admin_notifications').doc(this.notification.id)
        .set(JSON.parse(JSON.stringify(notification)), { merge: true }).then(result => {
          this.close();
        })
    } else {
      this.firestore.collection('admin_notifications')
        .add(JSON.parse(JSON.stringify(notification))).then(result => {
          this.close();
        })
    }

  }

}
