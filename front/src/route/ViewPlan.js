import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Styles from "./ViewPlan.module.scss";
import Loading from '../loading/Loading';
import axios from "axios";
import { CreateLineMap, PullSearchMap, SetMap } from "../naver/NaverApi";
import Directions from "../naver/Directions";

const ViewPlan = () => {

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

    //지도 경로 출력
    await directionFnc(dayArr[0].details);

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
    return Math.ceil(time / (1000 * 60 * 60 * 24));
  }

  //Nav 화살표 이동
  const navPrevFnc = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }
  const navNextFnc = () => {
    if (currentIndex < navState.dateArr.length - 5) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  //전체 경로 지도 출력 
  const directionFnc = async (details) => {

    let pointArr = []
    let i = 0; // 잘 못 입력된 주소 idx
    try {
      setLoading(true);
      setIsmap(true);
      if (details?.length > 0) {
        for (let { addr } of details) {
          //좌표 가져오기
          const point = await PullSearchMap(addr);
          pointArr.push(point);
          i++;
        }
        //마지막 날짜인 경우 last 좌표를 마지막 배열에 넣는다
        if (navState.view === navState.dateArr.length - 1) {
          i = -1;
          const point = await PullSearchMap(details[0].last.addr);
          pointArr.push(point);
          i = 0;
        }

        //전체 경로 정보 가져오기
        const data = await Directions(pointArr);

        //전체 경로 Line 그리기
        await CreateLineMap(data.path);
      }else {
        setIsmap(false);
      }
      setLoading(false);
    } catch (error) {
      //console.log(error);
      setIsmap(true);
      setLoading(false);
      return;
    }
  }

  useEffect(() => {
    setOpen(0);
    setDetailCk(0);
    //지도 경로 그리기
    directionFnc(dayPlan[navState.view]?.details);
  }, [navState.view])

  useEffect(() => {
    setPlanData();
  }, []);

  return (
    <>
      {loading && <Loading />}
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
        </div>

        <div className={Styles.titleDiv}>
          <h2>{plan.title}</h2>
          <input type='button' value='수정하기' 
            onClick={() => window.location.href = `/editplan/${id}`}/>
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
                    <h3>{idx + 1}번째 일정</h3>
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

                      <div className={Styles.timeDiv}>
                        <h3>활동 시간</h3>
                        <p>{hour}시간 {minute}분</p>
                      </div>

                      <div className={Styles.detailBtnDiv}>
                        <h3>상세 일정</h3>
                        <span onClick={() => setDetailCk(!detailCk)}>
                          {(detailCk) ? '▲' : '▼'}
                        </span>
                      </div>
                      {(detailCk === true) && (
                        <div className={Styles.detailDiv}>
                          {obj.reservation && <h3>예약 OK</h3>}
                          <h3>예상 가격</h3>
                          <p>{obj.price}</p>
                          <h3>메모</h3>
                          <textarea rows='5' value={obj.memo} disabled />
                        </div>
                      )}
                    </div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewPlan;