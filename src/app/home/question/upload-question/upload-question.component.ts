import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Events } from 'src/app/model/events';
import { Options, Questions } from 'src/app/model/questions';
import { BoardService } from 'src/app/services/board.service';
import { ClassesService } from 'src/app/services/classes.service';
import { EventsService } from 'src/app/services/events.service';
import { ModuleService } from 'src/app/services/module.service';
import { QuestionService } from 'src/app/services/question.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UploadService } from 'src/app/services/upload.service';
import { UtilityService } from 'src/app/utils/utils.service';
import { environment } from 'src/environments/environment.prod';
import * as XLSX from 'xlsx';

//Excel Data
type ExcelData = any[][];

@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-question.component.html',
  styleUrls: ['./upload-question.component.scss'],
})
export class UploadQuestionComponent implements OnInit {
  @Input() uploadfor: string;
  @Input() uploadforType: string;
  questions: Questions[] = [];
  board: any;
  cls: any;
  subject: any;
  module: any;
  events: Events[] = [];
  eventDetails: Events[] = [];

  data: ExcelData = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  states: any[] = [];
  district: any[] = [];
  cities: any[] = [];
  schools: any[] = [];
  interest: any[] = [];
  rejectQuestions = [];
  uploadType: string = 'XLSX';
  constructor(private modalController: ModalController,
    private toastController: ToastController,
    private utilityService: UtilityService,
    public questionService: QuestionService,
    public classesService: ClassesService,
    public subjectService: SubjectService,
    public boardService: BoardService,
    public moduleService: ModuleService,
    public uploadService: UploadService,
    private alertController: AlertController,
    private eventsService: EventsService,
    private firestore: AngularFirestore) {
    this.questions = [];
    this.rejectQuestions = [];
  }

  ngOnInit() {
    this.questionService.getSelectedBoard().subscribe(board => {
      this.board = board;
    });

    this.questionService.getSelectedClass().subscribe(cls => {
      this.cls = cls;
    });

    this.questionService.getSelectedSubject().subscribe(subject => {
      this.subject = subject;
    });

    this.questionService.getSelectedModule().subscribe(module => {
      this.module = module;
    });
    this.states = [];
    this.district = [];
    this.cities = [];
    this.schools = [];
  }

  close() {
    this.modalController.dismiss();
  }

  onQuestionUploadSelect(event) {
    this.uploadType = event.target.value;
  }



