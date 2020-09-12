const ipc = require('electron').ipcRenderer;

const puppeteer = require('puppeteer');

const in_txt = document.getElementById('in');
const out_txt = document.getElementById('out');

in_txt.focus();

ipc.on('translate-input', async () => {
    await translate();
});

async function translate() {
    in_txt.blur();

    //const url = `https://translate.google.ca/#view=home&op=translate&sl=en&tl=zh-CN&text=${in_txt.value}`; 
    
    const altUrl = ` https://www.google.com/search?q=translate+eng+to+chinese+${in_txt.value}`;

    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto(altUrl);
    
    let html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    //let chineseOnly = html.match(/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/g);
    
    // Function to get the desired tags from the HTML string
    function getTagsFromHTMLString(html, tag) {
        const regex = new RegExp(`<\\s*${tag}\\s*lang="zh-CN"[^>]*>[\\s\\S]+?</\\s*${tag}>`, 'g');
        return html.match(regex);
    }
    
    const spans = getTagsFromHTMLString(html, 'span');

    let noTag = new DOMParser().parseFromString(spans, 'text/html');

    // Weirdest bug - it's null if you enter two things in a row, so this does it twice LOL
    function checkValidity(text) {
        if(text.body.textContent.split(',')[0] == 'null') {
           const again = getTagsFromHTMLString(html, 'span'); 
           text = new DOMParser().parseFromString(again, 'text/html');       
        }
           return text.body.textContent.split(',')[0];
    }
    out_txt.value = checkValidity(noTag);

}


document.body.addEventListener('keypress', (e) => {
    if(e.code == 'Enter') {
        e.preventDefault();
        translate();
    }
    in_txt.focus();
});
