import AuthService from '../../services/auth/authService.js';
import AppError from '../../utils/appError.js';


class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const { user, token } = await AuthService.registerUser({
                name,
                email,
                password
            });

            res.status(201).json({
                message: 'User registered successfully',
                status: 'success',
                access_token: token,
                isAuthenticated: true,
                user
            });
        } catch (error) {
            res.status(400).json({
                message: 'Registration failed',
                error: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const ipAddress = req.ip;
            const userAgent = req.headers['user-agent'];

            const { token, user } = await AuthService.loginUser({
                email,
                password,
                ipAddress,
                userAgent
            });

            console.log("user", user);

            await handleAuthSuccess(user, res);
        } catch (error) {
            res.status(401).json({
                message: 'Login failed',
                error: error.message
            });
        }
    }

    // Change password
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword, confirmNewPassword, email } = req.body;

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: 'New passwords do not match' });
            }

            await AuthService.changePassword(email, currentPassword, newPassword);

            res.json({
                message: 'Password changed successfully',
                status: 'success'
            });
        } catch (error) {
            res.status(400).json({
                message: 'Password change failed',
                error: error.message
            });
        }
    }

    // Forgot password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await AuthService.initiatePasswordReset(email);
            res.json({
                message: 'Password reset email sent',
                status: 'success'
            });
        } catch (error) {
            res.status(400).json({
                message: 'Failed to initiate password reset',
                error: error.message
            });
        }
    }

    // Reset password
    async resetPassword(req, res) {
        try {
            const { token, newPassword, confirmNewPassword } = req.body;

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            await AuthService.resetPassword(token, newPassword);
            res.json({
                message: 'Password reset successful',
                status: 'success'
            });
        } catch (error) {
            res.status(400).json({
                message: 'Password reset failed',
                error: error.message
            });
        }
    }

    // Verify email
    async verifyEmail(req, res) {
        try {
            const { email, code } = req.body;
            await AuthService.verifyEmail(email, code);
            res.json({
                message: 'Email verified successfully',
                status: 'success'
            });
        } catch (error) {
            res.status(400).json({
                message: 'Email verification failed',
                error: error.message
            });
        }
    }

    async resendVerificationCode(req, res) {
        try {
            const { email } = req.body;
            await AuthService.resendVerificationCode(email);
            res.json({
                message: 'Verification code sent successfully',
                status: 'success'
            });
        } catch (error) {
            res.status(400).json({
                message: 'Failed to send verification code',
                error: error.message
            });
        }
    }

    // Check session
    async checkSession(req, res) {
        try {
            const userId = req.user.userId;
            const user = await AuthService.checkSession(userId);
            res.json({ user });
        } catch (error) {
            res.status(401).json({
                message: 'Session invalid',
                error: error.message
            });
        }
    }

    // Get login history
    async loginHistory(req, res) {
        try {
            const userId = req.user.userId;
            const history = await AuthService.getLoginHistory(userId);
            res.json({ history });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to fetch login history',
                error: error.message
            });
        }
    }

    async logout(req, res) {
        try {
            res.json({
                message: 'Logged out successfully'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Logout failed',
                error: error.message
            });
        }
    }

    async getUsers(req, res) {
        try {
            const { role, search } = req.query;
            const filters = {};

            if (role) filters.role = role;
            if (search) filters.search = search;

            const users = await AuthService.getUsers(filters);

            res.json({
                status: 'success',
                data: users
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

async function handleAuthSuccess(user, res) {
    try {
        res.status(201).json({
            message: 'User registered successfully',
            status: 'success',
            access_token: token,
            isAuthenticated: true,
            user
        });
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}

export default new AuthController();