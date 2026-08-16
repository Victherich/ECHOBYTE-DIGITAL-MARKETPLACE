import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email, and message.' },
        { status: 400 }
      );
    }

    // Configure Nodemailer transporter using your SMTP provider
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

 const htmlContent = `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8">
         <style>
           body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
           .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.05); }
           .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 30px; text-align: center; color: #ffffff; }
           .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
           .header p { margin: 8px 0 0; font-size: 13px; color: #e0e7ff; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
           .content { padding: 25px; }
           .info-box { background: #f8fafc; border-left: 4px solid #6366f1; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; line-height: 1.6; border: 1px solid #e2e8f0; border-left-width: 4px; }
           .info-row { margin-bottom: 6px; }
           .info-row:last-child { margin-bottom: 0; }
           .message-title { font-size: 14px; color: #334155; font-weight: 700; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em; }
           .message-box { background: #f8fafc; padding: 18px; border-radius: 8px; font-size: 14px; color: #1e293b; line-height: 1.6; border: 1px solid #e2e8f0; }
           .footer { background: #f1f5f9; padding: 18px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #e2e8f0; }
         </style>
       </head>
       <body>
         <div class="container">
           <div class="header">
             <h1>ECHOBYTE CONCEPT</h1>
             <p>New Client Contact Submission</p>
           </div>
           <div class="content">
             <div class="info-box">
               <div class="info-row"><strong>Name:</strong> ${name}</div>
               <div class="info-row"><strong>Email:</strong> ${email}</div>
               <div class="info-row"><strong>Phone:</strong> ${phone || 'N/A'}</div>
             </div>
             <h3 class="message-title">Client Message:</h3>
             <div class="message-box">
               ${message.replace(/\n/g, '<br/>')}
             </div>
           </div>
           <div class="footer">
             &copy; ${new Date().getFullYear()} EchoByte Concept. All rights reserved.
           </div>
         </div>
       </body>
     </html>
   `;

    // const mailOptions = {
    //   from: `"Bees Interior Contact" <${process.env.SMTP_USER}>`,
    //   to: 'beesinterior@gmail.com', // Recipient email specified for contact forms
    //   replyTo: email,
    //   subject: `New Inquiry from ${name} - Bees Interior`,
    //   html: htmlContent,
    // };

    const mailOptions = {
      // Must use process.env.SMTP_USER as the actual email to avoid spam flags, 
      // but you can prepend the customer's name in the display string safely:
      from: `"${name} via Echobyte Digital Store" <${process.env.SMTP_USER}>`,
      to: 'echobyteconcept@gmail.com', // The inbox receiving the leads
    //    to: 'victherich@gmail.com', // The inbox receiving the leads
      replyTo: email,             // Clicking "Reply" will reply straight to the customer
      subject: `New Contact Inquiry: ${name}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Contact email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}