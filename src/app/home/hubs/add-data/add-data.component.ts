import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss'],
})
export class AddDataComponent implements OnInit {
  @Input() tabValue: string;
  allStateDetails: any;
  allDistrictDetails: any;
  allCitiesDetails: any;
  name: string;
  stateDetails: any;
  districtDetails: any;
  schoolDetails: any;
  allBoardDetails: any;
  boardDetails: any;
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.getAllStates();
    this.getAllBoards();
  }


  close() {
    this.modalController.dismiss();
  }

  getAllStates() {
    this.allStateDetails = [];
    this.firestore.collection(FirebaseCollection.STATE).valueChanges().subscribe((state) => {
      this.allStateDetails = state;
    });
  }

  selectState(event) {
    this.stateDetails = event.detail.value;
    this.allDistrictDetails = [];
    this.firestore.collection("district", ref => ref.where("stateid", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.allDistrictDetails.push(res.data());
      })
    });
  }

  selectDistrict(event) {
    this.districtDetails = event.detail.value;
    this.allCitiesDetails = [];
    this.firestore.collection("cities", ref => ref.where("districtid", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.allCitiesDetails.push(res.data());
      })
    });
  }

  selectSchool(event) {
    this.schoolDetails = event.detail.value;
  }

  selectBoard(event){
    this.boardDetails = event.detail.value;
  }

  getAllDistrict() {
    this.allDistrictDetails = [];
    this.firestore.collection(FirebaseCollection.DISTRICT).valueChanges().subscribe((district) => {
      this.allDistrictDetails = district;
    });
  }

  getAllBoards() {
    this.allBoardDetails = [];
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref.get().then((board: any) => {
      if (!board.empty) {
        board.forEach(data => {
          this.allBoardDetails.push(data.data());
        });
      }
    })
  }

  save() {
    let data = {
      tabValue: this.tabValue,
      name: this.name,
      stateDetails:  this.stateDetails,
      districtDetails: this.districtDetails,
      schoolDetails: this.schoolDetails,
      boardDetails: this.boardDetails
    }
    this.modalController.dismiss(data);
  }

}
