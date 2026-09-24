import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Classes } from '../model/classes';

@Injectable({
    providedIn: 'root'
})
export class ClassesService {

    private classesCollection: AngularFirestoreCollection<Classes>;
    classes$: Observable<Classes[]>;

    public selectedClass = new ReplaySubject<Classes>(1);

    constructor(private firestore: AngularFirestore) {
        this.getClasses();
    }

    getSelectedClass() {
        return this.selectedClass.asObservable();
      }
    
    setSelectedClass(selectedClass: Classes) {
        this.selectedClass.next(selectedClass);
    }

    getClasses() {
        this.classesCollection = this.firestore.collection<Classes>('classes');
        this.classes$ = this.classesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Classes;
                return {
                    ...data
                };
            }))
        );
    }

    setClassToCollection(classRoom: Classes) {
        this.firestore.collection('classes').doc(classRoom.id)
            .set(JSON.parse(JSON.stringify(classRoom)), { merge: true });
    }

    getClassBySubjectId(subjectId: string){
        const query = this.firestore.collection('classes');
        return query.ref.where('subjectId', '==', subjectId).get()
    }

    deleteClassFromCollection(id: string) {
        this.firestore.collection('classes').doc(id).delete();
    }

    populateClassToCollection(selectedClass:Classes){
        let dbClass : Classes =new Classes();

        dbClass.id = selectedClass.id
        dbClass.name = selectedClass.name
        dbClass.displayName = selectedClass.displayName
        dbClass.colorCode = selectedClass.colorCode
        dbClass.boardId =selectedClass.boardId
        dbClass.boardName =selectedClass.boardName

        if(selectedClass.imageURL){
            dbClass.imageURL = selectedClass.imageURL
        }
        
        return dbClass
    }
}
