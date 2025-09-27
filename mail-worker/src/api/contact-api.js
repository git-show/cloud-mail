import app from '../hono/hono';
import { Resend } from 'resend';
import settingService from '../service/setting-service';
import BizError from '../error/biz-error';
import { t } from '../i18n/i18n.js';

// Contact form email sending API
app.post('/send-email', async (c) => {
  try {
    const body = await c.req.json();
    const { email, urgency, category, message, needReply, lang } = body;

    // バリデーション
    if (!email || !message) {
      return c.json({ success: false, error: 'Email and message are required' }, 400);
    }

    if (message.length > 200) {
      return c.json({ success: false, error: 'Message must be 200 characters or less' }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ success: false, error: 'Invalid email format' }, 400);
    }

    // 設定からresendトークンを取得（email-service.jsと同じ方法）
    const { resendTokens } = await settingService.query(c);
    const resendToken = resendTokens['baby.cat']; // tsubasa@baby.catのドメイン

    if (!resendToken) {
      return c.json({ success: false, error: 'Contact email service not configured' }, 500);
    }

    // 統一された言語システムを使用（i18n.jsのミドルウェアで設定された言語）
    // リクエストボディのlangパラメータは、フロントエンドとの互換性のために残すが、
    // 実際の言語は i18n ミドルウェアで設定されたものを使用

    // メール内容を構築（統一されたi18nシステムを使用）
    const urgencyText = t(`contact.urgency${urgency.charAt(0).toUpperCase() + urgency.slice(1)}`);
    const categoryText = t(`contact.category${category.charAt(0).toUpperCase() + category.slice(1)}`);

    const subject = `${categoryText} · ${urgencyText}`;
    
    const htmlContent = `
      <h3>${t('contact.title')}</h3>
      <p><strong>${t('contact.emailLabel')}:</strong> ${email}</p>
      <p><strong>${t('contact.urgencyLabel')}:</strong> ${urgencyText}</p>
      <p><strong>${t('contact.categoryLabel')}:</strong> ${categoryText}</p>
      <p><strong>${t('contact.needReplyLabel')}:</strong> ${needReply ? t('contact.yes') : t('contact.no')}</p>
      <hr>
      <p><strong>${t('contact.messageLabel')}:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const textContent = `
${t('contact.title')}

${t('contact.emailLabel')}: ${email}
${t('contact.urgencyLabel')}: ${urgencyText}
${t('contact.categoryLabel')}: ${categoryText}
${t('contact.needReplyLabel')}: ${needReply ? t('contact.yes') : t('contact.no')}

${t('contact.messageLabel')}:
${message}
    `;

    // Initialize Resend（email-service.jsと同じ構造）
    const resend = new Resend(resendToken);

    // メール送信（email-service.jsのsendFormと同じ構造）
    const sendForm = {
      from: `Contact Form <noreply@love.cat>`, // 認証済みドメインから送信
      to: ['info@love.cat'],
      subject: subject,
      text: textContent.trim(),
      html: htmlContent,
      replyTo: email // 返信先を問い合わせ者のメールアドレスに設定
    };

    const result = await resend.emails.send(sendForm);

    const { data, error } = result;

    if (error) {
      console.error('Resend API error:', error);
      return c.json({ success: false, error: error.message }, 500);
    }

    console.log('Contact email sent successfully:', result);
    return c.json({ 
      success: true, 
      messageId: data.id,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Contact email sending error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});