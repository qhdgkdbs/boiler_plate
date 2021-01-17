const express = require('express')
const app = express()
const port = 5000
const { User } = require('./models/User')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')

const config = require('./config/key.js')

//application/x-www-form-urlencoded 를 분석하기 위해서
app.use(bodyParser.urlencoded({extended : true}))
//application/json 를 분석하기 위해서
app.use(bodyParser.json())

app.use(cookieParser())

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false,
}).then( () => console.log("mongoDB Connected"))
.catch(err => console.log("[ERR]Mongo DB Connected ERR"))

app.get('/', (req, res) => {
  res.send('Hello 2021')
})

app.get('/api/hello', (req, res) => res.send('Hello World!dd'));

app.post('/api/user/register', (req, res) => {
    //회원 가입 할때 필요한 정보들을 cilent에서 가져오면
    //그것들을 데이터 베이스에 넣어주자.

    // {
    //     id : "hello",
    //     password : "123"
    // }
    // 가 req.body에 정보가 들어있음 
    // body parser 덕에 해당 정보가 들어있는 것임.

    const user = new User(req.body)

    user.save((err, userInfo) => {
        //userInfo는  save 이후에 콜백 인자임.
        if (err) return res.json({ success : false, err}) 

        return res.status(200).json({
            success : true
        })
    })
})


app.post('/api/user/login', (req, res) => {


    // db에서 요청한 이메일이 데이터 베이스에 있는지 찾기,
    User.findOne({ email : req.body.email}, (err, user) => {
        if(!user){
            return res.json ({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 요청된 이메일이 db에 있다면, 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err,isMatch) =>{
            if(!isMatch){
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."
                })
            }
            
            // 비밀번호가 맞다면, 토큰 생성하기
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)

                // 토큰을 저장한다.  쿠키, 로컬스토리지 등에 저장가능.
                // 여기서는 쿠키에다가 저장하자.
                res.cookie("x_auth", user.token) 
                .status(200)
                .json({loginSuccess : true, userId : user._id})
                // x_auth라는 이름의 쿠키가 사용자의 브라우저에 저장됨
            })

        })

    })

})


app.get('/api/user/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과했다는 것은 auth가 True라는 뜻
    res.status(200).json({
        _id : req.user._id,
        // role 이 0이면 일반 사용자, 1이면 관리자
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image 
    })
}) 

app.get('/api/auth/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id : req.user._id},
        { token : ""}
        ,(err, user) => {
            if(err) return res.json({success : false, err})
            return res.status(200).send({
                success : true
            })
        })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})