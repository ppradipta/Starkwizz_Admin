import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, IonModal, ModalController, ToastController } from '@ionic/angular';
import { DiscountSetupComponent } from '../discount-setup.component';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.scss'],
})
export class DiscountListComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  isModalOpen = false;
  discounts: any[] = [];
  selectedDiscount: any = {};
  suser: any = {};
  users: any[] = [];
  events: any[] = [];
  sEvent: any = {};
  modalOperation: string = 'LINK';
  constructor(private modalController: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.getDiscountList();
  }

  getDiscountList() {
    this.firestore.collection('discounts').valueChanges().subscribe((records: any[]) => {
      this.discounts = records;
    });
  }


  async editCopun(discount: any) {
    const modal = await this.modalController.create({
      component: DiscountSetupComponent,
      componentProps: {
        actionType: 'EDIT',
        discountSetp: discount
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }

  deleteCopun(discount: any) {
    this.firestore.collection('discounts').doc(discount.id).delete().then(result => {
      this.presentToast('Discounts Deleted sucessfully!!');
      this.getDiscountList();
    });
  }

  async linkDiscount(discount: any) {
    this.modalOperation = 'LINK';
    this.selectedDiscount = discount;
    if (discount.applicableFor == 'ASSOCIATES' || discount.applicableFor == 'COMBO_OFFER') {
      this.isModalOpen = true;
      this.firestore.collection('user_associates', ref => ref.where("status", "==", 'ACTIVE'))
        .valueChanges().subscribe((alluser) => {
          this.users = alluser;
        });
    } else if (discount.applicableFor == 'DYNAMO EXAM') {
      this.isModalOpen = true;
      this.firestore.collection('events', ref => ref.where("status", "==", 'ACTIVE')
        .where("applicableType", "==", "SUBSCRIBTION")
        .where("type", "==", 'DYNAMO EXAM'))
        .valueChanges().subscribe((allevents) => {
          this.events = allevents;
        });
    } else if (discount.applicableFor == 'EVENT') {
      this.isModalOpen = true;
      this.firestore.collection('events', ref => ref.where("status", "==", 'ACTIVE')
        .where("applicableType", "==", "SUBSCRIBTION")
        .where("type", "==", 'EVENT'))
        .valueChanges().subscribe((allevents) => {
          this.events = allevents;
        });
    } else if (discount.applicableFor == 'EXAM') {
      this.isModalOpen = true;
      this.firestore.collection('events', ref => ref.where("status", "==", 'ACTIVE')
        .where("applicableType", "==", "SUBSCRIBTION")
        .where("type", "==", 'EXAM'))
        .valueChanges().subscribe((allevents) => {
          this.events = allevents;
        });
    } else if (discount.applicableFor == 'QUIZWHIZZ EXAM') {
      this.isModalOpen = true;
      this.firestore.collection('events', ref => ref.where("status", "==", 'ACTIVE')
        .where("applicableType", "==", "SUBSCRIBTION")
        .where("type", "==", 'QUIZWHIZZ EXAM'))
        .valueChanges().subscribe((allevents) => {
          this.events = allevents;
        });
    } else {
      this.presentToast("Discounts Applicable for not found!!");
    }
  }

  selectedUser(usr: any) {
    usr.isSelected = usr.isSelected == null ? true : !usr.isSelected;
    this.suser = usr;
    let index = this.users.findIndex(suer => suer.id == usr.id);
    if (index != -1) {
      this.users[index].isSelected = usr.isSelected == null ? true : !usr.isSelected;
    }
  }

  selectedEvent(evt: any) {
    this.sEvent = evt;
  }

  viewLinkedDiscounts(discount) {
    this.modalOperation = 'VIEWLINK';
    if (discount.applicableFor == 'ASSOCIATES') {
      this.isModalOpen = true;
      this.firestore.collection('user_associates', ref => ref.where("status", "==", 'ACTIVE'))
        .valueChanges().subscribe((alluser) => {
          this.users = alluser;
        });
    }
  }

  confirmLinkDiscounts() {
    if (this.selectedDiscount.applicableFor == 'ASSOCIATES' || this.selectedDiscount.applicableFor == 'COMBO_OFFER') {
      this.firestore.collection('user_associates').doc(this.suser.id).update({
        discount: {
          code: this.selectedDiscount.code,
          description: this.selectedDiscount.description,
          id: this.selectedDiscount.id,
          name: this.selectedDiscount.name,
          type: this.selectedDiscount.type,
          typeValue: this.selectedDiscount.typeValue
        },
        discountId: this.selectedDiscount.id,
        discountType: this.selectedDiscount.applicableFor,
        isDiscountLink: true
      }).then(result => {
        this.modalDismiss();
        this.presentToast('Discounts Linked sucessfully!!');

      })
    }
    if (this.selectedDiscount.applicableFor == 'DYNAMO EXAM') {
      this.firestore.collection('events').doc(this.suser.id).update({
        discount: this.selectedDiscount
      }).then(result => {
        this.modalDismiss();
        this.presentToast('Discounts Linked sucessfully!!');

      })
    }
    if (this.selectedDiscount.applicableFor == 'EVENT') {
      this.firestore.collection('events').doc(this.suser.id).update({
        discount: this.selectedDiscount
      }).then(result => {
        this.modalDismiss();
        this.presentToast('Discounts Linked sucessfully!!');

      })
    }
    if (this.selectedDiscount.applicableFor == 'EXAM') {
      this.firestore.collection('events').doc(this.suser.id).update({
        discount: this.selectedDiscount
      }).then(result => {
        this.modalDismiss();
        this.presentToast('Discounts Linked sucessfully!!');

      })
    }
    if (this.selectedDiscount.applicableFor == 'QUIZWHIZZ EXAM') {
      this.firestore.collection('events').doc(this.suser.id).update({
        discount: this.selectedDiscount
      }).then(result => {
        this.modalDismiss();
        this.presentToast('Discounts Linked sucessfully!!');

      })
    }
  }
  modalDismiss() {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }

  async addDiscounts(actionType) {
    const modal = await this.modalController.create({
      component: DiscountSetupComponent,
      componentProps: {
        actionType: actionType,
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }




  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }


}
