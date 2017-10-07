const http = require('http');
const url = require('url');
const fs = require('fs');

var FOUROHFOUR = [
	'<h1>I can\'t find that page!</h1><p>Hopefully you can find what ',
	'you were looking for on the <a href="/">main page</a>.</p>'
].join('');

function serveStaticFile(req, res, staticFile, contentType) {
	console.log('Importing ' + staticFile + '.');
	var fileName = staticFile;
	fs.readFile(fileName, function(err, data) {
		if (err) {
			res.writeHead(404, {'content-type': 'text/html'});
		}
		res.writeHead(200, {'content-type': contentType}),
		res.write(data);
		res.end();
	})
}

http.createServer(function(req, res) {
	if (req.url.indexOf('drc.css') != -1) {
		serveStaticFile(req, res, 'drc.css', 'text/css');
	} else if (req.url.indexOf('max_tremaine_dot_com.json') != -1) {
		serveStaticFile(req,res, 'max_tremaine_dot_com.json', 'application/json');
	} else if (req.url.indexOf('icon.jpg') != -1) {
		serveStaticFile(req, res, 'icon.jpg', 'image/jpeg');
	} else {
		console.log('Getting the page.')
		var path = url.parse(req.url, true).pathname;
		var fileName = path == '/' ? 'index.html' : path.split('/')[1] + '.html';
		fs.readFile(fileName, function(err, data) {
			if (err) {
				res.writeHead(404, {'content-type': 'text/html'});
				return res.end(FOUROHFOUR);
			}
			res.writeHead(200, {'content-type': 'text/html'});
			res.write(data);
			res.end();
		});
	}
}).listen(8000);