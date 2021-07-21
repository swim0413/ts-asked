# ts-asked
에스크 질문 모듈 (타입스크립트)

# 예시
> ```js
> //example code
> import {asked} from '../src';
> 
> const id: string = 'asdf'; //로그인할 아이디
> const pw: string = 'sadf1234'; //로그인할 비번
> const swim = new asked(id, pw);
> swim.askAll(19, '자동 답변') //(답장할 개수(1개이상 20개이하), '답변')
> swim.reply(1234, '자동 답변'); //(리스트넘버, '답변')
> swim.getQueList(); //최근 질문 20개와 그 질문의 리스트 넘버를 출력
> swim.anonAsk('질문 상대 아이디', '질문') //비동기 ('질문 상대 아이디', '질문 내용') **익명**
> swim.anonAskSync('질문 상대 아이디', '질문') //동기 ('질문 상대 아이디', '질문 내용') **익명**
> swim.ask('질문 상대 아이디', '질문') //비동기 ('질문 상대 아이디', '질문 내용') **익명 아님**
> swim.askSync('질문 상대 아이디', '질문') //동기 ('질문 상대 아이디', '질문 내용') **익명 아님**
> //대부분이 리턴하는게 없고 콘솔로그로 남겨집니다
> ```