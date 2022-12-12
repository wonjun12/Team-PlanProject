const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PWD
    }
});


module.exports = {
    emailSignMail: async (toMail) => {
        const options = {
            from: `"Plan Team Project" <${process.env.MAIL_ID}>`,
            to: toMail,
            subject: 'Plan 인증 메일입니다.',
            html: `
            <div style='display: flex; flex-direction: row; justify-content: center; flex-wrap:wrap;'>
                <p style='width:100%; font-size:25px; text-align:center; font-weight:bold;'>이메일 사용을 위해 인증을 해주세요!! </p>
                <p>
                    사용자가 원하시는 인증을 완료하실려면 아래의 URL을 클릭해주세요! <br/>
                    ${process.env.BACK_URL}/emailCerti?email=${toMail}&CheckPoint=true
                </p>
            </div
            `
        };
        
        const sendMail = await transporter.sendMail(options);
    },
    pwdChangeMail: async (id, pwd, toMail) => {
        const options = {
            from: `"Plan Team Project" <${process.env.MAIL_ID}>`,
            to: toMail,
            subject: 'Plan 비밀번호 재설정 메일입니다.',
            html: `
            <div style='display: flex; flex-direction: row; justify-content: center; flex-wrap:wrap;'>
                <p style='width:100%; font-size:25px; text-align:center; font-weight:bold;'>비밀번호 재설정 이메일입니다!!! </p>
                <p>
                    잊으신 비밀번호 재설정을 위해 아래의 주소로 접속하여 입력해주세요!!! <br/>
                    ${process.env.BACK_URL}/password?warPoint=${id}&parPoint=${pwd}
                </p>
            </div
            `
        }
        
        const sendMail = await transporter.sendMail(options);
    }
}