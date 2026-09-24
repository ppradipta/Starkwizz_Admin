import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonModal, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Events } from 'src/app/model/events';
import { DashBoardService } from 'src/app/services/dashboard.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent implements OnInit {
  currentSelectReport: string;
  students = [];
  educationBoards = []
  users$: Observable<any[]>;
  events$: Observable<Events[]>;
  exams$: Observable<Events[]>;
  activities$: Observable<Events[]>;
  selectedUser: any;

  eventActivities$: Observable<any[]>;
  selectedEvent: any;

  displayedColumns: string[] = ['boardName', 'students', 'events', 'exams'];
  // studentColumns: string[] = ['#', 'name', 'class', 'mobile', 'profileType', 'city', 'state', 'schoolName'];
  studentColumns: string[] = ['#', 'name', 'class', 'mobile', 'schoolName'];
  eventColumns: string[] = ['#', 'name', 'class', 'subject', 'status', 'type', 'amount', 'category', 'startDate', 'endDate'];
  userColumns: string[] = ['#', 'type', 'name', 'subject', 'score', 'appearDate', 'startTime', 'endTime', 'correct', 'inCorrect', 'skip'];
  selectedEventColumns: string[] = ['#', 'userName', 'status', 'score', 'appearDate', 'startTime', 'endTime', 'correct', 'inCorrect', 'skip'];
  dataSource: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;
  dataSource3: MatTableDataSource<any>;
  dataSource4: MatTableDataSource<any>;
  @ViewChild('MatPaginator1') paginator: MatPaginator;
  @ViewChild('MatPaginator2') paginator2: MatPaginator;
  @ViewChild('MatPaginator3') paginator3: MatPaginator;
  @ViewChild('MatPaginator4') paginator4: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) StudentSort: MatSort;
  @ViewChild(MatSort) userSort: MatSort;
  @ViewChild(MatSort) selecteEventSort: MatSort;

  eventSubscriptionColumns: string[] = ['name', 'mobileNo', 'subscribedDate', 'expiryDate'];
  // eventSubscriptionColumns: string[] = ['name', 'mobileNo', 'className', 'subscribedDate', 'expiryDate'];
  dynamoSubscriptionColumns: string[] = ['name', 'mobileNo', 'className', 'subscribedDate', 'expiryDate'];
  @ViewChild('MatPaginator5') paginator5: MatPaginator;
  @ViewChild('MatPaginator6') paginator6: MatPaginator;
  @ViewChild('eventSort') eventSort: MatSort;
  @ViewChild('dynamoSort') dynamoSort: MatSort;
  dataSource5: MatTableDataSource<any>;
  dataSource6: MatTableDataSource<any>;

  classes: any[] = [];
  subjects: any[] = [];
  modules: any[] = [];
  allBoardDetails: any[] = [];

  filterBoardId: string;
  filterClassId: string;
  filterSubjectId: string;
  filterModuleId: string;
  dynamoSubscriptionDate: string;
  dynamoSubscriptionExpDate: string;
  eventSubscriptionDate: string;
  eventSubscriptionExpDate: string;
  allStateDetails: any[] = [];
  stateId: string;
  allDistricts: any[] = [];
  districtId: string;
  allCities: any[] = [];
  cityId: string;
  schools: any[] = [];
  schoolId: string;
  selectedCountry: string = 'India';
  selectedDistrict: any = {};
  selectedState: any = {};
  selectedSchool: any = {};
  selectedBoard: any = {};

  accountTypes: any[] = [{ id: 1, displayName: 'SUBSCRIBTION' }, { id: 2, displayName: 'FREE_TRAIL' }];
  accountTypeId: string;

  @ViewChild(IonModal) bookPublisherModal: IonModal;
  isUserDetailModalOpen: boolean = false;
  userDetail: any;
  constructor(
    private dashboardService: DashBoardService,
    private dateUtilService: DateUtilService,
    private firestore: AngularFirestore,
    private loading: LoadingService,
    private toastController: ToastController
  ) {
  }

  async ngOnInit() {
    this.dashboardService.getDynamoSubscriptionDetails().subscribe(devents => {
      this.dataSource6 = new MatTableDataSource(devents);
      this.dataSource6.paginator = this.paginator6;
      this.dataSource6.sort = this.dynamoSort;
    });
    this.dashboardService.getEventSubscriptionDetails().subscribe(events => {
      this.dataSource5 = new MatTableDataSource(events);
      this.dataSource5.paginator = this.paginator5;
      this.dataSource5.sort = this.eventSort;
    })
    this.dashboardService.boardEducations$.subscribe(boards => {
      // this.educationBoards = boards;
      this.dataSource = new MatTableDataSource(boards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.getAllBoards();
    this.getAllStateDetails();
  }

  ionViewWillEnter() {
    this.getAllBoards();
  }


  async viewStudentsDetailsForBoard(board) {
    this.selectedBoard = board;
    this.currentSelectReport = 'Students';
    this.users$ = await this.dashboardService.getUserDetailsCount(board);
    this.users$.subscribe(res => {
      this.dataSource2 = new MatTableDataSource(res);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.StudentSort;
    });
  }

  async viewEeventsDetailsForBoard(board) {
    this.selectedUser = null;
    this.currentSelectReport = 'Events';
    this.events$ = await this.dashboardService.getEventsCount(board);
    this.events$.subscribe(res => {
      this.dataSource2 = new MatTableDataSource(res);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.StudentSort;
    });
  }

  async viewExamDetailsForBoard(board) {
    this.selectedUser = null;
    this.currentSelectReport = 'Exams';
    this.exams$ = await this.dashboardService.getExamCount(board);
    this.exams$.subscribe(res => {
      this.dataSource2 = new MatTableDataSource(res);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.StudentSort;
    });
  }

  viewActivityDetails(user) {
    this.selectedUser = user;
    console.log('this.selectedUser: ', this.selectedUser);
    this.activities$ = this.dashboardService.getUserActivityDetails(user);
    this.activities$.subscribe(res => {
      this.dataSource3 = new MatTableDataSource(res);
      this.dataSource3.paginator = this.paginator3;
      this.dataSource3.sort = this.userSort;
    });
  }

  viewActivityDetailsForEvent(event) {
    this.selectedEvent = event;
    this.eventActivities$ = this.dashboardService.getUserEventActivityDetails(event);
    this.eventActivities$.subscribe(res => {
      this.dataSource4 = new MatTableDataSource(res);
      this.dataSource4.paginator = this.paginator4;
      this.dataSource4.sort = this.selecteEventSort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  dataSource2Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  dataSource3Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
    if (this.dataSource3.paginator) {
      this.dataSource3.paginator.firstPage();
    }
  }

  dataSource4Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource4.filter = filterValue.trim().toLowerCase();
    if (this.dataSource4.paginator) {
      this.dataSource4.paginator.firstPage();
    }
  }



  dataSource5Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource5.filter = filterValue.trim().toLowerCase();
    if (this.dataSource5.paginator) {
      this.dataSource5.paginator.firstPage();
    }
  }



  dataSource6Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource6.filter = filterValue.trim().toLowerCase();
    if (this.dataSource6.paginator) {
      this.dataSource6.paginator.firstPage();
    }
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


  onSelectBoard(event) {
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

  onSelectClass(event) {
    this.filterClassId = event.detail.value.id;
    this.subjects = [];
    this.firestore.collection("subjects", ref => ref.where("classId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.subjects.push(res.data());
      })
    });
  }

  onSelectSubject(event) {
    this.filterSubjectId = event.detail.value.id;
    this.modules = [];
    this.firestore.collection("modules", ref => ref.where("subjectId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.modules.push(res.data());
      })
    });
  }

  searchDynamoSubscription() {
    let query;
    if (this.filterClassId && this.dynamoSubscriptionDate) {
      this.dynamoSubscriptionDate = moment(this.dynamoSubscriptionDate).format('YYYY-MM-DD')
      query = this.firestore.collection<any>('user_subscription', ref => ref
        .where("classId", "==", this.filterClassId)
        .where("subscribedDate", "==", this.dynamoSubscriptionDate)
        .orderBy('subscribedDate', 'desc'));
    }
    else if (this.filterClassId && null == this.dynamoSubscriptionDate) {
      query = this.firestore.collection<any>('user_subscription', ref => ref
        .where("classId", "==", this.filterClassId)
        .orderBy('subscribedDate', 'desc'));
    }
    else if (this.dynamoSubscriptionDate && null == this.filterClassId) {
      this.dynamoSubscriptionDate = moment(this.dynamoSubscriptionDate).format('YYYY-MM-DD')
      query = this.firestore.collection<any>('user_subscription', ref => ref
        .where("subscribedDate", "==", this.dynamoSubscriptionDate)
        .orderBy('subscribedDate', 'desc'));
    } else if (this.filterBoardId) {
      query = this.firestore.collection<any>('user_subscription', ref => ref
        .where("boardId", "==", this.filterBoardId)
        .orderBy('subscribedDate', 'desc'));
      // this.presentToast('Please Select Class or Subscription Date!!!');
    }
    this.dashboardService.getDynamoSubscriptionDetailsOnFilter(query).subscribe(devents => {
      this.dataSource6 = new MatTableDataSource(devents);
      this.dataSource6.paginator = this.paginator6;
      this.dataSource6.sort = this.dynamoSort;
    });
  }

  searchEventSubscription() {
    let query;
    this.eventSubscriptionDate = moment(this.eventSubscriptionDate).format('YYYY-MM-DD')
    if (this.filterClassId && this.eventSubscriptionDate) {
      query = this.firestore.collection<any>('user_subscription_event', ref => ref
        .where("classId", "==", this.filterClassId).orderBy('subscribedDate', 'desc'));
    }
    else if (this.filterClassId && null == this.eventSubscriptionDate) {
      query = this.firestore.collection<any>('user_subscription_event', ref => ref.where("classId", "==", this.filterClassId)
        .orderBy('subscribedDate', 'desc'));
    }
    else if (this.eventSubscriptionDate && null == this.filterClassId) {
      query = this.firestore.collection<any>('user_subscription_event', ref => ref.where("subscribedDate", "==", this.eventSubscriptionDate)
        .orderBy('classId', 'desc'));
    }
    this.dashboardService.getEventSubscriptionDetailsnDetailsOnFilter(query).subscribe(uevents => {
      this.dataSource5 = new MatTableDataSource(uevents);
      this.dataSource5.paginator = this.paginator5;
      this.dataSource5.sort = this.eventSort;
    });
  }

  getAllStateDetails() {
    this.allStateDetails = [];
    const query = this.firestore.collection(FirebaseCollection.STATE);
    query.ref.get().then((state: any) => {
      if (!state.empty) {
        state.forEach(data => {
          this.allStateDetails.push(data.data());
        });
        this.allStateDetails = this.allStateDetails.sort((a, b) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      }
    })
  }

  selectState(event) {
    this.stateId = event.detail.value.id;
    this.allDistricts = [];
    this.firestore.collection("district", ref => ref.where("stateid", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.allDistricts.push(res.data());
      })
      this.allDistricts = this.allDistricts.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
          return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
          return -1;
        return 0;
      });
    });
  }

  selectDistrict(event) {
    this.districtId = event.detail.value.id;
    this.allCities = [];
    this.schools = [];
    this.firestore.collection("cities", ref => ref.where("districtid", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.allCities.push(res.data());
      })
      this.allCities = this.allCities.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
          return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
          return -1;
        return 0;
      });
    });


    this.firestore.collection("school", ref => ref
      .where("stateid", "==", this.stateId)
      .where("districtid", "==", this.districtId)).get().subscribe(data => {
        data.forEach((res: any) => {
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

  selectCities(event) {
    this.cityId = event.detail.value.id;
  }

  selectSchool(event) {
    this.schoolId = event.detail.value.id;
  }

  selectType(event) {
    this.accountTypeId = event.detail.value.id;
  }

  searchAccodingToReprotType(currentSelection: string) {
    if (currentSelection == 'Events') {
      let query;
      if (this.filterClassId && this.filterBoardId && this.filterSubjectId) {
        query = this.firestore.collection<any>('events', ref => ref.where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where('type', '==', 'EVENT')
          .where("subjectId", "==", this.filterSubjectId)
          .orderBy('eventStartDate', 'desc'));
      }
      else if (this.filterClassId && this.filterBoardId) {
        query = this.firestore.collection<any>('events', ref => ref.where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where('type', '==', 'EVENT')
          .orderBy('eventStartDate', 'desc'));
      }
      this.dashboardService.getEventsOnFilter(query).subscribe(res => {
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.StudentSort;
      });
    }
    if (currentSelection == 'Exams') {
      let query;
      if (this.filterClassId && this.filterBoardId && this.filterSubjectId) {
        query = this.firestore.collection<any>('events', ref => ref.where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where("subjectId", "==", this.filterSubjectId)
          .where('type', '==', 'EXAM')
          .orderBy('eventStartDate', 'desc'));
      }
      else if (this.filterClassId && this.filterBoardId) {
        query = this.firestore.collection<any>('events', ref => ref.where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where('type', '==', 'EXAM')
          .orderBy('eventStartDate', 'desc'));
      }

      this.dashboardService.getExamOnFilter(query).subscribe(res => {
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.StudentSort;
      });
    }
    if (currentSelection == 'Students') {
      let query;
      if (this.filterBoardId && this.filterClassId && this.stateId && this.districtId && this.cityId && this.schoolId) {
        query = this.firestore.collection<any>('users', ref => ref
          .where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where("stateId", "==", this.stateId)
          .where("districtId", "==", this.districtId)
          .where("cityId", "==", this.cityId)
          .where("schoolId", "==", this.schoolId)
          .where('userType', '==', 'STUDENT')
          .orderBy('creationUnixDate', 'desc'));
      }
      else if (this.filterBoardId && this.filterClassId && this.stateId && this.districtId && this.cityId) {
        query = this.firestore.collection<any>('users', ref => ref
          .where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where("stateId", "==", this.stateId)
          .where("districtId", "==", this.districtId)
          .where("cityId", "==", this.cityId)
          .where('userType', '==', 'STUDENT')
          .orderBy('creationUnixDate', 'desc'));
      }
      else if (this.filterBoardId && this.filterClassId && this.stateId && this.districtId) {
        query = this.firestore.collection<any>('users', ref => ref
          .where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where("stateId", "==", this.stateId)
          .where("districtId", "==", this.districtId)
          .where('userType', '==', 'STUDENT')
          .orderBy('creationUnixDate', 'desc'));
      }
      else if (this.filterBoardId && this.filterClassId && this.stateId) {
        query = this.firestore.collection<any>('users', ref => ref
          .where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where("stateId", "==", this.stateId)
          .where('userType', '==', 'STUDENT')
          .orderBy('creationUnixDate', 'desc'));
      }
      else if (this.filterBoardId && this.filterClassId) {
        query = this.firestore.collection<any>('users', ref => ref
          .where('boardId', '==', this.filterBoardId)
          .where("classId", "==", this.filterClassId)
          .where('userType', '==', 'STUDENT')
          .orderBy('creationUnixDate', 'desc'));
      }

      this.dashboardService.getExamOnFilter(query).subscribe(res => {
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.StudentSort;
      });
    }
  }

  downloadDynamoSubscription() {
    this.loading.present();
    this.dashboardService.getDynamoSubscriptionDetails().subscribe(devents => {
      this.dashboardService.exportAsExcelFileForDynamoSubscription(devents, 'DynamoSubscription');
    });
  }

  downloadEventSubscription() {
    this.loading.present();
    this.dashboardService.getEventSubscriptionDetails().subscribe(events => {
      this.dashboardService.exportAsExcelFileForEventSubscription(events, 'EventSubscription');
    })
  }

  downloadStudents() {
    this.loading.present();
    if (this.selectedBoard) {
      this.dashboardService.getUserDetailsCount(this.selectedBoard).subscribe(users => {
        this.dashboardService.exportAsExcelFileForStudentRecords(users, 'StudentReports');
      })
    } else {
      this.presentToast('Please select board');
    }

  }

  downloadExams() {
    let query = null;
    if (this.filterClassId && this.filterBoardId && this.filterSubjectId) {
      query = this.firestore.collection<any>('events', ref => ref.where('boardId', '==', this.filterBoardId)
        .where("classId", "==", this.filterClassId)
        .where("subjectId", "==", this.filterSubjectId)
        .where('type', '==', 'EXAM')
        .orderBy('eventStartDate', 'desc'));
    }
    else if (this.filterClassId && this.filterBoardId) {
      query = this.firestore.collection<any>('events', ref => ref.where('boardId', '==', this.filterBoardId)
        .where("classId", "==", this.filterClassId)
        .where('type', '==', 'EXAM')
        .orderBy('eventStartDate', 'desc'));
    }
    if (query) {
      // this.dashboardService.getExamOnFilter(query).subscribe(records => {
      //   this.dashboardService.exportAsExcelFileForExamReport(records, 'ExamReports');
      // });
      this.presentToast('Upcoming!!!');
    } else {
      this.presentToast('Please select search paramter!!');
    }

  }


  downloadEvents() {
    let query = null;
    if (this.filterClassId && this.filterBoardId && this.filterSubjectId) {
      query = this.firestore.collection<any>('events', ref => ref.where('boardId', '==', this.filterBoardId)
        .where("classId", "==", this.filterClassId)
        .where('type', '==', 'EVENT')
        .where("subjectId", "==", this.filterSubjectId)
        .orderBy('eventStartDate', 'desc'));
    }
    else if (this.filterClassId && this.filterBoardId) {
      query = this.firestore.collection<any>('events', ref => ref.where('boardId', '==', this.filterBoardId)
        .where("classId", "==", this.filterClassId)
        .where('type', '==', 'EVENT')
        .orderBy('eventStartDate', 'desc'));
    }
    if (query) {
      // this.dashboardService.getEventsOnFilter(query).subscribe(records => {
      //   this.dashboardService.exportAsExcelFileForEventReport(records, 'EventReports');
      // });
      this.presentToast('Upcoming!!!');
    } else {
      this.presentToast('Please select search paramter!!');
    }


  }

  downloadActivities() {
    this.loading.present();
    if (this.selectedUser) {
      this.dashboardService.getUserActivityDetails(this.selectedUser).subscribe(users => {
        console.log('users: ', users);
        this.dashboardService.exportAsExcelFileForActivitiesRecords(users, 'ActivityReports');
      })
    } else {
      this.presentToast('Please select board');
    }

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  viewUserDetails(userId) {
    // let arr = [];
    this.firestore.collection("users", ref => ref
      .where("id", "==", userId)).get().subscribe(data => {
        data.forEach((res: any) => {
          this.userDetail = res.data();
          // arr.push(res.data());
        });
      });
    this.isUserDetailModalOpen = true;
  }

  modalDismiss() {
    this.isUserDetailModalOpen = false;
    this.bookPublisherModal.dismiss(null, 'cancel');
  }

  downloadSubscriberEvents(eventUserId) {
    this.loading.present();
    this.firestore.collection(FirebaseCollection.USER_EVENTS, ref => ref
      .where("userId", "==", eventUserId)).get().subscribe((events: any) => {
         let eventData: any = [];
      if (!events.empty) {
        events.forEach(res => {
          eventData.push(res.data());
        });
      } 
      this.dashboardService.exportAsExcelFileForEventDetails(eventData, 'EventDetails');
    });
  }

}
