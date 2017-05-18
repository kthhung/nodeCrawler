var request = require('request');
var cheerio = require('cheerio');

var pagesCrawled = {};
var numPagesCrawled = 0;
var pagesToCrawl = [];
var maxPagesToCrawl = 2;

var initialPage = "http://www.businessinsider.com/";
var wordList = [];
var concordance = {};

console.log('Commencing crawler.js');
pagesToCrawl.push(initialPage);
crawl();

function crawl() {
  if (numPagesCrawled >= maxPagesToCrawl){
    console.log('Reached maximum number of crawls');
    return;
  }
  var nextPage = pagesToCrawl.shift();
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
      var title = $('title').text();
      console.log('Page title: ' + title);

      // Collect Links
      console.log('Collecting links...');
      var findRel = $("a[href^='http://www.businessinsider.com']");

      findRel.each(function() {
        pagesToCrawl.push($(this).attr('href'));
      });

      // Get keywords by calculating term frequency (tf)
      var text = $('div.KonaBody.post-content').children().first().text();
      // console.log(text);
      var tokens = text.split(/\W+/);
      for (var i = 0; i<tokens.length; i++) {
        var word = tokens[i].toLowerCase();
        if(!/\d+/.test(word)) {
          if (concordance[word] === undefined) {
            concordance[word] = {
              tf: 1,
            };
            wordList.push(word);
          } else {
            concordance[word].tf = concordance[word].tf + 1;
          }
        }
      }

      wordList.sort(function(a, b){
        return (concordance[b].tf - concordance[a].tf);
      });

      for (var i = 0; i < wordList.length; i++) {
        var key = wordList[i];
        console.log(key + " " + concordance[key].tf);
      }

      callback();
    }
  });
}
