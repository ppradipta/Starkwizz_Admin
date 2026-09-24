import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { ClassView, ModuleView, Options, Questions, SubjectView } from 'src/app/model/questions';
import { QuestionService } from 'src/app/services/question.service';
import { UtilityService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-single-choice',
  templateUrl: './single-choice.component.html',
  styleUrls: ['./single-choice.component.scss'],
})
export class SingleChoiceComponent implements OnInit {
  @Input() questionType: any;
  @Input() question: any;
  @Input() type: any;
  board: any;
  cls: any;
  subject: any;
  module: any;

  newQuestion: Questions = new Questions();
  answer: [] = [];
  numberOfOptions: number = 4;

  ref: AngularFireStorageReference;
  viewType: string = 'DEFAULT';
  constructor(private questionService: QuestionService,
    private firestore: AngularFirestore,
    private utilityService: UtilityService,
    private storage: AngularFireStorage,
    private toastController: ToastController) { }

  ngOnInit() {
    this.newQuestion.id = this.utilityService.generateAlphaNumericId();
    if (this.type) {
      this.newQuestion = this.question;
      this.newQuestion.id = this.question.id != null ? this.question.id : this.newQuestion.id;
      this.answer = this.question.answers;
    }
   // if (!(this.question.options.length > 0)) {
      this.generateSequence();
   // }

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

  }

  selectAnswer() {
     console.log(this.answer)
  }

  generateSequence() {
    let options = this.utilityService.generateOptionSequence(this.numberOfOptions, 'TEXT');
    this.newQuestion.options = [...options];
  }

  uploadQuestionImage(event) {

    const file = event.target.files[0];
    const filePath = `question/${this.board.id}/${this.cls.id}/${this.subject.id}/${this.module.id}/${this.newQuestion.id}`;
    const newMetadata = {
      cacheControl: 'public,max-age=3000',
      contentType: 'image/jpeg'
    };
    this.ref = this.storage.ref(filePath);
    this.ref.put(file, newMetadata).snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(iurl => {
          this.newQuestion.url = iurl;
        });
      })).subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
  }


  uploadQuestionOptionImage(event, opt) {

    const file = event.target.files[0];
    const filePath = `question/${this.board.id}/${this.cls.id}/${this.subject.id}/${this.module.id}/${this.newQuestion.id}/${opt.id}`;
    const newMetadata = {
      cacheControl: 'public,max-age=3000',
      contentType: 'image/jpeg'
    };
    this.ref = this.storage.ref(filePath);
    this.ref.put(file, newMetadata).snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(iurl => {
          let optIndex = this.newQuestion.options.findIndex(nqo => nqo.id == opt.id);
          if (optIndex != -1) {
            this.newQuestion.options[optIndex].url = iurl;
            this.newQuestion.options[optIndex].type = 'IMAGE';
          }
        });
      })).subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
  }

  previewQuestion() {

    if (null == (this.newQuestion.text || this.newQuestion.url)) {
      this.presentToast('Question Content is missing');
    } else {
      this.viewType = 'PREVIEW';
      if (this.board && this.cls && this.subject && this.module) {
        this.newQuestion.answers = this.answer;
        this.newQuestion.questionType = this.questionType;
        this.newQuestion.board = this.board.displayName;

        this.newQuestion.class = new ClassView();
        this.newQuestion.class.displayName = this.cls.displayName;
        this.newQuestion.class.id = this.cls.id;

        this.newQuestion.subject = new SubjectView();
        this.newQuestion.subject.displayName = this.subject.displayName;
        this.newQuestion.subject.id = this.subject.id;

        this.newQuestion.module = new ModuleView();
        this.newQuestion.module.displayName = this.module.displayName;
        this.newQuestion.module.id = this.module.id;
        this.questionService.setQuestion(this.newQuestion);
        this.presentToast('Question added To Preview ,Please validate and Confirm');
      } else {
        this.presentToast('Question Board,Class,Subject or Module missing');
      }
    }


  }

  addOption() {
    let lst = this.newQuestion.options.slice(-1);
    let sequence = String.fromCharCode(lst[0].sequence.charCodeAt(0) + 1);
    let opt: Options = new Options();
    opt.id = this.utilityService.generateAlphaNumericId();
    opt.sequence = sequence;
    opt.text = '';
    opt.type = 'TEXT';
    opt.url = '';
    this.newQuestion.options.push(opt);
  }
  removeOption(opt) {
    if (this.newQuestion.options.length < 2) {
      this.presentToast('You dont have permission to delete');
    }
    else {
      this.storage.refFromURL(opt.url).delete().subscribe(result => {
        console.log(result);
      });
      const index = this.newQuestion.options.findIndex(item => item.id == opt.id);
      if (index > -1) {
        this.newQuestion.options.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

  }


  clearQuestion() {
    this.newQuestion = new Questions();
    this.generateSequence();

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  onClickDeleteQuestion() {
    this.firestore.collection('questions').doc(this.newQuestion.id).delete().then(res => {
      this.presentToast('Question Deleted sucessfully!!');
      this.questionService.setSelectedBoard(this.board);
      this.questionService.setSelectedClass(this.cls);
      this.questionService.setSelectedSubject(this.subject);
      this.questionService.setSelectedModule(this.module);
      this.newQuestion = new Questions();
      this.newQuestion.answers = [];
      this.viewType = 'DEFAULT';
      this.generateSequence();
      this.storage.refFromURL(this.newQuestion.url).delete().subscribe(result => {
        this.newQuestion.url = "";
      });

    });

  }


  onClickConfirmQuestion() {
    this.questionService.setQuestionToCollection(this.newQuestion);
    this.presentToast('Question Saved sucessfully!!');
  }

  onClickAddMoreQuestion() {
    this.viewType = 'DEFAULT';
    this.questionService.setSelectedBoard(this.board);
    this.questionService.setSelectedClass(this.cls);
    this.questionService.setSelectedSubject(this.subject);
    this.questionService.setSelectedModule(this.module);
    this.newQuestion = new Questions();
    this.newQuestion.url = '';
    this.newQuestion.answers = [];
    this.generateSequence();
  }

  onClickEditQuestion() {
    //this.questionService.setQuestion(this.newQuestion);
  }

}
