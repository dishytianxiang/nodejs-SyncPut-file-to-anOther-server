var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var watch = require('watch');
var http = require('http');
var qs = require('querystring');
var filePath = '/mnt/sdb/dataShare1/ResponseXml';
var url = require('url');
var fs = require("fs");
var request = require('request');
var restler = require('restler');
var FormData = require('form-data');
http.createServer(function(req,res){
 res.writeHead(200,{'Content-Type': 'text/html'});
        res.write('<h1>Node.js</h1>');
        var parsedUrl = url.parse(req.url, true); // true to get query as object
        var queryAsObject = parsedUrl.query;
        var tableName = queryAsObject.tableName;
        var message = queryAsObject.message;
		var now = new Date();
		 var year = now.getFullYear();       
		var month = now.getMonth() + 1;     
		var day = now.getDate();            
		var hh = now.getHours();            
		var mm = now.getMinutes();          
		var hm =  now.getSeconds();
		var fileName = tableName  + year;
		var fileNameTable;
		var createValues = {};
		if(month < 10){
				fileName += "0" + month;
		}else{
		 fileName +=  month;
		}
		if(day < 10){
				fileName += "0" + day;
		}else{
				fileName += day;
		}
		if(hh < 10){
				fileName += "0" + hh;
		}else{
				fileName += hh;
		}
		if(mm < 10){
				fileName += "0" + mm;
		}else{
				fileName += mm;
		}
		if(hm < 10){
				fileName += "0" + hm;
		}else{
				fileName += hm;
		}
		fileNameTable = fileName;
		fileName += ".xml";
		fileName = "/mnt/sdb/dataShare1/ResponseXml/" + fileName;
         fs.writeFile(fileName, message, function (err) {
            if (err) throw err;
             return res.end("hai");
          });
}).listen(1337);
console.log("HTTP server is listening at port 1337.");
watch.createMonitor(filePath,function(monitor){
        monitor.on("created",function(f,stat){
                var fileName = f.split("\/");
                var len = fileName.length;
                console.log("len = " + fileName);
                var syncFileName = fileName[len - 1];
                console.log("syncFileName = " + syncFileName);
                setTimeout(function() {
                        console.log(syncFileName);
                        var formData = {
                          attachmentType: 'dataFile',
                          attachments: [
                                fs.createReadStream(filePath + "/" + syncFileName),
                          ]
                        };
                        request.post({url:'http://serverIp:1520/upload', formData: formData},
                                function optionalCallback(err, httpResponse, body) {
                         if (err) {
                                return console.error('upload failed:', err);
                         }
                          console.log('Upload successful!  Server responded with:', body);
                        })
                }, 4000)
        })
})
								
								
								