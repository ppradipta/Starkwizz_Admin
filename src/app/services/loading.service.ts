import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = false;
  //loaderToShow: Promise<void>;
  constructor(public loadingController: LoadingController) { }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      cssClass: 'page-loader',
      backdropDismiss: false,
      duration: 3000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.getTop().then(v => v ? this.doStopLoader() : null);
  }
  doStopLoader() {
    this.loadingController.dismiss();
  }
  async presentLoading(duration: number) {
    this.isLoading = true;
    this.loadingController.create({
      cssClass: 'page-loader',
      backdropDismiss: false,
      duration: duration
    }).then((res) => {
      res.present().then(() => {
        if (!this.isLoading) {
          res.dismiss();
        }
      });
    });
  }

}
