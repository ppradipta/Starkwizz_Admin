import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BookAdds } from 'src/app/model/bookAdds';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.scss'],
})
export class AddsComponent implements OnInit {
  myAdds: BookAdds[] = [];
  segmentValue = 'POSTED';
  postedAdds: BookAdds[] = [];
  approvedAdds: BookAdds[] = [];
  constructor(
    private firestore: AngularFirestore,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    //this.getBookAdds();
    this.getSegmentValue();
  }

  // getBookAdds() {
  //   this.firestore.collection(FirebaseCollection.MY_ADDS).valueChanges().subscribe((records: BookAdds[]) => {
  //     this.myAdds = records;
  //   });
  // }

  getSegmentValue() {
    this.segmentValue = this.segmentValue;
    if (this.segmentValue === "POSTED") {
      this.getPostedAdds();

    } else if (this.segmentValue === "PUBLISHED") {
      this.getApprovedAdds();
    }
  }

  tabChanged(event) {
    this.segmentValue = event.detail.value;
    if (this.segmentValue === "POSTED") {
      this.getPostedAdds();

    } else if (this.segmentValue === "PUBLISHED") {
      this.getApprovedAdds();
    }
  }

  getPostedAdds() {
    const query = this.firestore.collection(FirebaseCollection.MY_ADDS,
      (ref) => ref.where("status", "==", 'POSTED'));
    query.valueChanges().subscribe((pAdds: any) => {
      // this.postedAdds = [];
      if (pAdds.length > 0) {
        this.postedAdds = pAdds;
        this.calculateDiscount(this.postedAdds)
      }else{
        this.postedAdds = [];
      }
    });
  }

  getApprovedAdds() {
    const query = this.firestore.collection(FirebaseCollection.MY_ADDS,
      (ref) => ref.where("status", "==", 'PUBLISHED'));
    query.valueChanges().subscribe((pAdds: any) => {
      // this.approvedAdds = [];
      if (pAdds.length > 0) {
        this.approvedAdds = pAdds;
        this.calculateDiscount(this.approvedAdds)
      }
    });
  }
  
  markApproved(add){
    this.eventsService.updateMyAddDetailsToCollection(add).then(() =>{
      this.getPostedAdds();
    });
  }

  calculateDiscount(myAdds){
    myAdds.forEach(add => {
      add.discountPercentage  = parseFloat((((add.bookPrice - add.discount) /add.bookPrice)*100).toFixed(2));
    });
  }
}
