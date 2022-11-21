import { useEffect, useState } from "react";
import styled from "./joinTest.module.scss";

const JoinInput = ({toLogin, joinChangeBack}) => {

    const [joinButtonDisable, setJoinButtonDisable] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setJoinButtonDisable(false);
        }, 2950)
    },[])

    const toLoginDisable =() => {
        setJoinButtonDisable(true);
        toLogin();
    };

    return (
        <form id="joinFormId" className={joinChangeBack? styled.joinFormBack : styled.joinForm}>
            <div className={styled.mainJoin}>
               <input/>
               <button type="button" onClick={toLoginDisable} disabled={joinButtonDisable}> 뒤로 </button>
            </div>
        </form>
    );
};

export default JoinInput;