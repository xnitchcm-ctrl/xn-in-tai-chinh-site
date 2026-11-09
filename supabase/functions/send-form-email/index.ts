// Supabase Edge Function: send-form-email
// Dự án: Xí Nghiệp In Tài Chính TP. Hồ Chí Minh
// Chức năng: Tiếp nhận toàn bộ biểu mẫu từ website, lưu vào public.form_submissions và gửi email thông báo về xnitchcm@gmail.com qua Resend
//
// Yêu cầu Supabase Secrets (Project Settings > Edge Functions > Secrets):
// - RESEND_API_KEY: Khóa API từ resend.com (ví dụ: re_123456789)
// - CONTACT_RECEIVER_EMAIL: Địa chỉ email nhận thông báo (mặc định: xnitchcm@gmail.com)
// - SENDER_EMAIL: Địa chỉ email gửi (mặc định: "Xí Nghiệp In Tài Chính <onboarding@resend.dev>")

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Danh sách origin được phép kết nối CORS
const ALLOWED_ORIGINS = [
  "https://xn-in-tai-chinh-site.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") || "";
  const isAllowed =
    !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".vercel.app") ||
    origin.includes(".run.app") ||
    origin.includes("aistudio") ||
    origin.includes("localhost");

  return {
    "Access-Control-Allow-Origin": isAllowed ? (origin || "*") : "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Max-Age": "86400",
  };
}

// Cấu hình tiêu đề email và tên biểu mẫu chuẩn tiếng Việt theo yêu cầu
const FORM_TYPES: Record<string, { title: string; subject: string }> = {
  contact: {
    title: "Gửi Thư Liên Hệ",
    subject: "[Website In Tài Chính] Liên hệ mới",
  },
  quote: {
    title: "Yêu Cầu Báo Giá In",
    subject: "[Website In Tài Chính] Yêu cầu báo giá mới",
  },
  consultation: {
    title: "Yêu Cầu Tư Vấn In Tài Chính",
    subject: "[Website In Tài Chính] Yêu cầu tư vấn mới",
  },
  recruitment: {
    title: "Nộp Hồ Sơ Ứng Tuyển Nhanh",
    subject: "[Website In Tài Chính] Hồ sơ ứng tuyển mới",
  },
};

// Nhãn tiếng Việt thân thiện cho bảng chi tiết trong email
const FIELD_LABELS: Record<string, string> = {
  form_type: "Loại biểu mẫu",
  formType: "Loại biểu mẫu",
  full_name: "Họ và tên khách hàng / Đối tác",
  fullName: "Họ và tên khách hàng / Đối tác",
  name: "Họ và tên",
  phone: "Số điện thoại liên hệ",
  email: "Địa chỉ email liên hệ",
  company: "Đơn vị công tác / Công ty XSKT",
  company_name: "Đơn vị công tác / Công ty XSKT",
  companyName: "Đơn vị công tác / Công ty XSKT",
  service: "Dịch vụ / Vận đơn cần in",
  service_type: "Dịch vụ / Vận đơn cần in",
  serviceType: "Dịch vụ / Vận đơn cần in",
  quantity: "Sản lượng / Số véc-tờ dự kiến",
  deadline: "Hạn hoàn thiện mong muốn",
  subject: "Tiêu đề sự vụ / Sê-ri hợp đồng",
  message: "Nội dung yêu cầu / Ghi chú kỹ thuật",
  notes: "Yêu cầu kỹ thuật đặc biệt (Mực UV, Tem, Sê-ri...)",
  position: "Vị trí ứng tuyển",
  cv_link: "Đường dẫn hồ sơ / CV",
  cvLink: "Đường dẫn hồ sơ / CV",
  cover_letter: "Giới thiệu bản thân / Nguyện vọng ca kíp",
  coverLetter: "Giới thiệu bản thân / Nguyện vọng ca kíp",
  submittedAt: "Thời gian gửi",
  pageUrl: "Trang gửi yêu cầu",
};

function formatFieldValue(val: any): string {
  if (val === undefined || val === null || val === "") {
    return '<span style="color: #94a3b8; font-style: italic;">(Không có)</span>';
  }
  if (typeof val === "string" && (val.startsWith("http://") || val.startsWith("https://"))) {
    return `<a href="${val}" target="_blank" rel="noopener noreferrer" style="color: #0d4f9c; text-decoration: underline; word-break: break-all; font-weight: 600;">${val}</a>`;
  }
  return String(val).replace(/\n/g, "<br/>");
}

