import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonModal, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DashBoardService } from 'src/app/services/dashboard.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-activity',
  templateUrl: './my-activity.component.html',
  styleUrls: ['./my-activity.component.scss'],
})
export class MyActivityComponent implements OnInit {
  userDetails: any[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild('MatPaginator1') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  users$: Observable<any[]>;
  dataSourceActivity: MatTableDataSource<any>;
  @ViewChild('MatPaginatorAssociate') paginatorAssociates: MatPaginator;
  @ViewChild(MatSort) sortAssociates: MatSort;
  displayedColumnsActivity: string[] = ['code', 'name','referenceUID', 'creationdate', 'mobileNo', 'email', 'postId'];
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
  myActivity: any = [];
  
  constructor(
    private dashboardService: DashBoardService,
    private toastController: ToastController,
    private router: Router,
    private user: UserService,
  ) { }

  ngOnInit() {
    this.user.getUserDetails().subscribe(user => {
      this.userDetails = user;
    });


    this.userDetailsActivity$ = this.dashboardService.getAssociatesUserDetails();
    this.userDetailsActivity$.subscribe(res => {
      this.myActivity = res.filter(ass => ass.status == 'ACTIVE' && ass.isSelected);
      this.dataSourceActivity = new MatTableDataSource(this.myActivity);
      this.dataSourceActivity.paginator = this.paginatorAssociates;
      this.dataSourceActivity.sort = this.sortAssociates;
    });



    this.userDetailsActivity$ = this.dashboardService.getAssociatesUserDetails();
    this.userDetailsActivity$.subscribe(res => {
      this.myActivity = res.filter(ass => ass.status == 'ACTIVE' && ass.isSelected);
      this.dataSourceActivity = new MatTableDataSource(this.myActivity);
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

  selectActivityType() {
    this.userDetailsActivity$.subscribe(res => {
      this.myActivity = res.filter(ass => ass.status == 'ACTIVE' && ass.postName == this.selctedType);
      this.myActivity.forEach(ele => {
        if (!ele.isSelected && null == ele.isSelected)
          ele.isSelected = false;
      })
      this.dataSourceActivity = new MatTableDataSource(this.myActivity);
      this.dataSourceActivity.paginator = this.paginatorAssociates;
      this.dataSourceActivity.sort = this.sortAssociates;
    });
  }


  viewSubscription(record) {
    this.user.setViewDetails(record);
    this.router.navigate(['home/view-activity']);
  }

}
