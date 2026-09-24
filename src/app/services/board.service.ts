import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoardOfEducation } from '../model/board';
import { Classes } from '../model/classes';

@Injectable({
    providedIn: 'root'
})
export class BoardService {

    private boardCollection: AngularFirestoreCollection<BoardOfEducation>;
    boardEducations$: Observable<BoardOfEducation[]>;

    private classesCollection: AngularFirestoreCollection<Classes>;
    classes$: Observable<Classes[]>;
    constructor(private firestore: AngularFirestore) {
        this.getBoardOfEducation();
    }

    getBoardOfEducation() {
        this.boardCollection = this.firestore.collection<BoardOfEducation>('board_of_education', ref => ref.
            where('status', '==', 'ACTIVE'));
        this.boardEducations$ = this.boardCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as BoardOfEducation;
                return {
                    ...data
                };
            }))
        );
    }

}
