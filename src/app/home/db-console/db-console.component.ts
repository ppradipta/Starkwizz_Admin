import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-db-console',
  templateUrl: './db-console.component.html',
  styleUrls: ['./db-console.component.scss'],
})
export class DbConsoleComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild('MatPaginator1') paginator: MatPaginator;
  collectionNames: any[] = [];
  selectedCollectionName: string = '';
  constructor(private firestore: AngularFirestore) { }

  ngOnInit() { }


  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectCollection(event) {
    this.selectedCollectionName = event.detail.value.id;
    this.collectionNames = ['events', 'user_events'];

  }

}
