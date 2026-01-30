import nodemailer from 'nodemailer';

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
    
    if (isProduction) {
        // For production, just log the OTP (skip email sending)
        console.log(`📝 OTP for ${email}: ${otp}`);
        console.log('✅ OTP generated successfully (email skipped in production)');
        return { success: true, messageId: 'production-skip' };
    }
    
    // Local development - use Gmail
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
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
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.log(`📝 OTP for ${email}: ${otp} (email failed)`);
        return { success: false, error: error.message };
    }
};

export { generateOTP, sendOTPEmail };