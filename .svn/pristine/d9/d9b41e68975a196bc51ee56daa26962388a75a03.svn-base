// JavaScript Document
/*
CIVD for template "sandwich" page
version : 2015/10

before this javascript file, it should be included those files below :

jquery.js
*/





$(document).ready(function () {


	//程式開始
	noteBodySmall();		//偵測手機瑩幕並註記
	
	

	//視窗大小改變時。 When screen resize
	//在使用者端會出現的情況是，改變平板垂直或水平狀態
	$( window ).resize(function() {
		noteBodySmall();
	});
	
	
	

	
	//==========偵測手機瑩幕並註記==========	
	function noteBodySmall(){
		if ($(this).width() < 769) {
			$('body').addClass('body-small');
		} else {
			$('body').removeClass('body-small');
		}
	}
	//==========偵測手機瑩幕並註記 End==========	
  
  
  
  



	//========== offcanvas 開啟收合控制==========
	$('[data-toggle="offcanvas"]').click(function () {
	  $('body').toggleClass('offcanvas-active'); 
	});
	//========== offcanvas 開啟收合控制 end ==========




	
	//==========回頂端 Back to top==========
	/*
	功能
	頁面很長，捲動超過瑩幕範圍時，出現回頁面頂端的連結
	When you scroll a long page, it will show a link to back to top.
	*/
	
	var $back_to_top = $("#back-to-top");
	var $window = $(window);
	
	
	


	//IE6 and 7不支援position:fixed, 所以指定好預設起始位置
	var _btt_default_position = $window.height() - 30 - 35;	//30為BackToTop的高度，35為視窗底部
	
	if( $("html").hasClass("lt-ie8") ){
		$back_to_top.css("bottom", "auto" );
		$back_to_top.css("top", _btt_default_position);		
	}
	
	
	// 當網頁捲軸捲動時
	$window.scroll(function(){

		//如果不是手機瑩幕則會出現back-to-top
		if( !$("body").hasClass("body-small") ){

			//往下捲動 顯示回頁首
			if( $window.scrollTop() > 100 ){
				$back_to_top.css("display","block");
				
				//IE 6 and 7改為absolute, top定位
				if( $("html").hasClass("lt-ie8") ){
					$back_to_top.css("top", _btt_default_position + $window.scrollTop() );
				}
			}
			
			//往上捲動，捲至快頂時 隱藏回頁首
			if( $window.scrollTop() <= 100 ){
				$back_to_top.css("display","none");		
			}
		
		
		}// body-small End
	});	
	//==========回頂端 Back to top   END==========
	
});





//==========設定版面中間區域高度==========
/*
made by CIVD (China Airlines Visual Design team)
version 0.5

目的:
讓三明治樣版在中間區域高度不夠高的情形下，讓頁首頁尾頂天立地
呼叫方式
$(區塊).setLayoutMiddleHeight( 上方總高度， 下方總高度 );
$(element).setLayoutMiddleHeight( topHeight， bottomHeight );

括號內輸入"上方總高度"與"下方總高度"的px值。
為了活用，固定於上方的總高度，或下方的總高度可能因內容多寡而不同，
建議使用jQuery指定好各個高度

呼叫範例
$("#main").setLayoutMiddleHeight(
	$("#header").outerHeight()+$("#main-nav").outerHeight(), 	//上方總高度(header + main-nav)
	$("#footer").outerHeight()									//下方總高度(footer)
);

*/
(function( $ ){

  $.fn.setLayoutMiddleHeight= function( topHeight, bottomHeight ) {

		  var $this   = $(this);
		  
		  //輸入進來的資料:
		  //topHeight		頁首高度
		  //bottomHeight	頁尾高度
		  
		  var middleHeight = 0;
		  var windowHeight = $(window).height();
		  
		  
		  //是否為數字
		  if( isNaN(topHeight) ){
			  //console.log("topHeight不是數字");
			  return;
		  }
		  if( isNaN(bottomHeight) ){
			  //console.log("bottomHeight不是數字");
			  return;
		  }
		  
		  //沒有填寫的話, 當成0px
		  if( typeof topHeight === 'undefined' ){
			  topHeight = 0;
		  }
		  if( typeof topHeight === 'undefined'  ){
			  bottomHeight = 0;
		  }
		  
		  //console.log("windowHeight : " + windowHeight + " topHeight : " + topHeight + " bottomHeight : " + bottomHeight);		
		  middleHeight = windowHeight - topHeight - bottomHeight;
		  
		  //console.log(middleHeight);
		  
		//$this.css("min-height", middleHeight ); 
		//Angular高度處理
	
	  
  };

})(jQuery);
//==========設定版面中間區域高度 End==========

//----------以上是 sandwich 這個版所使用的js----------










//----------以下是內容區會使用的js----------

/*
made by CIVD (China Airlines Visual Design team)
version 0.5

目的:
讓Bootstrap 3的 table 擴充向下支援至IE6(原本基礎最低支援為IE9，優雅降級至IE8)
搭配相對應的CSS樣式，已寫入延伸的Bootstrap檔案中

前置:
html IE condition for <html>
jQuery.js


主要支援 IE6 ~ IE8 的項目:
.table-striped
.table-bordered
.table-condensed

CI Template擴充
.table-style01

於IE6放棄Bootstrap table 的支援項目:
.table-hover	不想讓IE6支援太多導致降低執行速度

*/

(function( $ ){

$.fn.civd_bs3_table= function() {
	return this.each(function() {
		var $this   = $(this);
		
			

		//for under and included IE8
		//IE8 以下
		/**/
		if( $("html").hasClass("lt-ie9") ){
			
			// table-striped 有用到CSS3 nth-of-type(odd) (work in IE9)
			if( $this.hasClass("table-striped") ){				
				$this.children("tbody").children("tr:nth-child(2n+1)").addClass("tr-odd");
			}
			
		}
		/*for IE8 End*/
		
		
		//for IE6
		/**/
		if( $("html").hasClass("lt-ie7") ){
			
			//normal bootstrap table style
			$this.children("thead, tbody, tfoot").children("tr").children("th, td").addClass("t-normal-cell");
				// in thead
			$this.children("thead").children("tr").children("th, td").addClass("t-thead-th");
			
			
			//table-bordered
			if( $this.hasClass("table-bordered") ){
				$this.children("thead, tbody").children("tr").children("th, td").addClass("t-cell-bordered");
			}
			
			//table-condensed
			if( $this.hasClass("table-condensed") ){
				$this.children("thead, tbody").children("tr").children("th, td").addClass("t-cell-condensed");
			}


			//table-style01
			if( $this.hasClass("table-style01") ){
				$this.children("thead").children("tr").children("th, td").addClass("t-table-style01-thead-cell");
			}
			
			
		}	
		/*for IE6 End*/
	
	});
};

})(jQuery);
/**/





