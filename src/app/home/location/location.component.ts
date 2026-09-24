import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { EventsService } from 'src/app/services/events.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AddDataComponent } from '../hubs/add-data/add-data.component';
import { UploadQuestionComponent } from '../question/upload-question/upload-question.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  @Input() actionType: string;
  @Input() event: any;
  @Input() actionFor: string;
  @Input() data: any;
  type: string;
  tabValue = 'STATE';
  states: any[] = [];
  district: any[] = [];
  cities: any[] = [];
  schools: any[] = [];
  institutes: any[] = [];
  newData: string;
  isTabChange: boolean = false;
  allStateDetails: any[] = [];
  allDistricts: any[] = [];
  allCities: any[] = [];
  stateId: string;
  districtId: string;
  cityId: string;
  selectedRecords: any[] = [];
  selectedRecordDetails: any[] = [];
  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private modalController: ModalController,
    private eventsService: EventsService,
    private toastController: ToastController,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.eventsService.getTabValue().subscribe((tabValue: string) => {
      this.tabValue = tabValue;
    });
    if (this.actionType == 'LINK_SCHOOL') {
      this.type = 'School';
    }
    if (this.actionType == 'LINK_STATE') {
      this.type = 'State';
    }
    if (this.actionType == 'LINK_DISTRICT') {
      this.type = 'District';
    }
    if (this.actionType == 'LINK_CITIES') {
      this.type = 'Cities';
    }
    this.getAllStateDetails();
  }


  tabChanged(event) {
    this.tabValue = event.detail.value;
    if (this.tabValue === "STATE") {
      this.getAllStates();
    }
    if (this.tabValue === "INSTITUTE") {
      this.getAllInstitutes();
    }
  }

  getAllStates() {
    this.states = [];
    this.firestore.collection(FirebaseCollection.STATE).valueChanges().subscribe((state) => {
      this.states = state;
    });
  }

  getAllInstitutes() {
    this.institutes = [];
    this.firestore.collection(FirebaseCollection.INSTITUTE).valueChanges().subscribe((institute) => {
      this.institutes = institute;
    });
  }




  async addNewEntryAlert() {
    const modal = await this.modalController.create({
      component: AddDataComponent,
      cssClass: 'small-center-modal',
      backdropDismiss: true,
      componentProps: {
        tabValue: this.tabValue,
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(async result => {
      if (result.data) {
        this.selectCollectionName(result.data.tabValue);

        if (result.data.tabValue == 'STATE') {
          let stateData = this.eventsService.populateStateData(result.data);
          this.eventsService.setDataToStateCollection(stateData).then(() => {
            this.presentToast(`${this.tabValue} Added Successfully !!! `);
          });
        }
        else if (result.data.tabValue == 'DISTRICT') {
          let distData = this.eventsService.populateDistrictData(result.data);
          this.eventsService.setDataToDistrictCollection(distData).then(() => {
            this.presentToast(`${this.tabValue} Added Successfully !!! `);
          });
        }
        else if (result.data.tabValue == 'CITIES') {
          let city = this.eventsService.populateCitiesData(result.data);
          this.eventsService.setDataToCitiesCollection(city).then(() => {
            this.presentToast(`${this.tabValue} Added Successfully !!! `);
          });
        }
        else if (result.data.tabValue == 'SCHOOLS') {
          let school = this.eventsService.populateSchoolData(result.data);
          this.eventsService.setDataToSchoolCollection(school).then(() => {
            this.presentToast(`${this.tabValue} Added Successfully !!! `);
          });
        }
        else if (result.data.tabValue == 'INSTITUTE') {
          let institute = this.eventsService.populateInstituteData(result.data);
          this.eventsService.setDataToInstituteCollection(institute).then(() => {
            this.presentToast(`${this.tabValue} Added Successfully !!! `);
          });
        }
      }
    });
  }

  selectCollectionName(empRole: string) {
    let collectionName: string;
    switch (empRole) {
      case "STATE":
        collectionName = FirebaseCollection.STATE;
        break;
      case "DISTRICT":
        collectionName = FirebaseCollection.DISTRICT;
        break;
      case "CITIES":
        collectionName = FirebaseCollection.CITIES;
        break;
      case "SCHOOLS":
        collectionName = FirebaseCollection.SCHOOL;
        break;
      case "INSTITUTE":
        collectionName = FirebaseCollection.INSTITUTE;
        break;
      default:
        collectionName = "";
    }
    return collectionName;
  }

  async delete(data) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: "Confirm Alert",
      message: `Delete ${this.tabValue.toLocaleLowerCase()} <b>${data.displayName}</b>, Are you Sure ?`,
      buttons: [
        {
          text: `Cancel `,
          role: "CANCEL",
          cssClass: "secondary",
          handler: (CANCEL) => {
          }
        },
        {
          text: `Delete`,
          role: "DELETE",
          handler: async (DELETE) => {
            if (this.actionType == 'BULK_UPLOAD') {
              if (this.tabValue == 'STATE') {
                const index = this.states.findIndex(ps => ps.id == data.id);
                if (index != -1) {
                  this.states.splice(index, 1);
                }
              }
              if (this.tabValue == 'DISTRICT') {
                const index = this.district.findIndex(pd => pd.id == data.id);
                if (index != -1) {
                  this.district.splice(index, 1);
                }
              }
              if (this.tabValue == 'CITIES') {
                const index = this.cities.findIndex(pc => pc.id == data.id);
                if (index != -1) {
                  this.cities.splice(index, 1);
                }

              }
              if (this.tabValue == 'SCHOOLS') {
                const index = this.schools.findIndex(ps => ps.id == data.id);
                if (index != -1) {
                  this.schools.splice(index, 1);
                }
              }
              if (this.tabValue == 'INSTITUTE') {
                const index = this.institutes.findIndex(ps => ps.id == data.id);
                if (index != -1) {
                  this.institutes.splice(index, 1);
                }
              }
            } else {
              let collectionName = await this.eventsService.selectCollectionName(this.tabValue);

              this.firestore.collection(collectionName).doc(data.id).delete().then(() => {
                this.presentToast(`${this.tabValue} Deleted Successfully !!! `);
              });
            }

          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  viewData(data, cName) {
    if (cName == 'DISTRICT') {
      data.collectionName = FirebaseCollection.DISTRICT;
    } else if (cName == 'STATE') {
      data.collectionName = FirebaseCollection.STATE;
    } else if (cName == 'CITIES') {
      data.collectionName = FirebaseCollection.CITIES;
    } else if (cName == 'SCHOOL') {
      data.collectionName = FirebaseCollection.SCHOOL;
    }
    data.tabValue = this.tabValue
    this.eventsService.setLocationData(data);
    this.router.navigate(['home/location/ViewDataPage']);

  }


  getAllStateDetails() {
    this.allStateDetails = [];
    const query = this.firestore.collection(FirebaseCollection.STATE);
    query.ref.get().then((state: any) => {
      if (!state.empty) {
        state.forEach(data => {
          this.allStateDetails.push(data.data());
        });
        this.allStateDetails = this.allStateDetails.sort((a, b) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      }
    })
  }

  selectState(event) {
    this.stateId = event.detail.value.id;
    this.allDistricts = [];
    this.firestore.collection("district", ref => ref.where("stateid", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.allDistricts.push(res.data());
      })
      this.allDistricts = this.allDistricts.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
          return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
          return -1;
        return 0;
      });
    });
    if (this.tabValue === 'INSTITUTE') {
      this.searchInstitutes();
    }
  }

  selectDistrict(event) {
    this.districtId = event.detail.value.id;
    this.allCities = [];
    this.firestore.collection("cities", ref => ref.where("districtid", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.allCities.push(res.data());
      })
      this.allCities = this.allCities.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
          return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
          return -1;
        return 0;
      });
    });
    if (this.tabValue === 'INSTITUTE') {
      this.searchInstitutes();
    }
  }
  selectCities(event) {
    this.cityId = event.detail.value.id;
    if (this.tabValue === 'INSTITUTE') {
      this.searchInstitutes();
    }
  }

  async searchDistrict() {
    this.district = [];
    if (this.stateId) {
      let query = this.firestore.collection(FirebaseCollection.DISTRICT).ref
        .where('stateid', '==', this.stateId);
      query.get().then((districts: any) => {
        if (!districts.empty) {
          districts.forEach(data => {
            this.district.push(data.data());
          });

          this.district = this.district.sort((a, b) => {
            if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
              return 1;
            if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
              return -1;
            return 0;
          });
        }
      });
    }
  }

  async searchCities() {
    this.cities = [];
    let query
    if (this.stateId && this.districtId) {
      query = this.firestore.collection(FirebaseCollection.CITIES).ref
        .where('stateid', '==', this.stateId)
        .where('districtid', '==', this.districtId);
    }

    query.get().then((cities: any) => {
      if (!cities.empty) {
        cities.forEach(data => {
          this.cities.push(data.data());
        });
        this.cities = this.cities.sort((a, b) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      }
    });
  }

  searchSchools() {
    this.loadingService.present();
    this.schools = [];
    let query = null;
    if (this.actionType == 'LINK_SCHOOL') {
      if (this.event && this.stateId && this.districtId && this.event.boardName) {
        let query = this.firestore.collection(FirebaseCollection.SCHOOL).ref
          .where('stateid', '==', this.stateId)
          .where('districtid', '==', this.districtId)
          .where('board', '==', this.event.boardName);
        query.get().then((schools: any) => {
          if (!schools.empty) {
            schools.forEach(data => {
              this.schools.push(data.data());
            });

            this.schools = this.schools.sort((a, b) => {
              if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
                return 1;
              if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
                return -1;
              return 0;
            });
          }
        });
      }
    } else {
      if (this.stateId && this.districtId) {
        let query = this.firestore.collection(FirebaseCollection.SCHOOL).ref
          .where('stateid', '==', this.stateId)
          .where('districtid', '==', this.districtId);
        query.get().then((school: any) => {
          if (!school.empty) {
            school.forEach(data => {
              this.schools.push(data.data());
            });
            this.schools = this.schools.sort((a, b) => {
              if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
                return 1;
              if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
                return -1;
              return 0;
            });
          }
        });
      }

    }

    if (query) {
      this.presentToast('Please select State and District');
    }

  }

  searchInstitutes() {
    this.loadingService.present();
    this.firestore.collection(FirebaseCollection.INSTITUTE).valueChanges().subscribe((institutes: any[]) => {
      this.institutes = institutes.filter(inst => {
        let match = true;
        if (this.stateId) match = match && inst.stateid === this.stateId;
        if (this.districtId) match = match && inst.districtid === this.districtId;
        if (this.cityId) match = match && inst.cityid === this.cityId;
        return match;
      });
      this.institutes = this.institutes.sort((a, b) => {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) return 1;
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) return -1;
        return 0;
      });
    });
  }


  selectSchoolForEvent(event, data) {
    let index = this.schools.findIndex(schl => schl.id === data.id);
    if (index != -1) {
      this.schools[index].isSelected = !this.schools[index].isSelected;
      if (this.schools[index].isSelected) {
        this.selectedRecords.push(data.id);
        this.selectedRecordDetails.push(data);
      } else {
        let sindex = this.selectedRecords.findIndex(schl => schl === data.id);
        if (sindex != -1) {
          this.selectedRecords.splice(sindex, 1);
          this.selectedRecordDetails.splice(sindex, 1);
        }

      }

    }
  }

  confirmSelectedSchool() {
    if (this.selectedRecords.length > 0) {
      if (this.actionFor == 'MODULE') {
        this.firestore.collection('modules').doc(this.data.id).update({
          linktype: 'SCHOOL',
          linkvalues: this.selectedRecords,
          linkValueDetails: this.selectedRecordDetails
        });
      } else {
        this.firestore.collection('events').doc(this.event.id).update({
          linktype: 'SCHOOL',
          linkvalues: this.selectedRecords
        });
      }
      this.modalController.dismiss();
      this.presentToast('Selected School linked sucessfully');

    } else {
      this.presentToast('Please select school for process');
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }


  async uploadData(tabValue) {
    const modal = await this.modalController.create({
      component: UploadQuestionComponent,
      cssClass: 'center-modal',
      backdropDismiss: false,
      componentProps: {
        uploadfor: "LOCATION",
        uploadforType: tabValue
      },
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result['data']) {
        this.actionType = 'BULK_UPLOAD';
        const uploadfor = result['data'].uploadfor;
        const records = result['data'].record;
        if (this.tabValue == 'STATE' && uploadfor == 'LOCATION') {
          this.states = records;
        }
        if (this.tabValue == 'DISTRICT' && uploadfor == 'LOCATION') {
          this.district = records;
        }
        if (this.tabValue == 'CITIES' && uploadfor == 'LOCATION') {
          this.cities = records;
        }
        if (this.tabValue == 'SCHOOLS' && uploadfor == 'LOCATION') {
          this.schools = records;
        }
        if (this.tabValue == 'INSTITUTE' && uploadfor == 'LOCATION') {
          this.institutes = records;
        }
      }
    });
  }

  async confirmBulkUpload() {
    if (this.tabValue == 'STATE') {
      this.states.forEach(stat => {
        this.firestore.collection(FirebaseCollection.STATE).doc(stat.id).set(stat, { merge: true });
      });
      this.presentToast(`${this.tabValue} Saved Successfully !!! `);
      this.actionType = '';
    }
    if (this.tabValue == 'DISTRICT') {
      this.district.forEach(dist => {
        this.firestore.collection(FirebaseCollection.DISTRICT).doc(dist.id).set(dist, { merge: true });
      });
      this.presentToast(`${this.tabValue} Saved Successfully !!! `);
      this.actionType = '';
    }
    if (this.tabValue == 'CITIES') {
      this.cities.forEach(city => {
        this.firestore.collection(FirebaseCollection.CITIES).doc(city.id).set(city, { merge: true });
      });
      this.presentToast(`${this.tabValue} Saved Successfully !!! `);
      this.actionType = '';
    }
    if (this.tabValue == 'SCHOOLS') {
      this.schools.forEach(school => {
        this.firestore.collection(FirebaseCollection.SCHOOL).doc(school.id).set(school, { merge: true });
      });
      this.presentToast(`${this.tabValue} Saved Successfully !!! `);
      this.actionType = '';
    }
    if (this.tabValue == 'INSTITUTE') {
      this.institutes.forEach(institute => {
        this.firestore.collection(FirebaseCollection.INSTITUTE).doc(institute.id).set(institute, { merge: true });
      });
      this.presentToast(`${this.tabValue} Saved Successfully !!! `);
      this.actionType = '';
    }
  }

}
