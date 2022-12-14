import { useEffect, useState } from "react";
import styled from "./Join.module.scss";
import axiosPost from "../Axios/backAxiosPost";
import JoinFailed from "../check/joinFailed";
import Loading from "../loading/Loading";


const JoinInput = ({toLogin, joinChangeBack}) => {
    const [PWD, setPWD] = useState('');
    const [PWDCk, setPWDCk] = useState('');

    const [joinButtonDisable, setJoinButtonDisable] = useState(true);
    
    const [emailCk, setEmailCk] = useState(false);
    const [nameCk, setNameCk] = useState(false);
    const [pwdCk, setPwdCk] = useState(false);

    const [failed, setFailed] = useState({fail: false, index: 0});

    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        setTimeout(() => {
            setJoinButtonDisable(false);
        }, 2950)
    },[])

    const toLoginDisable =() => {
        setJoinButtonDisable(true);
        setFailed({fail: false});
        toLogin();
    };

    const joinFnc = async (e) => {
        e.preventDefault();
        setLoading(true);
        const {email, name, pwd, pwdCkV} = e.target;
        if(emailCk && nameCk && pwdCk && !(PWD.length < 8)){
            const joinData = {
                email: email.value,
                name: name.value,
                password: pwd.value
            };
            await axiosPost('/home/join', joinData);
        }else if(!emailCk){
            setFailed({fail: true, index:0});
            email.focus();
        }else if(!nameCk){
            setFailed({fail: true, index:1});
            name.focus();
        }else if (PWD.length < 8){
            setFailed({fail: true, index:2});
            pwd.focus();
        }else if(!pwdCk){
            setFailed({fail: true, index:3});
            pwdCkV.focus();
        }

        setLoading(false);
        
    }

    const emailCkFnc = async (e) => {
        const { value } = e.target;
        const emailReg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        if(value === '' || value.length < 6 || !emailReg.test(value)){
            setEmailCk(false);
            setFailed({fail: true, index:0});
        }else {
            const {result} = await axiosPost('/user/emailCk', {email: value});
            setFailed({fail: !result, index:-1});
            setEmailCk(result);
        }
    };

    const nameCkFnc = (e) => {
        const { value } = e.target;

        if(value === '' || value.length < 1){
            setFailed({fail: true, index:1});
            setNameCk(false);
        }else {
            setFailed({fail: false});
            setNameCk(true);
        }
    };

    const pwdFnc = (e) => {
        const { value } = e.target;
        const pwdRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
        setPWD(value);
        console.log(!pwdRegEx.test(value));
        if(!pwdRegEx.test(value)){
            setFailed({fail: true, index:2});
        }else if(PWDCk !== value && PWDCk !== ''){
            setFailed({fail: true, index:3});
            setPwdCk(false);
        }else if(PWDCk === value){
            setFailed({fail: false});
            setPwdCk(true);
        }else {
            setFailed({fail: false});
        }
    };

    const pwdCkFnc = (e) => {
        const { value } = e.target;
        setPWDCk(value);
        
        if(PWD !== value) {
            setFailed({fail: true, index:3});
            setPwdCk(false);
        }else if(PWD === value){
            setFailed({fail: false});
            setPwdCk(true);
        }
    };


    return (
        <>
        {loading && <Loading/>}
        <form onSubmit={joinFnc} id="joinFormId" className={joinChangeBack? styled.joinFormBack : styled.joinForm}>
            <div className={styled.mainJoin}>
               <input onChange={emailCkFnc} name="email" placeholder="?????????"/>
               <input onChange={nameCkFnc} name="name" placeholder="??????"/>
               <input onChange={pwdFnc} value={PWD} type='password' name="pwd" placeholder="????????????"/>
               <input onChange={pwdCkFnc} value={PWDCk} type='password' name="pwdCkV" placeholder="???????????? ??????"/>
               <div>
                    <button type="button" onClick={toLoginDisable} disabled={joinButtonDisable}> ???????????? ??????... </button>
                    <button disabled={joinButtonDisable}> ???????????? ??????! </button>
               </div>
               {(failed.fail)? <JoinFailed index={failed.index} />: null}
            </div>
            
        </form>
        </>
    );
};

export default JoinInput;