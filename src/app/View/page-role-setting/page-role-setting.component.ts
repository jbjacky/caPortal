import { Component, OnInit } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ITreeOptions, ITreeState } from 'angular-tree-component';
import { GetAllRoleDataClass } from 'src/app/Models/GetAllRoleDataClass';
import { SetRolePageByEmpGetApiClass } from 'src/app/Models/PostData_API_Class/SetRolePageByEmpGetApiClass';
import { nodeClass } from 'src/app/Models/nodeClass';
import { ResponeStateClass } from 'src/app/Models/ResponeStateClass';

@Component({
    selector: 'app-page-role-setting',
    templateUrl: './page-role-setting.component.html',
    styleUrls: ['./page-role-setting.component.css'],
    providers: []
})

export class PageRoleSettingComponent implements OnInit {

    constructor(private GetApiDataServiceService: GetApiDataServiceService,
        private GetApiUserService: GetApiUserService,
        private LoadingPage: NgxSpinnerService) { }

    state: ITreeState;
    nodes: nodeClass[] = [];

    options: ITreeOptions = {
        useCheckbox: true,
    };

    NgxRoleSelectBox: GetAllRoleDataClass[] = []
    searchRole: GetAllRoleDataClass = new GetAllRoleDataClass()
    setMan = { EmpCode: '', EmpName: '' }
    ngOnInit() {

        this.GetApiUserService.counter$.subscribe(
            (x: any) => {
                if (x == 0) {

                } else {
                    this.setMan = {
                        EmpCode: x.EmpCode,
                        EmpName: x.EmpNameC
                    }
                    this.firstLoad()
                }
            }
        )
    }


    firstLoad() {

        this.GetApiDataServiceService.getWebApiData_GetAllRole()
            .subscribe((role: GetAllRoleDataClass[]) => {
                this.NgxRoleSelectBox = role
                this.searchRole = role[0]
                this.GetApiDataServiceService.getWebApiData_GetPageStructure().subscribe(
                    (x: any) => {
                        this.nodes = []
                        for (let i = 0; i < x.length; i++) {
                            this.nodes.push({
                                id: x[i].Code,
                                name: x[i].Title,
                                children: [],
                                parentId: x[i].ParentCode
                            })
                            var site = x[i].site
                            for (let i_site of site) {
                                this.nodes[i].children.push({
                                    id: i_site.Code,
                                    name: i_site.Title,
                                    children: [],
                                    parentId: i_site.ParentCode
                                })
                            }
                        }
                        this.searchRolePage()

                    }
                )
            })
    }
    searchRolePage() {
        this.LoadingPage.show()
        this.GetApiDataServiceService.getWebApiData_GetPageByRoleCode(this.searchRole.RoleCode)
            .subscribe(
                (z: any) => {
                    const selectedLeafNodeIds = {};
                    for (let data of z) {
                        if (data.site.length == 0) {
                            selectedLeafNodeIds[data.Code] = true;
                        } else {
                            selectedLeafNodeIds[data.Code] = false;
                        }
                        for (let site of data.site) {

                            if (site.site.length == 0) {

                                selectedLeafNodeIds[site.Code] = true;
                            } else {

                                selectedLeafNodeIds[site.Code] = false;
                            }


                        }
                    }
                    this.state = {
                        ...this.state,
                        selectedLeafNodeIds
                    };

                    this.LoadingPage.hide()
                }, error => {

                    this.LoadingPage.hide()
                }
            )
    }

    saveNode() {
        var getCheckArray = []
        Object.keys(this.state.selectedLeafNodeIds).map(
            (item: any) => {
                if (this.state.selectedLeafNodeIds[item] == true) {
                    getCheckArray.push(item)
                    return item
                }
            }
        );

        for (let i = 0; i < this.nodes.length; i++) {
            var site = this.nodes[i].children
            for (let i_site of site) {
                for (let _send of getCheckArray) {
                    if (i_site.id == _send) {
                        // saveArray.push(i_site.id)
                        if (i_site.parentId.length != 0) {
                            var found = getCheckArray.find(function (element) {
                                return element == i_site.parentId;
                            });
                            if (!found) {
                                getCheckArray.push(i_site.parentId)
                            }
                        }
                    }
                }
            }
        }

        var SetRolePageByEmpGetApi: SetRolePageByEmpGetApiClass = {
            "PageRows": getCheckArray,
            "RoleCode": this.searchRole.RoleCode,
            "SetMan": this.setMan.EmpCode
        }
        this.LoadingPage.show()
        this.GetApiDataServiceService.getWebApiData_SetRolePageByEmp(SetRolePageByEmpGetApi)
            .subscribe(
                (x: ResponeStateClass) => {
                    if (x.isOK) {
                        this.searchRolePage()
                        alert('儲存成功')
                    } else {
                        var errMsg = ''
                        for (let e of x.ErrorMsg) {
                          errMsg += e + '。 '
                        }
                        alert(errMsg);
                    }
                    this.LoadingPage.hide()
                }, error => {

                    this.LoadingPage.hide()
                }
            )
        // console.log(SetRolePageByEmpGetApi)
    }
}
