export class userEvents{
    id: string;
    userId: string;
    eventId: string;
    eventName: string;
    eventStartTime: string;
    eventEndTime: string;
    eventAppearStartTime: string;
    eventAppearEndTime: String;
    totalSkipQuestions: number= 0;
    totalAppearQuesiton: number= 0;
    totalQuestion: number = 0;
    mode: string; // attempted, skip
    questions: Questions []= [];
    status: string; // STARTED/INPROGRESS/COMPLETED
    appearedDate: string;
    type:string //EXAM/EVENT
    moduleName: string;
    totalHour: string;
    totalEventAppearTime: number;
    totalScore: number = 0;
}


export class Questions{
    id: string;
    userSelectedOption: string;
    mark: number= 0;
    status: string; //correct/wrong/skip
    startTime: string;
    endTime: string;
}