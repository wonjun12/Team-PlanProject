import axios from "axios";

//날씨 검색 (서울 기준)
const OnGeoOk = async () => {

    //현재 위도,경도
    const lat = 37.566535;
    const lon = 126.9779692;

    //API
    const API_KEY = "29e6fdb8f4a2c1394c290696729a9c86";
    const url = `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const res = await axios.get(url);

    return res.data.weather[0].main;

  }

  export default OnGeoOk;