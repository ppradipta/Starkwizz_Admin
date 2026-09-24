import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-associate',
  templateUrl: './add-associate.component.html',
  styleUrls: ['./add-associate.component.scss'],
})
export class AddAssociateComponent implements OnInit {
  @Input() actionType: string;

  user: any = {
    code: '',
    profileType: 'ASSOCIATES',
    gender: '',
    stateId: '',
    districtId: '',
    cityId: '',
  };
  stateList: any[] = [];
  districts: any[] = [];
  cities: any[] = [];

  postList: any = [
    { id: 'SBDA', displayName: 'SBDA', code: 'SA' },
    { id: 'DBDA', displayName: 'DBDA', code: 'DA' },
    { id: 'BBDA', displayName: 'BBDA', code: 'BA' },
    { id: 'OTHER', displayName: 'OTHER', code: 'OA' },
  ]
  constructor(private generateKey: GenerateKeyService, private dateUtil: DateUtilService,
    private modalCtrl: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private loading: LoadingService
  ) {
    this.user.code = 'SKB-' + this.generateKey.generateApplicationId();
    this.user.creationdate = this.dateUtil.getCurrentDateWithYYYYMMDD();
    this.user.id = this.generateKey.generateUniqueFirestoreId();
  }

  ngOnInit() {

    if (this.actionType == 'EDIT') {
      
    }

  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  selectState(event: any) {
    this.loading.presentLoading(2000);
    this.stateList = [];
    this.user.stateId = null;
    this.user.stateName = null;
    this.user.districtName = null;
    this.user.districtId = null;
    this.user.districtName = null;
    this.user.cityId = null;
    this.user.cityName = null;

    this.firestore.collection('state').get().subscribe((staes: any) => {
      if (!staes.empty) {
        staes.forEach((state: any) => {
          this.stateList.push(state.data());
        });

        this.stateList = this.stateList.sort((a: any, b: any) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      }
    });
  }
  
  selectDistrict(event: any) {
    this.loading.presentLoading(2000);
    this.districts = [];
    this.user.districtName = null;
    this.user.districtId = null;
    this.user.cityId = null;
    this.user.cityName = null;
    this.firestore.collection("district", ref => ref.where("stateid", "==", this.user.stateId)).get().subscribe(data => {
      data.forEach(res => {
        this.districts.push(res.data());
      })
      this.districts = this.districts.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
          return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
          return -1;
        return 0;
      });
    });
  }
  selectCity(event: any) {
    this.loading.presentLoading(2000);
    this.cities = [];
    this.user.cityId = null;
    this.user.cityName = null;
    this.firestore.collection("cities", ref => ref.where("districtid", "==", this.user.districtId)).get().subscribe(data => {
      data.forEach(res => {
        this.cities.push(res.data());
      });

      this.cities = this.cities.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
          return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
          return -1;
        return 0;
      });
    });
  }

  addAssociates() {
    this.user.status = 'ACTIVE';
    this.user.panNo = this.user.panNo.toUpperCase();

    if (this.stateList.length > 0) {
      let state = this.stateList.find((st: any) => st.id == this.user.stateId);
      if (state) {
        this.user.stateName = state.displayName;
      }
    }
    
    if (this.districts.length > 0) {
      let district = this.districts.find((st: any) => st.id == this.user.districtId);
      if (district) {
        this.user.districtName = district.displayName;
      }
    }

    if (this.cities.length > 0) {
      let city: any = this.cities.find((st: any) => st.id == this.user.cityId);
      if (city) {
        this.user.cityName = city.displayName;
      }
    }

    if (this.postList.length > 0) {
      let post: any = this.postList.find((post: any) => post.id == this.user.postId);
      if (post) {
        this.user.postName = post.displayName;
        this.user.code = post.code + "-" + this.generateKey.generateApplicationId();
      }
    }

    this.firestore.collection('user_associates').doc(this.user.id)
      .set(JSON.parse(JSON.stringify(this.user)), { merge: true }).then(result => {
        this.presentToast('Business Associates added sucessfully!!');
        this.modalCtrl.dismiss();
      });

  }

}

