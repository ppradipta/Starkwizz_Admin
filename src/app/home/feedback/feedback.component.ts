import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  feedbackList: any = [];

  constructor(
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
    this.allSyllabusEnquiry();
  }

  allSyllabusEnquiry() {
    this.firestore.collection("user_feedback", ref => ref
      .where("status", "==", 'ACTIVE')
      .orderBy("createDateUnix", "desc")
    ).get().subscribe(data => {
      this.feedbackList = [];
      if (!data.empty) {
        data.forEach((res: any) => {
          let record = res.data();
          this.feedbackList.push(record);
        });
      }
    });
  }

}
