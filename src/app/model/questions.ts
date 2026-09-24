
export class Questions {
    public id: string;
    public questionType: string; // TEXT, IMAGE
    public type: string; // Single/ multi etc
    public text: string;
    public hint: string;
    public url: string;
    public options: Options[] = [];
    public answers: string[] = [];
    public mark: number;
    public point: any;
    public board: string;
    public class: ClassView = new ClassView();
    public subject: SubjectView = new SubjectView();
    public module: ModuleView = new ModuleView();
    public perQuestionTimer: any;
    public isnegativeallow: boolean = false;
    public hinttext: string;
    public ansExplanationText: string;
    public questionExplanationText: string;
}

export class Options {
    public id: string;
    public type: string; // TEXT, IMAGE
    public text: string;
    public url: string;
    public sequence: string;

}

export class ClassView {
    id: string;
    displayName: string;
}

export class SubjectView {
    id: string;
    displayName: string;
}

export class ModuleView {
    id: string;
    displayName: string;
}