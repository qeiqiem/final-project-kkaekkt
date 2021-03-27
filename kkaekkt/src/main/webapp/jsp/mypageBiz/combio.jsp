<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://kit.fontawesome.com/415f6f6023.js" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
        <link rel="stylesheet" href="/css/combio.css">
        

    </head>

    <body>
        <jsp:include page="/jsp/header2.jsp"></jsp:include>
        <div class="body_container">
            <jsp:include page="sidebar_bs.jsp"></jsp:include>
            <div class="content">
                <div id="combio_title">
                    <ul>
                        <li>
                            <span id="name" readonly>홍길동</span>님 반갑습니다.
                        </li>
                        <li id="title_right">
                            찜<span id="likeNum">140</span>명/ 내 평점<span id="avglike">4.7</span> <i class="fas fa-star"></i>
                        </li>
                    </ul>
                </div>
                <hr>
                <form action="" method="POST" name="mybio" onsubmit="return submitCombio();">
                    <div id="bizform">
                    <div class="bizinfo">
                        업체정보
                        <hr>
                        <table>
                            <tr>
                                <td>업체명</td>
                                <td>사업자등록번호</td>
                                <td>계좌번호</td>
                            </tr>
                            <tr>
                                <td>세탁소</td>
                                <td>111-1111-1111</td>
                                <td>
                                    <select id="bankNum">
                                        <option>국민</option>
                                        <option>우리</option>
                                        <option>신한</option>
                                        <option>하나</option>
                                        <option>지역농협</option>
                                        <option>농협중앙회</option>
                                        <option>k뱅크</option>
                                        <option>카카오뱅크</option>
                                    </select>
                                    <input type="text" id="bankAccNum" placeholder="123-1263-1225-11">

                                </td>
                            </tr>
                        </table>
                    </div>   
                    <div class="bizMemberInfo">
                            가입정보
                            <hr>
                                <div class="bioleft">
                                    <table>
                                        <tr>
                                            <td>아이디</td>
                                            <td><input type="text" name="id" readonly></td>
                                        </tr>
                                        <tr>
                                            <td>비밀번호</td>
                                            <td>
                                                <input name="password" type="password" id="curpwd"> 
                                                <button type="button" id="btn_checkpwd">수 정</button>
                                                <label id="checkpwd"></label>
                                            </td>
                                        </tr>
                                        <br>
                                        <tr>
                                            <td> 새 비밀번호</td>
                                            <td><input type="password" id="pwd"><label id="checkval"></label></td>
                                        </tr>
                                        <tr>
                                            <td>새 비밀번호 확인</td>
                                            <td><input type="password" id="newpwd"> 
                                                <button type="button" id="btn_updatepwd">변경하기</button>
                                                <label id="match"></label>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                    
                                <!-- right -->
                                <div class="bioright">
                                    <table>
                                        <tr>
                                            <td>연락처</td>
                                            <td>
                                                <input id="phone1" type='text' pattern="[0-9]+" maxlength='3'> - 
                                                <input id="phone2" type="text" pattern="[0-9]+" maxlength='4'> -
                                                <input id="phone3" type="text" pattern="[0-9]+" maxlength='4'>
                                                <input name="phone" type="tel" id="phone" value="" hidden>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>이메일</td>
                                            <td>
                                                <input name="email" type="email" value="" id="email"
                                                    class="mail_input">
                                                <button type="button" id="btn_checkemail" class="mail_check_button">이메일인증</button>
                                                    <label id="checkemail"value=""></label></br>
                                                
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <input class="mail_check_input" id="mail_check_input_box_false" disabled="disabled">
                                                <button type="button" id="mail_check">확인</button>
                                                <span id="reqinput"></span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div id="combioAddress">
                                    주소<br>
                                    <input type="text" id="postcode" placeholder="우편번호">
                                    <button type="button" onclick=execDaumPostcode() id="btn_address">우편번호찾기</button><br>
                                    <input type="text" id="roadAddress" placeholder="도로명주소"><br>
                                    <!-- <span id="guide" style="color:#999;"></span><br> -->
                                    <input type="text" id="detailAddress" placeholder="상세주소">
                                    <input type="text" id="extraAddress" placeholder="참고항목">
                                    <span id="guide" style="color:#999;display:none"></span><br>
                                    <input type="hidden" name="address" id="address" value=""><!--여기에 디비로 보낼 도로명주소+상세주소 해서 보내기-->
                                    <script
                                        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
                                    <script src="/js/adress.js"></script>
                                </div>
                    </div>
                    </div>
                            <br>
                            <div id="btn_update">
                                <button type="button" onclick="" id="updateBio">수정하기</button>
                                <div id="btn_change">
                                    <button type="reset" onclick="" id="resetBio">돌아가기</button>
                                    <button type="button" onclick="" id="submitBio">수정완료</button>
                                </div>
                            </div>
                            <input type="hidden" name="bno" value="" id="bno">
                    
                </form>
            </div>

        </div>
        <script>
            var pageObj={//세션에서 정보를 받아오는건 독립된 js파일에서 불가능, jsp 내에서만 가능하기 때문에 여기서 값을 받아준다.
                bno:'${sessionScope.personBs.bno}',
                bname:'${sessionScope.personBs.bname}',
                bankNum:'${sessionScope.personBs.bankNum}',
                bankAccNum:'${sessionScope.personBs.bankAccountNum}',
                id:'${sessionScope.personBs.id}',
                password:'${sessionScope.personBs.password}',
                phone:'${sessionScope.personBs.phone}',
                email:'${sessionScope.personBs.email}',                
                address:'${sessionScope.personBs.address}',                
                state:'${sessionScope.personBs.state}'

            };
        	
           
</script>
        <script src="/js/combio.js"></script>

    </body>

    </html>