// import axios from 'axios'; 
// import { response } from 'express';
import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {auth} from '../_actions/user_action'


export default function( SpecificComponent, option, adminRoute = null){

    // option 에는 null이라는 옵션이 있고 true, false 가 있음
    // null > 아무나 출입이 가능한 페이지
    // true > 로그인한 유저만 출입이 가능한 페이지
    // false > 로그인한 유저는 출입이 불가능한 페이지 

    //adminRoute 어드민 유저만 들어가기를 원한다면 true를 인자로 넣자

    function AuthenticationCheck(props){
        const dispatch = useDispatch() 

        useEffect(() => {
 
            dispatch(auth()).then( response => {
                console.log(response)

                if(!response.payload.isAuth){
                // 로그인 하지 않은 상태에서
                    if(option){
                        //option이 true인 곳에 들어가려고 한다면,
                        props.history.push('/login')
                    }

                }else{
                    // 로그인 한 상태 
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(option === false)
                        props.history.push('/')

                    }

                }
            })


        }, [])

        return <SpecificComponent />
    }

    return AuthenticationCheck
}