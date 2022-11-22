import React, { useEffect, useState } from "react";
import styled from "./joinFailed.module.scss";

const JoinFailed = ({index}) => {

    const [failedStyle, setFailedStyle] = useState({left:'', top:''});
    const [content, setContent] = useState('');

    useEffect(() => {
        const left = 30 + '%';
        let top;
        if(index === 1){
            top = 37 + '%';
            setContent('이름을 정확히 입력해주세요!!');
        }else if(index === 2){
            top = 57 + '%';
            setContent('패스워드는 8자 이상 입력해야합니다!!');
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

    },[]);

    return (
        <div className={styled.joinFailed} style={failedStyle}>
            {content}
        </div>
    );

}

export default JoinFailed;