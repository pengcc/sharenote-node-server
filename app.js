const express = require('express');
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const app = express();
const path = require('path');
/**
* @TODO error handlin
*/

const hasOwn = ({}).hasOwnProperty;

let createNewFile = () => {
	// create a empty json file with a name of unique shortid
	let filename = shortid.generate();
	return filename;
};

let _getTargetFilePath = (filename) => {
	return path.join(__dirname, `/shared/${filename}.json`);
};

app.use((req, res, next) => {
	// enable cors
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/**
* Using the generated short id instead of the real request url
*/
app.get(/^\/[0-9a-zA-Z_\-]{7,14}$/, function (req, res, next) {
  let filename = req.url;
  // rewrite the request url
  req.url = `/shared?file=${filename}.json`;
  next();
});

app.get('/', function(req, res) {
	
});

app.get('/view', function(req, res) {
	// view 
	let filename = req.query.file;
	let filepath = _getTargetFilePath(filename);
	let obj = jsonfile.readFileSync(filepath);
	obj.filename = filename;
	res.json(obj);
});

let jsonParser = bodyParser.json();

app.post('/create', jsonParser, function(req, res){
	let data = req.body
	let filename = createNewFile();
	let filepath = _getTargetFilePath(filename);
	
	// create new file
	jsonfile.writeFileSync(filepath, data);
	res.json({"filename": filename, "is_create": true});
});

app.post('/save', jsonParser, function(req, res) {
	let data = req.body;
	let filename = data.filename;
	let filepath = _getTargetFilePath(filename);
	// overwrite the file with the new data
	jsonfile.writeFile(filepath, {notes: data.notes}, function(err) {
		if(err) {
			res.json({"err": err});
		} else {
			res.json({"is_create": false});
		}
	});

});

app.listen(5050, function(){
	console.log('Server start at 5050');
});