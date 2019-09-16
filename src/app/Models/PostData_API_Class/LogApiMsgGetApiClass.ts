
export class LogApiMsgGetApiClass {
    userAgent: string
    os: string
    browser: string
    device: string
    os_version: string
    browser_version: string
    isDesktop: boolean
    isMobile: boolean
    isTablet: boolean
    UserID: string // 出錯誤當下操作的id
    EditDate: string //出錯誤的日期
    postMethod: string //出錯的前端呼叫方法
    postData: string //出錯的呼叫方法的json
    errorResponse: string //出錯的response
}
