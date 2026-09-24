export class Eclass {
    boardName: string;
    boardId:string;
    videoURL: string;
    className: string;
    classId: string;
    subjectName: string;
    subjectId: string;
    moduleName: string;
    moduleId: string;
    topicName: string;
    shotDescription: string;
    longDescription: string;
    status: string;
    uploadDate: string;
    language:string;
    isDownloadAllow: boolean = false;
    isComment: boolean = false;
    uploadBy: string;
    uploadDetails: UserBasic = new UserBasic();
    approvedBy: string;
    approveDetails: UserBasic = new UserBasic();
    rejectedBy: string;
    rejectedDetails: UserBasic = new UserBasic();
    likeCount:number=0;
    dislikeCount:number=0;
    commentCount:number=0;
    ratingCount:number=0;
    viewsCount:number=0;

}

export class UserBasic {
    displayName: string;
    imageUrl: string;
}