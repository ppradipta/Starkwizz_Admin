import { BaseProperty } from "./base-property";

export class Module extends BaseProperty {
    public subjectId: string;
    public subjectName: string;
    public classId: string;
    public className: string;
}


 //Do not save this value to DB 'Only for View purpose'
 export class ModuleView extends Module {
    isChecked?: boolean;
    edit?: boolean;
}