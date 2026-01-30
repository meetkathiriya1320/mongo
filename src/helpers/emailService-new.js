import nodemailer from 'nodemailer';

// For Railway production, use a different email service
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;

let transporter;

if (isProduction) {
    // Use SendGrid for production (Railway compatible)
    transporter = nodemailer.createTransporter({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
        }
    });
} else {
    // Gmail for local development
    transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        timeout: 10000,
        secure: true,
        pool: true,
        maxConnections: 1,
        maxMessages: 5
    });
}

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: isProduction ? process.env.SENDGRID_FROM_EMAIL : process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification OTP - CricTrack',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; text-align: center;">Email Verification</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                            Your verification code is:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">
                                ${otp}
                            </span>
                        </div>
                        <p style="font-size: 14px; color: #666; margin-top: 20px;">
                            This code will expire in 1 minutes. Please do not share this code with anyone.
                        </p>
                    </div>
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        If you didn't request this verification, please ignore this email.
                    </p>
                </div>
            `
        };

        try {
            console.log('Attempting to send email to:', email);
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ OTP email sent successfully:', info.messageId);
            console.log(`📧 OTP sent to ${email}: ${otp}`);
            return { success: true, messageId: info.messageId };
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            console.log(`📝 OTP for ${email}: ${otp} (email failed - check credentials)`);
            console.log('🔧 Please verify email service configuration');
            return { success: false, error: emailError.message };
        }
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, error: error.message };
    }
};

export { generateOTP, sendOTPEmail };