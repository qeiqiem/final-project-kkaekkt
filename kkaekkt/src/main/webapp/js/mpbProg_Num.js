$(document).ready(function() {
	initSide();
	initEvent();
    ajax(pageObj); //처음 마이페이지 들어왔을 때, 진행중 주문 항목 출력
});
function initEvent() {
	$('.page_next').click(function() {
        if(!$(this).hasClass('no')) {
            pageObj.currentPageNum+=1;
            ajax(pageObj);
        }
    });
    $('.page_prev').click(function() {
        if(!$(this).hasClass('no')) {
            pageObj.currentPageNum-=1;
            ajax(pageObj);
        }
    });
    $('.page_prevBlock').click(function() {
        if(!$(this).hasClass('no')) {
            pageObj.currentPageNum=pageObj.blockFirstPageNum-1;
            ajax(pageObj);
        }
    });
    $('.page_nextBlock').click(function() {
        if(!$(this).hasClass('no')) {
            pageObj.currentPageNum=pageObj.blockLastPageNum+1;
            ajax(pageObj);
        }
    });
    $('.page_btn').on("click",".page_list",function() {
        if(pageObj.currentPageNum!=JSON.parse($(this).html())) {
            pageObj.currentPageNum=JSON.parse($(this).html());
            ajax(pageObj);
        }
    });
    $('.searchBox i.fas').click(function() { //검색 실행시
	    pageObj.search=$('.search')[0].value;
        pageObj.searchOption=$('.searchBox select')[0].value;
        pageObj.currentPageNum=1;
        ajax(pageObj);
    });
    $('.selectbox select').change(function(){
            var select_name = $(this).children('option:selected').text();
            $(this).siblings('label').text(select_name);
            pageObj.order=$('.selectbox select')[0].value;
            pageObj.currentPageNum=1;
            ajax(pageObj);
    });
    $('.laundry_nav li').click(function() {
        if(!$(this).hasClass('selected')) {
            resetSearch();
            pageObj.laundryType=$(this)[0].value;
            $(this).siblings().removeClass('selected');
            $(this).addClass('selected');
            ajax(pageObj);
        }
    });
	$('.process').on('click','.cancelBtn',function() {
		rsvObj.rsvNum=JSON.parse($('.processList tr').eq($(this)[0].value).children().eq(1)[0].innerHTML);
		cancel(rsvObj);
	});
	$('.process').on('click','.completeBtn',function() {
		rsvObj.rsvNum=JSON.parse($('.processList tr').eq($(this)[0].value).children().eq(1)[0].innerHTML);
		complete(rsvObj);
	});
}
function cancel(rsvObj) {
	$.post({
        url:"/cancel.do",
        data:rsvObj,
        success: function(data) {
			ajax(pageObj);
		}
	});
}
function complete(rsvObj) {
	$.post({
		url:"/complete.do",
		data:rsvObj,
		success: function(data) {
			ajax(pageObj);
		}
	});
}
function enter() {
    if(window.event.keyCode==13) {
        pageObj.search=$('.search')[0].value;
        pageObj.searchOption=$('.searchBox select')[0].value;
        ajax(pageObj);
    }
}
function initSide() {
        $('.side_sub')[0].innerHTML=
        '<button onclick="location.href='+"'/jsp/mypageBiz/mpbProg_Item.jsp'"+'">품목별</button>'+
        '<button onclick="location.href='+"'/jsp/mypageBiz/mpbProg_Num.jsp'"+'">주문번호별</button>';
		$('.side_sub').css('display','unset');
		$('.side button').eq(0).addClass("side_select");
		$('.side_sub button').eq(1).addClass("side_sub_select");
}
function initPageBtn() {
    if(pageObj.isNextExist) {
        $('.page_next').removeClass('no');
    }else {
        $('.page_next').addClass('no');
    }
    if(pageObj.isNextBlockExist) {
        $('.page_nextBlock').removeClass('no');
    }else {
        $('.page_nextBlock').addClass('no');
    }
    if(pageObj.isPrevExist) {
        $('.page_prev').removeClass('no');
    }else {
        $('.page_prev').addClass('no');
    }
    if(pageObj.isPrevBlockExist) {
        $('.page_prevBlock').removeClass('no');
    }else {
        $('.page_prevBlock').addClass('no');
    }
    $('.page_btn .page_list').remove(); //페이지 리스트 초기화
    for(var i=pageObj.blockLastPageNum;i>=pageObj.blockFirstPageNum;i--) {
        if(i==pageObj.currentPageNum) {
            $("<li class='page_list curPage'>"+i+"</li>").insertAfter($('.page_prev')).trigger("create");
        } else {
            $("<li class='page_list'>"+i+"</li>").insertAfter($('.page_prev'));
        }
    }
}
function initPageObj(data) {
    pageObj.blockLastPageNum=data.blockLastPageNum;
    pageObj.blockFirstPageNum=data.blockFirstPageNum;
    pageObj.isNextBlockExist=data.isNextBlockExist;
    pageObj.isNextExist=data.isNextExist;
    pageObj.isPrevBlockExist=data.isPrevBlockExist;
    pageObj.isPrevExist=data.isPrevExist;
}
function ajax(pageObj) { //ajax로 리스트 받아오기
    console.log('ajax 함수 진입');
    $.post({
        url:"/getRsvListBs.do",
        data:pageObj,
        success: function(data) {
            var rsv=JSON.parse(data);
            $('.content_header p:nth-child(1) span').html(rsv.totalPostCount);
            var list=rsv.rsvListRno;
            printlist(list);
            initPageObj(rsv);
            initPageBtn();
            console.log('ajax 완료');
        }
    });
}
function toDay() {
    var date=new Date();
    var mm=date.getMonth()+1;
    var dd=date.getDate();
    var today=mm+'월 '+dd+', '+date.getFullYear();
    return today;
}
function printHeader(key,value) {
    if($('.selectbox select')[0].value==1) { //정렬이 주문번호 순이라면,
        if(key==0&&value.rsvDate==toDay()){
            $('.process p')[0].innerHTML="오늘 주문";
        }else if(key==0) {
            $('.process p')[0].innerHTML="지난 주문";
        }else if($('.process p')[0].innerHTML=='오늘 주문'&&//첫 번째 라벨이 오늘 주문이라면
                $('.process p')[1]==undefined&&//두 번째 라벨이 없다면
                value.rsvDate!=toDay()) {//날짜가 오늘날짜가 아니라면
            $('.process').append('<p class="processTitle">지난 주문</p>');
        }
    }else { //정렬이 남은일자 순이라면
        if(key==0) {//첫 번째라면
            if(value.dDay<0) {//남은 기한이 음수라면
                $('.process p')[0].innerHTML="기한을 넘긴 주문";
                $('.process p')[0].style.color='red';
            }else if(value.dDay<3) {//남은 기한이 3미만
                $('.process p')[0].innerHTML="마감이 임박한 주문";
            }else if(value.dDay>=3) {//남은 기한이 3이상
                $('.process p')[0].innerHTML='기한이 넉넉한 주문';
            }
        } else if($('.process p')[1]==undefined) {//두 번째 제목이 선정되지 않았다면
            if($('.process p')[0].innerHTML=="기한을 넘긴 주문"){//첫 번째 제목이 기한을 넘긴 주문이라면
                if(value.dDay<3&&dDay>=0) {
                    $('.process').append('<p class="processTitle">마감이 임박한 주문</p>');
                }else if(value.dDay>=3){
                    $('.process').append('<p class="processTitle">기한이 넉넉한 주문</p>');
                }
            } else if($('.process p')[0].innerHTML=="마감이 임박한 주문" //첫 번째 제목이 마감임박 주문이고
                        &&value.dDay>=3) { //기한이 3일 이상이라면
                    $('.process').append('<p class="processTitle">기한이 넉넉한 주문</p>');
            }
        } else if($('.process p')[2]==undefined) {//3번째 제목이 선정되지 않았다면
            if(value.dDay>=3&&$('.process p')[1].innerHTML!='기한이 넉넉한 주문') {
                $('.process').append('<p class="processTitle">기한이 넉넉한 주문</p>');
            }
        }
    }
}

