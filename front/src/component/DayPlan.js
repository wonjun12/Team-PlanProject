import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { DayContext } from "./SetDayPlan";
import Styles from "./DayPlan.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SetMap, SearchMap, CreateLineMap, PullSearchMap } from '../naver/NaverApi';
import Directions from '../naver/Directions';

const DayPlans = () => {

  // id : planID
  const { id, day } = useParams();

  const navigate = useNavigate();

  const { dateArr, plan, navState, setNavState, setLoading, editCk } = useContext(DayContext);

  const [edit, setEdit] = useState(false);

  //지도 초기화 state
  const [ismap, setIsmap] = useState(true);

  //일정 open index
  const [open, setOpen] = useState(0);

  //상세 설정 CK
  const [detailCk, setDetailCk] = useState(false);

  //시간 input Ref
  const hourRef = useRef();
  const minuteRef = useRef();

  //숙소 정보 불러오기 select Ref
  const selectRef = useRef();

  //하루 일정 state
  const [dayPlan, setDayPlan] = useState([{
    id: "",
    address: "",
    location: "",
    reservation: false,
    price: "",
    time: 0,
    memo: "",
    lastLocation: "",
    lastAddress: ""
  }]);

  //경로 정보
  const [distanceInfo, setDistanceInfo] = useState({
    path: [],
    distance: 0,
    duration: 0,
  });

  //onchange 함수
  const inputChangeFnc = (e, key, idx) => {

    let changeValue;

    if (key === "time") {
      changeValue = (hourRef.current.value * 60) + (minuteRef.current.value * 1);
    } else if (key === "reservation") {
      changeValue = e.target.checked;
    } else {
      changeValue = e.target.value;
    }

    let copy = [...dayPlan];

    copy[idx] = {
      ...copy[idx],
      [key]: changeValue,
    }
    setDayPlan(copy);
  }

  //일정 추가
  const dayPlanAddFnc = () => {
    const dayPlanObj = {
      id: "",
      address: "",
      location: "",
      reservation: false,
      price: "",
      time: 0,
      memo: "",
      lastLocation: "",
      lastAddress: "",
    }
    setDayPlan([...dayPlan, dayPlanObj]);
    setOpen(dayPlan.length);
    setDetailCk(false);
  }

  //일정 초기화
  const dayPlanReset = () => {
    setDayPlan([{
      id: "",
      address: "",
      location: "",
      reservation: false,
      price: "",
      time: 0,
      memo: "",
      lastLocation: "",
      lastAddress: "",
    }]);
  }

  //일정 삭제
  const deleteFnc = (delIdx) => {
    if (delIdx > 0) {
      setDayPlan(dayPlan.filter((_, idx) => idx !== delIdx));
      setOpen(delIdx - 1);
      setDetailCk(false);
    }
  }

  //경로 좌표 가져오기
  const getPath = async (plan) => {

    let pointArr = [];
    try {
      setLoading(true);
      for (let i = 0; i < plan.length; i++) {
        //좌표 가져오기
        const point = await PullSearchMap(plan[i].address);
        pointArr.push(point);
      }

      if (parseInt(day) === dateArr.length - 1) {
        //마지막 날 경로 추가
        const point = await PullSearchMap(plan[0].lastAddress);
        pointArr.push(point);
      }
      //전체 경로 정보 가져오기
      const data = await Directions(pointArr);
      setLoading(false);
      return data;
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert('주소를 다시 확인해주세요!');
      return false;
    }
  }

  // 새로 만들기 Post
  const dayPlanPostFnc = async () => {

    //경로 정보 가져오기
    const data = await getPath(dayPlan);

    if (data !== false) {
      await axios.post(`/back/plan/${id}/planDays`, {
        day,
        dayPlan,
        point: data.path,
        distance: data.distance,
        duration: data.duration,
      });

      setOpen(0);
      setDetailCk(false);
      if (navState < dateArr.length - 1) {
        setNavState(navState + 1);
        if(editCk){
          navigate(`/editplan/${id}/${navState + 1}`);  
        }else{
          navigate(`/newplan/${id}/${navState + 1}`);  
        }
      }

    }
  }

  //계획 수정 Post
  const dayPlanEditPostFnc = async () => {

    //경로 정보 가져오기
    const data = await getPath(dayPlan);
    if (data !== false) {
      await axios.post(`/back/plan/${id}/editDay`, {
        day,
        dayPlan,
        point: data.path,
        distance: data.distance,
        duration: data.duration,
      });

      setOpen(0);
      setDetailCk(false);
      if (navState < dateArr.length - 1) {
        setNavState(navState + 1);
        if(editCk){
          navigate(`/editplan/${id}/${navState + 1}`);  
        }else{
          navigate(`/newplan/${id}/${navState + 1}`);  
        }
      }

    }
  }
  //일자별 계획 GET
  const getDayPlan = async () => {
    setLoading(true);

    const res = await axios.get(`/back/plan/${id}/planDays`, {
      params: { day },
    });

    //id까지 가져와서 복사 후 state 저장
    const details = res.data.dayPlan[0]?.details;
    let copyDayArr = [];
    let copyDayPlan = {};
    if (details?.length > 0) {
      for (let i = 0; i < details.length; i++) {
        copyDayPlan = {
          id: details[i]._id,
          address: details[i].addr,
          location: details[i].location,
          reservation: details[i].reser,
          price: details[i].price,
          memo: details[i].memo,
          time: details[i].time,
          lastLocation: "",
          lastAddress: "",
        }
        copyDayArr.push(copyDayPlan);
      }

      //마지막 날짜인 경우 last 정보를 0번째 배열에 넣는다
      if (parseInt(day) === dateArr.length - 1) {
        copyDayArr[0].lastLocation = details[0].last?.location;
        copyDayArr[0].lastAddress = details[0].last?.addr;
      }

      setDistanceInfo({
        path: res.data.dayPlan[0]?.point,
        distance: res.data.dayPlan[0]?.distance,
        duration: res.data.dayPlan[0]?.duration,
      });

      setDayPlan(copyDayArr);
      setEdit(true);

      try {
        CreateLineMap(res.data.dayPlan[0]?.point);
      } catch (error) {
        console.log(error);
      }
    } else {
      //처음 작성하는 계획이면 초기화
      setDistanceInfo({
        path: [],
        distance: 0,
        duration: 0,
      });
      dayPlanReset();
      setEdit(false);

      //지도 라인 초기화
      CreateLineMap([]);

      //지도 마커 초기화
      try {
        await SearchMap('');         
      } catch (error) {}
    }
    setLoading(false);
  }
  //주소 검색
  const searchAddFnc = async (idx) => {
    let result = false;
    try {
      result = await SearchMap(dayPlan[idx].address);
    } catch (error) {
      result = false;
    }
    if (!result) {
      let copy = [...dayPlan];
      copy[idx] = {
        ...copy[idx],
        address: "",
      }
      setDayPlan(copy);
      alert('주소를 다시 검색해주세요');
    }
  }

  //초기 설정 수정으로 돌아가기
  const pageBackFnc = () => {
    window.location.href = `/editplan/${id}`;
  }

  //출발지, 숙소 정보 불러오기
  const getLocInfoFnc = (idx) => {
    if (selectRef.current.value !== 'none') {
      let copy = [...dayPlan];
      if (selectRef.current.value === 'start') {
        //출발지 선택
        copy[idx] = {
          ...copy[idx],
          address: plan.startPlan.address,
          location: `출발지`,
          reservation: false,
        }
      } else {
        //숙소 선택
        let locIdx = parseInt(selectRef.current.value);
        copy[idx] = {
          ...copy[idx],
          address: plan.lodging[locIdx].address,
          location: `${locIdx + 1}번째 숙소`,
          reservation: plan.lodging[locIdx].reservation,
          memo: plan.lodging[locIdx].memo,
        }
      }
      setDayPlan(copy);
    }
  }

  //전체 경로 지도 출력 
  const directionFnc = async () => {
    const data = await getPath(dayPlan);
    try {
      if (data !== false) {
        //전체 경로 Line 그리기
        CreateLineMap(data.path);

        setDistanceInfo({
          path: data.path,
          distance: data.distance,
          duration: data.duration,
        })

      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    //dayPlan get
    getDayPlan();
    setNavState(parseInt(day));
    setOpen(0);
  }, [day])
  return (
    <div className={Styles.dayPlanWrap}>
      <div className={Styles.mapDiv}>
        {ismap && <SetMap />}
        <div className={Styles.distanceDiv}>
          <p>거리 : {Math.round(distanceInfo.distance / 1000)}km</p>
          {(((distanceInfo.duration / 60000) / 60) >= 1) ? (
            <p>시간 : {Math.floor((distanceInfo.duration / 60000) / 60)}시간 {Math.ceil((distanceInfo.duration / 60000) % 60)}분</p>
          ) : (
            <p>시간 : {Math.floor((distanceInfo.duration / 60000))}분</p>
          )}
        </div>
      </div>
      <div className={Styles.dayPlanDiv}>
        {(navState === dateArr.length - 1) && (
          <div className={Styles.lastLocDiv}>
            <label>최종 도착지 이름<br />
              <input type="text" value={dayPlan[0].lastLocation}
                onChange={(e) => inputChangeFnc(e, "lastLocation", 0)}
              />
            </label>
            <label htmlFor="last">최종 도착지 주소*</label>
            <div className={Styles.lastAddDiv}>
              <input id='last' type="text" value={dayPlan[0].lastAddress}
                onChange={(e) => inputChangeFnc(e, "lastAddress", 0)}
              />
              <input type="button" value="검색" onClick={() => searchAddFnc()} />
            </div>
          </div>
        )}
        {dayPlan.map((obj, idx) => {
          let hour = Math.floor(obj.time / 60);
          let minute = Math.floor(obj.time % 60);

          return (
            <div key={idx} className={Styles.planDiv}>
              <div className={Styles.openDiv}>
                {idx > 0 ? (
                  <p>{idx}번째 일정</p>
                ) : (
                  <p>출발지</p>
                )}
                <span className={Styles.openSpan} onClick={() => setOpen(idx)}>
                  {(open === idx) ? '●' : '▼'}
                </span>
              </div>
              {(open === idx) &&
                <>
                  <div className={Styles.logSelectDiv}>
                    <select ref={selectRef}>
                      <option value="none">출발지 or 숙소 선택 </option>
                      <option value='start'>출발지</option>
                      {plan.lodging.map((_, index) => {
                        return <option key={index} value={index}>{index + 1}번째 숙소</option>
                      })}
                    </select>
                    <input type="button" value="주소 불러오기" onClick={() => getLocInfoFnc(idx)} />
                  </div>

                  <div className={Styles.addDiv}>
                    <label htmlFor="address">주소*</label>
                    <div className={Styles.addInputDiv}>
                      <input id="address" type="text" value={obj.address}
                        onChange={(e) => inputChangeFnc(e, "address", idx)}
                      />
                      <input type="button" value="검색" onClick={() => searchAddFnc(idx)} />
                    </div>
                  </div>

                  <div className={Styles.locationDiv}>

                    <label>장소 이름<br />
                      <input type="text" value={obj.location}
                        onChange={(e) => inputChangeFnc(e, "location", idx)}
                      />
                    </label>
                    {idx > 0 && (
                      <div className={Styles.timeDiv}>
                        <label>활동 시간<br />
                          <input type="number" value={hour}
                            step='1' min='0' max='12' ref={hourRef}
                            onChange={(e) => inputChangeFnc(e, "time", idx)}
                          />시간
                          <input type="number" value={minute}
                            step='10' min='0' max='59' ref={minuteRef}
                            onChange={(e) => inputChangeFnc(e, "time", idx)}
                          />분
                        </label>
                      </div>
                    )}
                  </div>

                  <div className={Styles.detailBtnDiv}>
                    {idx > 0 ? (<p>상세 일정</p>):(<p>메모</p>)}
                    <span onClick={() => setDetailCk(!detailCk)}>
                      {(detailCk) ? '▲' : '▼'}
                    </span>
                  </div>

                  {detailCk && (
                    <>
                      {idx > 0 && (
                        <div className={Styles.detailDiv}>
                          <label>
                            <input type="checkbox"
                              checked={obj.reservation}
                              onChange={(e) => inputChangeFnc(e, "reservation", idx)}
                            />예약 완료
                          </label>

                          <label>예상 가격
                            <input type="number"
                              value={obj.price}
                              onChange={(e) => inputChangeFnc(e, "price", idx)}
                            />
                          </label>
                        </div>
                      )}
                      <label>{idx > 0 && '메모'}<br/> 
                        <textarea rows='5' value={obj.memo}
                          onChange={(e) => inputChangeFnc(e, "memo", idx)}
                        />
                      </label>
                    </>
                  )}
                  <input className={Styles.deleteBtn} type="button" value="삭제" onClick={() => deleteFnc(idx)} />
                </>
              }
            </div>
          );
        })}
        <input className={Styles.btn} type="button" value="일정추가" onClick={dayPlanAddFnc} />
        <input className={Styles.btn} type="button" value="경로보기" onClick={directionFnc} />
        {edit ? (
          <input className={Styles.btn} type="button" value="수정완료" onClick={dayPlanEditPostFnc} />
        ) : (
          <input className={Styles.btn} type="button"
            value={(navState === dateArr.length - 1) ? "저장" : "다음"}
            onClick={dayPlanPostFnc} />
        )}
        <input className={Styles.btn} type="button" value="뒤로가기" onClick={pageBackFnc} />
      </div>
    </div>
  );
}

export default DayPlans;