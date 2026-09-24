import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';

import * as FileSaver from 'file-saver';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { BoardOfEducation } from '../model/board';
import { Classes } from '../model/classes';
import { Events } from '../model/events';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class DashBoardService {

    private boardCollection: AngularFirestoreCollection<BoardOfEducation>;
    boardEducations$: Observable<BoardOfEducation[]>;

    private classesCollection: AngularFirestoreCollection<Classes>;
    classes$: Observable<Classes[]>;

    private eventsCollection: AngularFirestoreCollection<Events>;
    events$: Observable<Events[]>;

    private usersCollection: AngularFirestoreCollection<any>;
    users$: Observable<any[]>;

    private usersDetailsCollection: AngularFirestoreCollection<any>;
    userDetails$: Observable<any[]>;

    private usersDetailsActivityCollection: AngularFirestoreCollection<any>;
    userDetailsActivity$: Observable<any[]>;

    private usersViewDetailsCollection: AngularFirestoreCollection<any>;
    userViewDetails$: Observable<any[]>;

    public nexthostQueryAfter: QueryDocumentSnapshot<any>;
    public userEvents: ReplaySubject<any[] | undefined> =
        new ReplaySubject(undefined);



    private dynamoSubscriptionCollection: AngularFirestoreCollection<any>;
    dynamoSubscription$: Observable<any[]>;

    private eventSubscriptionCollection: AngularFirestoreCollection<any>;
    eventSubscription$: Observable<any[]>;

    constructor(private firestore: AngularFirestore) {
        this.getBoardOfEducation();
    }

    getBoardOfEducation() {
        this.boardCollection = this.firestore.collection<BoardOfEducation>('board_of_education');
        this.boardEducations$ = this.boardCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as BoardOfEducation;
                return {
                    ...data
                };
            }))
        );
    }

    getClasses(board) {
        this.classesCollection = this.firestore.collection<Classes>('classes', ref => ref.where('boardName', '==', board.name));
        this.classes$ = this.classesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Classes;
                return {
                    ...data
                };
            }))
        );
    }

    getEventsCount(board) {
        this.eventsCollection = this.firestore.collection<Events>('events', ref => ref.where('boardName', '==', board.name).where('type', '==', 'EVENT'));
        return this.eventsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Events;
                return {
                    ...data
                };
            }))
        );
    }

    getExamCount(board) {
        this.eventsCollection = this.firestore.collection<Events>('events', ref => ref.where('boardName', '==', board.name)
            .where('type', '==', 'EXAM')
            .orderBy('eventStartDate', 'asc'));
        return this.eventsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Events;
                return {
                    ...data
                };
            }))
        );
    }

    getUserDetailsCount(board) {
        this.usersCollection = this.firestore.collection<any>('users', ref => ref
            .where('boardName', '==', board.name)
            .orderBy("creationdate", "asc"));
        return this.usersCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );
    }

    getUserDetails() {
        this.usersDetailsCollection = this.firestore.collection<any>('users', ref => ref.orderBy("creationdate", "asc"));
        return this.usersDetailsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );
    }

    getAssociatesUserDetails() {
        this.usersDetailsActivityCollection = this.firestore.collection<any>('user_associates', ref => ref.
            orderBy("creationdate", "desc"));
        return this.usersDetailsActivityCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );
    }

    getUserActivityDetails(user) {
        this.usersCollection = this.firestore.collection<any>('user_events', ref => ref.where('userId', '==', user.id).orderBy('appearedDate', 'asc'));
        return this.usersCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );
    }

    getUserEventActivityDetails(event) {
        this.usersCollection = this.firestore.collection<any>('user_events', ref => ref.where('eventId', '==', event.id).orderBy('appearedDate', 'asc'));
        return this.usersCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );

    }

    getUserEventActivityDetailsWithNextQuery(event) {
        this.getUserEventActivityDetailsQuey(event).subscribe(hresult => {
            if (!hresult.empty) {
                this.nexthostQueryAfter = hresult.docs[hresult.docs.length - 1] as
                    QueryDocumentSnapshot<any>;
                this.userEvents.next(hresult.docs);
            }
        });
    }


    getUserEventActivityDetailsQuey(event) {
        if (this.nexthostQueryAfter) {
            return this.firestore.collection<any>('user_events', ref => ref.where('eventId', '==', event.id).orderBy('appearedDate', 'asc')
                .startAfter(this.nexthostQueryAfter)).get();
        } else {
            return this.firestore.collection<any>('user_events', ref => ref.where('eventId', '==', event.id).orderBy('appearedDate', 'asc')).get();
        }
    }



    getDynamoSubscriptionDetails() {
        this.dynamoSubscriptionCollection = this.firestore.collection<any>('user_subscription', ref => ref.orderBy('subscribedDate', 'desc'));
        return this.dynamoSubscriptionCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );

    }

    getDynamoSubscriptionDetailsOnFilter(query: any) {
        this.dynamoSubscriptionCollection = query;
        return this.dynamoSubscriptionCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );

    }

    getEventSubscriptionDetails() {
        // this.eventSubscriptionCollection = this.firestore.collection<any>('user_event_subscription', ref => ref.orderBy('dateUnix', "desc"));
        this.eventSubscriptionCollection = this.firestore.collection<any>('user_subscription_event', ref => ref.orderBy('subscribedDate', 'desc'));
        return this.eventSubscriptionCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );

    }

    getEventSubscriptionDetailsnDetailsOnFilter(query: any) {
        this.eventSubscriptionCollection = query;
        return this.eventSubscriptionCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );

    }

    getEventsOnFilter(query) {
        this.eventsCollection = query
        return this.eventsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Events;
                return {
                    ...data
                };
            }))
        );
    }


    getExamOnFilter(query) {
        this.eventsCollection = query;
        return this.eventsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Events;
                return {
                    ...data
                };
            }))
        );
    }


    public exportAsExcelFileForStudentRecords(recods: any[], excelFileName: string): void {
        let excleRecords = this.prepareExcleForStudentRecord(recods);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excleRecords);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }


    public exportAsExcelFileForEventReport(recods: any[], excelFileName: string): void {
        let excleRecords = this.prepareExcleForEventReport(recods);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excleRecords);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }



    public exportAsExcelFileForExamReport(recods: any[], excelFileName: string): void {
        let excleRecords = this.prepareExcleForExamReport(recods);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excleRecords);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    
    public exportAsExcelFileForActivitiesRecords(recods: any[], excelFileName: string): void {
        let excleRecords = this.ActivitiesRecord(recods);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excleRecords);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }


    public exportAsExcelFileForEventSubscription(recods: any[], excelFileName: string): void {
        let excleRecords = this.prepareExcleForEventSubscription(recods);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excleRecords);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }


    public exportAsExcelFileForDynamoSubscription(recods: any[], excelFileName: string): void {
        let excleRecords = this.prepareExcleForDynamoSubscription(recods);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excleRecords);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }


    public exportAsExcelFileForEventDetails(recods: any[], excelFileName: string): void {
        let excleRecords = this.prepareExcleForEventDetails(recods);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excleRecords);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }


    public prepareExcleForDynamoSubscription(excleRecods: any[]) {
        let excleRecords: any[] = [];
        if (excleRecods && excleRecods.length > 0) {
            excleRecods.forEach(record => {
                let excleRecod = {
                    AppId: record.applicationId,
                    BoardName: record.boardName,
                    SchoolName: record.schoolName,
                    ClassName: record.className,
                    Address: record.cityName + " " + record.displayName + " " + record.schoolName,
                    DiscountAmount: record.discountAmount,
                    DiscountType: record.discountType,
                    ExpiryDate: record.expiryDate,
                    Status: record.status,
                    ReferralDiscountName: record.referralDiscount?.name,
                    ReferralDiscountCode: record.referralDiscount?.code,
                    ReferralDiscountValue: record.referralDiscount?.typeValue,
                    // subjects: record.subject,
                    SubscribeAmount: record.subscribeAmount,
                    SubscribedDate: record.subscribedDate,
                    TotalAmount: record.totalAmount,
                    UserName: record.userDetails.displayName,
                    UserMobileNo: record.userDetails.mobileNo,
                    UserEmail: record.userDetails.email,
                    // UserId: record.userDetails.userId
                }
                excleRecords.push(excleRecod);
            });
            return excleRecords;
        }


    }


    public prepareExcleForEventSubscription(excleRecods: any[]) {
        let excleRecords: any[] = [];
        if (excleRecods && excleRecods.length > 0) {
            excleRecods.forEach(record => {
                let excleRecod = {
                    ClassName: record.className,
                    DiscountAmount: record.discountAmount,
                    ExpiryDate: record.expiryDate,
                    Status: record.status,
                    events: record.events,
                    SubscribeAmount: record.subscribeAmount,
                    SubscribedDate: record.subscribedDate,
                    TotalAmount: record.totalAmount,
                    UserName: record.userDetails.displayName,
                    UserMobileNo: record.userDetails.mobileNo,
                    UserEmail: record.userDetails.email,
                    // UserId: record.userDetails.userId
                }
                excleRecords.push(excleRecod);
            });
            return excleRecords;
        }


    }

    public prepareExcleForStudentRecord(excleRecods: any[]) {
        let excleRecords: any[] = [];
        if (excleRecods && excleRecods.length > 0) {
            excleRecods.forEach(record => {
                let excleRecod = {
                    ApplicationId: record.applicationId,
                    BoardName: record.boardName,
                    ClassName: record.className,
                    CreatedBy: record.createdBy,
                    Creationdate: record.creationdate,
                    DOB: record.dateOfBirth,
                    Name: record.displayName,
                    DistrictName: record.districtName,
                    CityName: record.cityName,
                    Email: record.emailId,
                    Gender: record.gender,
                    MobileNo: record.mobileNo,
                    SchoolName: record.schoolName,
                    StateName: record.stateName,
                    Type: record.userType,
                    ReferralCode: record.referralCode,
                    profileType: record.profileType
                }
                excleRecords.push(excleRecod);
            });
            return excleRecords;
        }


    }


    public prepareExcleForEventReport(excleRecods: any[]) {
        let excleRecords: any[] = [];
        if (excleRecods && excleRecods.length > 0) {
            excleRecods.forEach(record => {
                let excleRecod = {
                    ClassName: record.className,
                    DiscountAmount: record.discountAmount,
                    ExpiryDate: record.expiryDate,
                    Status: record.status,
                    events: record.events,
                    SubscribeAmount: record.subscribeAmount,
                    SubscribedDate: record.subscribedDate,
                    TotalAmount: record.totalAmount,
                    UserName: record.userDetails.displayName,
                    UserMobileNo: record.userDetails.mobileNo,
                    UserEmail: record.userDetails.email,
                    // UserId: record.userDetails.userId
                }
                excleRecords.push(excleRecod);
            });
            return excleRecords;
        }


    }


    public prepareExcleForExamReport(excleRecods: any[]) {
        let excleRecords: any[] = [];
        if (excleRecods && excleRecods.length > 0) {
            excleRecods.forEach(record => {
                let excleRecod = {
                    ClassName: record.className,
                    DiscountAmount: record.discountAmount,
                    ExpiryDate: record.expiryDate,
                    Status: record.status,
                    events: record.events,
                    SubscribeAmount: record.subscribeAmount,
                    SubscribedDate: record.subscribedDate,
                    TotalAmount: record.totalAmount,
                    UserName: record.userDetails.displayName,
                    UserMobileNo: record.userDetails.mobileNo,
                    UserEmail: record.userDetails.email,
                    // UserId: record.userDetails.userId
                }
                excleRecords.push(excleRecod);
            });
            return excleRecords;
        }


    }

    public prepareExcleFor
    ActivitiesRecord(excleRecods: any[]) {
        let excleRecords: any[] = [];
        if (excleRecods && excleRecods.length > 0) {
            excleRecods.forEach(record => {
                let excleRecod = {
                    Name: record.userDisplayName,
                    BoardName: record.boardName,
                    ClassName: record.className,
                    TotalQuestion: record.totalQuestion,
                    Type: record.type,
                    EventName: record.eventName,
                    Subject: record.subjectName,
                    Score: record.totalSecuredMark,
                    AppearedDate: record.appearedDate,
                    StartTime: record.examStartTime,
                    EndTime: record.examEndTime,
                    Correct: record.totalCorrect,
                    InCorrect: record.totalInCorrect,
                    totalSkipQuestions: record.totalSkipQuestions,
                }
                excleRecords.push(excleRecod);
            });
            return excleRecords;
        }


    }

    public prepareExcleForEventDetails(excleRecods: any[]) {
        let excleRecords: any[] = [];
        if (excleRecods && excleRecods.length > 0) {
            excleRecods.forEach(record => {
                let excleRecod = {
                    BoardName: record.boardName,
                    ClassName: record.className,
                    AppearedDate: record.appearedDate,
                    EventName: record.eventName,
                    EventCode: record.eventCode,
                    EventDate: record.eventDate,
                    Score: record.totalSecuredMark,
                    TotalQuestions: record.totalAppearQuesiton,
                    SkipQuestions: record.totalSkipQuestions,
                    QuestionToAttemp: record.questionToAttemp,
                }
                excleRecords.push(excleRecod);
            });
            return excleRecords;
        }


    }


    getUserDetailsWithId(userId) {
        this.usersDetailsCollection = this.firestore.collection<any>('users', ref => ref
            .where('id', '==', userId)
            .orderBy("creationdate", "asc"));
        return this.usersDetailsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );
    }


    getSubscriptionTypeDetails(code: string, year: string) {
        this.usersDetailsCollection = this.firestore.collection<any>('transaction', ref => ref.
            where('referralCode', '==', code)
            .where('year', '==', year));
        return this.usersDetailsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );
    }


    getAdminViewDetails() {
        this.usersViewDetailsCollection = this.firestore.collection<any>('admin_user', ref => ref);
        return this.usersViewDetailsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                return {
                    ...data
                };
            }))
        );
    }
}