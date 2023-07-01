const jwt = require('jsonwebtoken');
const jwtOptions = {
    expiresIn: '24h'
};
const db = require('../models/index.js');
const sendEmail = require('../utils/sendEmail.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Function to generate a random string between 12 to 24 characters including at least one uppercase letter, one lowercase letter, one number, and one special character
function generateRandomString(minLength, maxLength) {
    const specialChars = '!@#$%^&*()_+{}[]|:;"<>,.?/~`-=';

    const getRandomCharacter = (characters) => {
        return characters.charAt(Math.floor(Math.random() * characters.length));
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const randomLength = getRandomInt(minLength, maxLength);

    let randomString = '';

    // Add at least one uppercase letter, lowercase letter, number, and special character
    randomString += getRandomCharacter('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    randomString += getRandomCharacter('abcdefghijklmnopqrstuvwxyz');
    randomString += getRandomCharacter('0123456789');
    randomString += getRandomCharacter(specialChars);

    const remainingLength = randomLength - 4;

    // Add random characters to meet the desired length
    for (let i = 0; i < remainingLength; i++) {
        const randomGroup = getRandomInt(1, 3);

        switch (randomGroup) {
            case 1:
                randomString += getRandomCharacter('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
                break;
            case 2:
                randomString += getRandomCharacter('abcdefghijklmnopqrstuvwxyz');
                break;
            case 3:
                randomString += getRandomCharacter('0123456789');
                break;
        }
    }

    // Shuffle the characters in the string
    const shuffledString = randomString
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    return shuffledString;
}

// passwordReset request
exports.passwordReset_request = (req, res) => {
    try {
        db.user.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (!user) {
                res.sendStatus(404);
            }
            const token = jwt.sign({
                id: user.id
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            sendEmail(user.email, 'Password Reset Request', 'Please click the link below to reset your password:\n' + process.env.SV_URL + '/passwordReset/' + token + '\n\nYou will find your new password between quotes - ex: "My*New$Password".\n\nThis link will expire in 1 hour.');
            res.status(200).json(token);
        }).catch(err => {
            res.status(500).json(err);
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

// passwordReset reset
exports.passwordReset_reset = (req, res) => {
    try {
        jwt.verify(req.params.token, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            }
            db.user.findByPk(authData.id).then(user => {
                if (!user) {
                    res.sendStatus(404);
                }
                const randomPassword = generateRandomString(12, 24);
                bcrypt.hash(randomPassword, saltRounds, (err, hash) => {
                    if (err) {
                        res.status(500).json(err);
                    }
                    db.user.update({
                        password: hash || randomPassword
                    }, {
                        where: {
                            id: authData.id
                        }
                    }).then(data => {
                        res.status(200).json(randomPassword);
                    }).catch(err => {
                        res.status(500).json(err);
                    });
                });
            }).catch(err => {
                res.status(500).json(err);
            });
        });
    } catch (err) {
        res.status(500).json(err);
    }
}