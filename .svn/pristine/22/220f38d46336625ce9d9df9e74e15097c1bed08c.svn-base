// JavaScript Document

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

})(jQuery)
/**/