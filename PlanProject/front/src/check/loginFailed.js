import React, { useEffect, useState } from "react";
import styled from "./loginFailed.module.scss";

const LoginFailed = ({setFailed, err}) => {

    const [loginFailed, setLoginFailed] = useState({left: '', top: ''});
    const [content, setContent] = useState('');

    useEffect(() => {
        const left = 27 + Math.floor(Math.random() * 37) + '%';
        const top = 25 + Math.floor(Math.random() * 12) + '%';

        setLoginFailed({left, top});

        if(err === 'email'){
            setContent('이메일을 입력해주세요!');
        }else if(err === 'password'){
            setContent('비밀번호를 입력해주세요!');
        }else if(err === ''){
            setContent(['아이디, 비밀번호가 틀렸어요!',
                        <br/>,
                        '다시 로그인을 시도하세요!']);
        }else {
            setContent(err);
        }

        setTimeout(() => {
            setFailed({fail:false, error:''});
        }, 3100);
    },[]);

    return (
        <div id="failedId" className={styled.loginFailed} style={loginFailed}>
            {content}
        </div>
    );
};

export default LoginFailed;