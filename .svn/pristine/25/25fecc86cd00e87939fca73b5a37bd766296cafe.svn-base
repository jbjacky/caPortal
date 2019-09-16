
/**
 * @todo 數字前補0，補足10位數，0012345678
 * @param  ProcessFlowID :被補齊的數字; ex:234
 * @author jacky
 * @return 0000000234
 */
export function void_completionTenNum(ProcessFlowID){
    var makeupID = ProcessFlowID.toString()
    var makeupID_length = makeupID.length
    if(makeupID_length<10){
      var i = 10
      var addzero = i - makeupID_length
      var zero=''
      for(let k=0 ; k<addzero ;k++){
        zero+='0'
      }
      makeupID = zero + makeupID
    }
    return makeupID
  }