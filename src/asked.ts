import fetch from 'node-fetch';
import cheerio from 'cheerio';

type pVo = Promise<void>;

class asked{
    constructor(public id: string, public pw: string){}    //로그인할 계정의 아이디와 비번

    /**
     * 로그인 하여 쿠키를 반환
     * @returns 초코가 99% 첨가된 쿠키
     */
    async login(): Promise<string>{
        const params = new URLSearchParams();
        params.append('id', this.id);
        params.append('pw', this.pw);
        let res = await fetch('https://asked.kr/login.php', {
            method: 'POST',
            body: params
        });
        return res.headers.get('set-cookie');
    }

    /**
     * 질문의 리스트 넘버로 답장
     * @param index 리스트넘버
     * @param res 답장
     */
    async reply(index: number, res: any): pVo{
        const params = new URLSearchParams();
        params.append('id', this.id);
        params.append('content', res);
        params.append('listnum', index.toString());
        await fetch(`https://asked.kr/query.php?query=${query.REPLY}`, {
            method: 'POST',
            body: params,
            headers: {
                cookie: (await this.login()).toString()
            }
        });
    }

    /**
     * 질문온것을 20개 까지 리스트 넘버와 함께 가져옴(한페이지당 최대 20개)
     * @param page 페이지
     */
    async getQueList(page: number): pVo{
        let html = await fetch(`https://asked.kr/query.php?query=${query.GETQUE}&page=${page}&id=${this.id}`, {
            method: 'POST',
            headers: {
                cookie: (await this.login()).toString()
            }
        }).then(res=>res.text());
        let $ = cheerio.load(html);
        let resp = '';
        for(let i=0; i<20; i++){
            let list = $('div.card_ask')[i];
            let listnum = $('input[name=listnum]')[i];
            resp += i+1+'.'+' question: '+list['children'][0].data.trim()+'\nlist id: '+listnum['parent']['attribs'].id+'\n\n';
        }
        console.log(resp);
    }

    /**
     * 익명으로 동기 질문
     * @param id 아이디
     * @param question 질문
     * @param show 공개여부
     */
    anonAskSync(id: string, question: any, show: boolean): void{
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('content', question);
        params.append('makarong_bat', '-1');
        params.append('show_user', show+'');
        if(this.isUser(id)){
            fetch(`https://asked.kr/query.php?query=${query.ASK}`, {
                    method: 'POST',
                    body: params
            });
            console.log(`success!\nid: ${id}\nquestion: ${question}`);
        }else{
            console.log('없는 유저거나 삭제된 유저 입니다.');
        }
    }

    /**
     * 익명으로 비동기 질문
     * @param id 아이디
     * @param question 질문
     * @param show 공개여부
     */
    async anonAsk(id: string, question: any, show: boolean): pVo{
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('content', question);
        params.append('makarong_bat', '-1');
        params.append('show_user', show+'');
        if(await this.isUser(id)){
            await fetch(`https://asked.kr/query.php?query=${query.ASK}`, {
                method: 'POST',
                body: params
            });
            console.log(`success!\nid: ${id}\nquestion: ${question}`);
        }else{
            console.log('없는 유저거나 삭제된 유저 입니다.');
        }
        
    }

    /**
     * 로그인된 아이디로 비동기 질문 =>즉 익명 아님
     * @param id 아이디
     * @param question 질문
     * @param show 공개여부
     */
    askSync(id: string, question: any, show: boolean): void{
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('content', question);
        params.append('makarong_bat', '-1');
        params.append('show_user', show+'');
        if(this.isUser(id)){
            fetch(`https://asked.kr/query.php?query=${query.ASK}`, {
                method: 'POST',
                body: params,
                headers: {
                    cookie: (this.login()).toString()
                }
            });
            console.log(`success!\nid: ${id}\nquestion: ${question}`);
        }else{
            console.log('없는 유저거나 삭제된 유저 입니다.');
        }
    }

    /**
     * 로그인된 아이디로 동기 질문 =>즉 익명 아님
     * @param id 아이디
     * @param question 질문
     * @param show 공개여부
     */
    async ask(id: string, question: any, show:boolean): pVo{
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('content', question);
        params.append('makarong_bat', '-1');
        params.append('show_user', show+'');
        if(await this.isUser(id)){
            await fetch(`https://asked.kr/query.php?query=${query.ASK}`, {
                method: 'POST',
                body: params,
                headers: {
                    cookie: (await this.login()).toString()
                }
            });
            console.log(`success!\nid: ${id}\nquestion: ${question}`);
        }else{
            console.log('없는 유저거나 삭제된 유저 입니다.');
        }
    }

    /**
     * 아이디의 유저가 존제하는지 확인 => 존재하면 true 반환, 존재하지 않거나 삭제된 유저면 false 반환
     * @param id 아이디
     * @returns Boolean
     */
    async isUser(id: string): Promise<boolean>{
        let ht = await fetch(`https://asked.kr/${id}`).then(res=>res.text());
        let len = cheerio.load(ht).html().length;
        return len < 200? false:true;
    }
    
    /**
     * 1개 이상 20개 이하 질문을 한꺼번에 답변가능(왠지는 모르는데 for문으로 안하는걸 추천(안됨))
     * @param num 갯수
     * @param res 답변
     */
    async askAll(num: number,res: any): pVo{
        if(num>=1 && num<=20){
            let html = await fetch(`https://asked.kr/query.php?query=${query.ASK}&page=0&id=${this.id}`, {
                method: 'POST',
                headers: {
                    cookie: (await this.login()).toString()
                }
            }).then(respo=>respo.text());
            let $ = cheerio.load(html);
            let respArr = [];
            for(let i=0; i<num; i++){
                let listnum = $('input[name=listnum]')[i];
                respArr.push(listnum['parent']['attribs'].id.replace('card_', '').trim());
            }
            for(let i=0; i<respArr.length; i++){
                this.reply(respArr[i], res);
            }
            console.log(`${num}개의 질문에 '${res}' 라고 답변 완료!`);
        }else{
            console.log('20개 초과와 1개 미만은 질문 불가능 입니다!');
        }
    }
}

enum query {
    ASK = 0,
    GETQUE = 2,
    REPLY = 5
}

export {
    asked
}