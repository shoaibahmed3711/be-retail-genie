import { LoginHistory, User } from "../../models/auth/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import emailService from "../email/emailService.js";

class AuthService {
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString(); 
    }

    async registerUser(userData) {
        const { name, email, password } = userData;

        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const user = new User({
            name,
            email,
            password
        });

        const verificationCode = this.generateVerificationCode();
        user.verificationCode = {
            code: verificationCode,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };

        await user.save();

        // Generate tokens
        const token = this.generateToken(user._id);
        const refreshToken = this.generateRefreshToken(user._id);
        
        user.refreshToken = refreshToken;
        await user.save();

        await emailService.sendVerificationCode(user.email, user.verificationCode.code);

        return { token, user };
    }
    

    // User login
    async loginUser({ email, password, ipAddress, userAgent }) {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Regular email/password login
        if (!password) {
            throw new Error('Password is required');
        }

        // Ensure both password and user.password exist before comparing
        if (!user.password) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // If email is not verified, generate new verification code and send email
        if (!user.isEmailVerified) {
            const verificationCode = this.generateVerificationCode();
            user.verificationCode = {
                code: verificationCode,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            };
            await user.save();
            await emailService.sendVerificationCode(email, verificationCode);
        }

        // Log the login attempt even if email is not verified
        await LoginHistory.create({
            userId: user._id,
            ipAddress,
            userAgent
        });

        // Generate new tokens
        const token = this.generateToken(user._id);
        const refreshToken = this.generateRefreshToken(user._id);
        
        user.refreshToken = refreshToken;
        await user.save();

        return { 
            token, 
            user: {
                ...user.toObject(),
                password: undefined // Remove password from response
            }
        };
    }

    // Generate JWT token
    generateToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    generateRefreshToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
    }

    // Change password
    async changePassword(email, currentPassword, newPassword) {
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        // Update password
        user.password = newPassword; // The pre-save hook will hash this
        await user.save();

        return true;
    }

    // Initiate password reset
    async initiatePasswordReset(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
            
        user.passwordResetExpires = Date.now() + 3600000; 
        await user.save();

        try {
            // Send reset email
            await emailService.sendPasswordResetEmail(email, resetToken);
            return true;
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            throw new Error('Error sending password reset email');
        }
    }

    // Reset password with token
    async resetPassword(token, newPassword) {
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        user.password = newPassword;
        
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        
        await user.save();

        return true;
    }

    // Verify email with code
    async verifyEmail(email, code) {
        const user = await User.findOne({
            email,
            'verificationCode.code': code,
            'verificationCode.expiresAt': { $gt: new Date() }
        });

        if (!user) {
            throw new Error('Invalid or expired verification code');
        }

        user.isEmailVerified = true;
        user.verificationCode = undefined;
        await user.save();

        return true;
    }

    // Resend verification code
    async resendVerificationCode(email) {
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isEmailVerified) {
            throw new Error('Email is already verified');
        }

        const verificationCode = this.generateVerificationCode();
        user.verificationCode = {
            code: verificationCode,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        await user.save();
        await emailService.sendVerificationCode(email, verificationCode);

        return true;
    }

    // Get login history
    async getLoginHistory(userId, limit = 10) {
        return await LoginHistory.find({ userId })
            .sort({ loginTime: -1 })
            .limit(limit);
    }

    // Check session
    async checkSession(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getUsers(filters = {}) {
        try {
            const query = {};
            
            if (filters.role) {
                query.role = filters.role;
            }

            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const users = await User.find(query)
                .select('-password -refreshToken -verificationCode -passwordResetToken -passwordResetExpires')
                .sort({ createdAt: -1 });

            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }
}

export default new AuthService();