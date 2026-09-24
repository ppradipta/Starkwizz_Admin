import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-posted-snapshot-modal',
  templateUrl: './posted-snapshot-modal.component.html',
  styleUrls: ['./posted-snapshot-modal.component.scss'],
})
export class PostedSnapshotModalComponent implements OnInit {
  @Input() image: any;
  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {}

  onClickClose() {
    this.modalController.dismiss();
  }

}
