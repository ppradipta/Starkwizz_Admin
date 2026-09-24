import { BaseProperty } from "./base-property";

export class Subjects extends BaseProperty{
    public classId: string;
    public className: string;

    public category : string; //scholastic/Co-scholastic
    public price : number;   // must be per month
    public categoryId: string;
}



 //Do not save this value to DB 'Only for View purpose'
 export class SubjectView extends Subjects {
    isChecked?: boolean;
    edit?: boolean;
}