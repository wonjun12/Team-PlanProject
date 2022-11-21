const {naver} = window;

let map

export const naverMapSet = (zoom) => {
    const mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom,
        minZoom:10,
        maxZoom:15,
        zoomControl: true, //줌 컨트롤의 표시 여부
        scrollWheel: false, //스크롤 사용 여부
    };

    map = new naver.maps.Map('naverDiv', mapOptions);

};

export const naverMapSearch = (addr) => {
    if(addr !== ''){
        naver.maps.Service.geocode({
            query: addr
        }, (stat, res) => {
            
            if(stat !== naver.maps.Service.Status.ERROR && res.v2.meta.totalCount !== 0){
                const item = res.v2.addresses[0];
                const point = new naver.maps.Point(item.x, item.y);
    
                map.setCenter(point);
            }
            
            
        });
    }
};