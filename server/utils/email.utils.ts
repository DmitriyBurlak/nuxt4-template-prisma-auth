import nodemailer from 'nodemailer'
import { EmailSendError } from './error'
const config = useRuntimeConfig()

const transporter = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT, // Меняем на порт 587 для TLS 465
  secure: true, // false для порта 587
  auth: {
		user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  }
}, {
	from: config.MAIL_USER
})

// Тестовая функция для проверки подключения
export const verifyEmailConnection = async () => {
  try {
    console.log('Проверка SMTP соединения...')
    await transporter.verify()
    console.log('SMTP соединение успешно установлено')
    return true
  } catch (error) {
    console.error('Ошибка SMTP соединения:', error)
    if (error.code === 'ETIMEDOUT') {
      console.error('Превышено время ожидания подключения. Проверьте:')
      console.error('1. Доступность сервера smtp.yandex.ru')
      console.error('2. Настройки файрвола')
      console.error('3. Правильность порта (587 для TLS)')
    }
    return false
  }
}

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const verificationUrl = `${config.public.baseURL}/verify-email?token=${token}`
    
    const info = await transporter.sendMail({
      to: email,
      subject: 'Подтверждение email',
			html: `
      <h2>Добро пожаловать!</h2>
      <p>Для завершения регистрации подтвердите ваш email:</p>
      <a href="${verificationUrl}" 
         style="color: #2196F3; text-decoration: none;">
        Подтвердить Email
      </a>
      <p>Ссылка действительна 24 часа</p>
      <p>Если вы не регистрировались, проигнорируйте это письмо</p>
    `
    })

    console.log('Письмо успешно отправлено:', info.messageId)
    return true
  } catch (error) {
    console.error('Ошибка отправки письма:', error)
    throw new EmailSendError()
  }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetUrl = `${config.public.baseURL}/reset-password?token=${token}`
    
    const info = await transporter.sendMail({
      to: email,
      subject: 'Сброс пароля',
      html: `
        <h1>Сброс пароля</h1>
        <p>Для сброса пароля перейдите по ссылке:</p>
        <a href="${resetUrl}" style="color: #2196F3; text-decoration: none;">Сбросить пароль</a>
        <p>Ссылка действительна в течение 1 часа.</p>
      `
    })

    console.log('Письмо для сброса пароля отправлено:', info.messageId)
    return true
  } catch (error) {
    console.error('Ошибка отправки письма для сброса пароля:', error)
		throw new EmailSendError()
  }
}