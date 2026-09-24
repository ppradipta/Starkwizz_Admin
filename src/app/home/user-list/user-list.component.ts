import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, IonModal, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { DashBoardService } from 'src/app/services/dashboard.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserTxnHistoryComponent } from './user-txn-history/user-txn-history.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  segmentValue: any;
  userList = [
    { id: 0, type: 'student' },
    { id: 1, type: 'parent' },
    { id: 2, type: 'teacher' },
    { id: 3, type: 'hub' }
  ];
  userDetails: any[] = [];
  hubDetails: any[] = [];

  dataSource: MatTableDataSource<any>;
  @ViewChild('MatPaginator1') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // displayedColumns: string[] = ['applicationId', 'name', 'boardName', 'creationdate', 'mobileNo', 'profileType', 'dateOfBirth', 'address', 'school', 'emailId'];
  displayedColumns: string[] = ['applicationId', 'name', 'boardName', 'mobileNo', 'school'];
  users$: Observable<any[]>;


  dataSourceAssociates: MatTableDataSource<any>;
  dataSourceBlockAssociates: MatTableDataSource<any>;
  @ViewChild('MatPaginatorAssociate') paginatorAssociates: MatPaginator;
  @ViewChild(MatSort) sortAssociates: MatSort;
  displayedColumnsAssociates: string[] = ['code', 'name', 'CouponCode', 'creationdate', 'mobileNo', 'email', 'postId', 'stateName', 'referenceName', 'referenceUID', 'referenceMobile'];
  blockColumnsAssociates: string[] = ['code', 'name', 'creationdate', 'mobileNo', 'profileType', 'email', 'CouponCode'];
  userAssocates$: Observable<any[]>;
  userBlockAssocates$: Observable<any[]>;

  copunLinkedUsers: any[] = [];

  isLinkedUserModal = false;
  searchMobileNo: string = '';
  selectedUser: any = {};

  @ViewChild(IonModal) blockAssociatesModal: IonModal;
  isBlockAssociatesOpen: boolean = false;
  blockType: string;
  constructor(
    private firestore: AngularFirestore,
    private dashboardService: DashBoardService,
    private modalController: ModalController,
    private toastController: ToastController,
    private modal: ModalController,
    private router: Router,
    private user: UserService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.segmentValue = this.userList[0];
    this.getAllBoardData();
  }

  tabChanged(event) {
    this.segmentValue = event.detail.value;
    if (this.segmentValue.type == "hub") {
      this.getAllHubDetails();
    } else if (this.segmentValue.type == "hub") {
      this.getAllBoardData(this.segmentValue?.type);
    }
  }

  async getAllBoardData(userType?) {
    this.users$ = await this.dashboardService.getUserDetails();
    this.users$.subscribe(res => {
      let activeStudent = res.filter(ass => ass.status != 'BLOCK');
      this.dataSource = new MatTableDataSource(activeStudent);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event, type) {
    const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  }

  getAllHubDetails() {
    const query = this.firestore.collection(FirebaseCollection.HUBS);
    query.ref
      .get().then((hub: any) => {
        if (!hub.empty) {
          hub.forEach(data => {
            this.hubDetails.push(data.data());
          });
        }
      })
  }

  async viewStudentsDetailsTxnDetails(data: any) {
    this.user.setUserTxnHistory(data);
    this.router.navigate(['home/userTxnHistory'], { queryParams: { TYPE: 'STUDENT' } });


    // const modal = await this.modalController.create({
    //   component: UserTxnHistoryComponent,
    //   cssClass: 'addEvent-modal',
    //   backdropDismiss: true,
    //   componentProps: { user: data },
    // });
    // await modal.present();
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

  modalDismiss() {
    this.isLinkedUserModal = false;
    this.modal.dismiss(null, 'cancel');
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  async searchUser() {
    const searchUser = await new Promise<any>((resolve) => {
      this.firestore.collection("users", ref => ref.where("mobileNo", "==", this.searchMobileNo)).get().subscribe((data: any) => {
        if (!data.empty) {
          data.forEach((res: any) => {
            this.selectedUser = res.data();
          });
          resolve(this.selectedUser)
        }
      });
    });
    if (searchUser) {
      const modal = await this.modalController.create({
        component: UserDetailsComponent,
        cssClass: 'addEvent-modal',
        backdropDismiss: true,
        componentProps: {
          userDetail: searchUser
        },
      });
      await modal.present();
      await modal.onDidDismiss().then(result => {
        this.searchMobileNo = '';
      })
    }
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

  async presentAlertActiveAssociates(record, type) {
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
              this.firestore.collection('users').doc(record.id).update({
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



  goToBlockStudent() {
    this.blockType = 'STUDENTS';
    this.isBlockAssociatesOpen = true;
    this.users$ = this.dashboardService.getUserDetails();
    this.users$.subscribe(res => {
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

}
