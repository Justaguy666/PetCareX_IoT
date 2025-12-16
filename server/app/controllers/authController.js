import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import crypto from "crypto";
import sendMail from "../../services/mail.js";

class AuthController {
  register = async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res
          .status(400)
          .json({ error: "Vui lòng điền đầy đủ thông tin" });
      }

      const isExistingEmail = await User.findOne({
        email: String(email).toLowerCase().trim(),
      });
      if (isExistingEmail) {
        return res.status(409).json({ error: "Email đã tồn tại" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const newUser = new User({
        username: String(username),
        email: String(email),
        password: hashed,
      });

      await newUser.save();

      return res.status(201).json({
        success: "true",
        message: "Tạo tài khoản thành công",
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      });
    } catch (error) {
      console.log("[API/AUTH/REGISTER]: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Vui lòng điền đầy đủ thông tin" });
      }

      const user = await User.findOne({
        email: String(email).toLowerCase().trim(),
      }).select("+password");
      if (!user) {
        return res
          .status(401)
          .json({ error: "Email hoặc mật khẩu không đúng" });
      }

      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) {
        return res
          .status(401)
          .json({ error: "Email hoặc mật khẩu không đúng" });
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      res.cookie("AccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      const newRefreshToken = new RefreshToken({
        userId: user._id,
        refreshId: refreshToken,
        expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await newRefreshToken.save();

      return res.status(200).json({
        success: "true",
        message: `${user.username} đã đăng nhập thành công`,
        data: {
          id: user._id,
          accessToken,
        },
      });
    } catch (error) {
      console.log("[API/AUTH/LOGIN]: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  refreshToken = async (req, res) => {
    try {
      const oldRefreshToken = req.cookies?.RefreshToken;
      if (!oldRefreshToken) {
        return res.status(401).json({ error: "Không tồn tại refresh token" });
      }

      let decoded;
      try {
        decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_KEY);
      } catch {
        return res.status(401).json({ error: "Refresh token không hợp lệ" });
      }

      const storedToken = await RefreshToken.findOne({
        refreshId: oldRefreshToken,
        userId: decoded.id,
      });

      if (!storedToken) {
        return res.status(401).json({ error: "Refresh token không hợp lệ" });
      }

      if (storedToken.expiredAt < new Date()) {
        return res.status(401).json({ error: "Refresh token đã bị thu hồi" });
      }

      const userId = decoded.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ error: "Người dùng không tồn tại" });
      }

      const accessToken = this.generateAccessToken({ _id: userId });
      const refreshToken = this.generateRefreshToken({ _id: userId });

      const newRefreshToken = new RefreshToken({
        userId,
        refreshId: refreshToken,
        expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await Promise.all([
        newRefreshToken.save(),
        RefreshToken.deleteOne({ _id: storedToken._id }),
      ]);

      res.cookie("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      console.log("Refresh token successful for user:", userId);
      return res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      console.log("[API/AUTH/REFRESHTOKEN]: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  generateAccessToken = (user) => {
    if (!process.env.JWT_ACCESS_KEY) {
      console.log("JWT_ACCESS_KEY is missing");
    }
    return jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "15m",
      }
    );
  };

  generateRefreshToken = (user) => {
    if (!process.env.JWT_REFRESH_KEY) {
      console.log("JWT_REFRESH_KEY is missing");
    }
    return jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: "30d",
      }
    );
  };

  logout = async (req, res) => {
    try {
      const refreshToken = req.cookies?.RefreshToken;
      if (refreshToken) {
        await RefreshToken.deleteOne({ refreshId: refreshToken });
        res.clearCookie("RefreshToken", {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
      }

      const accessToken = req.cookies?.AccessToken;
      if (accessToken) {
        res.clearCookie("AccessToken", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      console.log("[API/AUTH/LOGOUT]: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Yêu cầu email" });
      }

      const user = await User.findOne({
        email: String(email).toLowerCase().trim(),
      }).select("+password");
      if (!user) {
        return res.json({
          message: "Nếu email tồn tại, mật khẩu mới sẽ được gửi",
        });
      }

      const tempPassword = this.generatePassword();

      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user.password = hashedPassword;
      await user.save();

      await sendMail({
        to: user.email,
        subject: "Mật khẩu tạm thời",
        html: `
                    <p>Mật khẩu tạm thời của bạn:</p>

                    <input
                        type="password"
                        value=${tempPassword}
                        readonly
                        style="
                            border: none;
                            background: #f3f3f3;
                            padding: 10px;
                            font-size: 18px;
                            width: 220px;
                            letter-spacing: 2px;
                        "
                    />

                    <p style="font-size:12px;color:#666">
                        Click vào ô để xem mật khẩu
                    </p>
                `,
      });

      return res.json({
        message: "Nếu email tồn tại, mật khẩu mới sẽ được gửi",
      });
    } catch (error) {
      console.log("[API/AUTH/FORGOTPASSWORD]: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  generatePassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    const length = 10;

    const bytes = crypto.randomBytes(length);
    let password = "";

    for (let i = 0; i < length; i++) {
      password += chars[bytes[i] % chars.length];
    }

    return password;
  };

  changePassword = async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword: oldPassword, newPassword } = req.body;
      if (!userId || !oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Vui lòng điền đầy đủ thông tin" });
      }

      const user = await User.findById(userId).select("+password");
      if (!user) {
        return res.status(401).json({ error: "Người dùng không tồn tại" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Mật khẩu cũ không đúng" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      await RefreshToken.deleteMany({ userId: user._id });

      return res.status(200).json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      console.log("[API/AUTH/CHANGEPASSWORD]: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default new AuthController();
