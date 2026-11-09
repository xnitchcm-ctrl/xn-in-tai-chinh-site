/**
 * Central Form Submission Handler
 * - Dispatches form data via Supabase Edge Function (send-form-email)
 * - Persists record in public.form_submissions with strict RLS
 * - Anti-spam: Honeypot check + Client debounce / duplicate prevention
 * - Zero secrets in frontend
 */

import { supabase, isSupabaseConfigured } from './supabase';

export type FormType = 'contact' | 'quote' | 'consultation' | 'recruitment';

export interface FormSubmissionPayload {
  formType: FormType;
  fullName: string;
  phone: string;
  email?: string;
  companyName?: string;
  serviceType?: string;
  quantity?: string;
  deadline?: string;
  subject?: string;
  message?: string;
  position?: string;
  cvLink?: string;
  coverLetter?: string;
  notes?: string;
  honeypot?: string; // Bot trap: must be empty
  extraData?: Record<string, any>;
}

// Map form type to specific required subject
export const FORM_EMAIL_SUBJECTS: Record<FormType, string> = {
  contact: '[Website In Tài Chính] Liên hệ mới',
  quote: '[Website In Tài Chính] Yêu cầu báo giá mới',
  consultation: '[Website In Tài Chính] Yêu cầu tư vấn mới',
  recruitment: '[Website In Tài Chính] Hồ sơ ứng tuyển mới',
};

// Map form type to friendly title
export const FORM_TYPE_NAMES: Record<FormType, string> = {
  contact: 'Gửi thư liên hệ',
  quote: 'Yêu cầu báo giá in',
  consultation: 'Yêu cầu tư vấn in tài chính',
  recruitment: 'Hồ sơ ứng tuyển nhanh',
};

// Debounce tracker to prevent rapid duplicate clicks (within 5 seconds)
let lastSubmissionTimestamp = 0;
let lastSubmissionHash = '';

function createSimpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

/**
 * Validate phone number format (basic VN phone check: 9-11 digits, starts with 0 or +84)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.-]/g, '');
  return /^(\+?84|0)[0-9]{8,10}$/.test(cleaned);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Sanitize error message to ensure NO technical English or jargon is displayed to customers
 */
export function sanitizeUserErrorMessage(rawError: any): string {
  if (!rawError) {
    return 'Gửi yêu cầu không thành công. Quý khách vui lòng thử lại hoặc liên hệ hotline để được hỗ trợ.';
  }

  const str = typeof rawError === 'string' ? rawError : (rawError.message || String(rawError));

  // Catch typical technical or English error strings
  const isTechnicalOrEnglish = 
    /Failed to send a request|Edge Function|FunctionsHttpError|NetworkError|Failed to fetch|Load failed|404|500|relation|PGRST|syntax error|TypeError|ReferenceError|not found|unauthorized/i.test(str);

  if (isTechnicalOrEnglish) {
    return 'Không thể kết nối đến máy chủ tiếp nhận yêu cầu. Quý khách vui lòng thử lại trong giây lát hoặc liên hệ trực tiếp hotline.';
  }

  return str;
}

/**
 * Main form submission function
 */
