$(document).ready(function() {
	initSide();
	initEvent();
    initModal();
    ajax(); //처음 마이페이지 들어왔을 때, 진행중 주문 항목 출력
});
function initEvent() {
	$('.page_next').click(function() {
        if(!$(this).hasClass('no')) {
            pageObj.currentPageNum+=1;
            ajax();
        }
    });
    $('.page_prev').click(function() {
        if(!$(this).hasClass('no')) {
            pageObj.currentPageNum-=1;
            ajax();
        }
    });
    $('.page_prevBlock').click(function() {
        if(!$(this).hasClass('no')) {
            pageObj.currentPageNum=pageObj.blockFirstPageNum-1;
            ajax();
        }
    });
    $('.page_nextBlock').click(function() {
        if(!$(this).hasClass('no')) {
            pageObj.currentPageNum=pageObj.blockLastPageNum+1;
            ajax();
        }
    });
    $('.page_btn').on("click",".page_list",function() {
        if(pageObj.currentPageNum!=JSON.parse($(this).html())) {
            pageObj.currentPageNum=JSON.parse($(this).html());
            ajax();
        }
    });
    $('.searchBox i.fas').click(function() { //검색 실행시
	    pageObj.search=$('.search')[0].value;
        pageObj.searchOption=$('.searchBox select')[0].value;
        pageObj.currentPageNum=1;
        ajax();
    });
    $('.selectbox select').change(function(){
            var select_name = $(this).children('option:selected').text();
            $(this).siblings('label').text(select_name);
            pageObj.order=$('.selectbox select')[0].value;
            pageObj.currentPageNum=1;
            ajax();
    });
    $('.laundry_nav li').click(function() {
        if(!$(this).hasClass('selected')) {
            resetSearch();
            pageObj.laundryType=$(this)[0].value;
            $(this).siblings().removeClass('selected');
            $(this).addClass('selected');
            ajax();
        }
    });
	$('.process').on('click','.cancelBtn',function() {//리스트의 취소 버튼을 누를 때
		rsvObj.rsvNum=JSON.parse($('.processList tr').eq($(this)[0].value).children().eq(1)[0].innerHTML);
        alertObj.addressee=$('.processList tr').eq($(this)[0].value).children()[2].id; //회원번호
        openModal('cancel');
	});
	$('.process').on('click','.completeBtn',function() {//리스트의 완료버튼을 누를 때
		rsvObj.rsvNum=JSON.parse($('.processList tr').eq($(this)[0].value).children().eq(1)[0].innerHTML);
        alertObj.addressee=$('.processList tr').eq($(this)[0].value).children()[2].id; //회원번호
		openModal('complete');
	});
    $("#mask").on("click", function() {  $("#modal_container").hide(); $("#mask").hide();});
    $("#mask").on("click", function() {  $("#modal_userInfo").hide(); $("#mask").hide();});
}
function initModal() {
    /* 모달 생성 */
    $("#modal_close").click(function(){ //모달 X버튼 누를 때
        modalClose();//모달 닫기
    });
    $("#closeBtn").click(function(event){ //모달 돌아가기 누를 때
        event.preventDefault();
        modalClose();//모달 닫기
    });
    $('#ok').click(function() {
        operate();
    });
}
function openModal(button) {
    $("#mask").show();
    $('#modal_container').show();
    if(button=='cancel'){//취소버튼이 눌려서 모달이 열렸다면
        $('#modal_foot p')[0].innerHTML='정말 취소하시겠습니까?';
        $('#ok')[0].innerHTML='취소하기';
    }else{//완료버튼이 눌려서 모달이 열렸다면
        $('#modal_foot p')[0].innerHTML='정말 완료하시겠습니까?';
        $('#ok')[0].innerHTML='완료하기';
    }
}
function operate() {
    if($('#ok')[0].innerHTML=='취소하기'){//버튼이 취소하기라면,
        cancel();
    }else {//버튼이 완료하기라면
        complete();
    }
}
function cancel() {
	$.post({
        url:"/cancel.do",
        data:rsvObj,
        success: function(result) {
            if(result!=''){//JAVA에서 null 반환시 공백으로 전달
                msgSet(result);
                console.log(alertObj+":..알림객체 js 체크");
                sendMsg();
            }
			ajax();
            alert('주문이 정상적으로 취소되었습니다.');
            modalClose();
		}
	});
}
function sendMsg() {
    $.post({
        url:'/regitAlert.do',
        data:alertObj,
        success:function() {
            if(socket){
                var receiver=alertObj.addressee;
                var msg='<li>'+
                            '<div class="msgTop">'+
                                '<a href="/jsp/mypageUser/mypagePs.jsp">['+(alertObj.typenum==3?'완료':'취소')+']⠀'+alertObj.msg+'</a>'+
                            '</div>'+
                            '<div class="msgBottom">'+
                                '<span class="date">'+today()+'</span>'+
                                '<span class="byBs">by '+alertObj.senderName+'</span>'+
                            '</div>'+
                            '<i class="fas fa-times"></i>'+
                        '</li>'
                socket.send(receiver+','+msg);//메시지 보냄
            }
        }
    });
}
function modalClose() {
    $('#modal_container').hide();
    $('#modal_userInfo').hide();
    $("#mask").hide();
}
function complete() {
	$.post({
		url:"/washingDone.do",
		data:rsvObj,
		success: function(result) {
            if(result!=''){//JAVA에서 null 반환시 공백으로 전달
                msgSet(result);
                sendMsg();
            }
			ajax();
            alert('작업이 완료되었습니다.');
            modalClose();
		}
	});
}
function enter() {
    if(window.event.keyCode==13) {
        pageObj.search=$('.search')[0].value;
        pageObj.searchOption=$('.searchBox select')[0].value;
        ajax();
    }
}
function initSide() {
        $('.side_sub')[0].innerHTML=
        '<button onclick="location.href='+"'/jsp/mypageBiz/mpbProg_Num.jsp'"+'">주문번호별</button>'+
        '<button onclick="location.href='+"'/jsp/mypageBiz/mpbProg_Item.jsp'"+'">품목별</button>';
		$('.side_sub').css('display','unset');
		$('.side button').eq(0).addClass("side_select");
		$('.side_sub button').eq(0).addClass("side_sub_select");
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
function ajax() { //ajax로 리스트 받아오기
    console.log('ajax 함수 진입');
    console.log('1번 : '+JSON.stringify(pageObj));
    $.post({
        url:"/getRsvListBs.do",
        data:pageObj,
        success: function(data) {
            console.log('2번 : '+data);
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
function msgSet(result) {
    console.log('메시지 송신 진입');
    if(result=='cancel'){//주문이 취소되었다면
        alertObj.rsvNum=rsvObj.rsvNum;
        alertObj.msg='주문번호'+rsvObj.rsvNum+' 가 취소되었습니다.';
        alertObj.typenum=5;
    }else if(result=='complete'){//주문이 완료되었다면
        alertObj.rsvNum=rsvObj.rsvNum;
        alertObj.msg='주문번호'+rsvObj.rsvNum+'의 세탁이 완료되었습니다.';
        alertObj.typenum=3;
    }else {
        console.log('알림메시지 처리 에러');
    }
}
function today() {
    var date=new Date();
    var mm=date.getMonth()+1;
    var dd=date.getDate();
    var today=date.getFullYear()+'.'+(mm<10?'0'+mm:mm)+'.'+(dd<10?'0'+dd:dd);
    return today;
}
function printHeader(key,value) {
    if($('.selectbox select')[0].value==1) { //정렬이 주문번호 순이라면,
        console.log(value.rsvDate.substr(0,10)+'...날짜를 함 보자!');
        console.log(today()+'...날짜를 또 보자!');
        if(key==0&&value.rsvDate.substr(0,10)==today()){
            $('.process p')[0].innerHTML="오늘 주문";
        }else if(key==0) {
            $('.process p')[0].innerHTML="지난 주문";
        }else if($('.process p')[0].innerHTML=='오늘 주문'&&//첫 번째 라벨이 오늘 주문이라면
                $('.process p')[1]==undefined&&//두 번째 라벨이 없다면
                value.rsvDate.substr(0,10)!=today()) {//날짜가 오늘날짜가 아니라면
            $('.process').append('<p class="processTitle">지난 주문</p>');
        }
    }else { //정렬이 남은일자 순이라면
        if(key==0) {//첫 번째라면
            if(value.dDay<0) {//남은 기한이 음수라면
                $('.process p')[0].innerHTML="기한을 넘긴 주문";
                $('.process p')[0].style.color='red';
            }else if(value.dDay<=3) {//남은 기한이 3이하
                $('.process p')[0].innerHTML="마감이 임박한 주문";
            }else if(value.dDay>3) {//남은 기한이 3초과
                $('.process p')[0].innerHTML='기한이 넉넉한 주문';
            }
        } else if($('.process p')[1]==undefined) {//두 번째 제목이 선정되지 않았다면
            if($('.process p')[0].innerHTML=="기한을 넘긴 주문"){//첫 번째 제목이 기한을 넘긴 주문이라면
                if(value.dDay<=3&&dDay>=0) {
                    $('.process').append('<p class="processTitle">마감이 임박한 주문</p>');
                }else if(value.dDay>3){
                    $('.process').append('<p class="processTitle">기한이 넉넉한 주문</p>');
                }
            } else if($('.process p')[0].innerHTML=="마감이 임박한 주문" //첫 번째 제목이 마감임박 주문이고
                        &&value.dDay>3) { //기한이 3일 초과라면
                    $('.process').append('<p class="processTitle">기한이 넉넉한 주문</p>');
            }
        } else if($('.process p')[2]==undefined) {//3번째 제목이 선정되지 않았다면
            if(value.dDay>3&&$('.process p')[1].innerHTML!='기한이 넉넉한 주문') {
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
            console.log(value.laundryList.length+'...품목길이');
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
                    '<td id="'+value.mno+'"><button class="btn_info" onclick="modal_userInfo('+value.mno+')">'+value.mname+'</td>'+
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
function modal_userInfo(mno){
    $("#mask").show();
    $("#modal_userInfo").show();
    $("#userInfo_bodycont *").remove();
    $.ajax({
        url: '/getuserInfo.do',
        type: 'post',
        data: {
            mno: mno,   
        }, success: function(data){
            let info = JSON.parse(data);
            let address = (info.address).replaceAll(",", " ");
          $("#userInfo_bodycont").append(
              '<table class="userInfo">' +
              '<tr>'+
                    '<th>회원번호</th>' +
                    '<td>'+ info.mno + '</td>' +
                '</tr>' +
                '<tr>'+
                    '<th>이&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;름</th>' +
                    '<td>'+ info.name + '</td>' +
                '</tr>' +
                '<tr>'+
                    '<th>연&nbsp;&nbsp;락&nbsp;&nbsp;처</th>' +
                    '<td>'+ info.phone + '</td>' +
                '</tr>' +
                '<tr>'+
                    '<th>주&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;소</th>' +
                    '<td>'+ address + '</td>' +
                '</tr>' +
              '</table>'
             
          )
        }   

    });
}