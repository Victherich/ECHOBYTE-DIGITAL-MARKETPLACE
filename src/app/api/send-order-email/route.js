



// app/api/send-order-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, payload, recipients } = body;

    if (!payload || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload or recipients.' },
        { status: 400 }
      );
    }

    // Configure Nodemailer transporter using authenticated SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
    });

    const {
      orderNumber,
      product,
      items,
      subtotal,
      discount,
      finalTotal,
      promoCode,
      currency,
      accountInfo,
      paymentType,
      paymentStatus,
      orderStatus,
    } = payload;

    // Extract single digital product details
    const orderItems = items || (product ? [product] : []);
    const singleProduct = orderItems[0] || {};
    const sellerEmail = singleProduct?.creatorEmail || process.env.SMTP_USER;
    const customerEmail = accountInfo?.email || recipients[0];

    const productName = singleProduct.name || singleProduct.title || 'Digital Product';
    const productId = singleProduct.id || singleProduct.productId || 'N/A';
    const productUrl = singleProduct.productUrl || singleProduct.url || '#';
    const productPrice = Number(singleProduct.amount || singleProduct.price || subtotal || 0);

    const calculatedDiscount = Number(discount || 0);
    const calculatedTotal = Number(finalTotal || (productPrice - calculatedDiscount));

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5eaf2; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.04); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 30px 25px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
            .header p { margin: 8px 0 0; font-size: 13px; color: #e0e7ff; }
            .content { padding: 25px; }
            .info-box { background: #f8fafc; border-left: 4px solid #6366f1; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px; font-size: 13px; line-height: 1.6; }
            .product-box { background: #f8fafc; border: 1px solid #e5eaf2; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
            .totals { width: 100%; font-size: 13px; margin-bottom: 24px; }
            .totals td { padding: 8px 12px; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #e5eaf2; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ECHOBYTE DIGITAL</h1>
              <p>Digital Product Access & Confirmation</p>
            </div>
            <div class="content">
              <div class="info-box">
                <strong>Order Number:</strong> ${orderNumber} <br/>
                <strong>Payment Type:</strong> ${paymentType} <br/>
                <strong>Payment Status:</strong> ${paymentStatus} <br/>
                <strong>Order Status:</strong> ${orderStatus}
              </div>

              <h3 style="font-size: 14px; color: #6366f1; margin-bottom: 8px;">Customer Information</h3>
              <p style="font-size: 13px; margin-top: 0; line-height: 1.5; color: #475569;">
                <strong>Name:</strong> ${accountInfo?.name || 'N/A'}<br/>
                <strong>Email:</strong> ${accountInfo?.email || 'N/A'}<br/>
                <strong>Phone:</strong> ${accountInfo?.phone || 'N/A'}
              </p>

              <h3 style="font-size: 14px; color: #6366f1; margin-bottom: 8px;">Purchased Product</h3>
              <div class="product-box">
                <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${productName}</div>
                <div style="font-size: 12px; font-family: monospace; color: #64748B; margin-bottom: 12px;">Product ID: ${productId}</div>
                ${productUrl !== '#' ? `
                <div style="margin-top: 8px;">
                  <a href="${productUrl}" target="_blank" style="background: #6366f1; color: #ffffff; padding: 10px 18px; border-radius: 6px; font-size: 13px; text-decoration: none; font-weight: 600; display: inline-block;">Access Your Order</a>
                </div>` : ''}
              </div>

              <table class="totals">
                <tr>
                  <td style="color: #64748B;">Price:</td>
                  <td style="text-align: right; font-weight: 600;">₦${Number(productPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                ${calculatedDiscount > 0 ? `
                <tr>
                  <td style="color: #10b981;">Discount ${promoCode ? `(${promoCode})` : ''}:</td>
                  <td style="text-align: right; font-weight: 600; color: #10b981;">-₦${Number(calculatedDiscount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>` : ''}
                <tr>
                  <td style="font-size: 15px; font-weight: 800; color: #0f172a; border-top: 1px solid #e5eaf2; padding-top: 12px;">Final Total:</td>
                  <td style="text-align: right; font-size: 15px; font-weight: 800; color: #6366f1; border-top: 1px solid #e5eaf2; padding-top: 12px;">₦${Number(calculatedTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </table>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} EchoByte Digital Store. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `Order Confirmation #${orderNumber}\n\n` +
      `Product: ${productName}\n` +
      `Product ID: ${productId}\n` +
      `Access Link: ${productUrl}\n\n` +
      `Payment Type: ${paymentType}\n` +
      `Payment Status: ${paymentStatus}\n` +
      `Order Status: ${orderStatus}\n\n` +
      `Customer: ${accountInfo?.name} (${accountInfo?.email}, ${accountInfo?.phone})\n\n` +
      `Final Total: ₦${Number(calculatedTotal).toLocaleString()}\n\n` +
      `Thank you for shopping with EchoByte Digital Store!`;

    const bccRecipients = recipients.filter((email) => email && email !== customerEmail);

    const mailOptions = {
      from: `"EchoByte Digital Store" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      bcc: [...new Set(bccRecipients)],
      replyTo: sellerEmail,
      subject: `Order Confirmation #${orderNumber} - EchoByte Digital`,
      text: textContent,
      html: htmlContent,
      headers: {
        'X-Entity-Ref-ID': orderId || orderNumber,
      },
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Digital product email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}