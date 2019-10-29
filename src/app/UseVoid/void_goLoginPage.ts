import { UUID } from 'angular2-uuid';
declare var OAuthPath
declare var _client_id
declare var _redirect_uri_LinkOuthpage

// import settingJson from '../../assets/setting.json';

/**
 * @todo 登入轉到華航登入頁
 */
export function void_goLoginPage(){
    
    var guid = UUID.UUID();


    var URL = OAuthPath+'?'
    URL += 'authorizeURL=authorize.aspx'
    URL += "&response_type=code";                  // OAuth 2.0 Response Type value that determines the authorization processing flow to be used.
    URL += "&scope=openid";                        // OpenID  Connect requests MUST contain the openid scope value.
    URL += "&client_id="+_client_id;               // OAuth 2.0 Client Identifier
    URL += `&state=${guid}`;        // Opaque value used to maintain state between the request and the callback.
    URL += "&redirect_uri="+_redirect_uri_LinkOuthpage;         // Redirection URI to which the response will be sent.

    window.location.href = URL;
}

/**
 * @todo 有錯誤時重導登入頁
 */
export function void_ReGoLoginPage(){
    localStorage.removeItem('API_Token')
    localStorage.removeItem('API_Code')
    void_goLoginPage();
}

/**
 * @todo 直接導登出頁
 */
export function void_LogoutPage(){
    localStorage.removeItem('API_Token')
    localStorage.removeItem('API_Code')
    void_goLoginPage();
    // var URL = 'https://iam.china-airlines.com/pkmslogout'
    // window.location.href = URL;
}