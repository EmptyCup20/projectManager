var formidable = require("formidable");
var db_tools = require("../mongo/db_tools");
var request = require('request');
var fs = require('fs');
/**
 * 文件存储到服务器
 * @param req
 * @param res
 * @param opts
 */
const fileServerPath = "http://10.33.31.234:5566";
const fileDocument = 'projectFile';
module.exports = {
    uploadFile: function (req, res) {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8'; //设置编辑
        form.keepExtensions = true; //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
        form.multiples = false;
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.write('error\n\n');
                return;
            }

            var file = files[fields.name];
            var formData = {
                dirName: fileDocument,
                upload: fs.createReadStream(file.path)
            };
            if (fields.unique) {
                formData.fileName = file.name;
            }

            request.post({
                url: fileServerPath + "/containers/upload",
                formData: formData
            }, function (err, httpResponse, body) {
                if (err) {
                    res.send({
                        success: false,
                        message: err
                    });
                    return;
                }

                body = JSON.parse(body);

                if (body.type == "success") {
                    res.send({
                        success: true,
                        message: "上传成功！",
                        data: {
                            name: file.name.replace(/\.\w+$/, ''),
                            url: fileServerPath + body.url,
                            downloadUrl: fileServerPath + '/containers/download' + body.url
                        }
                    });
                } else {
                    var message;
                    switch (body.message.code) {
                        case "EEXIST":
                            message = "文件已存在！";
                            break;
                        default:
                            message = "上传失败！";
                    }
                    res.send({
                        success: false,
                        message: message
                    });
                }
            });
        });
    }
}