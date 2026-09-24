import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Questions } from '../model/questions';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    public question = new ReplaySubject<Questions>(1);
    public previewQuestions = new ReplaySubject<Questions[]>(1);
    public rejectedQuestions = new ReplaySubject<Questions[]>(1);
    private questionCollection: AngularFirestoreCollection<Questions>;
    questions$: Observable<Questions[]>;

    public selectedBoard = new ReplaySubject<any>(1);
    public selectedClass = new ReplaySubject<any>(1);
    public selectedSubject = new ReplaySubject<any>(1);
    public selectedModule = new ReplaySubject<any>(1);

    constructor(private firestore: AngularFirestore) {
    }
    setRejectedQuestionsPreview(questions) {
        this.rejectedQuestions.next(questions);
    }
    getRejectedQuestionsPreview() {
        return this.rejectedQuestions.asObservable();
    }

    setQuestionsPreview(questions) {
        this.previewQuestions.next(questions);
    }
    getQuestionsPreview() {
        return this.previewQuestions.asObservable();
    }

    setSelectedBoard(board) {
        this.selectedBoard.next(board);
    }
    getSelectedBoard() {
        return this.selectedBoard.asObservable();
    }


    setSelectedClass(cls) {
        this.selectedClass.next(cls);
    }
    getSelectedClass() {
        return this.selectedClass.asObservable();
    }

    setSelectedModule(module) {
        this.selectedModule.next(module);
    }
    getSelectedModule() {
        return this.selectedModule.asObservable();
    }




    setSelectedSubject(subject) {
        this.selectedSubject.next(subject);
    }
    getSelectedSubject() {
        return this.selectedSubject.asObservable();
    }




    getQuestionList() {
        this.questionCollection = this.firestore.collection<Questions>('questions');
        this.questions$ = this.questionCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Questions;
                return {
                    ...data
                };
            }))
        );
    }

    setQuestionToCollection(question: Questions) {
        this.firestore.collection('questions').doc(question.id).set(JSON.parse(JSON.stringify(question)), { merge: true }).then(result => {
            console.log(' Result question!!');
        })
    }

    setQuestionExplainDetailsToCollection(question: Questions, ansExplain, quesExplain) {
        let qexplain = {
            ansExplanationText: ansExplain,
            questionExplanationText: quesExplain,
            id: question.id
        }
        this.firestore.collection('questions_explain').doc(qexplain.id).set(JSON.parse(JSON.stringify(qexplain)), { merge: true }).then(result => {
            console.log(' Question explain !!');
        })
    }

    deleteQuestionFromCollection(questionId: string) {
        this.firestore.collection('questions').doc(questionId).delete();
    }
    setQuestion(question: Questions) {
        this.question.next(question);
    }
    getQuestion() {
        return this.question.asObservable();
    }

}
