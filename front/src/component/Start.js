import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "./Start.module.scss";
import { SetMap, SearchMap } from '../naver/NaverApi';

const Start = ({ startPlan, setStartPlan }) => {

  const { setView } = useContext(ThemeContext);

  //출발 정보
  const [start, setStart] = useState({
    address: "",
    time: "",
    transportation: "car",
    memo: "",
  });

  const addRef = useRef(null);

  const startPostFnc = () => {
    setView("STEP3");
    setStartPlan(start);
  }

  const searchAddFnc = async () => {

    const searchCK = await SearchMap(addRef.current.value, true);
    if (searchCK) {
      setStart({
        ...start,
        address: addRef.current.value
      });
    }
  }

  useEffect(() => {
    //수정할 때 get
    if(startPlan.address !== ""){
      addRef.current.value = startPlan.address;
    }
    setStart(startPlan);
  }, []);
  
  console.log(start);

  return (
    <div className={Styles.startWrap}>

      <div className={Styles.mapDiv}>
        <SetMap />
      </div>

      <div className={Styles.planDiv}>
        <p>출발지 설정</p>
        <div className={Styles.addDiv}>
          <label htmlFor="address">주소</label>
          <input type="text" id="address" ref={addRef} />
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

        <input type="button" value="다음" onClick={startPostFnc} />
      </div>
    </div>
  );
}

export default Start;