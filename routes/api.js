var express     = require('express'),
    router      = express.Router(),
    User        = require("../models/user");

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: process.env.TRANSPORTER_SERVICE,
    auth : {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS
    }
});







    router.get("/usernames/checkAvailability/:username", function(req, res) {
        User.count({username : req.params.username}, function(err, count) {
            if (err) {
                res.status(500).json({
                    error : 'internal error'
                })
            }
            count < 1 ? res.json({unique : true}) : res.json({unique : false})
        })
    });

    router.post('/formsubmission', (req, res, next) => {
        let mailOptions = {
            from: 'Tyler',
            to: 'tylerappemail@gmail.com',
            subject: 'New Form Submission',
            text: `name: ${req.body.name}, email: ${req.body.email}, message: ${req.body.message}`
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                res.send('Server error sending email');
            } else {
                
                console.log('Email sent successfully');
                res.send('Server sent email');
            }

        });
    });

    

module.exports = router;
