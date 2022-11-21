import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "./SetPlan.module.scss";

const Hotel = () => {

  const { viewCont, setViewCont } = useContext(ThemeContext);
  const [hotelPlan, setHotelPlan] = useState([
    {
      address: "",
      check_in: "",
      check_out: "",
      reservation: "",
      price: "",
      memo: "",
    },
  ]);

  const inputChangeFnc = (e, key, idx) => {
    setHotelPlan(hotelPlan.map((hotelObj, objIdx) => 
      idx === objIdx ? 
        {...hotelObj, [key]: e.target.value} : hotelObj
    ));
  }

  const hotelAddFnc = () => {
    const hotelObj = {
      address: "",
      check_in: "",
      check_out: "",
      reservation: "",
      price: "",
      memo: "",
    }
    setHotelPlan([...hotelPlan, hotelObj]);
  }

  const hotelPostFnc = () => {
    //hotel post
    setViewCont(0);
  }

  return (
    <div  className={Styles.planWrap}>
      {hotelPlan.map((_,idx) => {
        return(
          <div key={idx} className={Styles.planDiv}>
            <label htmlFor="address">주소 : </label>
            <input type="text" id="address"
              value={hotelPlan.address}
              onChange={(e) => inputChangeFnc(e, "address", idx)}
            />
            <label htmlFor="check_in">체크인 : </label>
            <input type="text" id="check_in"
              value={hotelPlan.check_in}
              onChange={(e) => inputChangeFnc(e, "check_in", idx)}
            />
            <label htmlFor="check_out">체크아웃 : </label>
            <input type="text" id="check_out"
              value={hotelPlan.check_out}
              onChange={(e) => inputChangeFnc(e, "check_out", idx)}
            />
            <label htmlFor="reservation">예약 유무 : </label>
            <input type="text" id="reservation"
              value={hotelPlan.reservation}
              onChange={(e) => inputChangeFnc(e, "reservation", idx)}
            />
            <label htmlFor="price">가격 : </label>
            <input type="text" id="price"
              value={hotelPlan.price}
              onChange={(e) => inputChangeFnc(e, "price", idx)}
            />
            <label htmlFor="memo">메모 : </label>
            <input type="text" id="memo"
              value={hotelPlan.memo}
              onChange={(e) => inputChangeFnc(e, "memo", idx)}
            />
          </div>
          );
      })}
      <input type="button" value="숙소추가" onClick={hotelAddFnc} />
      <input type="button" value="완료" onClick={hotelPostFnc} />
    </div>
  );
}

export default Hotel;