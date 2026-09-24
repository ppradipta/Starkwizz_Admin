import { Injectable } from "@angular/core";
import * as moment from "moment-timezone";


@Injectable({
    providedIn: 'root'
})

export class DateUtilService {
    constructor() {
        moment.tz.setDefault('asia/kolkata');
    }

    getCurrentDate() {
        let tzDate = moment();
        return tzDate;
    }

    getCurrentDateWithYYYYMMDD() {
        let tzDate = this.getCurrentDate().format('YYYY-MM-DD');
        return tzDate;
    }

    getCurrentTimeWith12hrFormat() {
        let tzDate = this.getCurrentDate().format('hh:mm A');
        return tzDate;
    }


    getInputDateFormatToTime(input) {
        let tzDate = input.format('hh:mm A');
        return tzDate;
    }


    getCurrentDateWithTime() {
        let tzDate = this.getCurrentDate().format('YYYY-MM-DD hh:mm A');
        return tzDate;
    }

    addFiveDaysToCurrentDate() {
        const res = new Date();
        res.setDate(res.getDate() + 5);
        return res;
    }

    getFormatDate(date: string) {
        return moment(date, "YYYY-MM-DD").format('YYYY-MM-DD');;
    }

    sortingBasedOnEventDate(target: Array<any>) {
        return target.sort((b, a) => moment(a.eventDate).unix() - moment(b.eventDate).unix());
    }


    sortingBasedSubscriptionDate(target: Array<any>) {
        return target.sort((b, a) => moment(a.endDate).unix() - moment(b.endDate).unix());
    }

    getCurrentEpochTime() {
        return moment().unix();
    }

    getUnixTime(date: string) {
        return moment(date, "YYYY-MM-DD").unix();
    }

    getDateDifferenceInDays(eDate: string) {
        return moment().diff(moment(eDate), 'days');
    }

    getDateOFRemailningDays(sDate: string, eDate: string) {
        return moment(new Date(eDate)).diff(moment(new Date(sDate)), "days");
    }

    getCurrentMonth() {
        return moment().format('MMM');
    }

    getMonthFromDate(inputDate: string) {
        return moment(inputDate).format('MMM');
    }

    get12Months() {
        let months: any[] = [];
        for (var i = 0; i < 12; i++) {
            let mothObj = { id: i, title: moment().add(i, 'months').format('MMM') , displayName: moment().add(i, 'months').format('MMMM'), active: false };
            months.push(mothObj);
        }
        return months;
    }
}