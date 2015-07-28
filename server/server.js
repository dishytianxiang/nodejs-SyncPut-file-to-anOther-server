var url = require('url');
var multipartMiddleware = multipart();
var request = require("request");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(1520, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
app.post('/upload', multipartMiddleware, function(req, res) {
        var orginalFilePath = req.files.attachments.path;
        var orginalFileName = req.files.attachments.originalFilename;
        if(req.files && req.files.attachments ){
                        var newPath = '/mnt/dataShare/ResponseXml/' + orginalFileName;
                        console.log("received file %s copying to %s", orginalFilePath, newPath);
                        if(fs.existsSync(newPath)){
                                fs.unlink(newPath);
                        }
                        var suffix = orginalFileName.split(".");
                        var len = suffix.length;
                        if(suffix[len - 1] == "xml" ){
                                fs.exists(orginalFilePath,function(exist){
                                        if(!exist)
                                          return res.send({code: 404,msg: 'no such file',data: ''});
                                        var data = fs.readFileSync(orginalFilePath);
                                         fs.writeFileSync(newPath, data);
                                        return res.send(req.files);
                                   })
                                setTimeout(function(){
                                    var headers = {
                                        'User-Agent': 'Super Agent/0.0.1',
                                        'Content-Type':  'application/x-www-form-urlencoded'
                                }
                                var options = {
                                 url: 'http://localhost:1337/update',
                                    method: 'GET',
                                    headers: headers,
									qs: {'tableFileName': orginalFileName}
                                }
                                request(options, function (error, response, body) {
                                        if(error)
                                                console.log(error);

                                        console.log(body)
                                        })
                                },4000)
                        }
        }
})