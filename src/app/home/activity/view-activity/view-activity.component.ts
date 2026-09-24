import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, IonModal, ModalController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DashBoardService } from 'src/app/services/dashboard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AddAssociateComponent } from '../../user-associate/add-associate/add-associate.component';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { DateUtilService } from 'src/app/common/util/date-util.service';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss'],
})
export class ViewActivityComponent implements OnInit {
  // selectRecord: any = {
  //   id: '',
  //   code: '',
  //   name: '',
  //   applicableFor: '',
  //   type: '',
  //   typeValue: '',
  //   description: '',
  //   creationdate: '',
  //   status: ''
  // }
  userDetails: any[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild('MatPaginator1') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  users$: Observable<any[]>;
  dataSourceActivity: MatTableDataSource<any>;
  @ViewChild('MatPaginatorAssociate') paginatorAssociates: MatPaginator;
  @ViewChild(MatSort) sortAssociates: MatSort;
  displayedColumnsActivity: string[] = ['startDate', 'name', 'userid', 'boardName', 'className', 'boardId', 'classId', 'date', 'endDate', 'amount', 'referralCode'];
  userDetailsActivity$: Observable<any[]>;

  @ViewChild(IonModal) viewActivityModal: IonModal;
  isViewActivityOpen: boolean = false;
  viewDetail: any = {};
  selctedType: string = '';
  months: any = [];
  selectMonth: string = '';
  currentMonth = moment().format('MMM');
  selectYear: string = '';
  currentYear = moment().format('YYYY');
  subscriptionDetail: any = [];
  userDetail: any = {};
  userRecord: any = {};
  monthsFullName: any = [];
  monthName: any = {};
  constructor(
    private dashboardService: DashBoardService,
    private toastController: ToastController,
    private dateUtil: DateUtilService,
    private user: UserService,
    private navCtrl: NavController,
    private firestore: AngularFirestore,
  ) {
    this.months = this.dateUtil.get12Months();
    this.selectMonth = this.months[0].title;
    this.selectYear = this.currentYear;
  }

  ngOnInit() {


    this.user.getViewDetails().subscribe(record => {
      this.viewDetail = record;
    });

    this.monthName = this.months.filter(ass => ass.title == this.selectMonth)[0];
    this.viewAllSubscription();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceActivity.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceActivity.paginator) {
      this.dataSourceActivity.paginator.firstPage();
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }


  selectModuleForYear(event) {
    this.selectYear = event.detail.value;
    this.monthName = this.months.filter(ass => ass.title == this.selectMonth)[0];
    this.viewAllSubscription();
  }

  selectModuleForMonth(event) {
    this.selectMonth = event.detail.value;
    this.monthName = this.months.filter(ass => ass.title == this.selectMonth)[0];
    this.viewAllSubscription();

  }


  viewAllSubscription() {
    this.userDetailsActivity$ = this.dashboardService.getSubscriptionTypeDetails(this.viewDetail?.code, this.selectYear);
    this.userDetailsActivity$.subscribe(res => {
      this.subscriptionDetail = res.filter(ass => ass.month == this.selectMonth);
      this.dataSourceActivity = new MatTableDataSource(this.subscriptionDetail);
      this.dataSourceActivity.paginator = this.paginatorAssociates;
      this.dataSourceActivity.sort = this.sortAssociates;
    });
  }

  viewActivity(record) {
    this.userRecord = record;
    this.firestore.collection('users', ref => ref
      .where("id", "==", record.userid))
      .get().subscribe((results: any) => {
        if (!results.empty) {
          results.forEach(result => {
            this.userDetail = result.data();
          });
        }
      })
    this.isViewActivityOpen = true;
  }

  viewModalDismiss() {
    this.isViewActivityOpen = false;
    this.viewActivityModal.dismiss(null, 'cancel');
  }

  goBack() {
    this.navCtrl.back();
  }


}