function printlist(list) {
    $('.processList').remove();
    $('.processTitle').remove();
    $('.order p')[0].style.color=null;
    $.each(list, function(key,value) {
        printHeader(key,value);
        var laundry="";
        var count="";
        var price="";
        var state="";
        $.each(value.laundryList,function(idx,val) {
            laundry+=val.laundry;
            count+=val.count;
            price+=val.price;
            state+=val.state;
            if(value.laundryList.length!=idx+1) { //마지막이 아니라면 <br>붙이기
                laundry+='<br>';
                count+='<br>';
                price+='<br>';
                state+='<br>';
            }
        });
        $('.process').append(
            '<table class="processList">' +
                '<tr>' +
                    '<td>'+value.rsvDate+'</td>'+
                    '<td>'+value.rsvNum+'</td>'+
                    '<td>'+value.mname+'</td>'+
                    '<td>'+laundry+'</td>'+
                    '<td>'+count+'</td>'+
                    '<td>'+price+'</td>'+
                    '<td>'+state+'</td>'+
                    (value.dDay<0?
                    '<td style="color:red;">D+'+value.dDay*-1+'</td>'
                    :'<td>D'+value.dDay*-1+'</td>')+
                    '<td><div><button class="cancelBtn" value='+key+'>취소하기</button>'+
					'<button class="completeBtn" value='+key+'>작업완료</button></div></td>'+
                '</tr>'+
            '</table>'
        );
    });
}