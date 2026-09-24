import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { } from 'firebase/app';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  user: any = {};
  constructor(private fireAuth: AngularFireAuth, private router: Router, private alertController: AlertController,
    private firestore: AngularFirestore, private userService: UserService) { }

  ngOnInit() { }


  login() {

    if (this.email && this.password) {
      this.fireAuth.signInWithEmailAndPassword(this.email, this.password).then((res) => {
        if (null != res.user && null != res.user.uid) {
          this.firestore.collection("admin_user").doc(res.user.uid).get().subscribe((data: any) => {
            if (data.exists) {
              this.user = data.data();
              this.userService.setUserDetails(this.user);
              // this.router.navigate(['/home/dashboard']);
              this.router.navigate(['/home/pageDashboard']);
            } else {
              this.presentAlert('User not exist for this Password or email. Please try again.');
            }
          });


        } else {
          this.presentAlert('Invalid Password or email. Please try again.');
        }

      }).catch(function (error) {
        alert(error.message);
      });
    } else {
      this.presentAlert('Check your email or password .');
    }


  }



  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {

          }
        }
      ]
    })
    await alert.present();
  }
}