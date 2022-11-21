import { useEffect, useState } from "react";
import styled from "./loginTest.module.scss";
import JoinInput from "./joinTest";

import DelayedLink from "./LinkDelay";

const MainInput = (bool) => {

    const [joinChange, setJoinChange] = useState(false);
    const [formChange, setFormChange] = useState(true);
    const [joinChangeBack, setJoinChangeBack] = useState(false);

    const [buttonDisable, setButtonDisable] = useState(false);

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');

    const changeAni = () => {
        const loginFormId = document.getElementById("loginFormId");
        loginFormId.style.transform = 'rotateY(90deg)';
        loginFormId.style.transition = 'all 3s';
    };

    const waitTime = 2950;


    const toJoin = () => {
        changeAni();

        setButtonDisable(true);

        setTimeout(() => {
            setJoinChangeBack(false);
            setJoinChange(true);
            setFormChange(true);
        }, waitTime);
    };
    

    const toLogin = () => {
        setJoinChangeBack(true);
        
        setTimeout(() => {
            setJoinChange(false);
            setFormChange(false);
            setTimeout(() => {
                setButtonDisable(false);
            }, waitTime)
        }, waitTime);
        
    };

    //임시 유저
    
    const users = {
        id:'won',
        pwd: '1234'
    };
    const [err, setErr] = useState('');

    const toSelect = (e) => {
        e.preventDefault();
        setButtonDisable(true);

            const inputId = id.target.value;
            const inputPwd = pwd.target.value;

            if(users.id == inputId && users.pwd == inputPwd){
                changeAni();
                setTimeout(() => {
                    window.location.href = '/select';
                }, 3000)

            }else{
                setErr('아이디 비밀번호 틀림');
                setButtonDisable(false);
            }
            
    };

    return (
        (joinChange)? <JoinInput toLogin={toLogin} joinChangeBack={joinChangeBack}/> :
        <form id="loginFormId" className={formChange? styled.loginForm : styled.loginFormBack} >
            <div className={styled.mainLogin}>
                
                <input type="text" placeholder="ID" onChange={(v) => setId(v)} value={id.value} />
                <input type="password" placeholder="PWD" onChange={(v) => setPwd(v)} value={pwd.value}/>
                <div>
                    <button type="button" onClick={toJoin} disabled={buttonDisable}> 취소 </button>
                {/* <DelayedLink delay={delayClick} to="/select"> */}
                    <button type="submit" onClick={toSelect} disabled={buttonDisable}> 전송 </button>
                {/* </DelayedLink> */}
                    <p>{err}</p>
                </div>
            
            </div>
        </form>
    );
}

export default MainInput;