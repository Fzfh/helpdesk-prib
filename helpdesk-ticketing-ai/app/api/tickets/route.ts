import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

function generateTicketNumber(): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TIX-${random}`;
}

// FUNGSI VERIFIKASI CAPTCHA KE GOOGLE
async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${secretKey}&response=${token}`,
  });
  
  const data = await response.json();
  return data.success === true;
}

// FUNGSI EMAIL NOTIFIKASI TIKET BARU (DESAIN HITAM PUTIH ELEGAN)
async function sendEmail(to: string, ticketNumber: string, clientName: string, title: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tiket Baru: ${ticketNumber}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
          color: #1e1e1e;
        }
        .container {
          max-width: 560px;
          margin: 0 auto;
          background-color: #ffffff;
          borderRadius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          border: 1px solid #eaeaea;
        }
        .header {
          background-color: #1e1e1e;
          padding: 32px 28px;
          text-align: center;
          border-bottom: 1px solid #2c2c2c;
        }
        .logo {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #ffffff;
          margin: 0;
          line-height: 1.2;
        }
        .logo span {
          color: #b0b0b0;
          font-weight: 400;
        }
        .content {
          padding: 36px 32px;
        }
        .greeting {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1e1e1e;
        }
        .divider {
          width: 50px;
          height: 2px;
          background-color: #d4d4d4;
          margin: 20px 0 24px 0;
        }
        .ticket-card {
          background-color: #fafafa;
          border-left: 4px solid #1e1e1e;
          padding: 20px 24px;
          margin: 28px 0;
          border-radius: 12px;
        }
        .ticket-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          color: #6b6b6b;
          margin-bottom: 8px;
        }
        .ticket-number {
          font-family: monospace;
          font-size: 28px;
          font-weight: 700;
          color: #1e1e1e;
          letter-spacing: 1px;
          background: #ffffff;
          display: inline-block;
          padding: 4px 12px;
          border-radius: 40px;
          border: 1px solid #e0e0e0;
        }
        .title-text {
          font-size: 18px;
          font-weight: 500;
          margin-top: 12px;
          color: #2c2c2c;
        }
        .info-row {
          margin: 20px 0 0;
          font-size: 14px;
          color: #4a4a4a;
        }
        .button {
          display: inline-block;
          background-color: #1e1e1e;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 40px;
          font-weight: 500;
          font-size: 15px;
          margin: 16px 0 8px;
          transition: all 0.2s ease;
          border: 1px solid #1e1e1e;
        }
        .button:hover {
          background-color: #ffffff;
          color: #1e1e1e;
          border-color: #1e1e1e;
        }
        .footer {
          background-color: #fafafa;
          padding: 24px 32px;
          text-align: center;
          border-top: 1px solid #eeeeee;
          font-size: 12px;
          color: #8a8a8a;
        }
        .footer p {
          margin: 0;
        }
        @media (max-width: 600px) {
          .content { padding: 24px; }
          .ticket-number { font-size: 22px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">help<span>desk</span></div>
        </div>
        <div class="content">
          <div class="greeting">Halo, ${clientName}</div>
          <div class="divider"></div>
          <p style="margin: 0 0 16px 0; line-height: 1.5; color: #3a3a3a;">
            Tiket Anda telah berhasil dibuat. Tim support kami akan segera menindaklanjuti laporan Anda.
          </p>
          <div class="ticket-card">
            <div class="ticket-label">NOMOR TIKET</div>
            <div class="ticket-number">${ticketNumber}</div>
            <div class="title-text">${title}</div>
            <div class="info-row">
              <strong>Status:</strong> <span style="color: #1e1e1e;">Open</span> &nbsp;|&nbsp;
              <strong>Prioritas:</strong> <span style="color: #6b6b6b;">Sedang (akan ditentukan AI)</span>
            </div>
          </div>
          <div style="text-align: center; margin: 28px 0 16px;">
            <a href="${process.env.NEXTAUTH_URL}/track" class="button">Lacak Pengajuan →</a>
          </div>
          <p style="font-size: 13px; color: #8a8a8a; text-align: center; margin-top: 20px;">
            Simpan nomor tiket ini untuk memantau status laporan Anda.
          </p>
        </div>
        <div class="footer">
          <p>© 2025 Helpdesk System — Support 24/7</p>
          <p style="margin-top: 8px; font-size: 11px;">Email otomatis, mohon tidak membalas langsung.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Helpdesk System" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Tiket #${ticketNumber} Berhasil Dibuat - ${title}`,
    html: htmlContent,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, clientEmail, title, description, category, captchaToken } = body;

    // VALIDASI CAPTCHA WAJIB ADA
    if (!captchaToken) {
      return NextResponse.json({ error: "CAPTCHA wajib diisi" }, { status: 400 });
    }

    // VERIFIKASI CAPTCHA KE GOOGLE
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    
    if (!isCaptchaValid) {
      return NextResponse.json({ error: "Validasi CAPTCHA gagal. Silakan coba lagi." }, { status: 400 });
    }

    const ticketNumber = generateTicketNumber();

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        clientName,
        clientEmail,
        title,
        description,
        category,
        status: "Open",
        priority: "Medium",
      },
    });

    // 🔥 PANGGIL AI SUGGESTION (ditaruh di dalam try block)
    try {
      const aiRes = await fetch(`${process.env.NEXTAUTH_URL}/api/ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      
      const aiSuggestion = await aiRes.json();
      
      // Simpan AI suggestion ke database
      await prisma.aiSuggestion.create({
        data: {
          ticketId: ticket.id,
          summary: aiSuggestion.summary,
          suggestedCategory: aiSuggestion.category,
          suggestedPriority: aiSuggestion.priority,
        },
      });
      
      // Update prioritas tiket berdasarkan AI
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { priority: aiSuggestion.priority },
      });
      
      console.log("✅ AI suggestion saved for ticket:", ticket.ticketNumber);
      
    } catch (aiError) {
      console.log("⚠️ AI suggestion failed:", aiError);
      // Tetap lanjut, tiket tetap dibuat meskipun AI error
    }

    // Kirim email dengan data lengkap (nama + judul)
    try {
      await sendEmail(clientEmail, ticketNumber, clientName, title);
    } catch (emailError) {
      console.log("Email not sent:", emailError);
    }

    return NextResponse.json({
      success: true,
      ticketNumber: ticket.ticketNumber,
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal membuat tiket" },
      { status: 500 }
    );
  }
}