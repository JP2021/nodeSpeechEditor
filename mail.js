const nodemailer = require("nodemailer");

module.exports = async (to, subject, html) => {
    const smtpTransport = nodemailer.createTransport({
        name: process.env.SMTP_USERNAME,
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    var message = {
        to,
        from: process.env.SMTP_USERNAME,
        subject,
        html // Ensure this property is set
    };

    try {
        await smtpTransport.sendMail(message);
        console.log("E-mail enviado com sucesso");
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        smtpTransport.close();
    }
};
