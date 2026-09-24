import { BaseProperty } from "./base-property";

export class Classes extends BaseProperty{
    public boardId:string;
    public boardName:string;   //CBSE ICSC
}

 //Do not save this value to DB 'Only for View purpose'
export class ClassesView extends Classes {
    isChecked?: boolean;
    edit?: boolean;
}


