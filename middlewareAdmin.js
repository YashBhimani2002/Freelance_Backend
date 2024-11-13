const jwt = require('jsonwebtoken');
const { ErrorHandler } = require("postmark/dist/client/errors/ErrorHandler");
const userController = require('./controller/userController');

const middlewareAdmin = async (req, res, next) => {
    const { authToken } = req.cookies;
    const route = req.originalUrl || req.path;
    const secretKey = process.env.JWT_SECRET;
    if (!authToken) {
        res.clearCookie('authToken');
        res.status(200).json({ success: false, message: 'Logout' });
    } else {
        try {
            jwt.verify(authToken, secretKey, (err, decoded) => {
                if (err) {
                    res.status(200).json({ success: false, message: 'Logout', error: err });
                } else {
                    req.user = decoded;
                    if (route === '/verify-token-admin') {
                        req.authToken = authToken;
                        res.status(200).json({ success: true, message: 'Verified' });
                    } else if (route === '/logout') {
                        const user = decoded; // Get user information from decoded object
                        return res
                            .status(200)
                            .cookie('authToken', '', {
                                expiresIn: new Date(0),
                            })
                            .json({ success: true, message: 'Login Successful', id: user._id });
                    }
                    next();
                }
            });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = {
    middlewareAdmin,
};