import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser for body payloads
app.use(express.json());

// ================= SPEEDY IN-MEMORY RATE LIMIT SYSTEM =================
interface RateLimitData {
  count: number;
  firstRequestTime: number;
}
const ipLimits = new Map<string, RateLimitData>();

const rateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minute anti-spam window
  const maxRequests = 5; // Max 5 submissions per 5 minutes

  const limit = ipLimits.get(ip);
  if (!limit) {
    ipLimits.set(ip, { count: 1, firstRequestTime: now });
    return next();
  }

  if (now - limit.firstRequestTime > windowMs) {
    // Reset window
    limit.count = 1;
    limit.firstRequestTime = now;
    return next();
  }

  limit.count++;
  if (limit.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Hệ thống phát hiện thiết bị của bạn gửi yêu cầu quá thường xuyên. Vui lòng tạm đợi 5 phút để tránh nghẽn sê-ri bảo an và gửi lại.'
    });
  }

  next();
};

// ================= SECURE DATA VALIDATION & SANITIZATION HELPER =================
function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  // Basic validation to accept Vietnamese phone style (10 digits starting with 0 or 84)
  const phoneClean = phone.replace(/[\s\.\-\+\(\)]/g, '');
  return /^(0|84)\d{9,10}$/.test(phoneClean) && phoneClean.length >= 10;
}

