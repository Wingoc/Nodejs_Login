// Font API:
// locahost:8080/act=reg&user=wing&pass=123456        return json: {"ok": ture/false, "msg": "reson"}
// locahost:8080/act=login&user=wing&pass=123456      return json: {"ok": ture/false, "msg": "reson"}


const http = require("http");
const querystring = require("querystring");
const urlLib = require("url");
const fs = require("fs");

// 对象，模拟数据库保存数据
var users = {};    // {user1: pass1, user2: pass2}

var server = http.createServer(function (req, res){

  // 解析请求
  var str = "";
  req.on('data', function (data){
    str += data;
  });
  req.on('end', function (){
    var obj = urlLib.parse(req.url, true);
    var url = obj.pathname;
    var GET = obj.query;
    var POST = querystring.parse(str);

    console.log(url, GET, POST);

    // 区分访问的是： 接口(user)、文件
    if (url == "/user") {
      // 访问接口
      switch (GET.act) {
        case "reg":
          if (users[GET.user]) {
            res.write('{"ok": false, "msg": "The username is already existent!"}');
          } else {
            users[GET.user] = GET.pass;
            res.write('{"ok": true, "msg": "Register successfully!"}');
          }
          break;
        case "login":
          if (users[GET.user] === null) {
            res.write('{"ok": false, "msg": "The username is not exist!"}');
          } else if (users[GET.user] != GET.pass) {
            res.write('{"ok": false, "msg": "The password is not right!"}');
          } else {
            res.write('{"ok": true, "msg": "Login successfully!"}');
          }
          break;
        default:
          res.wirte('{"ok": false, "msg": "It is an unknow act!"}');
      }
      res.end();
    } else {
      // 访问文件
      var file_name = "./www" + url;
      fs.readFile(file_name, function (err, data){
        if (err) {
          res.write("404");
        } else {
          res.write(data);
        }
        res.end();
      });
    }
  });

});





























server.listen(8080);
