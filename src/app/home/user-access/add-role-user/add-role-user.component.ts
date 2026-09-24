import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';

@Component({
  selector: 'app-add-role-user',
  templateUrl: './add-role-user.component.html',
  styleUrls: ['./add-role-user.component.scss'],
})
export class AddRoleUserComponent implements OnInit {
  userAdd: any = {
    code: '',
    profileType: 'ADMIN_USER'
  };
  password: string = "";
  confirmPassword: string = "";
  isVisible = false;
  isVisible1 = false;
  typeList: any = [
    { id: 'OA ADMIN', displayName: 'OA ADMIN' },
    { id: 'SA ADMIN', displayName: 'SA ADMIN' },
    { id: 'DA ADMIN', displayName: 'DA ADMIN' },
    { id: 'BA ADMIN', displayName: 'BA ADMIN' },
  ];
  acess: any[] = [];

  constructor(private generateKey: GenerateKeyService, private dateUtil: DateUtilService,
    private afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private firestore: AngularFirestore, private toastController: ToastController) {
    this.userAdd.code = 'SKAB-' + this.generateKey.generateApplicationId();
    this.userAdd.creationdate = this.dateUtil.getCurrentDateWithYYYYMMDD();
  }
  ngOnInit() {
    this.firestore.collection("admin_acess", ref => ref).get().subscribe(data => {
      if (!data.empty) {
        data.forEach((res: any) => {
          this.acess = res.data()?.acessTypes;
        });
      }
    });
  }


  registerUser() {
    this.userAdd.status = 'ACTIVE';
    if (this.password == this.confirmPassword) {
      this.signUp(this.userAdd.email, this.password);
    }
    else {
      this.presentToast('Please Check Confirm Password!');
    }
  }

  signUp(email, password) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.userAdd.id = result.user.uid;
        this.userAdd.acess = this.acess;
        this.firestore.collection('admin_user').doc(this.userAdd.id)
          .set(JSON.parse(JSON.stringify(this.userAdd)), { merge: true }).then(result => {
            this.presentToast('You have been successfully registered!');
            this.modalCtrl.dismiss();
          });
      })
      .catch((error) => {
        this.presentToast(error.message);
      });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
