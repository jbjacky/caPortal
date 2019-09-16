import { showUploadFileClass } from "../showUploadFileClass";
import { uploadFileClass } from "../uploadFileClass";

export class GetNewsClass{
    ShowNewsHead: string
    UpdateDate:    any;
    PostDate:      any;
    PostDeadline:  any;
    NewsID:        string;
    NewsHead:      string;
    NewsBody:      string;
    IsOn:          boolean;
    Sort:          number;
    KeyMan:        string;
    UploadFileOld: showUploadFileClass[];
    UploadFileNew: uploadFileClass[];
  }
