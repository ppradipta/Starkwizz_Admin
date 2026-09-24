import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';

@Component({
  selector: 'app-discount-setup',
  templateUrl: './discount-setup.component.html',
  styleUrls: ['./discount-setup.component.scss'],
})
export class DiscountSetupComponent implements OnInit {
  discountSetp: any = {
    id: '',
    code: '',
    name: '',
    applicableFor: '',
    type: '',
    typeValue: '',
    description: '',
    creationdate: '',
    status: ''
  }
  discountApplicables: any[] = ['ASSOCIATES', 'DYNAMO EXAM', 'EVENT', 'EXAM', 'QUIZWHIZZ EXAM', 'USER', 'COMBO_OFFER'];
  boardDetails: any[] = [];
  classDetails: any[] = [];
  constructor(private generateKey: GenerateKeyService, private dateUtil: DateUtilService,
    private modalCtrl: ModalController,
    private firestore: AngularFirestore, private toastController: ToastController) {
    this.discountSetp.code = 'SKC-' + this.generateKey.generateApplicationId();
    this.discountSetp.creationdate = this.dateUtil.getCurrentDateWithYYYYMMDD();
    this.discountSetp.id = this.generateKey.generateUniqueFirestoreId();
    this.discountSetp.status='CREATE';
  }

  ngOnInit() {
    this.getAllBoardData();
  }

  createDiscounts() {

    let classdetls = this.classDetails.find(cld => cld.id == this.discountSetp.classId);
    if (classdetls) {
      this.discountSetp.className = classdetls.name;
    }

    this.firestore.collection('discounts').doc(this.discountSetp.id)
      .set(JSON.parse(JSON.stringify(this.discountSetp)), { merge: true }).then(result => {
        this.presentToast('Discounts added sucessfully!!');
        this.modalCtrl.dismiss();
      });
  }

  close(){
    this.modalCtrl.dismiss();
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }
  
  getAllBoardData() {
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref
      .get().then((boards: any) => {
        this.boardDetails = [];
        if (!boards.empty) {
          boards.forEach(data => {
            this.boardDetails.push(data.data());
          });
        }
      })
  }


  selectClass(event) {
    let boarddetls = this.boardDetails.find(cld => cld.id == this.discountSetp.boardId);
    if (boarddetls) {
      this.discountSetp.boardName = boarddetls.name;
    }
    this.classDetails = [];
    this.firestore.collection("classes", ref => ref.where("boardId", "==", this.discountSetp.boardId)).get().subscribe(data => {
      data.forEach(res => {
        this.classDetails.push(res.data());
        this.classDetails = this.classDetails.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
      })
    });

  }

}
