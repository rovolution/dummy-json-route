#!/usr/bin/env node

/* Load modules */
var arguments = require('commander'),
	path = require('path'),
	dummyjson = require('dummy-json'),
	express = require('express'),
	fs = require('fs'),
	chokidar = require('chokidar'),
	packageJSON = require('../package.json');

var app = express();

/* Parse CLI arguments */
arguments
	.description('Serve up dummy JSON data at a URL endpoint based on a Dummy JSON template file')
	.version(packageJSON.version)
	.option('-p, --port [n]', 'Port number (default: 9000)', parseInt, 9000)
	.option('-r, --route [filepath]', 'Route to serve up data  (default: \'/\')', '/')
	.option('-t, --template [filepath]', 'Template to generate JSON data from')
	.parse(process.argv);

/* Validate port argument */
var portArgIsNaN = isNaN(arguments.port);
if(portArgIsNaN) {
	throw new Error("argument 'port' must be a number");
}

/* Load/Compile Template file */
var filepath, compiledTemplate;

if(arguments.template) {
	filepath = arguments.template;
} else {
	var templatesDir = path.normalize(__dirname + '/../json_templates/'),
		defaultTemplate = 'default.hbs';
		
	filepath = templatesDir + defaultTemplate;
}

compiledTemplate = readAndCompileTemplate(filepath);

function readAndCompileTemplate(templateFilepath, reqParams) {
	var template = fs.readFileSync(templateFilepath, {encoding: 'utf8'});
	return dummyjson.parse(template, { data: { params: reqParams } });
}

/* Set Watch on Template File */
chokidar
	.watch(filepath, {persistent: true})
	.on('change', function(path) {
  		compiledTemplate = readAndCompileTemplate(filepath);
  		console.log('\nTemplate File: ', path, " has been re-compiled.");
	});

/* Run Web-Server */
app
	.get(arguments.route, function(req, res) {
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Content-Type', 'application/json');
		
		if(req.params) {
			compiledTemplate = readAndCompileTemplate(filepath, req.params);
		}
		res.send(compiledTemplate);
	})
	.listen(arguments.port);

console.log("\nServing up data from template file: \n'" + filepath + "'\nat http://localhost:" + arguments.port + arguments.route);