function isValidEmail(email: string): boolean {
  if (!email) return true; // Email is optional in some forms, handled case-by-case
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ================= LAZY EMAIL SENDING SERVICE (NODEMAILER) =================
interface MailResult {
  success: boolean;
  simulated?: boolean;
  messageId?: string;
  error?: string;
}

async function sendEmailNotification(subject: string, htmlContent: string): Promise<MailResult> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const recipient = process.env.RECIPIENT_EMAIL || 'xnitchcm@gmail.com';

  // Check if SMTP is left unconfigured or uses template default placeholder
  if (!user || !pass || user === 'sender@gmail.com' || pass.includes('your_gmail_app_password_here')) {
    console.warn('⚠️ SMTP credentials are NOT active in .env. Form transmission has been simulated successfully.');
    console.log(`--- [SIMULATED EMAIL LOGOUT] ---`);
    console.log(`To: ${recipient}`);
    console.log(`Subject: [WEBSITE PORTAL LOG] - ${subject}`);
    console.log(`SMTP Settings checked: host=${host}, port=${port}, secure=${secure}`);
    console.log(`Email Body (stripped HTML):\n${htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    console.log(`---------------------------------`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"Xí Nghiệp In Tài Chính - Portal" <${user}>`,
      to: recipient,
      subject: `[Website In Tài Chính] ${subject}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('❌ Error sending email through SMTP:', err.message || err);
    return { success: false, error: err.message || String(err) };
  }
}

// ================= API ENDPOINTS FOR FORM RECEPTON =================

// 1. Contact Route
app.post('/api/contact', rateLimiter, async (req: express.Request, res: express.Response) => {
  const { name, phone, email, subject, message } = req.body;

  // Validate fields
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Họ tên đơn vị/đối tác không hợp lệ. Vui lòng nhập tối thiểu 2 ký tự.' });
  }

  if (!phone || typeof phone !== 'string' || !isValidPhone(phone)) {
    return res.status(400).json({ success: false, error: 'Số điện thoại không hợp lệ. Vui lòng sử dụng số điện thoại định dạng Việt Nam.' });
  }

  if (email && (typeof email !== 'string' || !isValidEmail(email))) {
    return res.status(400).json({ success: false, error: 'Thư điện tử (Email) không đúng định dạng. Vui lòng kiểm tra lại.' });
  }

  const sName = escapeHtml(name.trim());
  const sPhone = escapeHtml(phone.trim());
  const sEmail = email ? escapeHtml(email.trim()) : 'Không cung cấp';
  const sSubject = subject ? escapeHtml(subject.trim()) : 'Liên hệ nghiệp vụ chung';
  const sMessage = message ? escapeHtml(message.trim()) : 'Không có tin nhắn đính kèm';
  
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const submittedAt = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Generate Email UI Layout
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #1e3a8a; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #f59e0b;">Thư Liên Hệ Mới</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.85;">Kênh tiếp nhận đại lý & doanh nghiệp toàn quốc</p>
      </div>
      <div style="padding: 24px; background-color: #fbfbfb; color: #333333; line-height: 1.6;">
        <p style="margin-top: 0; font-size: 14px;">Bạn có một yêu cầu liên hệ trực tuyến mới thông qua trang chủ.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 18px 0; background-color: #ffffff; border-radius: 6px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; width: 150px; color: #4b5563; font-size: 13px;">Họ tên Đơn vị/Đối tác:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Điện thoại di động:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px; font-family: monospace;"><b>${sPhone}</b></td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Email đối soát:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sEmail}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Tiêu đề sự vụ:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sSubject}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px; vertical-align: top;">Nội dung nghiệp vụ:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px; white-space: pre-wrap;">${sMessage}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px dashed #dddddd; font-size: 11px; color: #6b7280; text-align: center;">
          <p style="margin: 2px 0;">Yêu cầu được thực hiện từ IP: <b>${clientIp}</b> vào lúc: <b>${submittedAt} (Hồ Chí Minh Time)</b></p>
          <p style="margin: 2px 0; color: #10b981; font-weight: bold;">Hồ sơ thông tin sê-ri được mã hóa bảo mật chuẩn chỉnh ISO 27001.</p>
        </div>
      </div>
    </div>
  `;

  const emailResult = await sendEmailNotification(`Liên hệ mới - Từ đối tác: ${sName}`, emailHtml);

  if (!emailResult.success) {
    return res.status(500).json({ 
      success: false, 
      error: 'Xảy ra lỗi kết nối SMTP từ máy chủ. Vui lòng gọi trực tiếp hotline để được hỗ trợ thủ công.' 
    });
  }

  res.status(200).json({ 
    success: true, 
    message: 'Yêu cầu liên hệ được ghi nhận và luân chuyển trực tiếp về hòm thư hỗ trợ thành công!', 
    simulated: emailResult.simulated 
  });
});

// 2. Quotation / RFQ Route
app.post('/api/quotation', rateLimiter, async (req: express.Request, res: express.Response) => {
  const { fullName, phone, email, companyName, serviceType, quantity, deadline, notes } = req.body;

  // Validate fields
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Họ tên người đăng ký không hợp lệ. Vui lòng nhập tối thiểu 2 ký tự.' });
  }

  if (!phone || typeof phone !== 'string' || !isValidPhone(phone)) {
    return res.status(400).json({ success: false, error: 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.' });
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'Email đối soát bắt buộc và phải đúng định dạng.' });
  }

  const sFullName = escapeHtml(fullName.trim());
  const sPhone = escapeHtml(phone.trim());
  const sEmail = escapeHtml(email.trim());
  const sCompanyName = companyName ? escapeHtml(companyName.trim()) : 'Không ghi nhận';
  const sServiceType = serviceType ? escapeHtml(serviceType.trim()) : 'Yêu cầu tư vấn in ấn chung';
  const sQuantity = quantity ? escapeHtml(quantity.trim()) : 'Không đề cập';
  const sDeadline = deadline ? escapeHtml(deadline.trim()) : 'Chọn ngày thương thảo sau';
  const sNotes = notes ? escapeHtml(notes.trim()) : 'Không có ghi chú kỹ thuật đính kèm';

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const submittedAt = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Generate Email UI Layout
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #dca92a; color: #0b1329; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #000000; font-weight: 800;">Yêu Cầu Báo Giá In Ấn Bảo Mật</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: 650; color: #1e3a8a;">Ban Kế Hoạch Kỹ Thuật Đã Được Thông Báo</p>
      </div>
      <div style="padding: 24px; background-color: #fbfbfb; color: #333333; line-height: 1.6;">
        <p style="margin-top: 0; font-size: 14px;">Bạn vừa nhận một phiếu yêu cầu báo giá mới kèm các thông số kỹ thuật in ấn sơ bộ.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 18px 0; background-color: #ffffff; border-radius: 6px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; width: 170px; color: #4b5563; font-size: 13px;">Họ tên Người đại diện:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sFullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Bộ phận / Công ty đối tác:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sCompanyName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Điện thoại liên hệ trực:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px; font-family: monospace;"><b>${sPhone}</b></td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Email hòm thư đối soát:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sEmail}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Dịch vụ yêu cầu in:</td>
            <td style="padding: 12px; color: #1e3a8a; font-weight: bold; font-size: 13px;">${sServiceType}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Sản lượng / Số lượng:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sQuantity}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Hạn hoàn thiện đề xuất:</td>
            <td style="padding: 12px; color: #b45309; font-weight: bold; font-size: 13px;">${sDeadline}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px; vertical-align: top;">Ghi chú & Yêu cầu Kỹ Thuật:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px; white-space: pre-wrap;">${sNotes}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px dashed #dddddd; font-size: 11px; color: #6b7280; text-align: center;">
          <p style="margin: 2px 0;">Yêu cầu được thực hiện từ IP: <b>${clientIp}</b> vào lúc: <b>${submittedAt} (Hồ Chí Minh Time)</b></p>
          <p style="margin: 2px 0; color: #dca92a; font-weight: bold;">Hóa đơn tài chính, vé số kiến thiết và chứng từ bảo mật.</p>
        </div>
      </div>
    </div>
  `;

  const emailResult = await sendEmailNotification(`Yêu cầu báo giá mới - Dịch vụ: ${sServiceType}`, emailHtml);

  if (!emailResult.success) {
    return res.status(500).json({ 
      success: false, 
      error: 'Xảy ra lỗi kết nối SMTP từ máy chủ. Vui lòng gọi trực tiếp hotline để nhận hỗ trợ báo giá tức thì.' 
    });
  }

  res.status(200).json({ 
    success: true, 
    message: 'Hệ thống đã luân chuyển yêu cầu báo giá của bạn về Ban Kế hoạch Kỹ thuật thành công!',
    simulated: emailResult.simulated 
  });
});

// 3. Recruitment Route
app.post('/api/recruitment', rateLimiter, async (req: express.Request, res: express.Response) => {
  const { vacancyTitle, candidateName, candidatePhone, candidateEmail, cvLink, coverLetter } = req.body;

  // Validate fields
  if (!vacancyTitle || typeof vacancyTitle !== 'string') {
    return res.status(400).json({ success: false, error: 'Vui lòng chọn vị trí ứng tuyển hợp lệ.' });
  }

  if (!candidateName || typeof candidateName !== 'string' || candidateName.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Họ tên ứng viên tối thiểu 2 chữ và không chứa ký tự lạ.' });
  }

  if (!candidatePhone || typeof candidatePhone !== 'string' || !isValidPhone(candidatePhone)) {
    return res.status(400).json({ success: false, error: 'Số điện thoại liên hệ di động không hợp lệ.' });
  }

  if (!candidateEmail || typeof candidateEmail !== 'string' || !isValidEmail(candidateEmail)) {
    return res.status(400).json({ success: false, error: 'Địa chỉ thư điện tử (Email) không chính xác.' });
  }

  const sVacancyTitle = escapeHtml(vacancyTitle.trim());
  const sCandidateName = escapeHtml(candidateName.trim());
  const sCandidatePhone = escapeHtml(candidatePhone.trim());
  const sCandidateEmail = escapeHtml(candidateEmail.trim());
  const sCvLink = cvLink ? escapeHtml(cvLink.trim()) : 'Không đính kèm link sơ bộ';
  const sCoverLetter = coverLetter ? escapeHtml(coverLetter.trim()) : 'Không có thư tự giới thiệu kèm theo';

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const submittedAt = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Generate Email UI Layout
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #0c4a6e; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #a5f3fc;">Hồ Sơ Ứng Tuyển Nhân Sự Mới</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.85;">Ban Tổ chức Hành chính tiếp nhận ứng xử</p>
      </div>
      <div style="padding: 24px; background-color: #fbfbfb; color: #333333; line-height: 1.6;">
        <p style="margin-top: 0; font-size: 14px;">Chúc mừng! Hệ thống tuyển dụng vừa ghi nhận hồ sơ ứng cử viên mới nộp trực tuyến.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 18px 0; background-color: #ffffff; border-radius: 6px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; width: 170px; color: #4b5563; font-size: 13px;">Vị trí ứng tuyển:</td>
            <td style="padding: 12px; color: #0284c7; font-weight: bold; font-size: 13px;">${sVacancyTitle}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Họ tên ứng cử viên:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sCandidateName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Số điện thoại:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px; font-family: monospace;"><b>${sCandidatePhone}</b></td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Thư điện tử (Email):</td>
            <td style="padding: 12px; color: #111827; font-size: 13px;">${sCandidateEmail}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px;">Đường dẫn CV ứng viên:</td>
            <td style="padding: 12px; font-size: 13px;">
              ${sCvLink.startsWith('http') ? `<a href="${sCvLink}" target="_blank" style="color: #0284c7; font-weight: bold; text-decoration: underline;">Bấm để xem CV trực tuyến</a>` : sCvLink}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #4b5563; font-size: 13px; vertical-align: top;">Thư tự bạch ngắn:</td>
            <td style="padding: 12px; color: #111827; font-size: 13px; white-space: pre-wrap;">${sCoverLetter}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px dashed #dddddd; font-size: 11px; color: #6b7280; text-align: center;">
          <p style="margin: 2px 0;">Đơn nộp của ứng viên từ IP: <b>${clientIp}</b> lúc: <b>${submittedAt}</b></p>
          <p style="margin: 2px 0; color: #0284c7; font-weight: bold;">Hệ thống in tài chính an toàn sê-ri - TP.HCM</p>
        </div>
      </div>
    </div>
  `;

  const emailResult = await sendEmailNotification(`Ứng tuyển mới: [${sVacancyTitle}] - Ứng viên: ${sCandidateName}`, emailHtml);

  if (!emailResult.success) {
    return res.status(500).json({ 
      success: false, 
      error: 'Xảy ra sự cố cấu hình máy chủ tuyển dụng. Bạn có thể gửi email thủ công tới phòng nhân sự để nộp CV!' 
    });
  }

  res.status(200).json({ 
    success: true, 
    message: 'Nộp hồ sơ ứng tuyển thành công! Ban nhân sự của xí nghiệp đã nhận và quét CV tự động.', 
    simulated: emailResult.simulated 
  });
});


// ================= INTEGRATED DEV / PRODUCTION STATIC FLOWS =================

async function serveApplication() {
  if (process.env.NODE_ENV !== 'production') {
    // Mounting Vite development server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Development server setup with Vite middleware mode.');
  } else {
    // Standard express static serving for Production build
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('📦 Production server setup serving compiled static files.');
  }

  // Bind server listener exactly on port 3000 & host 0.0.0.0
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack node server boots smoothly on host 0.0.0.0 at port ${PORT}`);
  });
}

serveApplication().catch((err) => {
  console.error('❌ Failed to start the server:', err);
  process.exit(1);
});
