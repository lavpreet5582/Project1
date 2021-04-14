const fs = require('fs');
const puppy = require('puppeteer');

let finaldata =[];
let username = process.argv[4];
let id = process.argv[2];
let pass = process.argv[3];
let comment = "Nice Post";
async function instabot(){
    let browser = await puppy.launch({
        headless:false,
        defaultViewport:false
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
    await tab.goto("https://www.instagram.com/");
    await tab.waitForSelector("[name = username]",{visible:true});
    await tab.type("[name = username]",id);
    await tab.type("[name = password]",pass);
    await tab.click("[type='submit']");
    
    
    await tab.waitForSelector(".cmbtv",{visible:true});
    await tab.click(".cmbtv");
    
    await tab.waitForSelector("button.aOOlW.HoLwm",{visible:true});
    await tab.click("button.aOOlW.HoLwm");
    
    await tab.waitForSelector("[placeholder='Search']",{visible:true});
    await tab.type("[placeholder='Search']",username);
   
    await tab.waitForSelector(".-qQT3",{visible:true});
    await tab.click(".-qQT3");
   
    await likecomment(tab);
   
    await posts(tab,{delay:1000});
   
   
    await browser.close();
}
async function posts(tab){
    await tab.waitForSelector(".FFVAD",{visible:true});
    let down =  await tab.$$(".FFVAD");
    let newdata = [];
    for(let i of down){
        let data = await tab.evaluate(function(ele){
            return ele.getAttribute("src");
        },i);
        newdata.push(data);
    }
    for(let i of newdata){
    await tab.goto(i);
    }
    fs.writeFileSync("data.json",JSON.stringify(newdata));
 }
async function likecomment(tab){
    await tab.waitForSelector(".v1Nh3.kIKUG._bz0w a",{visible:true});
    let posturls = await tab.$$(".v1Nh3.kIKUG._bz0w a",{delay:2000});
    let allpromises = []
     for(let i of posturls){
       let urls = await tab.evaluate(function(ele){
            return ele.getAttribute("href");
         },i);
        await allpromises.push("https://www.instagram.com/"+ urls);
    }
    for(i of allpromises){
        await tab.goto(i);
        await tab.waitForSelector("span.fr66n",{visible:true});
        await tab.click("span.fr66n");
        await tab.waitForSelector(".X7cDz",{visible:true});
        await tab.click(".X7cDz");
        await tab.type(".X7cDz",comment);
        await tab.click("button.sqdOP.yWX7d.y3zKF");
    }
    fs.writeFileSync("finaldata.json",JSON.stringify(allpromises));
}

instabot();
