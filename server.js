var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var md = require('html-md');
var app     = express();

/*
app.get('/scrape', function(req, res){
	// Let's scrape Anchorman 2
	url = 'http://www.imdb.com/title/tt1229340/';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var title, release, rating;
			var json = { title : "", release : "", rating : ""};

			$('.header').filter(function(){
		        var data = $(this);
		        title = data.children().first().text();
		        release = data.children().last().children().text();

		        json.title = title;
		        json.release = release;
	        })

	        $('.star-box-giga-star').filter(function(){
	        	var data = $(this);
	        	rating = data.text();

	        	json.rating = rating;
	        })
		}

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your console!')
	})
})*/

var basepath = 'http://www.liberatingstructures.com'
function buildRequest( uri ){
	return  { url: basepath+uri,
			  headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0'	
			  }
			}
}


function getContent( error, response, html){
	if(!error){
		
		var $ = cheerio.load(html)
		$('#content').filter(function(){
			var data = $(this);
			var h = rebuildHTML( data);
			var markdown = md(h);
			var path = './test/';
			
			var file = data.find('h1').text();
			file = file.replace(/\W+/g, " ").split(' ').join('_').toLowerCase();
			file += '.md';

			
			fs.writeFile( path + file, markdown, function(err){	 
    	 		console.log( file + ' successfully written!');
	   			});
		});
	}
}



function rebuildHTML( $html ){

	var t;
	//remove title image, set title to h1
	$html.find('.LStitle').first().remove;
	t = $html.find('.LStitle').text();
	$html.find('.LStitle').replaceWith( '<h1>'+ t + '</h1');

	//set sub to h2
	t = $html.find('.LSsubtitle');
	t.replaceWith( '<h2>'+ t.text() + '</h2');
	
	//make block quote
	t = $html.find('quote2');
	t.replaceWith( '<blockquote>'+ t.text() + '</blockquote');

	//possible
	t = $html.find('.LSwhatispossible strong').first().remove();
	t.prepend( '<h3>'+ t.text() + '</h3');
	

	return $html.html()
}


app.get('/md', function(req, res){
	// Let's scrape Anchorman 2
	
	var options = buildRequest( '/ls/')

	function cb(error, response, html){
		if(!error){
			console.log('Successfully loaded, parsing')
			var $ = cheerio.load(html);

			var target = '#iconmap area';
			var title, release, rating;
			var json = { title : "", release : "", rating : ""};


			$(target).last().filter(function(){
		        var data = $(this);
		        console.log( basepath+data.attr('href'));

		        var opt = buildRequest( data.attr('href'));

		        request(opt, getContent )

	        })
			//fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    	 
    	 	console.log('File successfully written! - Check your project directory for the output.json file');
   		}
        res.send('Check your console!')
	}

	request(options, cb);
		
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 	