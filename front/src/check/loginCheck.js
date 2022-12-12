import React from "react";


const LoginCheck = async () => {
    const loginCk = await JSON.parse(window.sessionStorage.getItem('loginCk'));
    const {pathname} = window.location
    if(pathname == '/' || pathname == '/emailCerti'){
        if(loginCk){
            window.location.href = '/select';
        }
    }else {
        if(!loginCk){
            window.location.href = '/';
        }
    }
}

export default LoginCheck;