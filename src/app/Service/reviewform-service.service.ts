import { Injectable } from '@angular/core';
import { AllformReview, FlowSignForm, forgetFlowSign, vaFlowSign, delFlowSign, changeFlowSign } from '../Models/AllformReview';
import { showVaDetail } from '../Models/showVaDetail';
import { GetApiDataServiceService } from './get-api-data-service.service';
import { GetFlowSignRoleClass } from '../Models/PostData_API_Class/GetFlowSignRoleClass';

@Injectable({
  providedIn: 'root'
})
export class ReviewformServiceService {
  showReviewTab = '';
  showReviewMan: AllformReview = new AllformReview()

  vaDetailProcessFlowID = ''

  forgetDetail: forgetFlowSign
  vaDetail: vaFlowSign
  delDetail: delFlowSign
  changeDetail: changeFlowSign

  FlowSign = [];

  constructor(private GetApiDataServiceService: GetApiDataServiceService) {
  }

  clearReview() {

    this.showReviewTab = '';
    this.showReviewMan = new AllformReview()

    this.vaDetailProcessFlowID = ''

    this.forgetDetail = new forgetFlowSign()
    this.vaDetail = new vaFlowSign()
    this.delDetail = new delFlowSign()
    this.changeDetail = new changeFlowSign()

    this.FlowSign = [];
  }
  changeReview(Tab, selectReviewMan: AllformReview) {
    this.showReviewTab = Tab
    this.showReviewMan = selectReviewMan
  }

  changeReviewMan(selectReviewMan: AllformReview) {
    this.showReviewMan = selectReviewMan
  }

  setVaDetailProcessFlowID(vaDetailProcessFlowID) {
    this.vaDetailProcessFlowID = vaDetailProcessFlowID
  }

  getReviewData: AllformReview[] = []

  showVaDetail: showVaDetail = {
    FlowID: '',
    FlowCode: '',
    FlowState: '',
    isApproved: true,
    isSendback: true,
    isPutForward: false,
    EmpCode: '',
    EmpNameC: '',
    EmpNameE: '',
    LeaveTime: '',
    LeaveArray: [{
      starttime: '',
      endtime: '',
      proxyEmpCode: '',
      proxyEmpNameC: '',
      proxyEmpNameE: '',
      LeaveTime: '',
      vacategrory: { HoliDayID: 0, HoliDayNameC: '', HoliDayKindID: '' },
      cause: '',
      Fileupload: [],
      EveryDayDetail: [{
        date: '',
        time: '',
        restTime: '',
        leavetime: '',
      }]
    },
    {
      starttime: '',
      endtime: '',
      proxyEmpCode: '',
      proxyEmpNameC: '',
      proxyEmpNameE: '',
      LeaveTime: '',
      vacategrory: { HoliDayID: 0, HoliDayNameC: '', HoliDayKindID: '' },
      cause: '',
      Fileupload: [],
      EveryDayDetail: [{
        date: '',
        time: '',
        restTime: '',
        leavetime: '',
      }]
    }],
    showAllSigningOpinions: [{
      signJobTitle: '',
      signEmpCode: '',
      signEmpNameC: '',
      signEmpNameE: '',
      signDateTime: '',
      signState: '',
      singOpinions: ''
    }]
  }
}