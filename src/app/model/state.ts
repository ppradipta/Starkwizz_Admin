export class State{
    id: string;
    displayName: string;
    name: string;
}

export class District{
    id: string;
    displayName: string;
    name:string;
    stateid: string;
}

export class Cities{
    id: string;
    displayName: string
    stateid: string
    name: string;
    districtid: string
}

export class School{
    id: string
    board: string;
    displayName: string
    districtid: string
    name: string;
    stateid: string;
}

export class Institute{
    id: string
    board: string
    displayName: string
    districtid: string
    name: string;
    stateid: string;
    cityid: string;
}
