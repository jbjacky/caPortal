// Generated by https://quicktype.io

export interface GetblockDetailDetailApiDataClass {
    Title:             string;
    DateIntervalTitle: string;
    TransferTitle:     string;
    useTemplate:       string;
    NoteBloc:          string;
    BlockClass:        BlockClass[];
}

export interface BlockClass {
    title:            string;
    blockDetail:      BlockDetail[];
    OtherblockDetail: BlockDetail[] | null;
    initDollar:       string;
    order:            number;
}

export interface BlockDetail {
    title:  string;
    number: string;
    init:   string;
}
