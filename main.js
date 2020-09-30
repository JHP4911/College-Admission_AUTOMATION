const puppeteer = require("puppeteer");
let fs = require("fs");
let xlsx = require("xlsx");

let links=[];

(async function(){
    try{
   let browser =  await puppeteer.launch({
       headless: false,
       defaultViewport: null,
         slowMo: 70,
       args: ["--start-maximized"],
     });
   let allPages = await browser.pages();
   let page = allPages[0];
   await page.goto("https://collegedunia.com/");
   await page.waitForSelector(".cd-nav-menu-links.js-cd-nav-menu-links");
  let btech = await page.$(".cd-nav-menu-links.js-cd-nav-menu-links");
   let link = await page.evaluate(function(elem){
     return elem.getAttribute("href");
   } , btech);
 await page.goto(link);
 await page.waitForSelector('.state_filter_omni.listing_tags a[data-value="10"]');
  await Promise.all([page.click('.state_filter_omni.listing_tags a[data-value="10"]'), page.waitForNavigation({waitUntil:"networkidle0"})]);
 await page.click("#popularity_desc");
 await page.waitForSelector(".col-sm-4.automate_client_img_snippet img");
 let cname =  await page.$$(".col-sm-4.automate_client_img_snippet img");
 let clink =  await page.$$(".col-sm-4.automate_client_img_snippet");
 for(let i = 0; i<clink.length; i++ ){
   let name = await page.evaluate(function(elem){
     return elem.getAttribute("title");

   },cname[2*i] );
   console.log(name);
   let atag = await clink[i].$("a");
   let link = await page.evaluate(function(elem){
     return elem.getAttribute("href");
   } , atag);
   console.log(link);

   let element = {
     Name: name,
     Link: link

   };
links.push(element);
 }
 links = JSON.stringify(links);
 fs.writeFileSync("collegedetails.json" ,links);
 links = JSON.parse(links);

let workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook,xlsx.utils.json_to_sheet(links));
xlsx.writeFileSync(workbook,"details.xlsx");



}catch(err){
    console.log(err);
  }
 })();

