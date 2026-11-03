/**
 * Central Form Submission Handler
 * - Saves form submission to Supabase DB (table: form_submissions) with RLS
 * - Dispatches email notification via Supabase Edge Function (send-email) to xnitchcm@gmail.com
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

  if (!trimmedName) {
    throw new Error('Vui lòng nhập họ và tên của quý khách.');
  }

  if (!trimmedPhone) {
    throw new Error('Vui lòng nhập số điện thoại để chúng tôi liên hệ hỗ trợ.');
  }

  if (!isValidPhone(trimmedPhone)) {
    throw new Error('Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại (ví dụ: 0901234567).');
  }

  if (payload.email && payload.email.trim() && !isValidEmail(payload.email.trim())) {
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

  // Prepare standard data map for both database and email
  const submissionData: Record<string, any> = {
    fullName: trimmedName,
    phone: trimmedPhone,
    email: (payload.email || '').trim(),
    companyName: (payload.companyName || '').trim(),
    serviceType: (payload.serviceType || '').trim(),
    quantity: (payload.quantity || '').trim(),
    deadline: (payload.deadline || '').trim(),
    subject: (payload.subject || '').trim(),
    message: (payload.message || '').trim(),
    notes: (payload.notes || '').trim(),
    position: (payload.position || '').trim(),
    cvLink: (payload.cvLink || '').trim(),
    coverLetter: (payload.coverLetter || '').trim(),
    ...(payload.extraData || {}),
  };

  // Remove empty keys from the email data table for cleaner reading
  const cleanEmailData: Record<string, any> = {};
  for (const [k, v] of Object.entries(submissionData)) {
    if (v !== '' && v !== null && v !== undefined) {
      cleanEmailData[k] = v;
    }
  }

  let dbSaved = false;
  let recordId: string | undefined;

  // 4. Save to Supabase table (form_submissions) if configured
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .insert([
          {
            form_type: payload.formType,
            title: FORM_TYPE_NAMES[payload.formType] || payload.formType,
            full_name: trimmedName,
            phone: trimmedPhone,
            email: (payload.email || '').trim() || null,
            company_name: (payload.companyName || '').trim() || null,
            service_type: (payload.serviceType || '').trim() || null,
            quantity: (payload.quantity || '').trim() || null,
            deadline: (payload.deadline || '').trim() || null,
            subject: (payload.subject || '').trim() || null,
            message: (payload.message || '').trim() || null,
            cv_link: (payload.cvLink || '').trim() || null,
            details: submissionData,
            status: 'new',
          },
        ])
        .select('id')
        .maybeSingle();

      if (!error && data?.id) {
        dbSaved = true;
        recordId = data.id;
      } else if (error) {
        console.warn('Could not insert to form_submissions table (may need SQL migration):', error.message);
      }
    } catch (dbErr) {
      console.warn('Supabase DB insert error:', dbErr);
    }
  }

  // 5. Invoke Supabase Edge Function to deliver email to xnitchcm@gmail.com
  let emailSent = false;
  let edgeFunctionError: string | null = null;

  if (supabase && isSupabaseConfigured) {
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('send-email', {
        body: {
          formType: payload.formType,
          subject: emailSubject,
          replyTo: payload.email?.trim() || undefined,
          senderName: trimmedName,
          data: cleanEmailData,
        },
      });

      if (edgeError) {
        console.warn('Edge Function returned error:', edgeError);
        edgeFunctionError = edgeError.message || 'Không thể kết nối đến dịch vụ gửi email';
      } else if (edgeData?.error) {
        console.warn('Edge Function response error:', edgeData.error);
        edgeFunctionError = edgeData.error;
      } else {
        emailSent = true;
      }
    } catch (err: any) {
      console.warn('Failed to invoke send-email Edge Function:', err);
      edgeFunctionError = err.message || 'Lỗi gửi email máy chủ';
    }
  }

  // 6. Handle outcome
  // If either edge function sent OR DB saved, the request was recorded
  if (emailSent || dbSaved) {
    return {
      success: true,
      message: 'Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm.',
      id: recordId,
    };
  }

  // If both failed (e.g. edge function error AND DB unavailable), throw user-friendly error so they can retry
  if (edgeFunctionError) {
    throw new Error(`Gửi yêu cầu không thành công: ${edgeFunctionError}. Quý khách vui lòng thử lại hoặc liên hệ trực tiếp qua số hotline.`);
  }

  // Fallback in local/preview mock mode
  return {
    success: true,
    message: 'Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm.',
  };
}