  onFileChange(evt: any) {
    if (this.uploadfor == 'INTEREST' && this.uploadforType == 'INTEREST') {
      this.interest = [];
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const statereader: FileReader = new FileReader();
      statereader.onload = (e: any) => {
        const datastr: string = e.target.result;
        if (datastr) {
          datastr.split(/\r?\n/).forEach(element => {
            let elementid = element.replace(/\s/g, '').toLocaleLowerCase();
            let state = {
              'displayName': element,
              'id': elementid,
              'name': elementid
            }
            if (this.interest.findIndex(us => us.id == state.id) == -1) {
              this.interest.push(state);
            }
          });
        }
      };
      statereader.readAsBinaryString(target.files[0]);
    }

    if (this.uploadfor == 'LOCATION') {
      if (this.uploadforType == 'STATE') {
        this.states = [];
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const statereader: FileReader = new FileReader();
        statereader.onload = (e: any) => {
          const datastr: string = e.target.result;
          if (datastr) {
            datastr.split(/\r?\n/).forEach(element => {
              let splitedResult = element.split('#');
              let stateString = splitedResult[0];
              let stateid = stateString.replace(/\s/g, '').toLocaleLowerCase();
              let state = {
                'displayName': stateString,
                'id': stateid,
                'name': stateid
              }
              if (this.states.findIndex(us => us.id == state.id) == -1) {
                this.states.push(state);
              }

              //  this.firestore.collection('state').doc(stateid).set(state, { merge: true });
            });
          }
        };
        statereader.readAsBinaryString(target.files[0]);
      }
      if (this.uploadforType == 'DISTRICT') {
        this.district = [];
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const districtreader: FileReader = new FileReader();
        districtreader.onload = (e: any) => {
          const datastr: string = e.target.result;
          if (datastr) {
            datastr.split(/\r?\n/).forEach(element => {
              if (element.includes('#')) {
                let splitedResult = element.split('#');
                let stateString = splitedResult[0];
                let districtString = splitedResult[1];
                let stateid = stateString.replace(/\s/g, '').toLocaleLowerCase();
                let distname = districtString.replace(/\s/g, '').toLocaleLowerCase();
                const distid = stateid + "#" + distname;
                let district = {
                  'displayName': distname,
                  'id': distid,
                  'name': distname,
                  'stateid': stateid
                }
                if (this.district.findIndex(ud => ud.id == district.id) == -1) {
                  this.district.push(district);
                }
              }
              //this.uploadService.seDistrictToCollection(distname, distid, districtString, stateid);
            });
          }
        };
        districtreader.readAsBinaryString(target.files[0]);
      }

      if (this.uploadforType == 'CITIES') {
        this.cities = [];
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const cityreader: FileReader = new FileReader();
        cityreader.onload = (e: any) => {
          const datastr: string = e.target.result;
          if (datastr) {
            datastr.split(/\r?\n/).forEach(element => {
              if (element.includes('#')) {
                let splitedResult = element.split('#');
                let stateString = splitedResult[0];
                let districtString = splitedResult[1];
                let cityString = splitedResult[2];
                let stateid = stateString.replace(/\s/g, '').toLocaleLowerCase();
                let distname = districtString.replace(/\s/g, '').toLocaleLowerCase();
                const distid = stateid + "#" + distname;
                let citydata = cityString.replace(/\s/g, '').toLocaleLowerCase();

                if (citydata) {
                  const id = this.utilityService.generateAlphaNumericId();
                  let city = {
                    'displayName': cityString,
                    'id': id,
                    'name': citydata,
                    'stateid': stateid,
                    'districtid': distid
                  }
                  if (this.cities.findIndex(uc => (uc.name == city.name && uc.stateid == city.stateid && uc.districtid == city.districtid)) == -1) {
                    this.cities.push(city);
                  }

                }
              }
            });
          }
        };
        cityreader.readAsBinaryString(target.files[0]);
      }

      if (this.uploadforType == 'SCHOOLS') {
        this.schools = [];
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const schoolreader: FileReader = new FileReader();
        schoolreader.onload = (e: any) => {
          const datastr: string = e.target.result;
          if (datastr) {
            datastr.split(/\r?\n/).forEach(element => {
              if (element.includes('#')) {
                let splitedResult = element.split('#');
                let stateString = splitedResult[0];
                let districtString = splitedResult[1];
                let cityString = splitedResult[2];
                let boardString = splitedResult[3].toLocaleUpperCase();
                let schoolString = splitedResult[4];
                let stateid = stateString.replace(/\s/g, '').toLocaleLowerCase();
                let distname = districtString.replace(/\s/g, '').toLocaleLowerCase();
                const distid = stateid + "#" + distname;
                let scl = schoolString.replace(/\s/g, '').toLocaleLowerCase();

                if (scl) {
                  const id = this.utilityService.generateAlphaNumericId();
                  let school = {
                    'displayName': schoolString,
                    'id': id,
                    'name': scl,
                    'board': boardString,
                    'stateid': stateid,
                    'districtid': distid
                  }
                  if (this.schools.findIndex(us => (us.name == school.name && us.board == school.board
                    && us.districtid == school.districtid && us.stateid == school.stateid)) == -1) {
                    this.schools.push(school);
                  }
                }
              }
            });
          }
        };
        schoolreader.readAsBinaryString(target.files[0]);
      }
    } else {
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      if (this.uploadType === 'XLSX') {
        reader.onload = (e: any) => {
          /* read workbook */
          const datastr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(datastr, { type: 'binary' });
          // /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          // /* save data */
          this.data = <ExcelData>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
          this.processDataXLSX();
        };
        reader.readAsBinaryString(target.files[0]);
      }

      if (this.uploadType === 'TXT') {
        reader.onload = (e: any) => {
          /* read workbook */
          const datastr: string = e.target.result;
          let dataStrings: string[] = datastr.split("\n");
          if (dataStrings.length > 0) {
            dataStrings.shift();
            dataStrings.forEach(data => {
              let dataList: string[] = data.split("#@@#");
              this.insertQuestionToDataBaseForTXT(dataList);
            });
          }
        };
        reader.readAsText(target.files[0]);
      }
    }

  }



