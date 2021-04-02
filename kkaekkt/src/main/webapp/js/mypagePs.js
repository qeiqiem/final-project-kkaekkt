$(document).ready(function() {
    initSide();
    initEvent();
	initModal();
    initCommObj();
    ajax(pageObj); //처음 마이페이지 들어왔을 때, 진행중 주문 항목 출력
});
function initEvent() {
	var idx;
    $('.rsvList').on("click",".detailBtn",function() { // 버블링으로 생성된 주문에 클릭 이벤트 활성화
		idx=$(this).val();
        if(!$('.comments').eq(idx).hasClass('none')){ //만약, 상세보기가 열려있다면
            $('.comments').eq(idx).addClass('none');
        }
        $('.detail').eq(idx).toggleClass('none');
    });
    $('.rsvList').on("click",".commentBtn",function() {
        commObj.rsvNum=Number($('#rsvNum'+$(this).val())[0].innerHTML);
        commObj.bno=Number($(this).val());
        $("#modal_container").show();
    });
    $('.rsvList').on("click",".cancelBtn",function() {        
        var rsvNum=Number($('#rsvNum'+$(this).val())[0].innerHTML);
        alertObj.addressee=Number($('.mno').eq($(this).val()).attr('id').substr(3));
        cancelRsv(rsvNum);
    });
    $('.rsvList').on("keyup",".commentBox",function() {
		idx=Number($(this).attr("id").substr(2,3));
        if($(this).val().length>=300) {
            alert("300자 까지 입력할 수 있습니다.");
            $(this)[0].value=$(this).val().substr(0,300);
        }
        $('.comments_bottom span')[0].innerHTML=$(this).val().length+' / 300';
    });
    $(".rsvList").on("click",".comments_bottom button",function(){ 
        idx=$(this).val();
        commObj.content=$('.commentBox').eq(0).val();
        var rno=Number($('#rsvNum'+idx)[0].innerHTML);
        commObj.rsvNum=rno;
        edit(idx);
    });
    $('.rsvList').on("click",".reviewBtn",function() {
        idx=$(this).val();
        $('.commBox').eq(idx).toggleClass('none');
    });
    $('.rsvList').on("click",".cancel",function() {
        idx=$(this).val();
        $('.comments').remove();
        $('.comments_view').eq(idx).removeClass('none');
    });
    $('.side_sub button').click(function() { // 완료된 주문 출력
        if($(this).index()==0){ //진행중인 주문
            pageObj.state=1;
            pageObj.currentPageNum=1;
            ajax(pageObj);
        }else{ //완료된 주문
            pageObj.currentPageNum=1;
            pageObj.state=3;
            ajax(pageObj);
        }
    });
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
    $('.rsvList').on('click','i.fa-heart',function() {
        likeObj.bno=Number($(this).attr('value'));
        console.log(likeObj.bno+'..업체번호');
        if($(this).hasClass('fas')) {
            $(this).removeClass('fas');
            $(this).addClass('far');
            likeOff(likeObj);
        }else {
            $(this).addClass('fas');
            $(this).removeClass('far');
            likeOn(likeObj);
        }
    });
    $('.rsvList').on("click",".dotBtn",function() {
        $(this).siblings().eq(1).toggleClass('none');
    });
    $('.rsvList').on("click",".popMenu button",function() {
        var idx=$(this).val();
        $('.popMenu').addClass('none');
            commObj.rsvNum=JSON.parse($('#rsvNum'+$(this).val())[0].innerHTML);
        if($(this).index()==0) {
            commObj.content=$('.comments_content')[idx].innerHTML;
            editBtn(idx);
        }else {
            deleteComm(idx);
        }
    });
}
function cancelRsv(rsvNum) {
    $.post({
        url:"/cancel.do",
        data:{rsvNum:rsvNum},
        success:function(result) {
            if(result!=''){//JAVA에서 null 반환시 공백으로 전달
                msgSet(rsvNum);
                sendMsg();
            }
            ajax(pageObj);//초기화
        }
    });
}
function today() {
    var date=new Date();
    var mm=date.getMonth()+1;
    var dd=date.getDate();
    var today=date.getFullYear()+'.'+(mm<10?'0'+mm:mm)+'.'+dd;
    return today;
}
function msgSet(rsvNum) {
    alertObj.rsvNum=rsvNum;
    alertObj.typenum=5;
    alertObj.msg='주문번호'+rsvNum+' 가 취소되었습니다.'
}
function sendMsg() {
    $.post({
        url:'/regitAlert.do',
        data:alertObj,
        success:function(ano) {
            if(socket){
                var receiver=alertObj.addressee;
                var msg='<li class="alertLi'+ano+'"><div>'+
                                '<span class="msgHeader">[취소]</span>⠀<span class="msgBody" id="msg'+ano+'">'+alertObj.msg+'</span>'+
                            '</div>'+
                            '<div>'+
                                '<span class="byBs">by '+username+' </span><span>⠀|⠀</span>'+
                                '<span class="alertDate">'+today()+'</span>'+
                            '</div>'+
                            '<i id="del'+ano+'"class="fas fa-times"></i>'+
                        '</li>'
                socket.send(receiver+','+msg);//메시지 보냄
            }
        }
    });
}
function likeOff() {
    $.post({
        url:"/likeOff.do",
        data:likeObj,
        success:function() {
        	ajax(pageObj);
            delete likeObj.bno;//초기화
        }
    });
}
function likeOn() {
    $.post({
        url:"/likeOn.do",
        data:likeObj,
        success:function() {
        	ajax(pageObj);
            delete likeObj.bno;//초기화
        }
    });
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
    initPageBtn();
}
function ajax(pageObj) { //ajax로 리스트 받아오기
    console.log('ajax 함수 진입');
    $.post({
        url:"/getRsvListPs.do",
        data:pageObj,
        success: function(data) {
            var rsv=JSON.parse(data);
            var list=rsv.rsvListRno;
            initPageObj(rsv);
            printlist(list);
            console.log('ajax 완료');
        }
    });
}
function initSide() {
    $('.side_sub').css('display','unset');
    $('.side button').eq(0).addClass("side_select");
    $('.side_sub button').eq(0).addClass("side_sub_select");

    $('.side_sub button').click(function(){
        $(this).addClass("side_sub_select");
        $(this).siblings().removeClass("side_sub_select");
    });
}
function initModal() {
    /* 모달 생성 */
    $('#review_text').keyup(function() {
        $('#review_texter').html($(this).val().length)
    });
    $("#modal_close").click(function(){
        closeModal();
    });
    $("#closeBtn").click(function(event){ //모달 닫기
        event.preventDefault();
        closeModal();
    });
    /* 평점 받기 */
    $(".rating__input").click(function(){ 
        var starVal = $(this).attr('value'); 
        $("#starVal").val(starVal);
    });
    $('#regit').click(function(event) {
        event.preventDefault();
        regit();
    });
}
function initCommObj() {
    commObj.mno=pageObj.mno;
    commObj.depth=0;
    commObj.mname=pageObj.mname;
}
function closeModal() {
    $('#review_text').val('');
    $("#modal_container").hide(); 
}
function regit() {
    commObj.eval=$('#starVal').val();
    commObj.content=$('#review_text').val();
    $.post({
        url:'/regitComm.do',
        data:commObj,
        success:function() {
            alert("리뷰가 정상적으로 등록되었습니다.");
            closeModal();
            viewChange();
        }
    });
}
function printDate() {
    let today = new Date();   
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    return month+'월 '+date+', '+year;
}
function viewChange() {
    var reviewBtn=$('.btnDiv button:nth-child(3)');
    for(var i=0;i<$('.rsvBox').length;i++) {
        if(JSON.parse($('#rsvNum'+i)[0].innerHTML)==commObj.rsvNum) {
            reviewBtn.eq(i).removeClass('commentBtn');
            reviewBtn.eq(i).addClass('reviewBtn');
            reviewBtn[i].innerHTML='리뷰보기';
            $('.commBox')[i].innerHTML=printComment(commObj.mname,commObj.mno,commObj.content,printDate(),i);
        }
    }
}
function printEditBox(idx) {
    return '<div class="comments">'+
                '<div class="comments_header">'+
                    '<button class="cancel" value='+idx+'>취소</button>'+
                '</div>'+
                '<textarea class="commentBox" id="ta'+idx+'" cols="30" rows="3">'+commObj.content+'</textarea>'+
                '<label class="writer">'+commObj.mname+'</label>  '+
                '<div class="comments_bottom">'+
                    '<span>0 / 300</span>'+
                    '<button value='+idx+'>등록</button>'+
                '</div>'+
            '</div>'
}
function editBtn(idx) {
    $('.comments_view').eq(idx).addClass('none');
    $('.commBox').eq(idx).prepend(printEditBox(idx));
}
function edit(idx) {
    $.post({
        url:'/updateComm.do',
        data:commObj,
        success:function() {
            alert('수정이 완료되었습니다.');
            $('.comments').remove();
            $('.comments_content')[idx].innerHTML=commObj.content;
            $('.comments_view').eq(idx).removeClass('none');
        }
    });
}
function deleteComm(idx) {
    if($('.commBox').eq(idx).children()[1]==undefined){//답글이 없을 때
        $.post({
            url:'/deleteCommAb.do',
            data:commObj,
            success:function() {
                commBtn=$('.btnDiv button:nth-child(3)');
                alert('삭제가 완료되었습니다.');
                $('.commBox').eq(idx).children().remove();
                commBtn.eq(idx).addClass('commentBtn');
                commBtn.eq(idx).removeClass('reviewBtn');
                commBtn[idx].innerHTML='리뷰쓰기';
            }
        });
    }else {//답글이 있을 때
        commObj.content='삭제된 리뷰입니다.';
        commObj.mno=1;//고스트계정(이름=알수없음)
        $.post({
            url:'/deleteCommCh.do',
            data:commObj,
            success:function() {
                alert('삭제가 완료되었습니다.');
                $('.commBox').eq(idx).children().remove();
                $('.reviewBtn').eq(idx).attr("disabled",true);
                initCommObj();
            }
        });
    }
}
function printComment(name,no,content,date,idx) {
    return '<div class="comments_view">'+
                    '<div class="comments_writer">'+
                        '<p class="mname">'+name+'<span class="userNum">#'+no+'</span></p>'+
                        '<div class="dotBtn"></div>'+
                        '<div class="popMenu none">'+
                            '<button value='+idx+'>수정</button>'+
                            '<button value='+idx+'>삭제</button>'+
                        '</div>'+
                    '</div>'+
                    '<div class="comments_content">'+content+'</div>'+
                    '<div class="commRdate">'+date+'</div>'+
                '</div>'
}
function printReply(name,no,content,date) {
    return '<div class="comments_reply">'+
            '<span>┗</span>'+
                '<div class="comments_reply_inner">'+
                    '<div class="comments_reply_writer">'+
                        '<p>'+name+'<span class="userNum">#'+no+'</span></p>'+
                    '</div>'+
                    '<div class="comments_reply_content">'+content+'</div>'+
                    '<div class="commRdate">'+date+'</div>'+
                '</div>'+
            '</div>'
}
function printlist(list) {
    var price;
    var totalPrice=0;
    var btnText;
    var btnClass;
    if(list[0].state=='세탁 중') {
		$('.content_header')[0].innerHTML='진행중 주문';
    } else {
		$('.content_header')[0].innerHTML='완료된 주문';
    }
    $('.rsvList').children().remove();
    $.each(list, function(key,value) {
        if(list[0].state=='세탁 중'){
            btnText='주문취소';
            btnClass='cancelBtn';
        }else if(value.commList.length>0){
            btnText='리뷰보기';
            btnClass="reviewBtn";
            var comm=value.commList;
        } else {
            btnText='리뷰쓰기';
            btnClass='commentBtn';
        }
        $('.rsvList').append(
            '<div class="rsvBox" id=rsvBox"'+value.rsvNum+'">' +
                '<table class="rsvTable">'+
                    '<tr>'+
                    '<th colspan="2" class="mno" id="mno'+value.mno+'">'+value.bname+'</th>'+
                        '<td><i class="'+(value.like==1?'fas':'far')+' fa-heart like" value='+value.bno+'></i></td>'+
                    '</tr>'+
                    '<tr>' +
                        '<td class="column">주문일시</td>' +
                        '<td>'+value.rsvDate+'</td>' +
                    '</tr>'+
                    '<tr>'+
                        '<td class="column">예약번호</td>'+
                        '<td id="rsvNum'+key+'">'+value.rsvNum+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="column">전화번호</td>'+
                        '<td>'+value.phone+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="column">주문항목</td>'+
                        '<td><span>'+value.laundryList[0].laundry+'</span> 외 <span>'+(value.laundryList.length-1)+'</span>개</td>'+
                    '</tr>'+
                '</table>'+
                '<div class="btnDiv">'+
                    '<button>채팅상담</button>'+
                    '<button class="detailBtn" value="'+key+'">상세보기</button>'+
                    (btnText!='리뷰보기'?(value.timeOut==0?'<button disabled>':'<button class="'+btnClass+'" value='+key+'>')// if 리뷰가 없으면 -> 7일이 지났으면 비활성화 아니면 활성화
                    :(comm[0].content=='삭제된 리뷰입니다.'?'<button disabled>':'<button class="'+btnClass+'" value='+key+'>')// else 삭제된 ~ 이면 비활성화 아니면 활성화
                    )+btnText+'</button>'+
                '</div>'+
                '<div class="detail none" id="detail'+key+'">'+
                    '<hr>'+
                    '<div1-1>'+
                        '<table class="receipt" id="receipt'+key+'">'+
                            '<tr class="column">'+
                                '<th class="laundry">품목</th>'+
                                '<th class="count">개수</th>'+
                                '<th class="price">가격</th>'+
                            '</tr>'+
                        '</table>'+
                        '<hr>'+
                        '<table class="result">'+
                            '<th>결제금액</th>'+
                            '<td>&nbsp;&nbsp;</td>'+
                            '<td><span id="totalPrice'+key+'"></span> 원</td>'+
                        '</table>'+
                    '</div1-1>'+
                '</div>'+
                '<div class="commBox none">'+
                    (value.commList.length==0?''://댓글이 없다면 공백, 아니라면 댓글 추가
                    printComment(comm[0].mname,comm[0].mno,comm[0].content,comm[0].rdate,key))+
                    (value.commList.length<2?'':
                    printReply(comm[1].bname,comm[1].bno,comm[1].content,comm[1].rdate))+
                '</div>'+
            '</div>')+
        '</div>'
    });
    for(var i=0;i<list.length;i++) {//각 주문 별 상세 물품 목록 붙이기
        totalPrice=0;//초기화
        $.each(list[i].laundryList,function(idx,value) {
            price=value.count*value.price;
            totalPrice+=price;
            $('#receipt'+i).append(
                '<tr>'+
                    '<td class="laundry">'+value.laundry+'</td>'+
                    '<td class="count">'+value.count+'개</td>'+
                    '<td class="price">'+price+'</td>'+
                '</tr>'
            );
        });
        $('#totalPrice'+i)[0].innerHTML=totalPrice;
    }
}