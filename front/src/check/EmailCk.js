import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { axiosPost } from "../Axios/backAxios";
import LoginCheck from "./loginCheck";
import styled from "./EmailCk.module.scss";

const EmailCk = () => {

    const emailCerti = new URLSearchParams(useLocation().search);
    const [content, setContent] = useState(['']);
    const [sendMail, setSendMail] = useState(false);

    const emailCertiFnc = async (email) => {
        const {result} = await axiosPost('/user/emailCerti', {email});

        contents(result);
    }

    const contents = (bool) => {
        setContent([
            (!bool)? '잘못된 접근입니다!!!!' 
                        : 
                        [ '사용자 인증이 완료되었습니다!!',
                            <br key={0}/>,
                            '인증을 진행해주셔서 감사합니다!!!',
                            <br key={2}/>],
                <br key={1}/>,
            '잠시후 메인화면으로 넘어갑니다!!'
        ]);

        setTimeout(() => {
            window.location.href = '/';
        }, 1000 * 5);
    }

    useEffect(() => {
        LoginCheck();
        const checkPoint = emailCerti.get('CheckPoint');
        const email = emailCerti.get('email');
        if(checkPoint === 'false'){
            setContent(
                <p>
                    사용할 이메일에 대해 인증메일을 보냈습니다!!<br/><br/>
                    인증 메일을 보낸 후 1시간 이내에<br/>
                    인증을 완료하셔야 로그인이 가능합니다!!! <br/>
                    <p className={styled.pEmail}>(인증 미완료시 해당 계정은 삭제됩니다.)</p>
                </p>
            )
            setSendMail(true);
        }else if(checkPoint === 'true'){
            emailCertiFnc(email);
        }else {
            contents(false);
        }
       
    },[])

    const backHome = () => {
        window.location.href = '/';
    };

    return (
        <div className={styled.emailCk}>
            {content}
            {(sendMail)? <button onClick={backHome}>로그인 화면으로 돌아가기...</button> : null}
        </div>
    );
};

export default EmailCk;