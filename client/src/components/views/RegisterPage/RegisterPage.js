import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { loginUser, registerUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'


function RegisterPage(props) {
    const dispatch = useDispatch() //action을 취하기 위해서
 
    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")


    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }  

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }    

    const onConfirmPasswordhandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }  

    const alertFunc = (text) => {
        alert(text)
    }
    
    const onSubmitHandler = (event) => {
        event.preventDefault() // 리프레쉬를 막는 것

        console.log("email", Email)
        console.log("Password", Password)

        if(Password !== ConfirmPassword){
            return alert("비밀번호가 같아야 합니다.")
        }

        let body = {
            email : Email,
            password : Password,
            name: Name,

        }

        dispatch(registerUser(body))
            .then(response => {
                if(response.payload.success){
                    props.history.push('/login')
                }else{
                    alertFunc("회원가입에 실패")
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
            <input type = "email" value={Email} onChange = { onEmailHandler }/>

            <label>Name</label>
            <input type = "text" value={Name} onChange = { onNameHandler }/>

            <label>Password</label>
            <input type = "password" value={Password} onChange = { onPasswordHandler }/>

            <label>Confirm Password</label>
            <input type = "password" value={ConfirmPassword} onChange = { onConfirmPasswordhandler }/>
            
            <br />
            <button type = "submit">
                Sign Up
            </button>
        </form>

        </div>
    )
}

export default withRouter(RegisterPage)
