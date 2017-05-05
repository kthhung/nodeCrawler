var request = require('request');
var cheerio = require('cheerio');

var pagesCrawled = {};
var numPagesCrawled = 0;
var pagesToCrawl = [];

var initialPage = "http://www.businessinsider.com/";


pagesToCrawl.push(initialPage);
crawl();

function crawl() {
  if (numPagesCrawled >= 100){
    console.log('Reached maximum number of crawls allowed');
    return;
  }
  var nextPage = pagesToCrawl.pop();
  if (nextPage in pagesCrawled) {
    crawl();
  } else {
    scrape(nextPage, crawl);
  }
}

function scrape(url, callback) {
  pagesCrawled[url] = true;
  numPagesCrawled++;

  console.log('Scraping page: ' + url);
  request(url, function(error, res, body){
    if (error) {
      console.log("Error: " + error);
      callback();
    }
    if (res.statusCode === 200) {
      var $ = cheerio.load(body);
      console.log('Page title: ' + $('title').text());

      // Collect Links
      console.log('Collecting links...');
      var findRel = $("a[href^='http://www.businessinsider.com']");

      findRel.each(function() {
        pagesToCrawl.push($(this).attr('href'));
      });
      callback();
    }
  });
}
