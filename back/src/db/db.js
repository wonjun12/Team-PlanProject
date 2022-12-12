const mongoose = require('mongoose');

//table 여부 확인후 없을시 새로 만듬 (table 참고함)
mongoose.connect(process.env.DB_URL);

//db 연결 후 상태 확인
const db = mongoose.connection;

//on => 여러반 실행
db.on('error', (err) => {
    console.log('db error', err);
});
//once => 한번만 실행
db.once('open', () => {
    console.log('db open')
});