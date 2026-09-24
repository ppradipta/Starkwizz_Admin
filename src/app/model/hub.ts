export class Hub {
    public id: string;
    public displayName: string;
    public dealsIn: string;
    public description: string;
    public website: string;
    public email: string;
    public phoneNumber: string;
    public whatsappNumber: string;
    public hasNotice: boolean;
    public hasOffer: boolean;
    public imgUrl: string;
    public locationText: string;
    public latitude: string;
    public longitude: string;
    public rating: string;
    public ratedCount: string;
    public status: string;
    public category: string;//HUB
    public startTime: string;
    public endTime: string;
    public workingDays: any[] = [];
    public keywords: any[] = [];

}

export class HubOffer {
    public id: string;
    public name: string;
    public description: string;
    public hubId: string;
    public endDate: string;
    public maxValue: number;
    public minValue: string;
    public photos: string;
    public startDate: string;
    public status: string;
    public type: string;
    public typeValue: number;
}

export class HubNotices {
    public description: string;
    public hubId: string;
    public photos: string;
    public startDate: string;
    public endDate: string;
    public status: string;
    public noticeImgUrl: string;
    public id:string;

}