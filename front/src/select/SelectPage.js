import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from 'react-router-dom'
import styled from "./selectPage.module.scss";
import loginCheck from "../check/loginCheck";
import axiosPost from "../Axios/backAxiosPost";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";

const SelectPage = () => {

    const navigate = useNavigate();
    const [buttonDisable, setButtonDisable] = useState(true);

    const [pwdChangDiv, setPwdChangeDiv] = useState(false);
    const [password, setPassword] = useState({hashPwd: '',pwd:'', pwdCk:''});
    const [passwordError, setPasswordError] = useState({pwdError:'', pwdCkError:''})

    const changeAni = () => {
        const selectedId = document.getElementById("selectedId");
        selectedId.style.transform = 'rotateY(90deg)';
        selectedId.style.transition = 'all 3s';
    };


    useEffect(() => {
        loginCheck();
        setTimeout(() => {
            setButtonDisable(false);
        }, 3100)
    },[])

    const setPlan = () => {
        setButtonDisable(true);
        changeAni();
        setTimeout(() => {
            navigate('/newplan');
        },3100)
    }

    const toMypage = () => {
        setButtonDisable(true);
        changeAni();
        setTimeout(() => {
            navigate('/mypage');
        },3100)
    }


    const passwordInsert = (e) => {
        const pwd = e.target.value;
        const pwdRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

        if(!pwdRegEx.test(pwd)){
            setPasswordError({pwdError: '8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.', pwdCkError:''});
        }else if(pwd !== password.pwdCk && !!password.pwdCk){
            setPasswordError({pwdError: '', pwdCkError: '비밀번호가 일치하지않습니다.'});
        }else {
            setPasswordError({pwdError: '', pwdCkError:''});
        }

        setPassword({...password, pwd});
    }

    const passwordCkInsert = (e) => {
        const pwdCk = e.target.value;

        if(pwdCk !== password.pwd){
            setPasswordError({...passwordError, pwdCkError: '비밀번호가 일치하지않습니다.'});
        }else{
            setPasswordError({pwdError: '', pwdCkError:''});
        }

        setPassword({...password, pwdCk});
    }

    const passwordChange = async (e) => {
        e.preventDefault();
        
        if(!!password.pwd && !!password.hashPwd && !!password.pwdCk && !passwordError.pwdError && !passwordError.pwdCkError){
            setLoading(true);
            const body = {
                hash : password.hashPwd,
                password : password.pwd
            }
            const {result} = await axiosPost('/user/pwdChange', body);

            if(result){
                setPwdChangeDiv(false);
                setPassword({hashPwd: '',pwd:'', pwdCk:''});
            }else{
                alert('잘못된 비밀번호를 입력하셧습니다.')
            }
            setLoading(false);

        }else{
            alert('비밀번호를 확인하세요')
        }
    }


    const pwdRef = useRef();

    const passwordView = () => {
        pwdRef.current.animate([
            {
                height : '0px'
            },{
                height : '200px'
            }
        ], 320)
    }

    useEffect(() => {
        if(pwdChangDiv){
            passwordView();
        }
    }, [pwdChangDiv])

    const deleteUser = async () => {
        Swal.fire({
            title: '정말로 탈퇴하시겠습니까?',
            text: "작성한 계획표들도 전부 삭제됩니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제!',
            cancelButtonText : '취소'
          }).then(async (result) => {
            if (result.isConfirmed) {

                setLoading(true);
                await axiosPost('/user/deleteUser',{}, '/');
        
                Swal.fire(
                    '삭제 완료!!',
                    '정상적으로 삭제되었습니다!.',
                    'success'
                  )


              
            }
          })
        
    }

    const [loading, setLoading] = useState(false);

    return(
        <>
            {loading && <Loading/>}
            <div id="selectedId" className={styled.selectDiv}>
                <div>
                    <button onClick={setPlan} disabled={buttonDisable}> 계획표 작성 </button>
                    <button onClick={toMypage} disabled={buttonDisable}> 나의 계획표 </button>
                    <button disabled={buttonDisable} onClick={() => setPwdChangeDiv(true)}> 비밀번호 변경 </button>
                </div>
            </div>
            { (pwdChangDiv)?
            <form  className={styled.pwdDiv}> 
                <div ref={pwdRef}>
                    <input value={password.hashPwd} onChange={(e) => {
                        const hashPwd = e.target.value;
                        setPassword({...password, hashPwd});
                        }} type='password' placeholder="기존 비밀번호"/>
                    <input value={password.pwd} onChange={passwordInsert} type='password' placeholder="변경할 비밀번호" />
                        <p className={styled.pwdErr}>{passwordError.pwdError}</p>
                    <input value={password.pwdCk} onChange={passwordCkInsert} type='password' placeholder="변경할 비밀번호 확인" />
                        <p className={styled.pwdCkErr}>{passwordError.pwdCkError}</p>
                    <div>
                        <button type="button" onClick={() => setPwdChangeDiv(false)}> 취소 </button>
                        <button onClick={passwordChange}> 비밀번호 변경 </button>
                        <button onClick={deleteUser} type="button"> 회원 탈퇴 </button>
                    </div>
                </div>
            </form>: 
            null
            }
        </>
    );
};

export default SelectPage;