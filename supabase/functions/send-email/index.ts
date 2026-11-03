// Supabase Edge Function: send-email
// Sends form submissions from website to xnitchcm@gmail.com via Resend API
// Secrets required in Supabase Dashboard (Project Settings > Edge Functions > Secrets):
// - RESEND_API_KEY (e.g. re_123456789)
// - NOTIFICATION_EMAIL (optional, defaults to xnitchcm@gmail.com)
// - SENDER_EMAIL (optional, defaults to "Xí Nghiệp In Tài Chính <onboarding@resend.dev>")

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface FormSubmissionPayload {
  formType: "contact" | "quote" | "consultation" | "recruitment" | string;
  subject?: string;
  replyTo?: string;
  senderName?: string;
  data: Record<string, any>;
}

// Map form type to default subject and human-readable title
const FORM_META: Record<string, { title: string; defaultSubject: string }> = {
  contact: {
    title: "Gửi Thư Liên Hệ",
    defaultSubject: "[Website In Tài Chính] Liên hệ mới",
  },
  quote: {
    title: "Yêu Cầu Báo Giá In",
    defaultSubject: "[Website In Tài Chính] Yêu cầu báo giá mới",
  },
  consultation: {
    title: "Yêu Cầu Tư Vấn In Tài Chính",
    defaultSubject: "[Website In Tài Chính] Yêu cầu tư vấn mới",
  },
  recruitment: {
    title: "Nộp Hồ Sơ Ứng Tuyển Nhanh",
    defaultSubject: "[Website In Tài Chính] Hồ sơ ứng tuyển mới",
  },
};

// Friendly Vietnamese labels for data fields
const FIELD_LABELS: Record<string, string> = {
  fullName: "Họ và tên",
  name: "Họ và tên đối tác / đơn vị",
  phone: "Số điện thoại liên hệ",
  email: "Địa chỉ email đối soát / liên hệ",
  companyName: "Đơn vị công tác / Công ty XSKT",
  serviceType: "Dịch vụ / Vận đơn cần in",
  quantity: "Sản lượng / Số véc-tờ dự kiến",
  deadline: "Hạn hoàn thiện mong muốn",
  subject: "Tiêu đề sự vụ / Sê-ri hợp đồng",
  message: "Nội dung yêu cầu / Quy cách kỹ thuật",
  notes: "Ghi chú kỹ thuật đặc biệt",
  position: "Vị trí ứng tuyển",
  cvLink: "Đường dẫn hồ sơ / CV",
  coverLetter: "Giới thiệu bản thân / Nguyện vọng ca kíp",
  submittedAt: "Thời gian gửi",
  pageUrl: "Trang gửi yêu cầu",
};

function formatValue(val: any): string {
  if (val === undefined || val === null || val === "") return '<span style="color: #94a3b8; font-style: italic;">(Không có)</span>';
  if (typeof val === "string" && (val.startsWith("http://") || val.startsWith("https://"))) {
    return `<a href="${val}" target="_blank" style="color: #0d4f9c; text-decoration: underline; word-break: break-all;">${val}</a>`;
  }
  return String(val).replace(/\n/g, "<br/>");
}

function buildHtmlEmail(metaTitle: string, data: Record<string, any>, submittedAt: string): string {
  const rows = Object.entries(data)
    .filter(([key]) => key !== "_honeypot") // ignore bot trap
    .map(([key, value]) => {
      const label = FIELD_LABELS[key] || key;
      const formatted = formatValue(value);
      return `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b; background-color: #f8fafc; width: 35%; font-size: 13px;">
            ${label}
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #334155; font-size: 13px; line-height: 1.5;">
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
    <body style="margin: 0; padding: 24px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
      <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0d4f9c 0%, #082f5e 100%); padding: 24px 28px; color: #ffffff; text-align: left;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #f4c542; margin-bottom: 6px;">
            CÔNG TY TNHH MTV XỔ SỐ KIẾN THIẾT TP. HỒ CHÍ MINH
          </div>
          <div style="font-size: 20px; font-weight: 900; letter-spacing: 0.5px; color: #ffffff; text-transform: uppercase;">
            XÍ NGHIỆP IN TÀI CHÍNH
          </div>
          <div style="margin-top: 12px; display: inline-block; padding: 4px 12px; background-color: rgba(244, 197, 66, 0.2); border: 1px solid #f4c542; border-radius: 6px; font-size: 11px; font-weight: 700; color: #f4c542; text-transform: uppercase; letter-spacing: 1px;">
            ${metaTitle}
          </div>
        </div>

        <!-- Body Notice -->
        <div style="padding: 24px 28px;">
          <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #334155;">
            Hệ thống website đã tiếp nhận một biểu mẫu mới từ khách hàng / đối tác vào lúc <strong>${submittedAt}</strong>. Dưới đây là chi tiết toàn bộ nội dung đã nhập:
          </p>

          <!-- Table of fields -->
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <tbody>
              ${rows}
            </tbody>
          </table>

          <!-- Action tip -->
          <div style="margin-top: 24px; padding: 14px 18px; background-color: #eff6ff; border-left: 4px solid #0d4f9c; border-radius: 4px; font-size: 12px; color: #1e3a8a; line-height: 1.6;">
            <strong>Lưu ý:</strong> Quý bộ phận (Kế hoạch - Sản xuất / Nhân sự / Thư ký) vui lòng kiểm tra và liên hệ lại với khách hàng theo số điện thoại hoặc email trên.
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5;">
          Email tự động được gửi từ hệ thống Website Xí Nghiệp In Tài Chính TP.HCM.<br/>
          Địa chỉ: Cụm Công nghiệp Nhị Xuân, Xã Xuân Thới Sơn, Hóc Môn, TP.HCM
        </div>

      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload: FormSubmissionPayload = await req.json();
    const { formType, subject, replyTo, data = {} } = payload;

    // Basic anti-spam check (honeypot)
    if (data._honeypot) {
      console.warn("Honeypot triggered, dropping submission.");
      return new Response(JSON.stringify({ success: true, message: "OK" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine metadata and subject
    const meta = FORM_META[formType] || {
      title: "Yêu Cầu Mới Từ Website",
      defaultSubject: "[Website In Tài Chính] Yêu cầu mới",
    };

    const finalSubject = subject || meta.defaultSubject;
    const recipientEmail = Deno.env.get("NOTIFICATION_EMAIL") || "xnitchcm@gmail.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const senderEmail = Deno.env.get("SENDER_EMAIL") || "Xí Nghiệp In Tài Chính <onboarding@resend.dev>";

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY in Supabase secrets.");
      return new Response(
        JSON.stringify({
          error: "RESEND_API_KEY is not configured in Supabase Secrets.",
          hint: "Please set RESEND_API_KEY in Supabase Dashboard > Settings > Edge Functions > Secrets.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Current formatted time (Vietnam GMT+7)
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(now);

    const enrichedData = {
      ...data,
      submittedAt: formattedDate,
    };

    const htmlContent = buildHtmlEmail(meta.title, enrichedData, formattedDate);

    // Call Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [recipientEmail],
        reply_to: replyTo && replyTo.includes("@") ? replyTo : undefined,
        subject: finalSubject,
        html: htmlContent,
      }),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendResult);
      return new Response(
        JSON.stringify({
          error: resendResult.message || "Failed to send email via Resend",
          details: resendResult,
        }),
        {
          status: resendResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId: resendResult.id,
        recipient: recipientEmail,
        subject: finalSubject,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Unexpected error in send-email function:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