export async function submitCustomerForm(
  payload: FormSubmissionPayload
): Promise<{ success: boolean; message: string; id?: string }> {
  // 1. Anti-spam check (honeypot)
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    console.warn('[AntiSpam] Honeypot field filled. Dropping bot submission silently.');
    return {
      success: true,
      message: 'Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm.',
    };
  }

  // 2. Validate required fields
  const trimmedName = (payload.fullName || '').trim();
  const trimmedPhone = (payload.phone || '').trim();
  const trimmedEmail = (payload.email || '').trim();

  if (!trimmedName) {
    throw new Error('Vui lòng nhập họ và tên của quý khách.');
  }

  if (!trimmedPhone) {
    throw new Error('Vui lòng nhập số điện thoại để chúng tôi liên hệ hỗ trợ.');
  }

  if (!isValidPhone(trimmedPhone)) {
    throw new Error('Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại (ví dụ: 0901234567).');
  }

  if (trimmedEmail && !isValidEmail(trimmedEmail)) {
    throw new Error('Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.');
  }

  // 3. Anti-duplicate / debounce check (5 seconds window for exact same payload)
  const currentHash = createSimpleHash(`${payload.formType}-${trimmedName}-${trimmedPhone}`);
  const now = Date.now();
  if (currentHash === lastSubmissionHash && now - lastSubmissionTimestamp < 5000) {
    throw new Error('Hệ thống đang xử lý yêu cầu của bạn, vui lòng không bấm gửi nhiều lần liên tiếp.');
  }
  lastSubmissionTimestamp = now;
  lastSubmissionHash = currentHash;

  const emailSubject = FORM_EMAIL_SUBJECTS[payload.formType] || '[Website In Tài Chính] Yêu cầu mới';

  // Construct structured formData according to user specifications
  const formData = {
    form_type: payload.formType,
    full_name: trimmedName,
    phone: trimmedPhone,
    email: trimmedEmail || null,
    company: (payload.companyName || '').trim() || null,
    company_name: (payload.companyName || '').trim() || null,
    service: (payload.serviceType || '').trim() || null,
    service_type: (payload.serviceType || '').trim() || null,
    quantity: (payload.quantity || '').trim() || null,
    deadline: (payload.deadline || '').trim() || null,
    message: (payload.message || payload.notes || payload.coverLetter || '').trim() || null,
    position: (payload.position || '').trim() || null,
    cv_link: (payload.cvLink || '').trim() || null,
    subject: emailSubject,
    replyTo: trimmedEmail || undefined,
    metadata: {
      formType: payload.formType,
      formTitle: FORM_TYPE_NAMES[payload.formType] || payload.formType,
      fullName: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail || null,
      company: (payload.companyName || '').trim() || null,
      service: (payload.serviceType || '').trim() || null,
      quantity: (payload.quantity || '').trim() || null,
      deadline: (payload.deadline || '').trim() || null,
      message: (payload.message || payload.notes || payload.coverLetter || '').trim() || null,
      position: (payload.position || '').trim() || null,
      cvLink: (payload.cvLink || '').trim() || null,
      notes: (payload.notes || '').trim() || null,
      coverLetter: (payload.coverLetter || '').trim() || null,
      submittedAt: new Date().toISOString(),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      ...(payload.extraData || {}),
    },
  };

  let submissionId: string | undefined;
  let edgeInvokedSuccess = false;
  let dbSavedSuccess = false;

  // 4. Gọi Supabase Edge Function send-form-email
  if (supabase && isSupabaseConfigured) {
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('send-form-email', {
        body: formData,
      });

      if (!edgeError && edgeData?.success) {
        edgeInvokedSuccess = true;
        submissionId = edgeData.submissionId;
      } else if (edgeError) {
        console.warn('[Edge Function send-form-email warning]:', edgeError.message);
      } else if (edgeData && !edgeData.success) {
        console.warn('[Edge Function send-form-email returned]:', edgeData.message);
      }
    } catch (err: any) {
      console.warn('[Edge Function invocation error]:', err?.message || err);
    }

    // 5. Nếu Edge Function chưa trả về thành công (hoặc chưa kịp deploy), lưu trực tiếp vào bảng public.form_submissions qua Supabase RLS
    if (!edgeInvokedSuccess) {
      try {
        const { data: dbData, error: dbError } = await supabase
          .from('form_submissions')
          .insert([
            {
              form_type: formData.form_type,
              full_name: formData.full_name,
              phone: formData.phone,
              email: formData.email,
              company: formData.company,
              company_name: formData.company_name,
              service: formData.service,
              service_type: formData.service_type,
              quantity: formData.quantity,
              deadline: formData.deadline,
              message: formData.message,
              metadata: formData.metadata,
              details: formData.metadata,
              status: 'new',
            },
          ])
          .select('id')
          .maybeSingle();

        if (!dbError) {
          dbSavedSuccess = true;
          if (dbData?.id) {
            submissionId = dbData.id;
          }
        } else {
          console.warn('[Direct DB insert warning]:', dbError.message);
        }
      } catch (dbErr: any) {
        console.warn('[Direct DB insert exception]:', dbErr?.message || dbErr);
      }
    }
  }

  // 6. Kiểm tra kết quả
  if (edgeInvokedSuccess || dbSavedSuccess) {
    return {
      success: true,
      message: 'Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm.',
      id: submissionId,
    };
  }

  // 7. Nếu trong chế độ preview/demo mà Supabase chưa điền URL/Key
  if (!isSupabaseConfigured) {
    console.info('[Demo Mode] Simulating successful submission in preview environment.');
    return {
      success: true,
      message: 'Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm.',
    };
  }

  // 8. Nếu cả 2 phương thức đều lỗi do sự cố mạng hoặc cấu hình
  throw new Error('Không thể kết nối đến máy chủ tiếp nhận yêu cầu. Quý khách vui lòng thử lại trong giây lát hoặc liên hệ trực tiếp hotline.');
}
