import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Events } from 'src/app/model/events';
import { Subjects } from 'src/app/model/subject';
import { LoadingService } from 'src/app/services/loading.service';
import { Module } from 'src/app/model/module';
import { EventsService } from 'src/app/services/events.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  segmentValue: string = "DAYNAMO";
  eventFilterType: string = 'COUNTRY';
  filterBoardId: string;
  filterBoardName: string;
  filterClassId: string;
  filterSubjectId: string;
  filterModuleId: string;
  selectEvent: any = {};
  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  allBoardDetails: BoardOfEducation[] = [];
  eventData: any[] = [];
  myRankPostion: any = null;
  rankRecords: any[] = [];
  rankOnePostion: any = {};
  rankTwoPostion: any = {};
  rankThreewoPostion: any = {};
  selectState: any = {};
  selectDistrict: any = {};
  selectCity: any = {};
  selectSchool: any = {};

  stateList: any = [] = [];
  districts: any[] = [];
  cities: any[] = [];
  schools: any = [] = [];


  rankData: any[] = [];
  rankGroupedData: any;
  selectedCountry: string = 'India';


  actionSheetBoard = {
    header: 'Boards',
  };
  actionSheetClass = {
    header: 'Classes',
  };
  actionSheetSubject = {
    header: 'Subjects',
  };
  actionSheetModule = {
    header: 'Modules',
  };
  actionSheetState = {
    header: 'States',
  };
  actionSheetDistrict = {
    header: 'Districts',
  };
  actionSheetCity = {
    header: 'Cities',
  };
  actionSheetSchool = {
    header: 'Schools',
  };
  isActive: boolean = false;
  constructor(
    private loaderService: LoadingService,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
    this.getAllBoards();
  }

  ionViewWillEnter() {
  }

  tabChanged(event) {
    this.segmentValue = event.detail.value;
    this.rankGroupedData = [];
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

  selectBoard(event) {
    this.classes = [];
    this.filterBoardId = event.detail.value.id;
    this.filterBoardName = event.detail.value.name;
    let arr = [];
    this.firestore.collection("classes", ref => ref.where("boardId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        arr.push(res.data());
      });
      this.classes = arr.sort((a, b) => (a.displayName - b.displayName));
    });
  }

  selectClass(event) {
    this.filterClassId = event.detail.value.id;
    this.subjects = [];
    this.firestore.collection("subjects", ref => ref.where("classId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.subjects.push(res.data());
      })
    });
  }

  selectSubject(event) {
    this.filterSubjectId = event.detail.value.id;
    this.modules = [];
    this.firestore.collection("modules", ref => ref.where("subjectId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.modules.push(res.data());
      })
    });
  }

  selectModule(event) {
    this.filterModuleId = event.detail.value.id;
  }

  selectedState(event: any) {
    this.stateList = [];
    this.selectState = null;
    this.selectDistrict = null;
    this.selectCity = null;
    this.selectSchool = null;
    this.firestore.collection('state', ref => ref.orderBy("name", "asc")).get().subscribe((staes: any) => {
      if (!staes.empty) {
        staes.forEach((state: any) => {
          let stateData: any = state.data();
          let index = this.stateList.findIndex(sl => sl.name == stateData.name);
          if (index == -1) {
            this.stateList.push(stateData);
          }

        });

      }
    });
  }

  selectedDistrict(event: any) {
    this.districts = [];
    this.selectDistrict = null;
    this.selectCity = null;
    this.selectSchool = null;
    this.firestore.collection("district", ref => ref.where("stateid", "==", this.selectState.id).orderBy("name", "asc")).get().subscribe(data => {
      data.forEach(res => {
        let districtData: any = res.data();
        let index = this.districts.findIndex(sl => sl.name == districtData.name);
        if (index == -1) {
          this.districts.push(districtData);
        }
      })
    });
  }

  selectedCity(event: any) {
    this.cities = [];
    this.schools = [];
    this.selectCity = null;
    this.selectSchool = null;
    this.firestore.collection("cities", ref => ref.where("districtid", "==", this.selectDistrict.id).orderBy("name", "asc")).get().subscribe(data => {
      data.forEach(res => {
        let cityData: any = res.data();
        let index = this.cities.findIndex(sl => sl.name == cityData.name);
        if (index == -1) {
          this.cities.push(cityData);
        }
      });
    });
  }

  selectedSchool(event: any) {
    this.schools = [];
    this.selectSchool = null;
    this.firestore.collection("school", ref => ref
      .where("districtid", "==", this.selectDistrict.id)
      .where("board", "==", this.filterBoardName)
      .orderBy("name", "asc")
    ).get().subscribe(data => {
      data.forEach(res => {
        let schoolData: any = res.data();
        let index = this.schools.findIndex(sl => sl.name == schoolData.name);
        if (index == -1) {
          this.schools.push(res.data());
        }
      });
    });
  }

  async search() {
    this.loaderService.present();
    this.rankData = [];
    this.isActive = true;
    this.claculateRank();
  }

  typeChanged(event) {
    this.rankData = [];
    this.eventFilterType = event.detail.value;
    this.claculateRank();
  }

  claculateRank() {
    if (this.segmentValue == 'QUIZWHIZZ') {
      let collection = this.eventFilterType == 'SCHOOL' ? 'user_quizwhizz_school_ranks' :
        this.eventFilterType == 'CITY' ? 'user_quizwhizz_city_ranks' :
          this.eventFilterType == 'DISTRICT' ? 'user_quizwhizz_district_ranks' :
            this.eventFilterType == 'STATE' ? 'user_quizwhizz_state_ranks' : 'user_quizwhizz_all_ranks';
      let query;
      if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId && this.selectState.id && this.selectDistrict.id && this.selectCity.id && this.selectSchool.id) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('stateId ', '==', this.selectState.id)
          .where('districtId', '==', this.selectDistrict.id)
          .where('cityId', '==', this.selectCity.id)
          .where('schoolId', '==', this.selectSchool.id)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId && this.selectState.id && this.selectDistrict.id && this.selectCity.id) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('stateId ', '==', this.selectState.id)
          .where('districtId', '==', this.selectDistrict.id)
          .where('cityId', '==', this.selectCity.id)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId && this.selectState.id && this.selectDistrict.id) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('stateId ', '==', this.selectState.id)
          .where('districtId', '==', this.selectDistrict.id)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId && this.selectState.id) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('stateId ', '==', this.selectState.id)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
      }
      else if (this.filterBoardId) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('status', '==', 'COMPLETED');
      }

      query.get().then((eventRankDetail: any) => {
        if (!eventRankDetail.empty) {
          eventRankDetail.forEach(data => {
            this.rankData.push(data.data());
          });

          this.rankData.sort((a, b) => b.point - a.point);
          this.rankGroupedData = this.groupBy(this.rankData, rank => rank.stateName);
        }
      });


    } else {
      let collection = this.eventFilterType == 'SCHOOL' ? 'user_event_school_ranks' :
        this.eventFilterType == 'CITY' ? 'user_event_city_ranks' :
          this.eventFilterType == 'DISTRICT' ? 'user_event_district_ranks' :
            this.eventFilterType == 'STATE' ? 'user_event_state_ranks' : 'user_event_all_ranks';

      let query;
      if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId && this.selectState.id && this.selectDistrict.id && this.selectCity.id && this.selectSchool.id) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('stateId ', '==', this.selectState.id)
          .where('districtId', '==', this.selectDistrict.id)
          .where('cityId', '==', this.selectCity.id)
          .where('schoolId', '==', this.selectSchool.id)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId && this.selectState.id && this.selectDistrict.id && this.selectCity.id) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('stateId ', '==', this.selectState.id)
          .where('districtId', '==', this.selectDistrict.id)
          .where('cityId', '==', this.selectCity.id)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId && this.selectState.id && this.selectDistrict.id) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('stateId ', '==', this.selectState.id)
          .where('districtId', '==', this.selectDistrict.id)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId && this.selectState.id) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('stateId ', '==', this.selectState.id)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('moduleId', '==', this.filterModuleId)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId && this.filterSubjectId) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
          .where('subjectId', '==', this.filterSubjectId)
          .where('status', '==', 'COMPLETED');
      }
      else if (this.filterBoardId && this.filterClassId) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('classId', '==', this.filterClassId)
      }
      else if (this.filterBoardId) {
        query = this.firestore.collection(collection).ref
          .where('boardId', '==', this.filterBoardId)
          .where('status', '==', 'COMPLETED');
      }

      query.get().then((eventRankDetail: any) => {
        if (!eventRankDetail.empty) {
          eventRankDetail.forEach(data => {
            this.rankData.push(data.data());
          });

          this.rankData.sort((a, b) => b.point - a.point);
          this.rankGroupedData = this.groupBy(this.rankData, rank => rank.stateName);
        }
      });

    }
  }


  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
