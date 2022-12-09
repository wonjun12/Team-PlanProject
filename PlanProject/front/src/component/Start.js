import React, { useContext, useEffect, useRef, useState } from "react";
import { PlanContext } from "../context/PlanContext";
import Styles from "./Start.module.scss";
import { SetMap, SearchMap } from '../naver/NaverApi';

const Start = () => {

  const { navState, setNavState, plan, setPlan } = useContext(PlanContext);

  //출발 정보
  const [start, setStart] = useState({
    id: '',
    address: "",
    time: "",
    transportation: "car",
    memo: "",
  });

  //저장
  const startPostFnc = () => {
    console.log('start', start);
    setNavState({
      ...navState,
      view: 'STEP3'
    });
    setPlan({
      ...plan,
      startPlan: start
    });
  }

  //지도 검색
  const searchAddFnc = async () => {
    const searchCK = await SearchMap(start.address, true);
    if (!searchCK) {
      setStart((prev) => ({
        ...prev,
        address: "",
      }))
      alert('주소를 다시 검색해주세요');
    }
  }

  useEffect(() => {
    //수정할 때 get
    setStart(plan.startPlan);
  }, []);
  
  return (
    <div className={Styles.startWrap}>

      <div className={Styles.mapDiv}>
        <SetMap />
      </div>

      <div className={Styles.planDiv}>
        <p>출발지 설정</p>
        <div className={Styles.addDiv}>
          <label htmlFor="address">주소</label>
          <input type="text" id="address" value={start.address}
            onChange={(e) => setStart((prev) => ({
              ...prev,
              address: e.target.value,
            }))}/>
          <input type="button" value="검색" onClick={searchAddFnc} />
        </div>

        <label htmlFor="departure">출발시간</label>
        <input type="time" id="departure"
          value={start.time}
          onChange={(e) => setStart((prev) => ({
            ...prev,
            time: e.target.value,
          }))} />

        <label htmlFor="transportation">이동수단</label>
        <select id="transportation"
          onChange={(e) => setStart((prev) => ({
            ...prev,
            transportation: e.target.value,
          }))}>
          <option value="car">자동차</option>
          <option value="bus">대중교통</option>
          <option value="walk">도보</option>
        </select>

        <label htmlFor="memo">메모</label>
        <textarea id="memo" rows="8"
          value={start.memo}
          onChange={(e) => setStart((prev) => ({
            ...prev,
            memo: e.target.value,
          }))}
        ></textarea>

        <input type="button" value="저장" onClick={startPostFnc} />
      </div>
    </div>
  );
}

export default Start;