import { forwardRef, useEffect, useRef } from "react";

const {naver} = window;

const Map = {
    map : [],
    line : [],
    makers : []
};

const SetMap = forwardRef(({count, isSearch, addr, path}, MapRef) => {

    const SearchMap =  (addr, idx) => {

        naver.maps.Service.geocode({
                    query: addr
                }, (stat, res) => {
        
                    if(stat !== naver.maps.Service.Status.ERROR && res.v2.meta.totalCount !== 0){
                        const item = res.v2.addresses[0];
                        const point = new naver.maps.Point(item.x, item.y);

                        const marker = new naver.maps.Marker({
                                position: new naver.maps.LatLng(point),
                                map: Map.map[idx]
                        });

                        Map.makers.push(marker);
                        Map.map[idx].setCenter(point);
                        Map.map[idx].setZoom(13);

                    }
                });
    };

    const CreateLineMap = (searchLine, idx) => {

        const maps = Map.map[idx];
    
        const polyLine = new naver.maps.Polyline({
            map: maps,
            path: searchLine,
            strokeColor: '#5347AA',
            strokeOpacity: 1,
            strokeWeight: 5
        });
    
        Map.line.push(polyLine);
    };

    const createMap = () => {
        const mapOptions = {
            center: new naver.maps.LatLng(36.234185, 127.8913631),
            // minZoom:7,
            // maxZoom:15,
            zoom : 7,
            // zoomControl: true, //줌 컨트롤의 표시 여부
            // scrollWheel: false, //스크롤 사용 여부
        };

        const maps = new naver.maps.Map(MapRef[count], mapOptions);

        Map.map.push(maps);

        
    };

    useEffect(() => {        
        createMap();
        if(!!isSearch){
            SearchMap(addr, count)
        }else{
            CreateLineMap(path, count)
        }
    }, [count])


    const style = {
        width: '100%',
        height: '100%'
    }

    return (
        <div style={style}>
        </div>
    );
})

export default SetMap;