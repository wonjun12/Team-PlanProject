import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Styles from "./ViewPlan.module.scss";
import Loading from '../loading/Loading';
import axios from "axios";
import { CreateLineMap, SetMap } from "../naver/NaverApi";

import ViewPlans from "../CreatePDF/CreatePDF";

const ViewPlan = () => {

  //PDF 
  const pdfDown = ViewPlans();
  const pdfRef = useRef();

  //nav translate
  const [currentIndex, setCurrentIndex] = useState(0);

  //일정 open index
  const [open, setOpen] = useState(0);

  //상세일정 open index
  const [detailCk, setDetailCk] = useState(0);

  //Plan ID
  const { id } = useParams();

  //map 초기화
  const [ismap, setIsmap] = useState(true);

  //로딩 state
  const [loading, setLoading] = useState(false);

  //여행 기본 계획 = date, start, lodging
  const [plan, setPlan] = useState({});

  //일별 계획
  const [dayPlan, setDayPlan] = useState([]);

  //날짜 view
  const [navState, setNavState] = useState({
    dateArr: [],
    view: 0,
  });

  //PlanData 가져오기
  const setPlanData = async () => {
    setLoading(true);
    const res = await axios.get(`/back/plan/${id}/overallPlan`);
    setPlan(res.data.plan);

    //날짜 배열 set / view 변경
    const start = new Date(res.data.plan.start);
    const end = new Date(res.data.plan.end);
    const days = getDays(start, end);

    let dayArr = []
    let arr = [];
    let date = start;
    for (let i = 0; i < parseInt(days); i++) {
      //날짜 nav 만들기
      const dateStr = getDate(date);
      arr.push(
        dateStr
      );
      date.setDate(date.getDate() + 1);

      //비어있는 Arr를 day만큼 만들고 data를 따로 넣는다
      dayArr.push({
        details: [],
        distance: 0,
        duration: 0,
        point: [],
      });
    }

    for (let i = 0; i < dayArr.length; i++) {
      dayArr[res.data.days[i]?._id.day] = res.data.days[i];
    }

    if (res.data.days?.length > 0) {
      //지도 경로 출력
      CreateLineMap(res.data.days[navState.view].point);
    }
    setLoading(false);
    setDayPlan(dayArr);
    setNavState({ dateArr: arr, view: 0 });
  }

  //날짜 가져오기 
  const getDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const day = date.getDay();

    // return `${yyyy}-${mm}-${dd}`;

    //요일 숫자로 넘기기
    const dayStr = ["일", "월", "화", "수", "목", "금", "토"];
    return `${yyyy}-${mm}-${dd}-${dayStr[day]}`;
  }

  //일자 계산
  const getDays = (start, end) => {
    const time = Math.abs(start.getTime() - end.getTime());
    return Math.ceil(time / (1000 * 60 * 60 * 24)) + 1;
  }

  //Nav 화살표 이동
  const navPrevFnc = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }
  const navNextFnc = () => {
    if (currentIndex < navState.dateArr.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  useEffect(() => {
    setOpen(0);
    setDetailCk(0);

    //지도 경로 출력
    CreateLineMap(dayPlan[navState.view]?.point);
  }, [navState.view])

  useEffect(() => {
    setPlanData();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div style={{ position: 'absolute', left: '9999%', height: 'auto' }}>
        {pdfDown.MainDiv(pdfRef, plan, dayPlan)}
      </div>
      <div className={Styles.container}>
        <div className={Styles.navDiv}>
          <span className={Styles.prevBtn} onClick={navPrevFnc}>◀</span>
          <span className={Styles.nextBtn} onClick={navNextFnc}>▶</span>
          {navState.dateArr.map((date, idx) => {
            if (navState.view === idx) {
              return (
                <div onClick={() => setNavState({ ...navState, view: idx })} key={idx}
                  style={{
                    transform: `translate(-${currentIndex * 100}%)`,
                    backgroundColor: 'rgba(183, 182, 182, 0.5)',
                  }}>
                  {date}
                </div>
              );
            } else {
              return (
                <div onClick={() => setNavState({ ...navState, view: idx })} key={idx}
                  style={{ transform: `translate(-${currentIndex * 100}%)` }}>
                  {date}
                </div>
              );
            }
          })}
          <div onClick={() => { pdfDown.douwnloadPDF(pdfRef, '계획표 다운로드') }}
            style={{ transform: `translate(-${currentIndex * 100}%)` }}>
            PDF Print ▷
          </div>
        </div>

        <div className={Styles.titleDiv}>
          <h2>{plan.title}</h2>
        </div>

        <div className={Styles.dayPlanWrap}>
          <div className={Styles.mapDiv}>
            {ismap && <SetMap />}
            <div className={Styles.distanceDiv}>
              <span>거리 : {Math.round(dayPlan[navState.view]?.distance / 1000)}km</span>
              {(((dayPlan[navState.view]?.duration / 60000) / 60) >= 1) ? (
                <span>시간 : {Math.floor((dayPlan[navState.view]?.duration / 60000) / 60)}시간 {Math.ceil((dayPlan[navState.view]?.duration / 60000) % 60)}분</span>
              ) : (
                <span>시간 : {Math.floor((dayPlan[navState.view]?.duration / 60000))}분</span>
              )}
            </div>
          </div>
          <div className={Styles.dayPlanDiv}>
            {(navState.view === navState.dateArr.length - 1) && (
              <div className={Styles.lastLocDiv}>
                <h3>최종 도착지</h3>
                <div>
                  <p>{dayPlan[navState.view].details[0]?.last.location}</p>
                  <p>{dayPlan[navState.view].details[0]?.last.addr}</p>
                </div>
              </div>
            )}
            {(dayPlan[navState.view]?.details.length === 0)
              && <h1 className={Styles.noPlan}>계획을 작성해주세요!</h1>}
            {dayPlan[navState.view]?.details.map((obj, idx) => {
              let hour = Math.floor(obj.time / 60);
              let minute = Math.floor(obj.time % 60);

              return (
                <div className={Styles.planDiv} key={idx}>
                  <div className={Styles.openDiv}>
                    {idx > 0 ? (
                      <h3>{idx}번째 일정</h3>
                    ) : (
                      <h3>출발지</h3>
                    )}
                    <span className={Styles.openSpan} onClick={() => setOpen(idx)}>
                      {(open === idx) ? '●' : '▼'}
                    </span>
                  </div>
                  {(open === idx) &&
                    <div className={Styles.infoDiv}>
                      <div className={Styles.addDiv}>
                        <h3>{obj.location}</h3>
                        <p>{obj.addr}</p>
                      </div>
                      {idx > 0 && (
                        <div className={Styles.timeDiv}>
                          <h3>활동 시간</h3>
                          <p>{hour}시간 {minute}분</p>
                        </div>
                      )}
                      <div className={Styles.detailBtnDiv}>
                        {idx > 0 ? (<h3>상세 일정</h3>) : (<h3>메모</h3>)}
                        <span onClick={() => setDetailCk(!detailCk)}>
                          {(detailCk) ? '▲' : '▼'}
                        </span>
                      </div>
                      {(detailCk === true) && (
                        <div className={Styles.detailDiv}>
                          {idx > 0 && (
                            <>
                              {obj.reservation && <h3>예약 OK</h3>}
                              <h3>예상 가격</h3>
                              <p>{obj.price}</p>
                            </>
                          )}
                          {idx > 0 && (<h3>메모</h3>)}
                          <textarea rows='5' value={obj.memo} disabled />
                        </div>
                      )}
                    </div>}
                </div>
              );
            })}
            <div className={Styles.editBtnDiv}>
              <input className={Styles.editBtn} type='button' value='수정하기'
                onClick={() => window.location.href = `/editplan/${id}`} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewPlan;