import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth
  ) { }
  

  ngOnInit(): void {}

  logout(){
    this.fireAuth.signOut();
    this.router.navigate(['login']);
  }

  goToNotification() {
    this.router.navigate(['home/notification']);
  }
}
