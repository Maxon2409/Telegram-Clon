/**
 * Сервис отправки SMS-кодов подтверждения.
 *
 * Режим разработки: возвращает тестовый код "123456".
 * В продакшене подключи: Twilio, Firebase Phone Auth, sms.ru и т.п.
 */

const DEV_MODE = __DEV__; // true в режиме разработки
const DEV_CODE = '123456';

export interface SendCodeResult {
  success: boolean;
  error?: string;
  /** В dev-режиме возвращает код для тестирования */
  devCode?: string;
}

export interface VerifyCodeResult {
  success: boolean;
  error?: string;
}

/**
 * Отправляет SMS с кодом подтверждения на указанный номер.
 */
export async function sendVerificationCode(phone: string): Promise<SendCodeResult> {
  if (DEV_MODE) {
    console.log(`[DEV] Код отправлен на ${phone}: ${DEV_CODE}`);
    return { success: true, devCode: DEV_CODE };
  }

  // TODO: Подключить реальный SMS-провайдер
  // Пример с Twilio:
  // const client = twilio(accountSid, authToken);
  // await client.messages.create({
  //   body: `Ваш код: ${code}`,
  //   from: twilioPhone,
  //   to: phone,
  // });
  return { success: true, devCode: DEV_CODE };
}

/**
 * Проверяет введённый код (реализация зависит от провайдера).
 */
export async function verifyCode(phone: string, code: string): Promise<VerifyCodeResult> {
  if (DEV_MODE) {
    const valid = code === DEV_CODE || code === '000000';
    return { success: valid };
  }

  // TODO: Проверка через API провайдера (Firebase, Twilio Verify и т.д.)
  return { success: true };
}
