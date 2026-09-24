import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BoardOfEducation } from 'src/app/model/board';
import { ClassView, ModuleView, Questions, SubjectView } from 'src/app/model/questions';
import { BoardService } from 'src/app/services/board.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-single-choice-preview',
  templateUrl: './single-choice-preview.component.html',
  styleUrls: ['./single-choice-preview.component.scss'],
})
export class SingleChoicePreviewComponent implements OnInit {
  answer: string;
  boardEducations: BoardOfEducation[];
  selectedBoard: string;
  question: Questions = new Questions();
  selectedClass: ClassView;
  selectedSubject: SubjectView;
  selectedModule: ModuleView;
  constructor(private questionService: QuestionService,
    private boardService: BoardService,
    private modalController: ModalController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.getBoardList();
    this.questionService.getQuestion().subscribe((res: any) => {
        this.question = res;
    })
  }
  getBoardList() {
    this.boardService.boardEducations$.subscribe(boardEducations => {
      this.boardEducations = boardEducations
    });
  }
  selectBoard(event) {
    this.selectedBoard = event.detail.value;
  }



  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  onClickDeleteQuestion() {
    this.questionService.deleteQuestionFromCollection(this.question.id);
    this.presentToast('Question Deleted sucessfully!!');
  }


  onClickConfirmQuestion() {
    this.questionService.setQuestionToCollection(this.question);
    this.presentToast('Question Saved sucessfully!!');
  }

  onClickAddMoreQuestion() {
    this.questionService.setSelectedBoard(this.question.board);
    this.questionService.setSelectedClass(this.question.class.id);
    this.questionService.setSelectedSubject(this.question.subject.id);
    this.questionService.setSelectedModule(this.question.module.id);
    this.questionService.setQuestionToCollection(null);
  }

  onClickEditQuestion() {
    this.questionService.setQuestionToCollection(this.question);
  }

}
