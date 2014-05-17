# dummy-json-route

## Purpose:

Serve up dummy JSON data at a URL endpoint based on a Dummy JSON template file

## Command line Interface:

* '-p :portNumber':
	Description: Port to serve data on (must be integer)
	Default: 9000
	
* '-r :routeName':
	Description: Route to serve data on (must be string)
	Default: base route '/'
	
* '-t :dataTemplateFilePath'
	Description: Path to Dummy JSON data file path OR a valid template string
	Default: A default template file that will be packaged with the module install
	
	
## Example Commands:

### __Ex.1__: 
Serve up dummy data at http://localhost:9000/myDummyData from template file 'dummyData.hbs'

	
	pc:~ rkalkur$ dummyjsonroute -p 9000 -r /myDummyData -t /myDataTemplates/dummyData.hbs
	
	
	
###  __Ex.2__: 
Serve up dummy data at http://localhost:9000/person/:id/purchases from template file 'dummyPurchaseData.hbs'

	
	pc:~ rkalkur$ dummyjsonroute -p 9000 -r /person/:id/purchases -t /myDataTemplates/dummyPurchaseData.hbs
	


###  __Ex.3__: 
Serve up dummy data at http://localhost:9000/person/:id/purchases from template file 'dummyPurchaseData.hbs'

However, inject the URL parameters into the dummy data where they are specified in the given template file

	
	pc:~ rkalkur$ dummyjsonroute -p 9000 -r /person/:id/purchases -t /myDataTemplates/dummyPurchaseData.hbs
	

dummyPurchaseData.hbs file contents: 
	
	{ 
		"id": {{ params.id }},
		"name": "Kleenex"
	}

Then, if you issue an HTTP GET request to http://localhost:9000/person/1/purchases, you would get back the following response (in JSON format):

	{	
		"id": 1,
		"name": "Kleenex"
	}


If you want to pass non-numeric values in as URL parameters, you need to remember to wrap the property value in double-quotes within the template file.

For example, if you issue an HTTP GET request to http://localhost:9000/person/aq575uti00/purchases, the data template file would need to look like the following:

	{ 
		"id": "{{ params.id }}",
		"name": "Kleenex"
	}