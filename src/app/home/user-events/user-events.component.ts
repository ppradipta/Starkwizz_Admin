import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { userEvents } from 'src/app/model/user-events';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss'],
})
export class UserEventsComponent implements OnInit {
  segmentValue = 'EXAMS';
  examSegmentValue = 'COMPLETED'
  examDetails: userEvents[] = [];
  eventDetails: userEvents[] = [];
  rescheduledExamDetails: userEvents[]=[];

  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  allBoardDetails: BoardOfEducation[]=[];
  filterBoardId: string;
  filterClassId: string;
  filterSubjectId: string;
  filterModuleId: string;

  constructor(
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.getCompletedExams();
    this.getAllBoards();
  }

  tabChanged(event) {
    this.segmentValue = event.detail.value;
    if(this.segmentValue == 'EVENTS'){
      this.getEvents();
    }
  }

  examTabChanged(event){
    this.examSegmentValue = event.detail.value;
    if(this.examSegmentValue == 'RESCHEDULED'){
      this.getRescheduleExams();
    }else if(this.examSegmentValue == 'COMPLETED'){
      this.getCompletedExams()
    }
  }
    
  getCompletedExams() {
      const query = this.firestore.collection(FirebaseCollection.USER_EVENTS,
        (ref) => ref
        .where("type", "==", 'EXAM')
        .where("status", "==", 'COMPLETED')
        );
      query.valueChanges().subscribe(async (pAdds: any) => {
        this.examDetails= [];
        if (pAdds.length > 0) {
          this.examDetails = pAdds;        
          await this.getUser(this.examDetails);
          this.calculateResult(this.examDetails);
        }
      });
  }

 getEvents() {
    const query = this.firestore.collection(FirebaseCollection.USER_EVENTS);
    query.ref
    .where("type", "==", 'EVENT')
      .get().then((event: any) => {
        if (!event.empty) {
          this.eventDetails = [] = [];
          event.forEach(async data => {
            this.eventDetails.push(data.data());
            await this.getUser(this.eventDetails);
            this.calculateResult(this.eventDetails);
          });
        }
      });
  }

  getUser(eventDetails){
    eventDetails.forEach(eventData => {
      if(eventData.userId){
        const query = this.firestore.collection(FirebaseCollection.USERS);
      query.ref
      .where("id", "==", eventData.userId)
        .get().then((user: any) => {
          if (!user.empty) {
            user.forEach(data => {
              let user = data.data();
              // let userData ={
              //   firstName: user.firstName,
              //   lastName: user.lastName,
              //   displayName: user.displayName
              // }
              //eventData.userDetails = userData;
              eventData.userName = user.displayName;
            });
          }
        })
      }
    });
  
  }

  getRescheduleExams(){
    const query = this.firestore.collection(FirebaseCollection.USER_EVENTS,
      (ref) => ref
      .where("type", "==", 'EXAM')
      .where("status", "==", 'RESCHEDULED')
      );
    query.valueChanges().subscribe(async (pAdds: any) => {
      this.examDetails =[];
      if (pAdds.length > 0) {
        this.examDetails = pAdds;        
        await this.getUser(this.examDetails);
        this.calculateResult(this.examDetails);
      }
    });
  }

  calculateResult(eventDetails){
    eventDetails.forEach(event => {
      event.totalScore = 0;
      let correctAnswersResult = event.questions.filter(ques => ques.status == "CORRECT");
      if (correctAnswersResult.length > 0) {
        correctAnswersResult.forEach(ques => {
          event.totalScore += ques.mark
        });
      }else{
        event.totalScore = 0;
      }
      event.correctAnswers = correctAnswersResult.length;
      event.inCorrectAnswers = (event.questions.filter(ques => ques.status == "WRONG").length);
      event.skippedQuestions = (event.questions.filter(ques => ques.status == "SKIPPED").length);
    });
   
  }

  getAllBoards() {
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref.get().then((board: any) => {
      if (!board.empty) {
        board.forEach(data => {
          this.allBoardDetails.push(data.data());
        });
      }
    })
  }

  selectBoard(event){
    this.classes = [];
    this.filterBoardId = event.detail.value.id;
    this.firestore.collection("classes", ref => ref.where("boardId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.classes.push(res.data());
        this.classes = this.classes.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
      });
      console.log(this.classes);
    });
  }

  selectClass(event){
    this.filterClassId = event.detail.value.id;
    this.subjects = [];
    this.firestore.collection("subjects", ref => ref.where("classId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.subjects.push(res.data());
      })
    });
  }

  selectSubject(event){
    this.filterSubjectId = event.detail.value.id;
    this.modules = [];
    this.firestore.collection("modules", ref => ref.where("subjectId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.modules.push(res.data());
      })
    });
  }

 selectModule(event){
  this.filterModuleId = event.detail.value.id;
 }

  async search() {
    this.eventDetails = [];
    this.examDetails = [];
    let query;
    if (this.filterBoardId) {
      query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
        .where('boardId', '==', this.filterBoardId);
    }
    if (this.filterClassId) {
      query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
        .where('classId', '==', this.filterClassId);
    }
    if (this.filterSubjectId) {
      query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
        .where('subjectId', '==', this.filterSubjectId);
    }
    if (this.filterModuleId) {
      query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
        .where('moduleId', '==', this.filterModuleId);
    }
    let exmDet = [];
    query.get().then((eventDetail: any) => {
      if (!eventDetail.empty) {
        eventDetail.forEach(data => {
          exmDet.push(data.data());
          if(this.segmentValue == 'EXAMS'){
            if(this.examSegmentValue == 'COMPLETED'){
              let res: any =  exmDet.filter(exm => exm.status == 'COMPLETED');
              if(res.length > 0){
                this.examDetails = res;
              }
            }
          }else if(this.segmentValue =='EVENTS'){
            this.eventDetails.push(data.data());
          }
        });
      }
    });
  }
}
