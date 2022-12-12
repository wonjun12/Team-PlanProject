import { useEffect, useRef, useState } from 'react';
import axiosGet from '../Axios/backAxiosGet';
import axiosPost from '../Axios/backAxiosPost';
import styled from './MyPage.module.scss';
import {useNavigate} from 'react-router-dom'
import Loading from '../loading/Loading';
import Swal from 'sweetalert2';

const MyPage = () => {
    const navigate = useNavigate();

    const [isDrag, setIsDrag] = useState(false);
    const [mouseX, setMouseX] = useState();
    const [moveDiv, setMoveDiv] = useState(0);
    const pageDiv = useRef()

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(true);

    
    const onDragStart = (e) => {
        e.preventDefault();
        setMouseX(e.pageX);
        setIsDrag(true);
    }

    const onDragEnd = () => {
        const maxWidth =  (plans.length < 4)? 0 : (1300 - pageDiv.current.offsetWidth);
                
        setIsDrag(false);
        
        if(moveDiv > 0){
            setMoveDiv(0);
        }else if(maxWidth > moveDiv){
            setMoveDiv(maxWidth);
        }
    }

    const  onDragMove = (e) => {
        if(isDrag){
            const left = e.pageX - mouseX;
            setMoveDiv((v) => v + (left / 1.5));
            setMouseX(e.pageX)
        }
    }

    const toHref = (plan) => {
        navigate(plan)
    }

    const setDate = (day) => {
        const weeks = ['일', '월', '화', '수', '목', '금', '토']
        const days = new Date(day);
        return `${days.getFullYear()}-${days.getMonth() + 1}-${days.getDate()} (${weeks[days.getDay()]})`
    }

    const getPlan = async () => {
        const data = await axiosGet('/plan');
        if(data.result){
            setPlans(data.plans);
            setLoading(false);   
        }
    }

    const deletePlan = async (id) => {

        Swal.fire({
            title: '정말로 삭제하시겠습니까?',
            text: "삭제 후 되돌릴수 없습니다!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제!',
            cancelButtonText : '취소'
          }).then(async (result) => {
            if (result.isConfirmed) {

                setLoading(true);
                const data = await axiosPost('/plan/deletePlan', {
                    PlanId : id
                })
        
                if(data.result){
                    await getPlan();
                    setLoading(false);

                    Swal.fire(
                        '삭제 완료!!',
                        '정상적으로 삭제되었습니다!.',
                        'success'
                      )
                }

              
            }
          })
        
    }

    useEffect(() => {
        getPlan();
    }, [])


    return (
        (loading)? <Loading/> :
    (!!plans.length) ? 
    <>
        
            <div ref={pageDiv} style={{left:`${moveDiv}px`}} className={styled.myPageMain}
                onMouseDown={onDragStart}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                onMouseMove={onDragMove}
            >            

                {plans.map(({title, start, end, _id, createdAt}, index) => {
                    return (
                        <div className={styled.plans} key={index}>
                            <div className={styled.title}>
                                <h2>{title}</h2>
                            </div>
                            <div className={styled.dates}>
                                <h3>
                                    <p>{setDate(start)}</p>
                                    <p> ~ </p>
                                    <p>{setDate(end)}</p>
                                </h3>
                            </div>
                            <div className={styled.buttonDiv}>
                                <span onClick={() => {deletePlan(_id)}}> 
                                    삭제 
                                </span>
                                <button onClick={() => toHref(`/viewplan/${_id}`)}>
                                    보기
                                </button>
                            </div>
                        </div>
                    )
                })}
        </div>
    </>
    : 
    <div className={styled.notPlan}>
        <div onClick={() => toHref('/select')}> 
                <img src='/img/back.png' />
         </div>
        <h2>작성한 계획표가 없습니다!</h2>
    </div>
    );
}

export default MyPage;