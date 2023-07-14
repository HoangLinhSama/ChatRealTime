/* tao server (cau hinh express)*/
var express = require("express"); // require de tham chieu den module "express" va gan vao cho bien express
var app = express(); // express() de tao mot ung dung express, express la framework de xay dung web application
var server = require("http").createServer(app); // de su dung HTTP server va client thi phai require("http"), createServer() se tra ve 1 instance cua server va su dung giao thuc http
var io = require("socket.io")(server); // dong code nay de set callback function server se duoc chay khi server duoc khoi dong, socketio cho phep giao tiep 2 chieu giua client va server
var fs = require("fs"); // fs cho phep tuong tac voi he thong tep theo cach duoc mo hinh hoa tren cac chuc nang POSIX tieu chuan.
server.listen(process.env.PORT || 3000); // start mot server listening cho connection tren cong duoc dinh nghia trong process.env.PORT, neu khong thi chay tren PORT 3000

// app.get("/", function (req, res) {
//   // dau "/" dung de chi thu muc goc
//   res.sendFile(__dirname + "/index.html"); // sendFile de truyen tep tai directory da cho
// }); /* doan code nay lien quan den web dung de : khi goi den domain (vi du : localhost:3000) thi no se mo file /.../.../index.html */

console.log("Server Running..."); // hien thi thong bao da dung server thanh cong

var arrayUser=[]; // arrayUser chua thong tin cac user de dam bao ten user la duy nhat

/* tao ket noi giua client va server */
io.sockets.on("connection", function(socket) // io.sockets.on() la de lang nghe su kien tu tat ca cac ket noi, 2 tham so la : name event (mac dinh la connection), callback function(socket) (co the coi la ham an danh nhu trong java) de bat data duoc client gui den, socket (object) la var du lieu the hien thong tin ve thiet bi ket noi den server
{
  var exist =true;
  console.log("Client Connected Successful !"); // moi khi co 1 client ket noi den server thi se xuat dong nay ra
  // socket.on("client-send-data", function(data) // socket.on() cua server de bat su kien tu mot client goi emit() de gui du lieu (do la socket.on())
  // {
  //   console.log("Server received " + data);
  //   io.sockets.emit("server-send-data",{content:data}); // vua nhan duoc du lieu tu client thi sever phan hoi lai ngay (phan hoi den tat ca do la io.sockets.emit()), do do doan code phan hoi (emit()) de o day, va du lieu ma server gui di la duoi dang json object {string:value}
  // });
  socket.on("client-register-user", function(data) // nhan su kien dang ky user cua mot client tai mot thoi diem
  {
    if(arrayUser.indexOf(data) ==-1) // indexOf() de tra ve vi tri dau tien cua gia tri can tim o trong mang, neu khong co thi tra ve -1 (tuc la neu ten chua co trong mang arrayUser thi duoc phep dang ky)
    {
      arrayUser.push(data); // them user vao array
      console.log("Register Successful : "+ data);
      exist = false;
      io.sockets.emit("server-send-list-user",{listuser:arrayUser}); // khi dang ky thanh cong thi thong bao ngay den tat ca user danh sach nhung nguoi dung da dang ky thanh cong, tham so truyen vao la mot JSONObject, va chu y value cua JSONObject nay la mot JSONArray
      socket.un = data; // gan thong tin user dang ky thanh cong thanh ten dinh danh cua client hien dang ket noi, un la de dinh danh cho socket
    }
    else
    {
      console.log(data+ " Already Exist !");
      exist = true;
    }
    socket.emit("server-send-result",{result:exist}); // phan hoi lai ngay den duy nhat client da gui yeu cau register user (cung la dang JSONObject)
  })
  socket.on("client-send-message",function(message) // nhan su kien gui message cua mot client tai mot thoi diem
  {
    console.log(socket.un+" : "+message);
    io.sockets.emit("server-send-message", {messagecontent:socket.un+" : "+message}); // server emit den tat ca cac client
  })
});