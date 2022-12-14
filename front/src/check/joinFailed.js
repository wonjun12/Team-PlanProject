import React, { useEffect, useState } from "react";
import styled from "./joinFailed.module.scss";

const JoinFailed = ({index}) => {

    const [failedStyle, setFailedStyle] = useState({left:'', top:''});
    const [content, setContent] = useState('');

    useEffect(() => {
        const left = 20 + '%';
        let top;
        if(index === 1){
            top = 37 + '%';
            setContent('이름을 정확히 입력해주세요!!');
        }else if(index === 2){
            top = 57 + '%';
            setContent('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요!');
        }else if(index === 3){
            top = 77.5 + '%';
            setContent('패스워드가 서로 다릅니다!!');
        }else {
            top = 16.5 + '%';
            if(index === 0){
                setContent('이메일을 정확히 입력해주세요!!');
            }else if(index === -1){
                setContent('중복된 이메일 입니다!!');
            }
        }

        setFailedStyle({left, top});

    },[index]);

    return (
        <div className={styled.joinFailed} style={failedStyle}>
            {content}
        </div>
    );

}

export default JoinFailed;