const { model } = require("mongoose");
const { User } = require("../models/User");


let auth = (req, res, next) => {
    // 인증처리를 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져온다. (쿠키파서 이용)
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err
        if(!user) return res.json({ isAUth : false, err : true })

        req.token = token
        req.user = user
        next()
    })

    // 유저가 있으면 인증 ok

    // 유저가 없으면 인증 no

}

module.exports = { auth }