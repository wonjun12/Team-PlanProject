import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "../route/SetPlan.module.scss";
//import Styles from "./Logding.module.scss";

const Hotel = () => {

  const { viewCont, setViewCont } = useContext(ThemeContext);
  const [logding, setLogding] = useState({
    0: {
      address: "",
      check_in: "",
      check_out: "",
      reservation: false,
      price: "",
      memo: "",
    },
  });

  const valueChangeFnc = (e, key, idx, obj) => {
    const changeValue = (key === "reservation") ? e.target.checked : e.target.value;
    const change = { ...obj, [key]: changeValue, }
    setLogding({
      ...logding,
      [idx]: change,
    });
  }

  const hotelAddFnc = () => {
    const idxKey = Object.keys(logding).length;
    setLogding({
      ...logding,
      [idxKey]: {
        address: "",
        check_in: "",
        check_out: "",
        reservation: false,
        price: "",
        memo: "",
      }
    });
  }

  const hotelPostFnc = () => {
    //hotel post
    console.log(logding);
    //setViewCont(0);
  }

  return (
    <div className={Styles.logdingWrap}>
      <p>숙소 설정</p>
      {Object.entries(logding).map(([idx, obj]) => (
        <div className={Styles.logdingDiv} key={idx}>
          <label htmlFor={`address${idx}`}>
            주소<br/>
            <input type="text" id={`address${idx}`}
              value={obj.address}
              onChange={(e) => valueChangeFnc(e, "address", idx, obj)}
            />
          </label>
          <label>
            숙박일정
            <div className={Styles.logDateDiv}>
              <input type="date"
                value={obj.check_in}
                onChange={(e) => valueChangeFnc(e, "check_in", idx, obj)}
              />
              <p className={Styles.dateText}>~</p>
              <input type="date"
                value={obj.check_out}
                onChange={(e) => valueChangeFnc(e, "check_out", idx, obj)}
              />
            </div>
          </label>
          
          <label htmlFor={`reservation${idx}`}>
            <input type="checkbox" id={`reservation${idx}`} checked={obj.reservation}
              onChange={(e) => valueChangeFnc(e, "reservation", idx, obj)}
            />
            예약완료
          </label>

          <label htmlFor={`price${idx}`}>
            숙소가격<br/>
            <input type="number" id={`price${idx}`}
            value={obj.price}
            onChange={(e) => valueChangeFnc(e, "price", idx, obj)}
            />
          </label>
          
          <label htmlFor={`memo${idx}`}>
            메모<br/>
            <textarea id={`memo${idx}`} rows="5"
              value={obj.memo}
              onChange={(e) => valueChangeFnc(e, "memo", idx, obj)}
            ></textarea>
          </label>
          
        </div>
      ))}
      <input type="button" value="숙소추가" onClick={hotelAddFnc} />
      <input type="button" value="완료" onClick={hotelPostFnc} />
    </div>
  );
}

export default Hotel;