import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ReplaySubject } from 'rxjs';
import { DateUtilService } from '../common/util/date-util.service';
import { UserRank } from '../model/calculate-rank';
import { FirebaseCollection } from '../model/comman/firebase-collection';
import { Events } from '../model/events';
import { Cities, District, Institute, School, State } from '../model/state';

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    setImagesForUploadData = new ReplaySubject<any>(1);
    uploadImageUrl = new ReplaySubject<string>(1);
    questionType = new ReplaySubject<string>(1);
    isGenerate = new ReplaySubject<boolean>(1);
    question = new ReplaySubject<any>(1);
    hub = new ReplaySubject<any>(1);
    noticeUploadImageUrl = new ReplaySubject<string>(1);
    event = new ReplaySubject<any>(1);
    locationData = new ReplaySubject<any>(1);
    tabValue = new ReplaySubject<any>(1);

    eclass = new ReplaySubject<any>(1);
    constructor(
        private firestore: AngularFirestore,
        private dateUtilService: DateUtilService
    ) {
    }


    setEclass(eclass) {
        this.eclass.next(eclass);
    }
    getEclass() {
        return this.eclass.asObservable();
    }

    setImagesDataForUpload(items) {
        this.setImagesForUploadData.next(items);
    }
    getImagesDataForUpload() {
        return this.setImagesForUploadData.asObservable();
    }

    setImageForUpload(imageUri) {
        this.uploadImageUrl.next(imageUri);
    }
    getImageForUpload() {
        return this.uploadImageUrl.asObservable();
    }

    setNoticeImgForUpload(imageUri) {
        this.uploadImageUrl.next(imageUri);
    }
    getNoticeImgForUpload() {
        return this.uploadImageUrl.asObservable();
    }


    setQuestionType(questionType) {
        this.questionType.next(questionType);
    }
    getQuestionType() {
        return this.questionType.asObservable();
    }

    setQuestion(question) {
        this.question.next(question);
    }
    getQuestion() {
        return this.question.asObservable();
    }

    setHubDetails(hub) {
        this.hub.next(hub);
    }
    getHubDetails() {
        return this.hub.asObservable();
    }

    setEventData(event) {
        this.event.next(event);
    }
    getEventData() {
        return this.event.asObservable();
    }

    setIsGenerateQuestionSequence(isGenerate: boolean) {
        this.isGenerate.next(isGenerate);
    }
    getIsGenerateQuestionSequence() {
        return this.isGenerate.asObservable();
    }

    setLocationData(data) {
        this.locationData.next(data);
    }
    getLocationData() {
        return this.locationData.asObservable();
    }

    setTabValue(tabValue) {
        this.tabValue.next(tabValue);
    }
    getTabValue() {
        return this.tabValue.asObservable();
    }


    populateEventDetailsToCollection(event) {
        let eventDetail: Events = new Events();
        if (null == event.id) {
            eventDetail.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            eventDetail.eventCode = ('SK-' + Math.random().toString(36).substring(2, 8)).toUpperCase();
        } else {
            eventDetail.id = event.id;
            eventDetail.eventCode = event.eventCode;
        }
        eventDetail.eventInfo = event.eventInfo;
        eventDetail.eventName = event.eventName;
        eventDetail.boardName = event.boardName;
        eventDetail.boardId = event.boardId;
        eventDetail.className = event.className;
        eventDetail.classId = event.classId;
        eventDetail.subjectName = event.subjectName;
        eventDetail.subjectId = event.subjectId;
        eventDetail.moduleName = event.moduleName;
        eventDetail.moduleId = event.moduleId;
        eventDetail.status = 'UPCOMING';
        eventDetail.category = event.category;
        eventDetail.categoryId = event.categoryId;
        eventDetail.eventCategory = event.eventCategory;
        eventDetail.eventCategoryId = event.eventCategoryId;
        eventDetail.totalHour = event.totalHour;
        eventDetail.perQuestionHour = event.perQuestionHour;
        eventDetail.type = event.type;
        eventDetail.typeId = event.typeId;
        eventDetail.eventCategory = event.eventCategory;
        eventDetail.eventCategoryId = event.eventCategoryId;
        eventDetail.eventMarks = event.eventMarks;
        eventDetail.passMark = event.passMark;
        eventDetail.creationDate = this.dateUtilService.getCurrentDateWithYYYYMMDD();
        eventDetail.creationDateUnix = String(this.dateUtilService.getCurrentEpochTime());
        eventDetail.startTime = this.dateUtilService.getCurrentTimeWith12hrFormat();
        eventDetail.endTime = this.dateUtilService.getCurrentTimeWith12hrFormat();
        eventDetail.eventStartDate = event.eventStartDate;
        eventDetail.eventStartDateUnix = String(this.dateUtilService.getUnixTime(event.eventStartDate));
        eventDetail.eventEndDate = event.eventEndDate;
        eventDetail.eventEndDateUnix = String(this.dateUtilService.getUnixTime(event.eventEndDate));
        eventDetail.eventDate = event.eventStartDate;
        eventDetail.eventMonth = this.dateUtilService.getMonthFromDate(event.eventStartDate);
        eventDetail.eventDateUnix = String(this.dateUtilService.getUnixTime(event.eventStartDate));
        eventDetail.applicableType = event.applicableType;
        eventDetail.description = event.description;
        eventDetail.price = event.price;
        eventDetail.questionPattern = event.questionPattern;
        eventDetail.questionToAttemp = event.questionToAttemp;
        eventDetail.testType = event.testType;
        eventDetail.stateId = event.stateId;
        eventDetail.stateName = event.stateName;
        eventDetail.districtId = event.districtId;
        eventDetail.districtName = event.districtName;
        eventDetail.cityId = event.cityId;
        eventDetail.cityName = event.cityName;
        eventDetail.schoolId = event.schoolId;
        eventDetail.schoolName = event.schoolName;
        return eventDetail;
    }

    populateQuestionToCollection(questionData, eventData) {
        eventData.questions = [];
        questionData.forEach(questions => {
            let data = {
                id: questions.id,
                correctAnswer: questions.answers[0]
            }
            eventData.questions.push(data);
        });

        return eventData;
    }

    setEventDetailsToCollecton(eventDetails: Events) {
        return this.firestore.collection('events').doc(eventDetails.id)
            .set(JSON.parse(JSON.stringify(eventDetails)), { merge: true });
    }

    setQuizWhizzSubscriptionCollecton(eventDetails: Events) {
        return this.firestore.collection('quizWhizz_subscription').doc(eventDetails.id)
            .set(JSON.parse(JSON.stringify(eventDetails)), { merge: true });
    }

    updateMyAddDetailsToCollection(add) {
        return this.firestore.collection(FirebaseCollection.MY_ADDS).doc(add.id).update({
            status: 'PUBLISHED',
            approvedDate: this.dateUtilService.getCurrentDateWithYYYYMMDD(),
            approvedBy: 'ADMIN'
        })
    }

    populateQuestionEventData(events) {
        let eventDetail: Events = new Events();

        eventDetail.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        eventDetail.eventName = events.eventName;
        eventDetail.classId = events.clasdId;
        eventDetail.className = events.className;
        eventDetail.subjectId = events.subjectId;
        eventDetail.subjectName = events.subjectName;
        eventDetail.moduleId = events.moduleId;
        eventDetail.moduleName = events.moduleName;
        eventDetail.startDate = events.startDate;
        eventDetail.endDate = events.endDate;
        eventDetail.creationDate = this.dateUtilService.getCurrentDateWithYYYYMMDD();
        eventDetail.questions = events.questions;
        eventDetail.eventMonth = this.dateUtilService.getCurrentMonth();

        return eventDetail;
    }



    populateStateData(data) {
        let state: State = new State()
        state.displayName = data.name;
        state.id = data.name.replace(/\s/g, '').toLocaleLowerCase();
        state.name = state.id;
        return state;
    }

    populateDistrictData(data) {
        let dist: District = new District();

        dist.id = data.stateDetails.id.replace(/\s/g, '').toLocaleLowerCase() + '#' + data.name.replace(/\s/g, '').toLocaleLowerCase();
        dist.displayName = data.name;
        dist.name = data.name.toLocaleLowerCase();
        dist.stateid = data.stateDetails.id;
        return dist;
    }

    populateCitiesData(data) {
        let city: Cities = new Cities();

        city.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        city.displayName = data.name;
        city.name = data.name.toLocaleLowerCase();
        city.stateid = data.stateDetails.id;
        city.districtid = data.districtDetails.id;
        return city;
    }

    populateSchoolData(data) {
        let school: School = new School();

        school.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        school.displayName = data.name;
        school.name = data.name.toLocaleLowerCase();
        school.stateid = data.stateDetails.id;
        school.districtid = data.districtDetails.id;
        school.board = data.boardDetails.displayName
        return school;
    }

    populateInstituteData(data) {
        let institute: Institute = new Institute();

        institute.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        institute.displayName = data.name;
        institute.name = data.name.toLocaleLowerCase();
        institute.stateid = data.stateDetails.id;
        institute.districtid = data.districtDetails.id;
        institute.cityid = data.schoolDetails.id;
        institute.board = data.boardDetails.displayName
        return institute;
    }


    setDataToStateCollection(state) {
        return this.firestore.collection('state').doc(state.id)
            .set(JSON.parse(JSON.stringify(state)), { merge: true });
    }

    setDataToDistrictCollection(district) {
        return this.firestore.collection('district').doc(district.id)
            .set(JSON.parse(JSON.stringify(district)), { merge: true });
    }

    setDataToCitiesCollection(cities) {
        return this.firestore.collection('cities').doc(cities.id)
            .set(JSON.parse(JSON.stringify(cities)), { merge: true });
    }

    setDataToSchoolCollection(school) {
        return this.firestore.collection('school').doc(school.id)
            .set(JSON.parse(JSON.stringify(school)), { merge: true });
    }

    setDataToInstituteCollection(institute) {
        return this.firestore.collection('institute').doc(institute.id)
            .set(JSON.parse(JSON.stringify(institute)), { merge: true });
    }

    setDataToEClassCollection(eclass) {
        return this.firestore.collection('eclass').add(JSON.parse(JSON.stringify(eclass)));
    }

    selectCollectionName(name: string) {
        let collectionName: string;
        switch (name) {
            case "STATE":
                collectionName = FirebaseCollection.STATE;
                break;
            case "DISTRICT":
                collectionName = FirebaseCollection.DISTRICT;
                break;
            case "CITIES":
                collectionName = FirebaseCollection.CITIES;
                break;
            case "SCHOOLS":
                collectionName = FirebaseCollection.SCHOOL;
                break;
            default:
                collectionName = "";
        }
        return collectionName;
    }

    populateRank(data) {
        let rankCalculate = [];
        data.forEach(calculateRank => {
            let userRank: UserRank = new UserRank();
            userRank.id = calculateRank.id;
            userRank.userId = calculateRank.userId;
            // userRank.name = calculateRank.userName;
            userRank.displayName = calculateRank.userDisplayName;
            userRank.userImage = calculateRank.userImage;
            userRank.eventId = calculateRank.eventId;
            userRank.eventName = calculateRank.eventName;
            userRank.eventType = calculateRank.type
            userRank.moduleId = calculateRank.moduleId;
            userRank.moduleName = calculateRank.moduleName;
            userRank.boardId = calculateRank.boardId;
            userRank.boardName = calculateRank.boardName;
            userRank.classId = calculateRank.classId;
            userRank.className = calculateRank.className;
            userRank.schoolId = calculateRank.schoolId;
            userRank.schoolName = calculateRank.schoolName;
            userRank.subjectId = calculateRank.subjectId;
            userRank.subjectName = calculateRank.subjectName;
            userRank.calculateRank = calculateRank.cacluateRank;
            userRank.stateId = calculateRank.stateId;
            userRank.stateName = calculateRank.stateName;
            userRank.districtId = calculateRank.districtId;
            userRank.districtName = calculateRank.districtName;
            userRank.cityId = calculateRank.cityId;
            userRank.cityName = calculateRank.cityName;
            userRank.point = calculateRank.totalSecuredMark;
            userRank.totalExamTime = calculateRank.totalExamTime;
            userRank.examTimeInMilliSeconds = calculateRank.totalExamTime * 1000;
            userRank.totalExamTimeDisplay = calculateRank.totalExamTimeDisplay;
            userRank.status = calculateRank.status;
            userRank.token = calculateRank.token;
            rankCalculate.push(userRank);

        });
        return rankCalculate;
    }

    setDataToSchoolRank(calculateRank, eventType) {
        if (eventType == 'QUIZWHIZZ') {
            let query = this.firestore.collection('user_quizwhizz_school_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_quizwhizz_school_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_quizwhizz_school_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true });
                }
            });
        } else {
            let query = this.firestore.collection('user_event_school_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_event_school_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_event_school_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true });
                }
            });
        }
    }

    setDataToCityRank(calculateRank, eventType) {
        if (eventType == 'QUIZWHIZZ') {
            let query = this.firestore.collection('user_quizwhizz_city_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_quizwhizz_city_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_quizwhizz_city_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true });
                }
            });
        } else {
            let query = this.firestore.collection('user_event_city_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_event_city_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_event_city_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true });
                }
            });
        }
    }

    setDataToDistrictRank(calculateRank, eventType) {
        if (eventType == 'QUIZWHIZZ') {
            let query = this.firestore.collection('user_quizwhizz_district_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_quizwhizz_district_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_quizwhizz_district_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true });
                }
            });
        } else {
            let query = this.firestore.collection('user_event_district_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_event_district_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_event_district_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true });
                }
            });
        }
    }

    setDataToStateRank(calculateRank, eventType) {
        if (eventType == 'QUIZWHIZZ') {
            let query = this.firestore.collection('user_quizwhizz_state_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_quizwhizz_state_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_quizwhizz_state_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true });
                }
            });
        } else {
            let query = this.firestore.collection('user_event_state_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_event_state_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_event_state_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true });
                }
            });
        }
    }

    setDataToAllRank(calculateRank, eventType) {
        if (eventType == 'QUIZWHIZZ') {

            let query = this.firestore.collection('user_quizwhizz_all_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_quizwhizz_all_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_quizwhizz_all_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true }).then(result => {
                            this.processEventNotification(calculateRank, 'QUIZWHIZZ_ALL_RANK_CALCULATION_COMPLETED').then(result => {
                                console.log('Rank clculated msg publish');
                            });
                        });
                }
            });
        } else {
            let query = this.firestore.collection('user_event_all_ranks').ref
                .where('eventId', '==', calculateRank.eventId)
                .where('userId', '==', calculateRank.userId);
            query.get().then((eventDetail: any) => {
                if (!eventDetail.empty) {
                    eventDetail.forEach(data => {
                        let record = data.data();
                        this.firestore.collection('user_event_all_ranks').doc(record.id).update({
                            calculateRank: calculateRank.calculateRank
                        });
                    });
                } else {
                    this.firestore.collection('user_event_all_ranks').doc(calculateRank.id)
                        .set(JSON.parse(JSON.stringify(calculateRank)), { merge: true }).then(result => {
                            this.processEventNotification(calculateRank, 'EVENT_ALL_RANK_CALCULATION_COMPLETED').then(result => {
                                console.log('Rank clculated msg publish');
                            });
                        });
                }
            });
        }
    }


    processEventNotification(eventDetail, functionTypeValue) {
        if (null != eventDetail.token) {
            let userData = {
                name: eventDetail.displayName,
                id: eventDetail.userId,
                token: eventDetail.token
            }
            let createEventNotification = {
                creationDate: this.dateUtilService.getCurrentDateWithTime(),
                eventType: eventDetail.eventType,
                eventId: eventDetail.eventId,
                eventName: eventDetail.eventName,
                types: "PUSH",
                functionType: functionTypeValue,
                msgText: null,
                title: null,
                receivers: [] = [userData],
                receiversId: [] = [userData.id],
                userDetail: userData
            }
            if (createEventNotification.functionType === 'EVENT_ALL_RANK_CALCULATION_COMPLETED') {
                createEventNotification.msgText = `Congratulations , Your rank publish for ${eventDetail.eventName},Please visit leaderboard and view your rank.`;
                createEventNotification.title = `Rank For Event`;
            }
            return this.firestore.collection('user_message_push')
                .add(JSON.parse(JSON.stringify(createEventNotification)));
        }

    }


    processProfileUpdateSMS(userdetails, phoneNo, functionTypeValue, changeparam, status) {
        if (null != phoneNo) {
            let userData = {
                name: userdetails.displayName,
                id: userdetails.userId,
                phoneNo: phoneNo
            }
            let createEventNotification = {
                creationDate: this.dateUtilService.getCurrentDateWithTime(),
                types: "SMS",
                functionType: functionTypeValue,
                body: null,
                to: null,
                userDetail: userData
            }

            if (createEventNotification.functionType === 'USER_PROFILE_CHANGE_REQUEST') {
                if (null != changeparam.boardName && null != changeparam.className) {
                    createEventNotification.body = `Dear ${userdetails.displayName},Your request has been ${status} for Board name from ${userdetails.boardName} to ${changeparam.boardName} and Class Name from ${userdetails.className} to ${changeparam.className}. Starkwizz`;
                    createEventNotification.to = userData.phoneNo;
                }
                else if (null != changeparam.boardName) {
                    createEventNotification.body = `Dear ${userdetails.displayName},Your request has been ${status} for  Board name from ${userdetails.boardName} to ${changeparam.boardName}. Starkwizz`;
                    createEventNotification.to = userData.phoneNo;
                }
                else if (null != changeparam.className) {
                    createEventNotification.body = `Dear ${userdetails.displayName},Your request has been ${status} for  Class name from ${userdetails.className} to ${changeparam.className}. Starkwizz`;
                    createEventNotification.to = userData.phoneNo;
                }
            }

            return this.firestore.collection('user_message_sms')
                .add(JSON.parse(JSON.stringify(createEventNotification)));
        }
    }


    processProfileUpdateNotification(userdetails, functionTypeValue, changeparam, status) {
        if (null != userdetails.token) {
            let userData = {
                name: userdetails.displayName,
                id: userdetails.userId,
                token: userdetails.token
            }
            let createEventNotification = {
                creationDate: this.dateUtilService.getCurrentDateWithTime(),
                types: "PUSH",
                functionType: functionTypeValue,
                msgText: null,
                title: null,
                receivers: [] = [userData],
                receiversId: [] = [userData.id],
                userDetail: userData
            }

            if (createEventNotification.functionType === 'USER_PROFILE_CHANGE_REQUEST') {
                if (null != changeparam.boardName && null != changeparam.className) {
                    createEventNotification.msgText = `Dear ${userdetails.displayName},Your request has been ${status} for Board name from ${userdetails.boardName} to ${changeparam.boardName} and Class Name from ${userdetails.className} to ${changeparam.className}. Starkwizz`;
                    createEventNotification.title = `Profile Change Request`;
                }
                else if (null != changeparam.boardName) {
                    createEventNotification.msgText = `Dear ${userdetails.displayName},Your request has been ${status} for  Board name from ${userdetails.boardName} to ${changeparam.boardName}. Starkwizz`;
                    createEventNotification.title = `Profile Change Request`;
                }
                else if (null != changeparam.className) {
                    createEventNotification.msgText = `Dear ${userdetails.displayName},Your request has been ${status} for  Class name from ${userdetails.className} to ${changeparam.className}. Starkwizz`;
                    createEventNotification.title = `Profile Change Request`;
                }
            }
            return this.firestore.collection('user_message_push')
                .add(JSON.parse(JSON.stringify(createEventNotification)));
        }


    }
}
