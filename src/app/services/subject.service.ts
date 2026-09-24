import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subjects } from '../model/subject';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {

    private subjectCollection: AngularFirestoreCollection<Subjects>;
    subjects$: Observable<Subjects[]>;

    public selectedSubject = new ReplaySubject<Subjects>(1);

    constructor(private firestore: AngularFirestore) {
        this.getSubjects();
    }

    getSelectedSubject() {
        return this.selectedSubject.asObservable();
      }
    
    setSelectedSubject(subject: Subjects) {
        this.selectedSubject.next(subject);
    }

    getSubjects() {
        this.subjectCollection = this.firestore.collection<Subjects>('subjects');
        this.subjects$ = this.subjectCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Subjects;
                return {
                    ...data
                };
            }))
        );
    }

    getSubjectByClassId(classId: string){
    const query = this.firestore.collection('subjects');
    return query.ref.where('classId', '==', classId).get()
    }

    setSubjectToCollection(subject: Subjects) {
        this.firestore.collection('subjects').doc(subject.id)
            .set(JSON.parse(JSON.stringify(subject)), { merge: true });
    }

    deleteSubjectFromCollection(id: string) {
        this.firestore.collection('subjects').doc(id).delete();
    }

    populateSubjectToCollection(selectedSubject:Subjects){
        let dbSubject : Subjects =new Subjects();

        dbSubject.id = selectedSubject.id
        dbSubject.name = selectedSubject.name
        dbSubject.displayName = selectedSubject.displayName
        dbSubject.colorCode = selectedSubject.colorCode
        dbSubject.classId = selectedSubject.classId
        dbSubject.className = selectedSubject.className
        dbSubject.category = selectedSubject.category
        dbSubject.price = selectedSubject.price

        if(selectedSubject.imageURL){
            dbSubject.imageURL = selectedSubject.imageURL
        }
        
        return dbSubject
    }


    populateNewSubjectDetails(evnt){
        let newSubject : Subjects = new Subjects();
        newSubject.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        newSubject.category = 'Scholastic';
        newSubject.classId = evnt.classId;
        newSubject.className = evnt.className;
        newSubject.colorCode = '#E27575';
        newSubject.displayName =  evnt.subjectName, //Subj displayName
        newSubject.name =  evnt.subjectName,
        newSubject.price = 40;
        return newSubject
    }
}
