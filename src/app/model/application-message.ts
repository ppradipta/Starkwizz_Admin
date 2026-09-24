
export class ApplicationMessage {

    public id:string;
    public displayText:string;
    public type: string;
}

export class ApplicationMessageConstants {
    public static ERROR = 'ERROR';
    public static SUCESS = 'SUCESS';
    public static INFO = 'INFO';
    public static WARNING = 'WARN';
}