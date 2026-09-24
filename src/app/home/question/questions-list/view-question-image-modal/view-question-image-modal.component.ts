import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Questions } from 'src/app/model/questions';

@Component({
  selector: 'app-question-image-modal',
  templateUrl: './view-question-image-modal.component.html',
  styleUrls: ['./view-question-image-modal.component.scss'],
})
export class ViewQuestionImageModalComponent implements OnInit {
  @Input() question: Questions;
  constructor(
    private modalController: ModalController) {
  }

  ngOnInit() {

  }

  close() {
    this.modalController.dismiss()
  }
}