  processDataXLSX() {

    let result: any[] = [];

    for (let i = 1; i < this.data.length; i++) {
      let csvMap: Map<string, string> = new Map<string, string>();
      this.data[0].forEach((header, index) => {
        csvMap.set(header, this.data[i][index]);
      })
      result.push(csvMap);
    }

    this.insertQuestionToDataBaseForXLXS(result)
  }
  insertQuestionToDataBaseForTXT(data: string[]) {
    let ques: Questions = new Questions();
    ques.id = this.utilityService.generateAlphaNumericId();
    ques.questionType = 'TEXT';
    ques.board = this.board.displayName;
    ques.class.displayName = this.cls.displayName;
    ques.class.id = this.cls.id;
    ques.subject.displayName = this.subject.displayName;
    ques.subject.id = this.subject.id;
    ques.module.displayName = this.module.displayName;
    ques.module.id = this.module.id;
    ques.text = data[1];

    if (data[2].includes('#')) {
      let multiAns = data[2].split('#');
      multiAns.forEach(ans => {
        ques.answers.push(ans.trim());
      })
    } else {
      ques.answers.push(data[2].trim());
    }

    let opt1: Options = new Options();
    opt1.id = this.utilityService.generateAlphaNumericId();
    opt1.sequence = "A";
    opt1.text = data[3].trim();
    opt1.type = 'TEXT';
    ques.options.push(opt1);

    let opt2: Options = new Options();
    opt2.id = this.utilityService.generateAlphaNumericId();
    opt2.sequence = "B";
    opt2.text = data[4].trim();
    opt2.type = 'TEXT';
    ques.options.push(opt2);

    let opt3: Options = new Options();
    opt3.id = this.utilityService.generateAlphaNumericId();
    opt3.sequence = "C";
    opt3.text = data[5].trim();
    opt3.type = 'TEXT';
    ques.options.push(opt3);

    let opt4: Options = new Options();
    opt4.id = this.utilityService.generateAlphaNumericId();
    opt4.sequence = "D";
    opt4.text = data[6].trim();
    opt4.type = 'TEXT';
    ques.options.push(opt4);

    ques.mark = parseFloat(data[7]);
    ques.type = data[8].trim();
    if (null != data[9]) {
      ques.perQuestionTimer = parseInt(data[9]);
    } else {
      ques.perQuestionTimer = 60;
    }

    if (data[10] == 'Y') {
      ques.isnegativeallow = true;
    } else {
      ques.isnegativeallow = false;
    }
    if (null != data[11]) {
      ques.hinttext = data[11].trim();
    }
    if (null != data[12]) {
      ques.ansExplanationText = data[12];
    }
    if (null != data[13]) {
      ques.questionExplanationText = data[13].trim();
    }

    if (ques.type == 'SUBJECTIVE_NO_OPTION') {
      ques.options = [];
    }
    if (null == ques.mark || ques.answers.length == 0 || null == ques.text || null == ques.perQuestionTimer || null == ques.type) {
      if (ques.type == 'SUBJECTIVE_NO_OPTION') {
        this.questions.push(ques);
      } else {
        this.rejectQuestions.push(ques);
      }

    } else {
      this.questions.push(ques);
    }
  }

