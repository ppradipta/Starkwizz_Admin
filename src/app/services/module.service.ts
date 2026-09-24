import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Module } from '../model/module';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    private moduleCollection: AngularFirestoreCollection<Module>;
    modules$: Observable<Module[]>;

    private publisherCollection: AngularFirestoreCollection<any>;
    publishers$: Observable<any[]>;
    constructor(private firestore: AngularFirestore) {
        this.getModules();
        this.getPublishers();
    }


    getPublishers() {
        this.publisherCollection = this.firestore.collection<Module>('book_publishers');
        this.publishers$ = this.publisherCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Module;
                return {
                    ...data
                };
            }))
        );
    }

    getModules() {
        this.moduleCollection = this.firestore.collection<Module>('modules');
        this.modules$ = this.moduleCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Module;
                return {
                    ...data
                };
            }))
        );
    }

    getModuleBySubjectId(subjectId: string) {
        const query = this.firestore.collection('modules');
        return query.ref.where('subjectId', '==', subjectId).get()
    }

    getModuleByClassId(classId: string) {
        const query = this.firestore.collection('modules');
        return query.ref.where('classId', '==', classId).get()
    }


    setModuleToCollection(module: Module) {
        this.firestore.collection('modules').doc(module.id)
            .set(JSON.parse(JSON.stringify(module)), { merge: true });
    }


    deleteModuleFromCollection(id: string) {
        this.firestore.collection('modules').doc(id).delete();
    }

    populateModuleToCollection(selectedModule: Module) {
        let dbModule: Module = new Module();

        dbModule.id = selectedModule.id
        dbModule.name = selectedModule.name
        dbModule.displayName = selectedModule.displayName
        dbModule.colorCode = selectedModule.colorCode
        dbModule.subjectId = selectedModule.subjectId
        dbModule.subjectName = selectedModule.subjectName
        dbModule.classId = selectedModule.classId
        dbModule.className = selectedModule.className

        if (selectedModule.imageURL) {
            dbModule.imageURL = selectedModule.imageURL
        }

        return dbModule
    }


    populateNewModuleDetails(evnt) {
        let newMod: Module = new Module();
        newMod.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        newMod.name = evnt.moduleName;
        newMod.displayName = evnt.moduleName;
        newMod.colorCode = '#E27575';
        newMod.subjectId = evnt.subjectId;
        newMod.subjectName = evnt.subjectName; //Subj displayName
        newMod.classId = evnt.classId;
        newMod.className = evnt.className;

        return newMod
    }


    setBookPublisherToCollection(publisher: any) {
        return this.firestore.collection('book_publishers').doc(publisher.id)
            .set(JSON.parse(JSON.stringify(publisher)), { merge: true });
    }

    updateBookPublisherFromCollection(newpublisher: any, oldPublisher: any) {
        return this.firestore.collection('book_publishers').doc(newpublisher.id)
            .set(JSON.parse(JSON.stringify(newpublisher)), { merge: true }).then(result => {
                return this.firestore.collection('book_publishers').doc(oldPublisher.id).delete();
            })

    }


    deleteBookPublisherFromCollection(publisher: any) {
        return this.firestore.collection('book_publishers').doc(publisher.id).delete();
    }

}
