import { Base } from "./GetDeptaByEmpDataClass"

export class DeptDetailClass{
    ParentID: number
    ParentDeptNameC: string
    DeptID: number
    DeptNameC: string
    BaseArray: Array<Base>
    isSearchClick:boolean | null
}