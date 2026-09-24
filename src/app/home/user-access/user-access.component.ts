import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { AddRoleUserComponent } from './add-role-user/add-role-user.component';
import { EditAccessModalComponent } from './edit-access-modal/edit-access-modal.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
})
export class UserAccessComponent implements OnInit {
  users: any[] = [];
  userDetail: any = {};
  // acess: any[] = [];
  typeList: any = [
    { id: 'OA ADMIN', displayName: 'OA ADMIN' },
    { id: 'SA ADMIN', displayName: 'SA ADMIN' },
    { id: 'DA ADMIN', displayName: 'DA ADMIN' },
    { id: 'BA ADMIN', displayName: 'BA ADMIN' },
  ];
  segmentValue: string = 'SA ADMIN';

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private user: UserService,
  ) { }

  ngOnInit() {
    this.user.getUserDetails().subscribe(user => {
      this.userDetail = user;
    })

    // this.firestore.collection("admin_acess", ref => ref).get().subscribe(data => {
    //   if (!data.empty) {
    //     data.forEach((res: any) => {
    //       this.acess = res.data()?.acessTypes;
    //     });
    //   }
    // });

    this.goToUsers();
  }

  ionViewWillEnter() {
    this.goToUsers();
  }

  tabChanged(event) {
    this.segmentValue = event.detail.value;
    this.users = [];
    this.goToUsers();
  }

  goToUsers() {
    this.firestore.collection("admin_user", ref => ref
      .where("type", "==", this.segmentValue)
    ).get().subscribe(data => {
      if (!data.empty) {
        data.forEach((res: any) => {
          let record = res.data();
          this.users.push(record);
        });
      }
    });

  }

  async editAccess(user) {
    const modal = await this.modalController.create({
      component: EditAccessModalComponent,
      componentProps: {
        // acess: this.acess,
        user: user
      },
      cssClass: 'toggle-modal',
      backdropDismiss: false
    });
    await modal.present();
  }


  async addUser() {
    const modal = await this.modalController.create({
      component: AddRoleUserComponent,
      cssClass: 'addEvent-modal',
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();
  }

  viewAccess(record) {
    this.router.navigate(['home/view-access'], { queryParams: { OPERATION: this.segmentValue } })
  }

}