  insertQuestionToDataBaseForXLXS(result: any[]) {
    result.forEach((csvMap: Map<string, string>) => {
      let ques: Questions = new Questions();
      let evnt: Events = new Events();
      ques.id = this.utilityService.generateAlphaNumericId();
      ques.questionType = 'TEXT';

      ques.board = this.board.displayName;

      ques.class.displayName = this.cls.displayName;
      ques.class.id = this.cls.id;
      evnt.classId = this.cls.id;

      ques.subject.displayName = this.subject.displayName;
      ques.subject.id = this.subject.id;
      evnt.subjectId = this.subject.id;

      ques.module.displayName = this.module.displayName;
      ques.module.id = this.module.id;
      evnt.moduleId = this.module.id;

      csvMap.forEach((value: string, key: string) => {
        if (key.toLowerCase().indexOf('type') >= 0) {
          ques.type = value;
        } else if (key.toLowerCase().indexOf('question') >= 0) {
          if (value.includes("###")) {
            let quesmix: any[] = value.split("###");
            ques.text = quesmix[0];
            ques.url = this.buildQuestionAssetUrl(ques, quesmix[1]);
          } else {
            ques.text = value;
          }

        } else if (key.toLowerCase().indexOf('mark') >= 0) {
          ques.mark = parseFloat(value);
        } else if (key.toLowerCase().indexOf('point') >= 0) {
          ques.point = parseFloat(value);
        } else if (key.toLowerCase().indexOf('answers') >= 0) {
          if (value) {
            if (value.includes('#')) {
              let multiAns = value.split('#');
              multiAns.forEach(ans => {
                ques.answers.push(ans);
              })
            } else {
              ques.answers.push(value);
            }
          }
        } else if (key.toLowerCase().indexOf('option1') >= 0) {
          let opt: Options = new Options();
          opt.id = this.utilityService.generateAlphaNumericId();
          opt.sequence = "A";
          opt.text = value;
          opt.type = 'TEXT';
          // if (value.indexOf("###") > -1) {
          //   let optmix: any[] = value.split("###");
          //   opt.text = optmix[0];
          //   opt.url = this.buildQuestionOptionAssetUrl(ques, opt, optmix[1]);
          //   opt.type = 'IMAGE';
          // } else {
          //   opt.text =""+value;
          // }
          ques.options.push(opt);
        } else if (key.toLowerCase().indexOf('option2') >= 0) {
          let opt: Options = new Options();
          opt.id = this.utilityService.generateAlphaNumericId();
          opt.sequence = "B";
          opt.text = value;
          opt.type = 'TEXT';
          // if (value.indexOf("###") > -1) {
          //   let optmix: any[] = value.split("###");
          //   opt.text = optmix[0];
          //   opt.url = this.buildQuestionOptionAssetUrl(ques, opt, optmix[1]);
          //   opt.type = 'IMAGE';
          // } else {
          //   opt.text =""+value;
          // }
          ques.options.push(opt);
        } else if (key.toLowerCase().indexOf('option3') >= 0) {
          let opt: Options = new Options();
          opt.id = this.utilityService.generateAlphaNumericId();
          opt.sequence = "C";
          opt.text = value;
          opt.type = 'TEXT';
          //Update for image upload question
          // if (value.indexOf("###") > -1) {
          //   let optmix: any[] = value.split("###");
          //   opt.text = optmix[0];
          //   opt.url = this.buildQuestionOptionAssetUrl(ques, opt, optmix[1]);
          //   opt.type = 'IMAGE';
          // } else {
          //   opt.text =""+value;
          // }
          ques.options.push(opt);
        } else if (key.toLowerCase().indexOf('option4') >= 0) {
          let opt: Options = new Options();
          opt.id = this.utilityService.generateAlphaNumericId();
          opt.sequence = "D";
          opt.text = value;
          opt.type = 'TEXT';
          // if (value.indexOf("###") > -1) {
          //   let optmix: any[] = value.split("###");
          //   opt.text = optmix[0];
          //   opt.url = this.buildQuestionOptionAssetUrl(ques, opt, optmix[1]);
          //   opt.type = 'IMAGE';
          // } else {
          //   opt.text =""+value;
          // }


          ques.options.push(opt);
        }
        else if (key.toLowerCase().indexOf('mark') >= 0) {
          if (value) {
            evnt.eventMarks = parseFloat(value);
          }
        }
        else if (key.toLowerCase().indexOf('time') >= 0) {
          if (value) {
            ques.perQuestionTimer = value;
          } else {
            ques.perQuestionTimer = 60;
          }
        }
        else if (key.toLowerCase().indexOf('point') >= 0) {
          if (value) {
            ques.point = value;
          }
        }
        else if (key.toLowerCase().indexOf('isnegativeallow') >= 0) {
          if (value == 'Y') {
            ques.isnegativeallow = true;
          } else {
            ques.isnegativeallow = false;
          }
        }
        else if (key.toLowerCase().indexOf('hinttext') >= 0) {
          if (value) {
            ques.hinttext = value;
          }
        }
        else if (key.toLowerCase().indexOf('ansexplanation') >= 0) {
          if (value) {
            ques.ansExplanationText = value;
          }
        }
        else if (key.toLowerCase().indexOf('qexplanation') >= 0) {
          if (value) {
            ques.questionExplanationText = value;
          }
        }
      });
      if (ques.type == 'SUBJECTIVE_NO_OPTION') {
        ques.options = [];
      }
      if (null == ques.mark || ques.answers.length == 0 || null == ques.text || null == ques.perQuestionTimer || null == ques.type) {
        if (ques.type == 'SUBJECTIVE_NO_OPTION') {
          this.questions.push(ques);
        } else {
          this.rejectQuestions.push(ques);
        }

      } else {
        this.questions.push(ques);
      }

    });
  }


