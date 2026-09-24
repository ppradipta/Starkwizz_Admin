import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, IonModal, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DashBoardService } from 'src/app/services/dashboard.service';
import { AddAssociateComponent } from './add-associate/add-associate.component';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-user-associate',
  templateUrl: './user-associate.component.html',
  styleUrls: ['./user-associate.component.scss'],
})

export class UserAssociateComponent implements OnInit {
  userDetails: any[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild('MatPaginator1') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['code', 'name', 'mobileNo', 'email', 'postId'];
  users$: Observable<any[]>;
  dataSourceAssociates: MatTableDataSource<any>;
  dataSourceBlockAssociates: MatTableDataSource<any>;
  dataSourceViewAssociates: MatTableDataSource<any>;
  @ViewChild('MatPaginatorAssociate') paginatorAssociates: MatPaginator;
  @ViewChild(MatSort) sortAssociates: MatSort;
  displayedColumnsAssociates: string[] = ['code', 'name', 'referenceUID', 'creationdate', 'mobileNo', 'email', 'postId'];
  blockColumnsAssociates: string[] = ['code', 'name', 'creationdate', 'mobileNo', 'profileType', 'email', 'CouponCode'];
  blockColumnViewAssociates: string[] = ['code', 'name', 'creationdate', 'mobileNo', 'profileType', 'email', 'CouponCode'];
  userAssocates$: Observable<any[]>;
  userBlockAssocates$: Observable<any[]>;

  copunLinkedUsers: any[] = [];

  isLinkedUserModal = false;
  searchMobileNo: string = '';
  selectedUser: any = {};

  @ViewChild(IonModal) blockAssociatesModal: IonModal;
  isBlockAssociatesOpen: boolean = false;
  blockType: string;

  @ViewChild(IonModal) viewAssociatesModal: IonModal;
  isViewAssociatesOpen: boolean = false;
  associateType: string;
  viewDetail: any = {};
  constructor(
    private firestore: AngularFirestore,
    private dashboardService: DashBoardService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.userAssocates$ = this.dashboardService.getAssociatesUserDetails();
    this.userAssocates$.subscribe(res => {
      let activeAssociates = res.filter(ass => ass.status == 'ACTIVE');
      this.dataSourceAssociates = new MatTableDataSource(activeAssociates);
      this.dataSourceAssociates.paginator = this.paginatorAssociates;
      this.dataSourceAssociates.sort = this.sortAssociates;
    });
  }


  ionViewWillEnter() {
    this.loading.present();
    this.userAssocates$ = this.dashboardService.getAssociatesUserDetails();
    this.userAssocates$.subscribe(res => {
      let activeAssociates = res.filter(ass => ass.status == 'ACTIVE');
      this.dataSourceAssociates = new MatTableDataSource(activeAssociates);
      this.dataSourceAssociates.paginator = this.paginatorAssociates;
      this.dataSourceAssociates.sort = this.sortAssociates;
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAssociates.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceAssociates.paginator) {
      this.dataSourceAssociates.paginator.firstPage();
    }
  }

  async addAssociates() {

    const modal = await this.modalController.create({
      component: AddAssociateComponent,
      cssClass: 'addEvent-modal',
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      this.userAssocates$ = this.dashboardService.getAssociatesUserDetails();
      this.userAssocates$.subscribe(res => {
        this.dataSourceAssociates = new MatTableDataSource(res);
        this.dataSourceAssociates.paginator = this.paginatorAssociates;
        this.dataSourceAssociates.sort = this.sortAssociates;
      });
    });
  }

  viewLinkUsers(user: any) {
    this.firestore.collection("users", ref => ref.where("referralCode", "==", user.code)).get().subscribe((data: any) => {
      let users: any[] = [];
      if (!data.empty) {
        this.isLinkedUserModal = true;
        data.forEach((res: any) => {
          users.push(res.data());
        });
        this.copunLinkedUsers = users;
      } else {
        this.presentToast('No users linked to these event codes');
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

  async presentAlertBlockAssociates(record) {
    const alert = await this.alertController.create({
      header: "Confirm Alert",
      message: 'Are you sure you want to Block Associates!',
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
            this.firestore.collection('user_associates').doc(record.id).update({
              status: 'BLOCK',
            }).then(result => {
              this.presentToast(`${record.firstName} ${record.lastName} Associates Block successfully!!`);
            })
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertActiveAssociates(record) {
    const alert = await this.alertController.create({
      header: "Confirm Alert",
      message: 'Are you sure you want to Active Associates!',
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
            this.firestore.collection('user_associates').doc(record.id).update({
              status: 'ACTIVE',
            }).then(result => {
              this.presentToast(`${record.firstName} ${record.lastName} Associates Active successfully!!`);
            })

          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertDeleteAssociates(record) {
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
            this.firestore.collection('user_associates').doc(record.id).delete().then(result => {
              this.presentToast('User Associates Deleted sucessfully!!');
              this.ionViewWillEnter();
            });

          }
        }
      ]
    });
    await alert.present();
  }

  goToBlockAssociates() {
    this.blockType = 'ASSOCIATES';
    this.isBlockAssociatesOpen = true;
    this.userBlockAssocates$ = this.dashboardService.getAssociatesUserDetails();
    this.userAssocates$.subscribe(res => {
      let BlockAssociates = res.filter(ass => ass.status == 'BLOCK');
      this.dataSourceBlockAssociates = new MatTableDataSource(BlockAssociates);
      this.dataSourceBlockAssociates.paginator = this.paginatorAssociates;
      this.dataSourceBlockAssociates.sort = this.sortAssociates;
    });
  }

  blockModalDismiss() {
    this.isBlockAssociatesOpen = false;
    this.blockAssociatesModal.dismiss(null, 'cancel');
  }

  viewAssociates(record, type) {
    this.associateType = type;
    this.viewDetail = record;
    this.isViewAssociatesOpen = true;
  }

  viewModalDismiss() {
    this.isViewAssociatesOpen = false;
    this.viewAssociatesModal.dismiss(null, 'cancel');
  }

    async editAssociates(record: any) {
      const modal = await this.modalController.create({
        component: AddAssociateComponent,
        componentProps: {
          actionType: 'EDIT',
          user: record
        },
        cssClass: 'addEvent-modal',
        backdropDismiss: false
      });
      await modal.present();
    }
}


