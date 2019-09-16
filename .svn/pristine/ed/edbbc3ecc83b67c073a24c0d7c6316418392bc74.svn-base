// JavaScript Document
/**
輔助用工具小程式

功用 : 樣版三明治頁 - 依內容計算出的主選單尺吋實際尺吋，以方便置中

使用方式
如果將系統選單輸入完成後發現跑版
Step 1: 將此js檔匯入至三明治頁的html
		置於網頁的<head>之內，jQuery.js之後
		<script src="style2015/js/civd2015-tool-tempSandwich-knowMainNavWidth.js"></script>
		
Step 2: 重新整理後在頁面上方會出現提示增加的css樣式， 
		複製，貼上至自訂的css檔案

Step 3: 將html上，此js檔的連結移除

Step 4: 完成，選單應該會置中。


其他應用
如果選單中有某個選項在某些情形下會顯示全部，或是顯示部份。
需要再多寫幾行css

/**/


$(function(){

    var mainNavTotalWidth = 1;		//#main-nav-menu 的右邊有一條線佔1px
    $("#main-nav-menu").children("li").each(function(){
        mainNavTotalWidth = mainNavTotalWidth + $(this).outerWidth();	//計算每一個li的寬度，然後加總
    });

	//這一段html不能斷行，要改的話
    $("body").prepend("<div class='container'><p>三明治頁樣版 依內容計算主選單寬度</p><p>請複製以下樣式到您的自訂css檔案內(custom.css)，讓選單置中不會跑版</p><pre>#main-nav-area &gt; ul{width:"+mainNavTotalWidth+"px;}</pre></div>");



});