import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-hub-offer',
  templateUrl: './hub-offer.component.html',
  styleUrls: ['./hub-offer.component.scss'],
})
export class HubOfferComponent implements OnInit {
  offers: any[] = [];
  constructor(private navCtrl: NavController,
    private route: ActivatedRoute,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    let hubId = this.route.snapshot.queryParams['hubId'];
    if (hubId) {
      this.offers = [];
      this.getOffersForHub(hubId);
    }

  }


  getOffersForHub(hubId: string) {
    const query = this.firestore.collection("hubOffers");
    query.ref.where('hubId', '==', hubId)
      .get().then((hub: any) => {
        if (!hub.empty) {
          hub.forEach(data => {
            this.offers.push(data.data());
          });
        }
      });

  }

  goBack(){
    this.navCtrl.back();
  }

  addOffersForHub() {

  }

}
