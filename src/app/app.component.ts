import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private userService: UserService,
    private router: Router
  ) {
    this.getUserAuth();
  }

  getUserAuth() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        const query = this.db.collection('admin_user').doc(user.uid);
        query.ref.get().then((respone: any) => {
          if (respone.exists) {
            let userDetails = respone.data();
            userDetails.id = userDetails.uid;
            this.userService.setUserDetails(userDetails);
            this.router.navigate(['home/pageDashboard']);
          }
        }, err => {
          console.log('err', err);
          this.userService.setUserDetails(null);
          this.router.navigate(['/login']);

        })
      }
    });
  }
}
