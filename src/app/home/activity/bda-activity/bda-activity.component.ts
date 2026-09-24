import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonModal, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DashBoardService } from 'src/app/services/dashboard.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-bda-activity',
  templateUrl: './bda-activity.component.html',
  styleUrls: ['./bda-activity.component.scss'],
})
export class BdaActivityComponent implements OnInit {
  userDetails: any[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild('MatPaginator1') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  users$: Observable<any[]>;
  dataSourceActivity: MatTableDataSource<any>;
  @ViewChild('MatPaginatorAssociate') paginatorAssociates: MatPaginator;
  @ViewChild(MatSort) sortAssociates: MatSort;
  displayedColumnsActivity: string[] = ['postName', 'code', 'name', 'creationdate', 'mobileNo', 'email', 'postId'];
  userDetailsActivity$: Observable<any[]>;

  @ViewChild(IonModal) viewAssociatesModal: IonModal;
  isViewAssociatesOpen: boolean = false;
  associateType: string;
  viewDetail: any = {};

  postList: any = [
    { id: 'SBDA', displayName: 'SBDA' },
    { id: 'DBDA', displayName: 'DBDA' },
    { id: 'BBDA', displayName: 'BBDA' },
    { id: 'OTHER', displayName: 'OTHER' },
  ]

  selctedType: string = '';
  constructor(
    private dashboardService: DashBoardService,
    private toastController: ToastController,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
    this.userDetailsActivity$ = this.dashboardService.getAssociatesUserDetails();
    this.userDetailsActivity$.subscribe(res => {
      let bdaActivity = res.filter(ass => ass.status == 'ACTIVE');
      bdaActivity.forEach(ele => {
        if (!ele.isSelected && null == ele.isSelected)
          ele.isSelected = false;
      })

      this.dataSourceActivity = new MatTableDataSource(bdaActivity);
      this.dataSourceActivity.paginator = this.paginatorAssociates;
      this.dataSourceActivity.sort = this.sortAssociates;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceActivity.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceActivity.paginator) {
      this.dataSourceActivity.paginator.firstPage();
    }
  }

  selectAssociateType() {
    this.userDetailsActivity$.subscribe(res => {
      let bdaActivity = res.filter(ass => ass.status == 'ACTIVE' && ass.postName == this.selctedType);
      bdaActivity.forEach(ele => {
        if (!ele.isSelected && null == ele.isSelected)
          ele.isSelected = false;
      })
      this.dataSourceActivity = new MatTableDataSource(bdaActivity);
      this.dataSourceActivity.paginator = this.paginatorAssociates;
      this.dataSourceActivity.sort = this.sortAssociates;
    });
  }

  onCheckboxChange(event: any, record) {
    let isChecked = event;
    if (isChecked === false) {
      this.firestore.collection('user_associates').doc(record.id).update({
        isSelected: true,
      }).then(result => {
        this.presentToast("Select Associates successfully!!");
      })
    } else {
      this.firestore.collection('user_associates').doc(record.id).update({
        isSelected: false,
      }).then(result => {
        this.presentToast("Remove Associates successfully!!");
      })
    }

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  viewActivity(record, type) {
    this.associateType = type;
    this.viewDetail = record;
    this.isViewAssociatesOpen = true;
  }

  viewModalDismiss() {
    this.isViewAssociatesOpen = false;
    this.viewAssociatesModal.dismiss(null, 'cancel');
  }
}
