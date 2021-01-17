// import axios from 'axios'
// import { response } from 'express'
import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'


function LoginPage(props) {

    const dispatch = useDispatch() //action을 취하기 위해서
 
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailhandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordhandler = (event) => {
        setPassword(event.currentTarget.value)
    }    

    const alertFunc = (text) => {
        alert(text)
    }
    
    const onSubmitHandler = (event) => {
        event.preventDefault() // 리프레쉬를 막는 것

        // console.log("email", Email)
        // console.log("Password", Password)

        let body = {
            email : Email,
            password : Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess){
                    // 로그인에 성공하면,
                    props.history.push('/') //리액트에서 페이지를 이동시키는 법
                }else{
                    // 로그인에 실패하면
                    alertFunc("로그인 실패")
                }
            }) //loginUser라는 액션
 

    }

    return (
        <div style={{
            display : "flex", justifyContent : "center", alignItems : "center",
            width : "100%", height : '100vh'
        }}>
        
        <form style = {{display : 'flex', flexDirection : 'column'}}
            onSubmit = { onSubmitHandler } 
        >
            <label>Email</label>
            <input type = "email" value={Email} onChange = { onEmailhandler }/>
            <label>Password</label>
            <input type = "password" value={Password} onChange = { onPasswordhandler }/>
            
            <br />
            <button type = "submit">
                Login
            </button>
        </form>

        </div> 
    )
}

export default withRouter(LoginPage)
