import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DashBoardService } from 'src/app/services/dashboard.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-view-user-access',
  templateUrl: './view-user-access.component.html',
  styleUrls: ['./view-user-access.component.scss'],
})
export class ViewUserAccessComponent implements OnInit {
  userDetails: any[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild('MatPaginator1') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // displayedColumns: string[] = ['code', 'name', 'mobileNo', 'email', 'postId'];
  // users$: Observable<any[]>;
  dataSourceUsers: MatTableDataSource<any>;
  @ViewChild('MatPaginatorAssociate') paginatorAssociates: MatPaginator;
  @ViewChild(MatSort) sortAssociates: MatSort;
  displayedColumnsUsers: string[] = ['code', 'name', 'creationdate', 'mobileNo', 'email', 'status'];
  userViewDetails$: Observable<any[]>;

  copunLinkedUsers: any[] = [];

  searchMobileNo: string = '';
  selectedUser: any = {};

  @ViewChild(IonModal) viewAssociatesModal: IonModal;
  isViewAssociatesOpen: boolean = false;
  viewDetail: any = {};
  operationType: string = '';
  typeList: any = [
    { id: 'OA ADMIN', displayName: 'OA ADMIN' },
    { id: 'SA ADMIN', displayName: 'SA ADMIN' },
    { id: 'DA ADMIN', displayName: 'DA ADMIN' },
    { id: 'BA ADMIN', displayName: 'BA ADMIN' },
  ];
  selctedType: string = "";
  constructor(
    private firestore: AngularFirestore,
    private dashboardService: DashBoardService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loading: LoadingService,
    private activeRoute: ActivatedRoute,
  ) {
    this.operationType = this.activeRoute.snapshot.queryParams['OPERATION'];
  }

  ngOnInit() {
    this.userViewDetails$ = this.dashboardService.getAdminViewDetails();
    this.userViewDetails$.subscribe(res => {
      let activeAssociates = res.filter(ass => ass.type == this.operationType);
      this.dataSourceUsers = new MatTableDataSource(activeAssociates);
      this.dataSourceUsers.paginator = this.paginatorAssociates;
      this.dataSourceUsers.sort = this.sortAssociates;
    });
  }


  ionViewWillEnter() {
    this.loading.present();
    this.userViewDetails$ = this.dashboardService.getAdminViewDetails();
    this.userViewDetails$.subscribe(res => {
      let activeAssociates = res.filter(ass => ass.type == this.operationType);
      this.dataSourceUsers = new MatTableDataSource(activeAssociates);
      this.dataSourceUsers.paginator = this.paginatorAssociates;
      this.dataSourceUsers.sort = this.sortAssociates;
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUsers.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceUsers.paginator) {
      this.dataSourceUsers.paginator.firstPage();
    }
  }

  selectUserDetails() {
    this.userViewDetails$ = this.dashboardService.getAdminViewDetails();

    this.userViewDetails$.subscribe(res => {
      let activeAssociates = res.filter(ass => ass.type == this.selctedType);
      this.dataSourceUsers = new MatTableDataSource(activeAssociates);
      this.dataSourceUsers.paginator = this.paginatorAssociates;
      this.dataSourceUsers.sort = this.sortAssociates;
    });
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  async presentAlertBlockUser(record) {
    const alert = await this.alertController.create({
      header: "Confirm Alert",
      message: 'Are you sure you want to Block User!',
      cssClass: 'customAlert',
      buttons: [
        {
          text: `Cancel `,
          role: "CANCEL",
          cssClass: "secondary",
          handler: (CANCEL) => {
          }
        },
        {
          text: `Block`,
          role: "BLOCK",
          handler: async (DELETE) => {
            this.firestore.collection('admin_user').doc(record.id).update({
              status: 'BLOCK',
            }).then(result => {
              this.presentToast(`${record.firstName} ${record.lastName} User Block successfully!!`);
            })
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertActiveUser(record) {
    const alert = await this.alertController.create({
      header: "Confirm Alert",
      message: 'Are you sure you want to Active User!',
      cssClass: 'customAlert',
      buttons: [
        {
          text: `Cancel `,
          role: "CANCEL",
          cssClass: "secondary",
          handler: (CANCEL) => {
          }
        },
        {
          text: `Active`,
          role: "ACTIVE",
          handler: async (DELETE) => {
            this.firestore.collection('admin_user').doc(record.id).update({
              status: 'ACTIVE',
            }).then(result => {
              this.presentToast(`${record.firstName} ${record.lastName} User Active successfully!!`);
            })

          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertDeleteUser(record) {
    const alert = await this.alertController.create({
      header: "Confirm Alert",
      message: 'Are you sure you want to Delete!',
      cssClass: 'customAlert',
      buttons: [
        {
          text: `No`,
          role: "NO",
          cssClass: "secondary",
          handler: (CANCEL) => {
          }
        },
        {
          text: `Yes`,
          role: "YES",
          handler: async (DELETE) => {
            this.firestore.collection('admin_user').doc(record.id).delete().then(result => {
              this.presentToast('User Deleted sucessfully!!');
              this.ionViewWillEnter();
            });

          }
        }
      ]
    });
    await alert.present();
  }


  viewUser(record) {
    this.viewDetail = record;
    this.isViewAssociatesOpen = true;
  }

  viewModalDismiss() {
    this.isViewAssociatesOpen = false;
    this.viewAssociatesModal.dismiss(null, 'cancel');
  }

  editUser(record: any) {
  }
}
