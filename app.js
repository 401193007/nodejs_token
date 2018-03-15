const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// 可以直接使用req.cookies.cname来访问cookie
var cookie = require('cookie-parser');

const app = express()
app.use(bodyParser('json'))
app.use(cookie())
//设置模板引擎
app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/login', (req, res, next) => {
  // 注意render是应用于模板
  res.render('login')
})

app.get('/index', (req, res, next) => {
  console.log(req.cookie)
  if(req.cookies.user !== null){
    req.user = req.cookies.user;
  }
  res.render('index');
  console.log(req.user)
})

app.post('/login', (req, res, next) => {
  var username = req.body.username;
  var pwd = req.body.pwd;
  var user={  
    username:'admin',  
    pwd:123456  
  }  
  if(username==user.username && pwd==user.pwd){
    //设置cookie  @httpOnly为true表明这个cookie只能有服务器修改
    res.cookie("user", {username: username}, {maxAge: 600000 , httpOnly: false});
    res.redirect('index'); 
  }else{
    req.error = '用户名密码错误'
    res.render('login' , req) ;
  }
})

app.get('/logout', function (req,res,next){ 
  //删除Cookie  
  res.clearCookie('user');
  res.redirect('index'); 
})

// 使用静态文件
app.use(express.static(path.join(__dirname, 'public')));
app.listen(3344, () => {
  console.log('服务器开启，端口：3344')
})