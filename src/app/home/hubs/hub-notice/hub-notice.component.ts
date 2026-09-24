import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-hub-notice',
  templateUrl: './hub-notice.component.html',
  styleUrls: ['./hub-notice.component.scss'],
})
export class HubNoticeComponent implements OnInit {
  notices: any[] = [];
  constructor(private navCtrl: NavController,
    private route: ActivatedRoute,
    private firestore: AngularFirestore) { }

  ngOnInit() {

   let hubId = this.route.snapshot.queryParams['hubId'];
    if (hubId) {
      this.notices = [];
      this.getNoticesForHub(hubId);
    }
  }

  getNoticesForHub(hubId: string) {
    const query = this.firestore.collection('hubNotices');
    query.ref.where('hubId', '==', hubId)
      .get().then((hub: any) => {
        if (!hub.empty) {
          hub.forEach(data => {
            this.notices.push(data.data());
          });
        }
      });

  }

  goBack(){
    this.navCtrl.back();
  }

  addNoticesForHub() {

  }

}
