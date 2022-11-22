const mailer = require('../mail/mailer');
const bcrypt = require('bcrypt');
const User = require('../db/user');
const Plan = require('../db/plan');
const Calendar = require('../db/calendar');
const Details = require('../db/details');
const Starting = require('../db/starting');
const Lodging = require('../db/lodging');


module.exports = {
    //로그인 체크
    loginCk: async (req, res) => {
        const {loginBool} = req.session;

        if(loginBool){
            res.json({result: true}).end();
        }else{
            res.json({result: false}).end();
        }
    },
    //회원 이메일 체크 and 이메일 인증 체크
    joinEmailCk: async (req, res) => {
        const {email} = req.body;
        const user = await User.exists({email});

        if(user === null){
            res.json({result: true}).end();
        }else{
            res.json({result: false}).end();
        }
    },
    //이메일 인증 적용 및 확인
    emailCerti: async (req, res) => {
        try {
            const {email} = req.body;

            const user = await User.findOneAndUpdate({
                email, 
                emailCk:false
            },{
                emailCk: true
            });

            if(user === null){
                res.json({result:false}).end();
            }else {
                res.json({result: true}).end();
            }
        } catch (error) {
            res.json({result:false}).end();
        }
        
    },
    //로그인
    login: async (req, res) => {
        const {email, password} = req.body;

        const user = await User.findOne({
            email
        });

        if(user !== null){
            const PwdCheck = await bcrypt.compare(password, user.password);
            if(!PwdCheck){
                res.json({result: false}).end();
            }else {
                if(user.emailCk){
                    req.session.loginBool = true;
                    req.session.loginID = user._id;
                    res.json({result: true}).end();
                }else{
                    res.json({result: true, error:'emailCerti', email}).end();
                }
            }
        }else {
            res.json({result: false, error: '존재하지 않는 이메일 입니다!!'}).end();
        }

    },
    //회원가입
    join: async (req, res) => {
        const {email, name, password} = req.body;
        const timeOut = 1000 * 60 * 60;

        await User.create({
            email,
            name,
            password
        });

        
        
        //1시간 후 인증되어 있지 않다면 삭제
        setTimeout(async () => {
            const user = await User.findOne({email});
            if(!(user.emailCk)){
                await User.deleteOne({email:user.email});
            }
        }, timeOut);
        
        //이메일 전송
        await mailer(email);
        
        res.json({result: true, error:'emailCerti', email}).end();
    },
    //로그아웃
    logout: async (req, res) => {
        req.session.destroy();
        res.json({result: true}).end();
    },
    //계획표 작성
    setPlan: async (req, res) => {
        res.send('set plan test');
    },
    //내정보
    mypage: async (req, res) => {
        res.send('myPage test');
    },
    //작성한 계획표 보기
    viewPlan: async (req, res) => {
        res.send('view Plan');
    }
}