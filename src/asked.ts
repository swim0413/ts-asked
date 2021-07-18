import fetch from 'node-fetch';

const postUrl: string = 'https://asked.kr/query.php?query=0';

export async function ask(id: string, question: any){
    const params = new URLSearchParams();
    params.append("id", id);
    params.append("content", question);
    params.append("makarong_bat", "-1");
    params.append("show_user", "0");
    await fetch(postUrl, {
        method: 'POST',
        body: params
    })
}

export function askSync(id: string, question: any){
    const params = new URLSearchParams();
    params.append("id", id);
    params.append("content", question);
    params.append("makarong_bat", "-1");
    params.append("show_user", "0");
    fetch(postUrl, {
        method: 'POST',
        body: params
    })
}