import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import  axiosPost  from "../Axios/backAxiosPost";
import styled from "./PwdChange.module.scss"

const PwdChange = () => {

    const params = new URLSearchParams(useLocation().search);
    const [pwd, setPwd] = useState('');
    const [pwdCk, setPwdCk] = useState('');

    const [pwdError, setPwdError] = useState('');
    const [pwdCkError, setPwdCkError] = useState('');
    const [boole, setBoole] = useState(true);

    const pwdFnc = (v) => {
        const {value} = v.target;
        const pwdRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
        setPwd(value);
        
        if(pwdRegEx.test(value)){
            setPwdError('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요!');
            setPwdCkError('');
        }else if(value !== pwdCk) {
            setPwdError('');
            setPwdCkError('비밀번호가 서로 다릅니다!');
        }else if(value === pwdCk){
            setPwdError('');
            setPwdCkError('');
        }
    };

    const pwdCkFnc = (v) => {
        const {value} = v.target;
        setPwdCk(value);

        if(value !== pwd){
            setPwdCkError('비밀번호가 서로 다릅니다!');
        }else if(value === pwd){
            setPwdError('');
            setPwdCkError('');
        }

    }

    const pwdChange = async (e) => {
        e.preventDefault();
        const id = params.get('warPoint');
        const hash = params.get('parPoint');

        if(pwd.length >= 8 && pwdError === '' && pwdCkError === '' && pwd === pwdCk){
           const {result} = await axiosPost('/home/pwdChange',{id, hash, password: pwd}, '/');

           if(!result){
                setBoole(result);
                setTimeout(() => {
                    window.location.href = '/';
                }, 2500)
           }   
        }else{
            setPwdError('비밀번호를 정확히 입력해주세요!!');
        }
    };


    return (
    <>
    {(boole)? 
        <form className={styled.pwdChangeDiv}>
            <div>
                <h3>변경할 비밀번호를 입력하세요!!</h3>
            </div>
            <input type="password" value={pwd} onChange={pwdFnc} />
                <div>
                    {pwdError}
                </div>
            <input type="password" value={pwdCk} onChange={pwdCkFnc} />
                <div>
                    {pwdCkError}
                </div>
            <button type="submit" onClick={pwdChange}> 비밀번호를 변경하실려면 클릭하세요! </button>
        </form>  : 
        
        <div className={styled.pwdChangeDiv} style={{color:'red', fontSize:'25px'}}>
            잘못된 접근입니다!!!!!!!!!!!!!!!!!
        </div>
    }
        
    </>
    );
};

export default PwdChange;