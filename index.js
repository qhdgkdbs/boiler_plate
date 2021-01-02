const express = require('express')
const app = express()
const port = 3000
const { User } = require('./models/User')
const bodyParser = require('body-parser')

const config = require('./config/key.js')

//application/x-www-form-urlencoded 를 분석하기 위해서
app.use(bodyParser.urlencoded({extended : true}))
//application/json 를 분석하기 위해서
app.use(bodyParser.json())

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false,
}).then( () => console.log("mongoDB Connected"))
.catch(err => console.log("[ERR]Mongo DB Connected ERR"))

app.get('/', (req, res) => {
  res.send('Hello 2021')
})

app.post('/register', (req, res) => {
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
        if (err) return res.json({ success : false, err}) 

        return res.status(200).json({
            success : true
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})