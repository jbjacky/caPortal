
/**
 * @todo HtmlDecode -> HtmlEncode
 */
export function void_HtmlEncode(HtmlDecodeString){
    var HtmlEncodeString  = new DOMParser().parseFromString(HtmlDecodeString, "text/html").documentElement.textContent
    return HtmlEncodeString.toString();
}