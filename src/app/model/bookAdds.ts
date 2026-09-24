export class BookAdds{
    category : Category[];
    bookName: string;
    boardName: string;
    boardId: string;
    className: string;
    classId: string;
    publicationName: string;
    YearOfPublication: string;
    condition: string;
    bookPrice: string;
    discount: string;
    photos : string [] = [];

}


export class Category{
    name: string;
    displayName: string;
}