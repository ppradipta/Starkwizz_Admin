import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { arrayRemove } from 'firebase/firestore';
import { AlertMessageComponent } from 'src/app/common/component/alert-message/alert-message.component';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { LoadingService } from 'src/app/services/loading.service';
import { AddFilterComponent } from './add-filter/add-filter.component';

@Component({
  selector: 'app-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: ['./filter-category.component.scss'],
})
export class FilterCategoryComponent implements OnInit {
  filterTypes: any[] = [];
  filters: any[] = [];
  tabValue: string = 'SHOWCASE';
  filterType: any;
  selectedType: any;
  constructor(private firestore: AngularFirestore,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private loaderService: LoadingService,
    public navCtrl: NavController) { }

  ngOnInit() {

  }

  goBack() {
    this.navCtrl.back();
  }

  tabChanged(event) {
    this.tabValue = event.detail.value;
    this.filterTypes = [];
    this.filterType = '';
    this.filters = [];
  }

  getAllFilterTypeForTabValue() {
    this.loaderService.present();
    this.filterTypes = [];
    this.firestore.collection(FirebaseCollection.PARAMETER_TYPES, ref => ref.where("type", "==", this.tabValue)).get()
      .subscribe(filterTypes => {
        if (!filterTypes.empty) {
          filterTypes.forEach(data => {
            this.selectedType = data.data();
            this.filterTypes.push(...this.selectedType['values']);
          });
          this.filterTypes = this.filterTypes.sort((a, b) => {
            if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
              return 1;
            if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
              return -1;
            return 0;
          });
        }
        this.loaderService.dismiss();
      });
  }


  selectFilterType() {
    this.filterType = '';
    this.filters = [];
    this.getAllFilterTypeForTabValue();
  }

  async addFilters() {
    if (this.selectedType && this.filterType) {
      const modal = await this.modalController.create({
        component: AddFilterComponent,
        cssClass: 'center-modal',
        backdropDismiss: false,
        componentProps: {
          type: this.tabValue,
          typeId: this.filterType.id,
          filterType: this.filterType
        },
      });
      await modal.present();
      await modal.onDidDismiss().then(result => {
        if (result.data) {
          this.searchFilter();
        }
      });
    } else {
      this.presentToast(`Please select Filter Type to Add`);
    }


  }



  searchFilter() {
    if (this.filterType) {
      this.loaderService.present();
      this.filters = [];
      this.firestore.collection(FirebaseCollection.PARAMETER, ref => ref.where("filterfor", "==", this.tabValue)
        .where("id", "==", this.filterType.id)).get()
        .subscribe(fetchfilters => {
          if (!fetchfilters.empty) {
            fetchfilters.forEach(data => {
              this.selectedType = data.data();
              this.selectedType['parameterId'] = data.id;
              this.filters.push(...this.selectedType['values']);
            });
            this.filters = this.filters.sort((a, b) => {
              if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
                return 1;
              if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
                return -1;
              return 0;
            });
          }
          this.loaderService.dismiss();
        });
    } else {
      this.presentToast(`Please select Filter Type to Search`);
    }

  }

  async delete(data) {
    let msg = `Are you sure you want to delete Filter  ${data.displayName}?`;
    let filterMessage = {
      displayText: msg
    }
    const modal = await this.modalController.create({
      component: AlertMessageComponent,
      componentProps: {
        message: filterMessage,
        header: 'Delete Filter'
      },
      cssClass: 'small-center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data) {
        this.firestore.collection(FirebaseCollection.PARAMETER).doc(this.selectedType.parameterId).update({
          values: arrayRemove(data)
        }).then(res => {
          this.presentToast(`${data.displayName} deleted sucessfully!! `);
          this.searchFilter();
        })
      }

    });

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

}
