import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface PaymentNotificationData {
    customerName: string;
    customerEmail: string;
    planName: string;
    amount: number;
    currency: string;
    paymentStatus: 'success' | 'failed';
    paymentDate: Date;
    transactionId?: string;
    errorMessage?: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    private http = inject(HttpClient);
    // Usar backend para evitar CORS y no exponer claves en el navegador
    private readonly backendEmailUrl = `${environment.backendUrl}/api/v1/emails/send`;

    /**
     * Envía notificación de pago (éxito o fallo)
     */
    async sendPaymentNotification(data: PaymentNotificationData): Promise<{ success: boolean; message?: string }> {
        console.log('[EmailService] sendPaymentNotification llamado:', data);

        const subject = data.paymentStatus === 'success'
            ? `Pago Exitoso - ${data.planName}`
            : `Pago Fallido - ${data.planName}`;

        const htmlContent = this.generatePaymentNotificationHTML(data, subject);
        const textContent = this.generatePaymentNotificationText(data, subject);

        const emailData = {
            from: {
                email: environment.mailersend.fromEmail,
                name: environment.mailersend.fromName
            },
            to: [
                {
                    email: data.customerEmail,
                    name: data.customerName
                }
            ],
            subject: subject,
            html: htmlContent,
            text: textContent
        };

        try {
            console.log('[EmailService] Enviando email via backend:', {
                recipient: data.customerEmail,
                subject,
                msgBody: textContent
            });

            // Backend espera EmailDetails { recipient, subject, msgBody, attachment }
            await firstValueFrom(this.http.post(this.backendEmailUrl, {
                recipient: data.customerEmail,
                subject,
                msgBody: textContent,
                attachment: null
            }));
            console.log('[EmailService] Email enviado exitosamente');
            return { success: true };
        } catch (error: any) {
            console.error('[EmailService] Error enviando notificación de pago:', error);
            return {
                success: false,
                message: error?.error?.message || 'Error enviando notificación por email'
            };
        }
    }

    /**
     * Envía notificación de bienvenida después de pago exitoso
     */
    async sendWelcomeNotification(data: Omit<PaymentNotificationData, 'paymentStatus' | 'errorMessage'>): Promise<{ success: boolean; message?: string }> {
        console.log('[EmailService] sendWelcomeNotification llamado:', data);

        const subject = `¡Bienvenido a ${data.planName}!`;

        const htmlContent = this.generateWelcomeNotificationHTML(data, subject);
        const textContent = this.generateWelcomeNotificationText(data, subject);

        const emailData = {
            from: {
                email: environment.mailersend.fromEmail,
                name: environment.mailersend.fromName
            },
            to: [
                {
                    email: data.customerEmail,
                    name: data.customerName
                }
            ],
            subject: subject,
            html: htmlContent,
            text: textContent
        };

        try {
            console.log('[EmailService] Enviando email de bienvenida via backend:', {
                recipient: data.customerEmail,
                subject,
                msgBody: textContent
            });

            await firstValueFrom(this.http.post(this.backendEmailUrl, {
                recipient: data.customerEmail,
                subject,
                msgBody: textContent,
                attachment: null
            }));
            console.log('[EmailService] Email de bienvenida enviado exitosamente');
            return { success: true };
        } catch (error: any) {
            console.error('[EmailService] Error enviando notificación de bienvenida:', error);
            return {
                success: false,
                message: error?.error?.message || 'Error enviando notificación de bienvenida'
            };
        }
    }

    /**
     * Genera el HTML para la notificación de pago
     */
    private generatePaymentNotificationHTML(data: PaymentNotificationData, subject: string): string {
        const statusText = data.paymentStatus === 'success' ? 'EXITOSO' : 'FALLIDO';
        const statusColor = data.paymentStatus === 'success' ? '#10B981' : '#EF4444';
        const statusIcon = data.paymentStatus === 'success' ? 'ok' : 'denied';

        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #F3F4F6;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 40px;
    }
    .footer {
      background-color: #F3F4F6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6B7280;
    }
    .amount {
      font-size: 24px;
      font-weight: bold;
      color: #1F2937;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table td {
      padding: 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    .info-table tr:last-child td {
      border-bottom: none;
    }
    .status {
      color: ${statusColor};
      font-weight: bold;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3B82F6;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    @media (max-width: 600px) {
      .content { padding: 20px; }
      .amount { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span style="color: #6B7280; font-size: 12px;">Notificación de Pago</span>
    </div>

    <div class="content">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold; color: #1F2937; margin-bottom: 30px;">
        ${subject}
      </h1>

      <p style="font-size: 16px; color: #4B5563;">
        Hola <strong>${data.customerName}</strong>,
      </p>

      <p style="font-size: 16px; color: #4B5563;">
        ${data.paymentStatus === 'success'
            ? 'Tu pago ha sido procesado exitosamente. Aquí están los detalles de tu transacción:'
            : 'Lo sentimos, hubo un problema con tu pago. Detalles de la transacción:'}
      </p>

      <table class="info-table">
        <tr>
          <td style="font-weight: bold;">Plan:</td>
          <td>${data.planName}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Monto:</td>
          <td class="amount">${data.currency} ${data.amount}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Fecha:</td>
          <td>${data.paymentDate.toLocaleDateString('es-ES')} a las ${data.paymentDate.toLocaleTimeString('es-ES')}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">ID de Transacción:</td>
          <td>${data.transactionId || 'N/A'}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Estado:</td>
          <td class="status">${statusIcon} ${statusText}</td>
        </tr>
        ${data.errorMessage ? `
        <tr>
          <td style="font-weight: bold;">Error:</td>
          <td style="color: #EF4444;">${data.errorMessage}</td>
        </tr>
        ` : ''}
      </table>

      <p style="text-align: center; font-size: 14px; color: #6B7280;">
        ${data.paymentStatus === 'success'
            ? '¡Gracias por tu compra! Tu plan ha sido activado correctamente.'
            : 'Por favor, intenta nuevamente o contacta con soporte si el problema persiste.'}
      </p>

      <div style="text-align: center;">
        <a href="https://tuapp.com/support" class="button">📞 Contactar Soporte</a>
      </div>
    </div>

    <div class="footer">
      <p>© 2024 Tu App. Todos los derechos reservados.</p>
      <p>Este es un email automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>`;
    }

    /**
     * Genera el contenido de texto plano para la notificación de pago
     */
    private generatePaymentNotificationText(data: PaymentNotificationData, subject: string): string {
        return `
${subject}

Hola ${data.customerName},

${data.paymentStatus === 'success'
            ? 'Tu pago ha sido procesado exitosamente. Aquí están los detalles de tu transacción:'
            : 'Lo sentimos, hubo un problema con tu pago. Detalles de la transacción:'}

Plan: ${data.planName}
Monto: ${data.currency} ${data.amount}
Fecha: ${data.paymentDate.toLocaleDateString('es-ES')} a las ${data.paymentDate.toLocaleTimeString('es-ES')}
ID de Transacción: ${data.transactionId || 'N/A'}
Estado: ${data.paymentStatus === 'success' ? 'EXITOSO' : 'FALLIDO'}
${data.errorMessage ? `Error: ${data.errorMessage}` : ''}

${data.paymentStatus === 'success'
            ? '¡Gracias por tu compra! Tu plan ha sido activado correctamente.'
            : 'Por favor, intenta nuevamente o contacta con soporte si el problema persiste.'}

Para soporte, visita: https://tuapp.com/support

© 2024 Tu App. Todos los derechos reservados.
Este es un email automático, por favor no respondas a este mensaje.`.trim();
    }

    /**
     * Genera el HTML para el email de bienvenida
     */
    private generateWelcomeNotificationHTML(data: Omit<PaymentNotificationData, 'paymentStatus' | 'errorMessage'>, subject: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #3B82F6;
      padding: 40px;
      text-align: center;
      color: white;
    }
    .content {
      padding: 40px;
    }
    .footer {
      background-color: #F3F4F6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6B7280;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    .info-table tr:last-child td {
      border-bottom: none;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #10B981;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    @media (max-width: 600px) {
      .content { padding: 20px; }
      .header { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${subject}</h1>
    </div>

    <div class="content">
      <p style="font-size: 18px; color: #1F2937;">
        Hola <strong>${data.customerName}</strong>,
      </p>

      <p style="font-size: 16px; color: #4B5563;">
        ¡Gracias por unirte a nuestro plan <strong>${data.planName}</strong>!
        Tu pago de <strong>${data.currency} ${data.amount}</strong> ha sido procesado exitosamente.
      </p>

      <p style="font-size: 16px; color: #4B5563;">
        <strong>Detalles de tu suscripción:</strong>
      </p>

      <table class="info-table">
        <tr>
          <td style="font-weight: bold;">Plan:</td>
          <td>${data.planName}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Fecha de activación:</td>
          <td>${data.paymentDate.toLocaleDateString('es-ES')}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">ID de Transacción:</td>
          <td>${data.transactionId || 'N/A'}</td>
        </tr>
      </table>

      <p style="font-size: 16px; color: #4B5563;">
        <strong>¿Qué sigue?</strong>
      </p>

      <ul style="font-size: 14px; color: #6B7280; padding-left: 20px;">
        <li>Acceso inmediato a todas las funciones de tu plan</li>
        <li>Recibirás recordatorios antes de la renovación</li>
        <li>Soporte prioritario durante tu suscripción</li>
        <li>Actualizaciones exclusivas para miembros premium</li>
      </ul>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://tuapp.com/dashboard" class="button">🚀 Comenzar a Usar</a>
      </div>
    </div>

    <div class="footer">
      <p>© 2024 Tu App. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>`;
    }

    /**
     * Genera el contenido de texto plano para el email de bienvenida
     */
    private generateWelcomeNotificationText(data: Omit<PaymentNotificationData, 'paymentStatus' | 'errorMessage'>, subject: string): string {
        return `
${subject}

Hola ${data.customerName},

¡Gracias por unirte a nuestro plan ${data.planName}!
Tu pago de ${data.currency} ${data.amount} ha sido procesado exitosamente.

Detalles de tu suscripción:
- Plan: ${data.planName}
- Fecha de activación: ${data.paymentDate.toLocaleDateString('es-ES')}
- ID de Transacción: ${data.transactionId || 'N/A'}

¿Qué sigue?
• Acceso inmediato a todas las funciones de tu plan
• Recibirás recordatorios antes de la renovación
• Soporte prioritario durante tu suscripción
• Actualizaciones exclusivas para miembros premium

Comienza a usar tu plan: https://tuapp.com/dashboard

© 2024 Tu App. Todos los derechos reservados.`.trim();
    }

    /**
     * Método con reintentos para envío de emails
     */
    private async sendWithRetry(emailData: any, retries = 3): Promise<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        for (let i = 0; i < retries; i++) {
            try {
                return await firstValueFrom(this.http.post(this.backendEmailUrl, emailData, { headers }));
            } catch (error) {
                console.warn(`[EmailService] Reintento ${i + 1}/${retries} falló:`, error);
                if (i === retries - 1) throw error;
                await this.delay(1000 * (i + 1));
            }
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
