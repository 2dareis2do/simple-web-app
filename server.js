var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var favicon = require('serve-favicon');
var path = require("path");
var url = require("url");
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var searchName;

var pageLinks = [];
var allowed = [];
var disallowed = [];
var robots = 'robots.txt';
var scraped = [];

app.use(favicon(path.join(__dirname+'/favicon.ico')));
app.set('view engine', 'html');
app.use(bodyParser()); //reads a form's input and stores it as a javascript object accessible through `req.body` 

var getLinks = function(node) {

    var $ = cheerio.load(node);

    var links = $('a');

    $(links).each(function(i, link){

        var item = $(link).attr('href');

        if (item !== undefined) {
            if (item != '/') {
              item = item.replace(/\/$/, "");
            }
            item = item.split("#")[0];
            if ((item.indexOf(searchName) == 0 ) || (item.indexOf('/') == 0)) {
              if (pageLinks.indexOf(item) === -1) {
                  pageLinks.push(item);
              }
            }
        }
    });

    pageLinks.sort();
}

var addScrapes = function(links) {

    var pageLinksLength = links.length;

    for (var i = 0; i < pageLinksLength; i++) {
        var siteLink = pageLinks[i];
            request(pageLinks[i], function(error, response, html){
            if(!error){
            scraped.push({'path': this.path})
            } else {
              res.status(500)
              res.render('error', { error: error })
            }
        });

    }

}

app.get('/', function(req, res, next){

  var html = '<!DOCTYPE html><html><head><title>Simple Web Crawler</title></head><body>' +
                '<h1>Simple Web Crawler</h1>' +
                '<p>This is a simple webcrawler that will scrapes your target url and returns a list of links or simple site map.</p>' +
                '<form action="/" method="post">' +
                   '<label for"searchName">Target url:</label> ' +
                   '<input type="url" name="searchName" placeholder="http://your-address-here.com" />' +
                   '<button type="submit">Submit</button>' +
                '</form>'+
              '</body></html>';
  res.send(html);

  next();
});


// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
app.post('/', function(req, res, next){
  searchName = req.body.searchName;

  res.setHeader("Content-Type", "text/html");
  res.write('<!DOCTYPE html><html><head><title>Simple Web Crawler</title></head><body>');
  res.write('<p>Crawling ' + searchName + '</p>');
    getContent(searchName)
     .then((html) => {
      getLinks(html);

      var itemsLength = pageLinks.length;
      if (itemsLength > 0 ) {

        res.write('<h3>Number of links scraped:'+itemsLength+'</h3>');
        res.write('<ol>');

          cheerio(pageLinks).each(function(i, link){
              if(link == searchName) {
                res.write('<li><a href="'+link +'">/</a></li>');
              }
              else if ((link.indexOf(searchName) == 0 ) && (link != searchName)) {
                var searchName2Length = searchName.length;
                link = link.substring(searchName2Length);
                res.write('<li><a href="'+searchName +'">'+link+'</a></li>');
              } else {
                res.write('<li><a href="'+searchName+ link +'">'+link+'</a></li>');
              }
          })

        res.write('</ol>');

      } else {

        res.write('<h3>No results returned from '+searchName+'</h3>');

      }

      res.write('<a href="/">Try again.</a>');
      res.write('</body></html>');

    })
     .then((html) => {
      //reset
      pageLinks = [];
      res.end();

    })
      .catch((err) => console.error(err));

    next();

});

const getContent = function(url) {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    var lib = url.startsWith('https') ? require('https') : require('http');
    var request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      var body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err));
    })
};

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;