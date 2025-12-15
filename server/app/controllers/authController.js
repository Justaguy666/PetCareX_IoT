import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';

class AuthController {
    register = async (req, res) => {
        try {
            const { email, username, password } = req.body;

            if(!email || !username || !password) {
                return res
                        .status(400)
                        .json({ error: 'Vui lòng điền đầy đủ thông tin' });
            }

            const isExistingEmail = await User.findOne({ email: String(email).toLowerCase().trim() });
            if(isExistingEmail) {
                return res
                        .status(409)
                        .json({ error: 'Email đã tồn tại' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const newUser = new User({
                username: String(username),
                email: String(email),
                password: hashed
            });

            await newUser.save();

            return res
                    .status(201)
                    .json({ 
                        success: 'true',
                        message: 'Tạo tài khoản thành công',
                        data: {
                            id: newUser._id,
                            username: newUser.username,
                            email: newUser.email,
                            createdAt: newUser.createdAt
                        }
                    });
        } catch (error) {
            console.log('[API/AUTH/REGISTER]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if(!email || !password) {
                return res
                        .status(400)
                        .json({ error: 'Vui lòng điền đầy đủ thông tin' });
            }

            const user = await  User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
            if(!user) {
                return res
                        .status(401)
                        .json({ error: 'Email hoặc mật khẩu không đúng' });
            }

            const isPassword = await bcrypt.compare(password, user.password);
            if(!isPassword) {
                return res
                        .status(401)
                        .json({ error: 'Email hoặc mật khẩu không đúng' });
            }

            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);
        
            res.cookie("AccessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000
            });

            const newRefreshToken = new RefreshToken({
                userId: user._id,
                refreshId: refreshToken,
                expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            await newRefreshToken.save();

            return res
                    .status(200)
                    .json({
                        success: 'true',
                        message: `${user.username} đã đăng nhập thành công`,
                        data: {
                            id: user._id,
                            accessToken
                        }
                    })
        } catch (error) {
            console.log('[API/AUTH/LOGIN]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
    }

    refreshToken = async (req, res) => {
        try {
            const oldRefreshToken = req.cookies?.RefreshToken;
            if(!oldRefreshToken) {
                return res
                        .status(401)
                        .json({ error: 'Không tồn tại refresh token' });
            }

            const storedToken = await RefreshToken.findOne({ refreshId: String(oldRefreshToken) });
            if(!storedToken) {
                return res
                        .status(401)
                        .json({ error: 'Refresh token không hợp lệ' });
            }

            if(storedToken.expiredAt < new Date()) {
                return res
                        .status(401)
                        .json({ error: 'Refresh token đã bị thu hồi' });
            }

            const decoded = jwt.verify(
                oldRefreshToken,
                process.env.JWT_REFRESH_KEY
            )

            const userId = decoded.id;

            const accessToken  = this.generateAccessToken({ _id: userId });
            const refreshToken = this.generateRefreshToken({ _id: userId });

            const newRefreshToken = new RefreshToken({
                userId,
                refreshId: refreshToken,
                expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            await Promise.all([
                newRefreshToken.save(),
                RefreshToken.deleteOne({ _id: storedToken._id })
            ]);
            
            res.cookie("RefreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'strict'
            });
          
            return res.status(200).json({
                success: true,
                accessToken
            });
        } catch (error) {
            console.log('[API/AUTH/REFRESHTOKEN]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
    }

    generateAccessToken = (user) => {
        if (!process.env.JWT_ACCESS_KEY) {
            console.log('JWT_ACCESS_KEY is missing');
        }
        return jwt.sign(
            { 
                id: user._id
            },
            process.env.JWT_ACCESS_KEY,
            { 
                expiresIn: '15m' 
            }
        );
    }

    generateRefreshToken = (user) => {
        if (!process.env.JWT_REFRESH_KEY) {
            console.log('JWT_REFRESH_KEY is missing');
        }
        return jwt.sign(
            { 
                id: user._id
            },
            process.env.JWT_REFRESH_KEY,
            { 
                expiresIn: '30d' 
            }
        );
    }

    logout = async (req, res) => {
        try {
            const refreshToken = req.cookies?.RefreshToken;

            if (refreshToken) {
                await RefreshToken.deleteOne({ refreshId: refreshToken });
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                    path: '/'
                });
            }

            return res.status(200).json({ 
                success: true,
                message: "Đăng xuất thành công"
            });
        } catch (error) {
            console.log('[API/AUTH/LOGOUT]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
    }
}

export default new AuthController();