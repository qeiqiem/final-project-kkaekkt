

	/* 실제 사용 이벤트  */
$(document).ready(function(){

    $(document).on('change','.item',function(){
		alert(" 동적 변경 감지");
	})

    var adrress="서울용산"

    //사이드바 이벤트
    $('.foldBtn').click(function(){ $('.foldBtn').toggleClass('expand'); $('.slide').toggleClass('hide'); })

    //키워드 검색
    $('.slide_ul').on("click","#all_search"	, function(){ var item = adrress+"클리닝"; searchMajor(item); viewSearch(item) 
    					$('.single').hide(); $('.list').show();})  
    $('.slide_ul').on("click","#basic_search", function(){ var item = adrress+"세탁소"; searchMajor(item); viewSearch(item) 
    					$('.single').hide(); $('.list').show();})  
    $('.slide_ul').on("click","#coin_search", function(){ var item = adrress+"코인세탁소"; searchMajor(item); viewSearch(item);
    					$('.single').hide(); $('.list').show();})
   
  	//single List 단일 조회시 데이터 처리
    $('table').on("click",".place_body",function(){ 
        
        var s_title = $(this).find('td')  
        var title = s_title[0].innerText
        title = title.substr(2)
        var address = s_title[3].innerHTML
        var phone = s_title[5].innerHTML
        
        $("#s_title").html(title)
        $("#s_address").html(address)
        $("#s_phone").html(phone)
       
        
        

        $('.list').hide()
        $('.single').show() 
     })

})

 //관련 function -----------------------------------------------------------
 //검색결과 보이게하기
 function viewSearch(clone){
    $(".slide_mini").html(clone+"&nbsp&nbsp검색결과")  
}