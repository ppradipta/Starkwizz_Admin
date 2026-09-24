import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  appPages = [
    {
      title: "Dashboard",
      url: "home/pageDashboard",
      routerDirection: "forward",
    },
      {
      title: "Subscription",
      url: "home/subscription",
      routerDirection: "forward",
    },
    {
      title: "Board Classes",
      url: "home/dashboard",
      routerDirection: "forward",
    },
    {
      title: "All Questions",
      url: "home/allQuestion",
      routerDirection: "forward",
    },
    {
      title: "Questions",
      url: "home/addQuestion",
      routerDirection: "forward",
    },
    {
      title: "Events",
      url: "home/events",
      routerDirection: "forward",
    },
    {
      title: "Dynamo Events",
      url: "home/dynamoevents",
      routerDirection: "forward",
    },
    {
      title: "Location",
      url: "home/location",
      routerDirection: "forward"
    },
    {
      title: "Interest",
      url: "home/interest",
      routerDirection: "forward"
    },
    {
      title: "Filters",
      url: "home/filter-category",
      routerDirection: "forward",
    },
    {
      title: "Adds",
      url: "home/adds",
      routerDirection: "forward",
    },
    {
      title: "QuizWhizz",
      url: "home/quizwhizz",
      routerDirection: "forward",
    },
    {
      title: "Events-Video",
      url: "home/events-video",
      routerDirection: "forward",
    },
    {
      title: "Events-Snapshots",
      url: "home/eventsSnapshots",
      routerDirection: "forward",
    },
    {
      title: "Posted Video",
      url: "home/postedVideo",
    },
    {
      title: "Posted Snapshots",
      url: "home/snapshots",
      routerDirection: "forward",
    },
    {
      title: "User Events",
      url: "home/userEvents",
      routerDirection: "forward",
    },
    {
      title: "Users",
      url: "home/userList",
      routerDirection: "forward",
    },
    {
      title: "Users Access",
      url: "home/userAccess",
      routerDirection: "forward",
    },
    {
      title: "Associates Management",
      url: "home/user-associate",
      routerDirection: "forward",
    },
    {
      title: "BDA Activity",
      url: "home/bda-activity",
      routerDirection: "forward",
    },
    {
      title: "MY Activity",
      url: "home/my-activity",
      routerDirection: "forward",
    },
    {
      title: "Manage Syllabus",
      url: "home/manage-syllabus",
      routerDirection: "forward",
    },
        {
      title: "LeaderBoard",
      url: "home/leaderboard",
      routerDirection: "forward",
    },
    {
      title: "Hubs",
      url: "home/hubs",
      routerDirection: "forward",
    },
    {
      title: "E-class",
      url: "home/eclass",
      routerDirection: "forward",
    },
    {
      title: "Notification",
      url: "home/notification",
      routerDirection: "forward",
    },
    {
      title: "Profile Approval",
      url: "home/user-profile-approval",
      routerDirection: "forward",
    },
    {
      title: "Combo Offer",
      url: "home/combo-offer",
      routerDirection: "forward",
    },
    {
      title: "Price Management",
      url: "home/price-management",
      routerDirection: "forward",
    },
    {
      title: "Discounts",
      url: "home/discountlist"
    },
    {
      title: "Club Points",
      url: "home/club-points"
    },
    {
      title: "Feedback",
      url: "home/feedback"
    },
    {
      title: "DB Console",
      url: "dbconsole",
      routerDirection: "forward",
    }
  ];

  user: any = {};
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private userService: UserService
  ) {
    this.userService.getUserDetails().subscribe(user => {
      this.user = user;
      if (this.user.profileType != 'SUPER_ADMIN') {
        this.appPages = user.acess?.filter(ass => ass.isSelected == true);
            } 

    });
  }

  async changePage(url) {
    this.router.navigate([url]);
  }

  logout() {
    this.fireAuth.signOut();
    this.router.navigate(['login']);
  }

  goToQuestion() {
    this.router.navigate(['home/questions']);
  }
}
