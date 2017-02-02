# Simple Web Crawler

## About

This is a simple web crawler that I have put together using javascript.

The crawler has an user input that accepts a URL of your choice. The url should be formatted e.g. [http://wiprodigital.com](http://wiprodigital.com). If valid, submtting the form will return a basic site map or list of links to other local resources on that page/site.

## Installation

This app has been developed with node js and utilises various npm modules. Just be sure to have [Node](http://nodejs.org/) installed first. Then simply clone the repo and install as usual:

    $ npm install

To run the app:

    $ npm start
    or
    $ node server.js

This app should then run in your web browser of choice, at be available at localhost on port 8081 i.e. http://localhost:8081


## Next Steps

The following features are missing

* Recursive indexing or crawling
* Unit testing
* Further input validation especially for browsers that don't support html5 input type email
* Parse Robots.txt and make sure that items are not crawled or are crawled if within paths that are restricted
* Provide better error handling to output is not available, times out or domain does not exist etc.
* Suggestions from you


## Feedback

To leave feedback, open an issue in the
[Issues section](https://github.com/2dareis2do/simple-web-app/issues).