function buildHtmlEmail(metaTitle: string, displayFields: Record<string, any>, submittedAt: string): string {
  const rows = Object.entries(displayFields)
    .filter(([key]) => key !== "_trap_field" && key !== "honeypot" && key !== "_honeypot" && key !== "details" && key !== "metadata")
    .map(([key, value]) => {
      const label = FIELD_LABELS[key] || key;
      const formatted = formatFieldValue(value);
      return `
        <tr>
          <td style="padding: 11px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b; background-color: #f8fafc; width: 35%; font-size: 13px; vertical-align: top;">
            ${label}
          </td>
          <td style="padding: 11px 16px; border-bottom: 1px solid #e2e8f0; color: #334155; font-size: 13px; line-height: 1.6; vertical-align: top;">
            ${formatted}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${metaTitle}</title>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
      <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0d4f9c 0%, #082f5e 100%); padding: 26px 30px; color: #ffffff; text-align: left; border-bottom: 4px solid #f4c542;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #f4c542; margin-bottom: 6px;">
            CÔNG TY TNHH MTV XỔ SỐ KIẾN THIẾT TP. HỒ CHÍ MINH
          </div>
          <div style="font-size: 21px; font-weight: 900; letter-spacing: 0.5px; color: #ffffff; text-transform: uppercase; line-height: 1.3;">
            XÍ NGHIỆP IN TÀI CHÍNH
          </div>
          <div style="margin-top: 14px; display: inline-block; padding: 5px 14px; background-color: rgba(244, 197, 66, 0.2); border: 1px solid #f4c542; border-radius: 6px; font-size: 11px; font-weight: 800; color: #f4c542; text-transform: uppercase; letter-spacing: 1px;">
            ${metaTitle}
          </div>
        </div>

        <!-- Body Content -->
        <div style="padding: 26px 30px;">
          <p style="margin: 0 0 18px; font-size: 14px; line-height: 1.6; color: #334155;">
            Hệ thống website đã tiếp nhận một biểu mẫu mới từ khách hàng / đối tác vào lúc <strong>${submittedAt}</strong>. Dưới đây là thông tin chi tiết:
          </p>

          <!-- Table of fields -->
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <tbody>
              ${rows}
            </tbody>
          </table>

          <!-- Action tip -->
          <div style="margin-top: 24px; padding: 14px 18px; background-color: #eff6ff; border-left: 4px solid #0d4f9c; border-radius: 4px; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
            <strong>Bộ phận phụ trách:</strong> Quý bộ phận (Kế hoạch - Sản xuất / Nhân sự / Thư ký) vui lòng kiểm tra và liên hệ lại với khách hàng theo số điện thoại hoặc email trên để phản hồi kịp thời.
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 30px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
          Email tự động được gửi từ hệ thống Website <strong>Xí Nghiệp In Tài Chính TP.HCM</strong>.<br/>
          Địa chỉ: Lô A1-A2 Đường A, Cụm Công Nghiệp - Khu dân cư Nhị Xuân, Ấp 25, Xã Xuân Thới Sơn, TP.HCM
        </div>

      </div>
    </body>
    </html>
  `;
}

serve(async (req: Request) => {
  const cors = getCorsHeaders(req);

  // 1. Xử lý preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  // 2. Chỉ chấp nhận phương thức POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, message: "Phương thức không được hỗ trợ (Method Not Allowed)." }),
      {
        status: 405,
        headers: { ...cors, "Content-Type": "application/json" },
      }
    );
  }

  try {
    let rawBody: any = {};
    try {
      rawBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: "Dữ liệu JSON không hợp lệ." }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // Hỗ trợ cả { body: formData } và formData trực tiếp
    const payload = rawBody.body || rawBody.formData || rawBody.data || rawBody;

    // Tránh spam với honeypot bot trap
    if (payload.honeypot || payload._trap_field || payload._honeypot || payload._job_bot_trap) {
      console.warn("[AntiSpam] Honeypot triggered, dropping bot submission.");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm.",
        }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // 3. Chuẩn hóa & trích xuất dữ liệu
    const formType = String(payload.form_type || payload.formType || "contact").toLowerCase();
    const fullName = String(payload.full_name || payload.fullName || payload.name || "").trim();
    const phone = String(payload.phone || "").trim();
    const email = String(payload.email || "").trim();
    const company = String(payload.company || payload.company_name || payload.companyName || "").trim();
    const service = String(payload.service || payload.service_type || payload.serviceType || "").trim();
    const quantity = String(payload.quantity || "").trim();
    const deadline = String(payload.deadline || "").trim();
    const message = String(payload.message || payload.notes || payload.coverLetter || "").trim();
    const position = String(payload.position || "").trim();
    const cvLink = String(payload.cv_link || payload.cvLink || "").trim();
    const subjectParam = String(payload.subject || "").trim();

    // 4. Kiểm tra trường bắt buộc
    if (!fullName) {
      return new Response(
        JSON.stringify({ success: false, message: "Vui lòng nhập họ và tên của quý khách." }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    if (!phone) {
      return new Response(
        JSON.stringify({ success: false, message: "Vui lòng nhập số điện thoại để chúng tôi liên hệ hỗ trợ." }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // Xác định tiêu đề loại biểu mẫu & tiêu đề email
    const formMeta = FORM_TYPES[formType] || {
      title: "Yêu Cầu Mới Từ Website",
      subject: "[Website In Tài Chính] Yêu cầu mới",
    };

    const finalSubject = subjectParam || formMeta.subject;

    // Thời gian định dạng Việt Nam (GMT+7)
    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(new Date());

    // Gom dữ liệu metadata đầy đủ để lưu trữ
    const metadataObj: Record<string, any> = {
      ...payload,
      formType,
      fullName,
      phone,
      email: email || null,
      company: company || null,
      service: service || null,
      quantity: quantity || null,
      deadline: deadline || null,
      message: message || null,
      position: position || null,
      cvLink: cvLink || null,
      submittedAt: formattedDate,
      pageUrl: payload.pageUrl || req.headers.get("referer") || "",
    };

    // 5. Lưu vào Supabase Database (bảng public.form_submissions)
    let submissionId: string = crypto.randomUUID();
    let dbSaved = false;
    let dbErrorMessage: string | null = null;

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://zdxfunpysjufddkgjhiw.supabase.co";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";

      if (supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: dbData, error: dbError } = await supabase
          .from("form_submissions")
          .insert([
            {
              id: submissionId,
              form_type: formType,
              full_name: fullName,
              phone: phone,
              email: email || null,
              company: company || null,
              company_name: company || null,
              service: service || null,
              service_type: service || null,
              quantity: quantity || null,
              deadline: deadline || null,
              message: message || null,
              status: "new",
              metadata: metadataObj,
              details: metadataObj,
            },
          ])
          .select("id")
          .maybeSingle();

        if (dbError) {
          console.error("[Database Insert Warning]:", dbError.message);
          dbErrorMessage = dbError.message;
        } else {
          dbSaved = true;
          if (dbData?.id) {
            submissionId = dbData.id;
          }
          console.log("[Database Saved Successfully] Submission ID:", submissionId);
        }
      } else {
        console.warn("[Database] SUPABASE_SERVICE_ROLE_KEY not present in environment.");
      }
    } catch (dbEx: any) {
      console.error("[Database Exception]:", dbEx?.message || dbEx);
      dbErrorMessage = dbEx?.message || "Lỗi lưu cơ sở dữ liệu";
    }

    // 6. Gửi email thông báo qua Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const receiverEmail =
      Deno.env.get("CONTACT_RECEIVER_EMAIL") ||
      Deno.env.get("NOTIFICATION_EMAIL") ||
      "xnitchcm@gmail.com";
    const senderEmail =
      Deno.env.get("SENDER_EMAIL") || "Xí Nghiệp In Tài Chính <onboarding@resend.dev>";

    let emailSent = false;
    let emailErrorMessage: string | null = null;

    if (!resendApiKey) {
      console.warn("[Resend Warning] RESEND_API_KEY is not configured in Supabase Secrets.");
      emailErrorMessage = "Chưa cấu hình RESEND_API_KEY trong Supabase Secrets.";
    } else {
      try {
        // Dữ liệu hiển thị trong email
        const displayData: Record<string, any> = {
          form_type: formMeta.title,
          full_name: fullName,
          phone: phone,
        };
        if (email) displayData.email = email;
        if (company) displayData.company = company;
        if (service) displayData.service = service;
        if (quantity) displayData.quantity = quantity;
        if (deadline) displayData.deadline = deadline;
        if (position) displayData.position = position;
        if (cvLink) displayData.cv_link = cvLink;
        if (message) displayData.message = message;
        displayData.submittedAt = formattedDate;

        const htmlEmail = buildHtmlEmail(formMeta.title, displayData, formattedDate);

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: senderEmail,
            to: [receiverEmail],
            reply_to: email && email.includes("@") ? email : undefined,
            subject: finalSubject,
            html: htmlEmail,
          }),
        });

        const resendResult = await resendRes.json();

        if (resendRes.ok) {
          emailSent = true;
          console.log("[Resend Email Sent] Message ID:", resendResult?.id);
        } else {
          console.error("[Resend API Error]:", resendResult);
          emailErrorMessage = resendResult?.message || "Không thể gửi email qua Resend.";
        }
      } catch (mailEx: any) {
        console.error("[Resend Exception]:", mailEx?.message || mailEx);
        emailErrorMessage = mailEx?.message || "Lỗi gửi email máy chủ";
      }
    }

    // 7. Phản hồi kết quả cho Frontend
    // Miễn là email gửi thành công HOẶC bản ghi đã được lưu vào database, coi như thành công
    if (emailSent || dbSaved) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm.",
          submissionId,
          emailSent,
          dbSaved,
        }),
        {
          status: 200,
          headers: { ...cors, "Content-Type": "application/json" },
        }
      );
    }

    // Nếu cả email và database đều chưa thành công
    return new Response(
      JSON.stringify({
        success: false,
        message: "Hệ thống đang bận tiếp nhận yêu cầu. Quý khách vui lòng thử lại sau hoặc liên hệ trực tiếp hotline.",
        detail: emailErrorMessage || dbErrorMessage,
        submissionId,
      }),
      {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("[Unhandled Server Error]:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Có lỗi xảy ra trong quá trình xử lý yêu cầu. Quý khách vui lòng thử lại.",
      }),
      {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      }
    );
  }
});
