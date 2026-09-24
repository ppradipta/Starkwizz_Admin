export class Events {
    public id: string;
    public eventName: string;
    public eventCode: string;
    public description: string;
    public eventInfo: string;

    public subjectId: string;
    public subjectName: string;
    public moduleId: string;
    public moduleName: string;
    public classId: string;
    public className: string;
    public boardId: string;
    public boardName: string;

    public category: string; // Diagnostic , Progressive, Proficiency // dropdpwn //parameter Collection
    public categoryId: string;
    public type: string; // Exam, Event
    public typeId: string;
    public status: string; // Active, Inactive, Completed
    public startTime: string;
    public endTime: string;
    public creationDate: string; //autcreate
    public startDate: string;
    public endDate: string;
    public questions: QuestionAppearanceView[] = []
    public imageUrl: string;
    public colorCode: string;
    public answerUrl: string;
    public totalHour: number; //input
    public perQuestionHour: number; //input
    public totalMark: number;
    public totalPoints: number;
    public eventCategory: string; //Scholostics, Co-Scholostics
    public eventCategoryId: string;
    public eventMarks: any;
    public eventDate: any;
    public eventStartDate: any;
    public eventEndDate: any;
    public applicableType: string;
    public price: number;
    public questionPattern: string;
    public questionToAttemp: number = 10;
    public passMark: number = 1;
    public eventStartDateUnix: string;
    public eventEndDateUnix: string;
    public creationDateUnix: string;
    public eventDateUnix: string;
    public testType: string;
    public eventMonth: string;
    public stateId: string;
    public stateName: string;
    public districtName: string;
    public districtId: string;
    public cityId: string;
    public cityName: string;
    public schoolId: string;
    public schoolName: string;
}
export class QuestionAppearanceView {
    id: string;
    //sequence: string;
    correctAnswer: string;
}

export class Parameters {
    public id: string;
    public eventType: string[];
    public eventCategory: string[];
}