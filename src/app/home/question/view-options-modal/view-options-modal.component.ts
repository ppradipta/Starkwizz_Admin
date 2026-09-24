import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Questions } from 'src/app/model/questions';

@Component({
  selector: 'app-view-options-modal',
  templateUrl: './view-options-modal.component.html',
  styleUrls: ['./view-options-modal.component.scss'],
})
export class ViewOptionsModalComponent implements OnInit {
@Input() question: Questions;
  constructor(
    private modalController: ModalController) {
   }

  ngOnInit() {
  }

  close(){
    this.modalController.dismiss()
  }
}
