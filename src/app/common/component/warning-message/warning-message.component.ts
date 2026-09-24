import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApplicationMessage } from 'src/app/model/application-message';

@Component({
  selector: 'app-warning-message',
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.scss'],
})
export class WarningMessageComponent implements OnInit {

  @Input() message:ApplicationMessage

  constructor(
    private modalController: ModalController,
  ) {
   }

  ngOnInit() {}

  success(){
    this.closeModal(this.modalController);
    }
  
    closeModal(modalController: ModalController) {
      modalController.dismiss();
    }

}
