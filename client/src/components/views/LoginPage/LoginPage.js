import axios from 'axios'
import React, {useState} from 'react'

function LoginPage() {

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailhandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordhandler = (event) => {
        setPassword(event.currentTarget.value)
    }    
    
    const onSubmitHandler = (event) => {
        event.preventDefault() // 리프레쉬를 막는 것

        console.log("email", Email)
        console.log("Password", Password)

        let body = {
            email : Email,
            password : Password
        }

        axios.post('api/user/login', body)
        .then(res => console.log(res))

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

export default LoginPage
