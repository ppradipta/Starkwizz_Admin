import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApplicationMessage } from 'src/app/model/application-message';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
})
export class AlertMessageComponent implements OnInit {
  @Input() message: ApplicationMessage
  @Input() header: string
  moduleOperationType=true;


  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  success() {
    this.modalController.dismiss(this.moduleOperationType);
  }
  cancel() {
    this.closeModal(this.modalController);
  }

  closeModal(modalController: ModalController) {
    modalController.dismiss();
  }

}
