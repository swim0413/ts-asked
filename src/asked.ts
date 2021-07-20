import fetch from 'node-fetch';
import cheerio from 'cheerio';

type pVo = Promise<void>;

export class asked{
    constructor(public id: string, public pw: string){}    //로그인할 계정의 아이디와 비번

    async login(): Promise<string>{      //로그인 하여 쿠키를 반환
        const params = new URLSearchParams();
        params.append('id', this.id);
        params.append('pw', this.pw);
        let res = await fetch('https://asked.kr/login.php', {
            method: 'POST',
            body: params
        });
        return res.headers.get('set-cookie');
    }

    async reply(index: number, res: any): pVo{     //질문의 리스트 넘버로 답장
        const params = new URLSearchParams();
        params.append('id', this.id);
        params.append('content', res);
        params.append('listnum', index.toString());
        await fetch('https://asked.kr/query.php?query=5', {
            method: 'POST',
            body: params,
            headers: {
                cookie: (await this.login()).toString()
            }
        });
    }

    async getQueList(): pVo{     //질문온것을 20개 까지 리스트 넘버와 함께 가져옴(왜인지는 모르겠는데 20개 이상으로 하면 오류가... 내가 잘못한건지?)
        let html = await fetch(`https://asked.kr/query.php?query=2&page=0&id=${this.id}`, {
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

    anonAskSync(id: string, question: any): void{     //익명으로 동기 질문
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('content', question);
        params.append('makarong_bat', '-1');
        params.append('show_user', '0');
        if(this.isUser(id)){
            fetch('https://asked.kr/query.php?query=0', {
                    method: 'POST',
                    body: params
            });
            console.log(`success!\nid: ${id}\nquestion: ${question}`);
        }else{
            console.log('없는 유저거나 삭제된 유저 입니다.');
        }
    }

    async anonAsk(id: string, question: any): pVo{     //익명으로 비동기 질문
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('content', question);
        params.append('makarong_bat', '-1');
        params.append('show_user', '0');
        if(await this.isUser(id)){
            await fetch('https://asked.kr/query.php?query=0', {
                method: 'POST',
                body: params
            });
            console.log(`success!\nid: ${id}\nquestion: ${question}`);
        }else{
            console.log('없는 유저거나 삭제된 유저 입니다.');
        }
        
    }

    askSync(id: string, question: any): void{     //로그인된 아이디로 비동기 질문 =>즉 익명 아님
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('content', question);
        params.append('makarong_bat', '-1');
        params.append('show_user', '1');
        if(this.isUser(id)){
            fetch('https://asked.kr/query.php?query=0', {
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

    async ask(id: string, question: any): pVo{     //로그인된 아이디로 동기 질문 =>즉 익명 아님
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('content', question);
        params.append('makarong_bat', '-1');
        params.append('show_user', '1');
        if(await this.isUser(id)){
            await fetch('https://asked.kr/query.php?query=0', {
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

    async isUser(id: string): Promise<boolean>{     //아이디의 유저가 존제하는지 확인 => 존재하면 true 반환, 존재하지 않거나 삭제된 유저면 false 반환
        let ht = await fetch(`https://asked.kr/${id}`).then(res=>res.text());
        let len = cheerio.load(ht).html().length;
        return len < 200? false:true;
    }

    async askAll(num: number,res: any): pVo{     //1개 이상 20개 이하 질문을 한꺼번에 답변가능(왠지는 모르는데 for문으로 안하는걸 추천(안됨))
        if(num>=1 && num<=20){
            let html = await fetch(`https://asked.kr/query.php?query=2&page=0&id=${this.id}`, {
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