  async previewUpload() {
    if (this.uploadfor == 'LOCATION') {
      if (this.uploadforType == 'STATE') {
        this.modalController.dismiss({ 'uploadfor': this.uploadfor, 'record': this.states });
      }
      if (this.uploadforType == 'DISTRICT') {
        this.modalController.dismiss({ 'uploadfor': this.uploadfor, 'record': this.district });
      }
      if (this.uploadforType == 'CITIES') {
        this.modalController.dismiss({ 'uploadfor': this.uploadfor, 'record': this.cities });
      }
      if (this.uploadforType == 'SCHOOLS') {
        this.modalController.dismiss({ 'uploadfor': this.uploadfor, 'record': this.schools });
      }
    } else if (this.uploadforType == 'INTEREST' && this.uploadfor == 'INTEREST') {
      this.modalController.dismiss({ 'uploadfor': this.uploadfor, 'record': this.interest });
    }
    else {
      this.questionService.setQuestionsPreview(this.questions);
      this.questionService.setRejectedQuestionsPreview(this.rejectQuestions);
      this.close();
    }

  }

  checkForSameEvent() {
    this.events.forEach(event => {
      this.firestore.collection("events", ref => ref
        .where("classId", "==", event.classId)
        .where("subjectId", "==", event.subjectId)
        .where("moduleId", "==", event.moduleId))
        .get().subscribe(data => {
          let eventData = [];
          // after getting data fiter with name if same name exist then update else create new
          if (!data.empty) {
            data.forEach((res: any) => {
              eventData.push(res.data());
            });
            if (event.eventName) {
              let res = eventData.filter(evnt => evnt?.eventName.toLowerCase() == event?.eventName.toLowerCase());
              if (res.length > 0) {
                data.forEach(element => {
                  let dbEvent: any = element.data();
                  event.questions.forEach(element => {
                    dbEvent.questions.push(element)
                  });
                  this.eventsService.setEventDetailsToCollecton(dbEvent);
                });
              } else {
                let eventData = this.eventsService.populateQuestionEventData(event);
                this.eventsService.setEventDetailsToCollecton(eventData);
              }
            }
          }

        });
    });

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }



  uploadAndProcessTextFile(fileEvent: any) {
    const target: DataTransfer = <DataTransfer>(fileEvent.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const datastr: string = e.target.result;
      if (datastr) {
        datastr.split(/\r?\n/).forEach(element => {
          let splitedResult = element.split('#');
          let state = splitedResult[0];
          let district = splitedResult[1];
          let board = splitedResult[2];
          let school = splitedResult[3];
          this.uploadService.seStateToCollection(state, district, school, board);
        });

      }
    };
  }



  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    })
    await alert.present();
  }


  buildQuestionAssetUrl(ques: any, key: string) {
    return environment.assetUrl + "question/" + ques.id + "/" + key;
  }

  buildQuestionOptionAssetUrl(ques: any, option: any, key: string) {
    return environment.assetUrl + "question/" + ques.id + "/" + option.id + "/" + key;
  }

}
