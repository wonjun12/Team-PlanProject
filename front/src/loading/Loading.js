import React from 'react';
import ScaleLoader  from 'react-spinners/ScaleLoader'
import styled from './Loading.module.scss';

//로딩 div 셋팅
const Loading = () => {

    return (
        <div className={styled.loadingMain}>
            <div>
                <ScaleLoader height={60} width={7} radius={5} margin={3} color='#472772'/>
            </div>
        </div>
    );
}
export default Loading;