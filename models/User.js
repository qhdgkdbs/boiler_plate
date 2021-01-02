const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
})

userSchema.pre('save',function(next) {
    //여기서 this는 데이터들. user.password 등
    
    var user = this

    if(user.isModified('password')){
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err => {
                return next(err)
            })

            bcrypt.hash(user.password , salt, function(err, hash) {
                //hash는 암호화 된 비밀번호
                // Store hash in your password DB.
                if(err) return next(err)
                
                user.password = hash
                next()
            });
        });
    }else{
        // 비밀번호 변경이 아닐경우.
        // else문에 넣어줘. 왜냐면 if문 밖에두면 동시에 실행이 돼
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword =1234567
    // 암호화된 패스워드 = adsfasdflkj123lk

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this
    //jsonwebtoken을 이용해서 토큰을 생성하기,

    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id는 몽고db에 있어
    // secretToken 이건 커스텀이야, 아무거나 써도 돼
    // 근데 나중에 secretToken을 통해서 user._id값을 가져올 수 있어
    // user._id + 'secretToken' = token
    // secretToken -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}
 

const User = mongoose.model('User',userSchema)

module.exports = { User }