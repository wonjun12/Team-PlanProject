import { useEffect, useState } from "react";
import styled from "./Login.module.scss";
import Join from "./Join";
import  axiosPost  from "../Axios/backAxiosPost";
import LoginFailed from "../check/loginFailed";
import LoginCheck from "../check/loginCheck";

const MainInput = (bool) => {

    const [joinChange, setJoinChange] = useState(false);
    const [formChange, setFormChange] = useState(true);
    const [joinChangeBack, setJoinChangeBack] = useState(false);

    const [buttonDisable, setButtonDisable] = useState(false);

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');
    const [emailPlace, setEmailPlace] = useState('이메일');

    const waitTime = 2950;

    const changeAni = (deg) => {
        const loginFormId = document.getElementById("loginFormId");
        loginFormId.style.transform = `rotateY(${deg}deg)`;
        loginFormId.style.transition = 'all 3s';
    };

    const toJoin = () => {
        changeAni(90);

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


    const [loginFailed, setLoginFailed] = useState({fail: false, error: ''});

    const toSelect = async (e) => {
        e.preventDefault();
        
        if(id === ''){
            setLoginFailed({fail: true, error:'email'});
        }else if(pwd === ''){
            setLoginFailed({fail: true, error:'password'});
        }else{
            const loginData = {
                email: id,
                password: pwd
            }
            setButtonDisable(true);
            changeAni(90);
            const {result, error} = await axiosPost('/home/login', loginData, '/select', waitTime);
            
            if(!result){
                setTimeout(() => {
                    console.log(error);
                    changeAni(0);
                    setLoginFailed({fail: !result, error: (error !== undefined)? error : ''});
                    setTimeout(() => {
                        setButtonDisable(false);
                    }, waitTime)
                }, waitTime);
            }
        }
    };

    const pwdSearch = async () => {
        const {result, error} = await axiosPost('/home/sendPwd',{email: id});
        
        if(!result){
            setLoginFailed({fail: !result, error});
        }else{
            setId('');
            setEmailPlace('이메일을 성공적으로 보냈습니다!!');
        }
    };

    useEffect(() => {
        LoginCheck();
    },[]);

    return (
        (joinChange)? <Join toLogin={toLogin} joinChangeBack={joinChangeBack}/> :
        <>
            {(loginFailed.fail)? <LoginFailed setFailed={setLoginFailed} err={loginFailed.error} /> : null}
            <form id="loginFormId" className={formChange? styled.loginForm : styled.loginFormBack} >
                <div className={styled.mainLogin}>
                    
                    <input type="text" placeholder={emailPlace} onChange={(v) => setId(v.target.value)} value={id} />
                        <button type="button" className={styled.pwdMailSend} onClick={pwdSearch}>비밀번호가 기억나지 않으신다면 누르세요.</button>
                    <input type="password" placeholder="비밀번호" onChange={(v) => setPwd(v.target.value)} value={pwd}/>
                    <div>
                        <button type="button" onClick={toJoin} disabled={buttonDisable}> 비회원이면 회원가입 가능! </button>
                        <button type="submit" onClick={toSelect} disabled={buttonDisable}> 로그인 </button>
                    </div>
                
                </div>
            </form>
        </>
    );
}

export default MainInput;