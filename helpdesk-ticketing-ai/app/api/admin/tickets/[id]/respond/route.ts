import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// EMAIL BALASAN ADMIN - DESAIN HITAM PUTIH ELEGAN
async function sendEmail(to: string, ticketNumber: string, message: string, ticketTitle: string, clientName: string) {
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
      <title>Balasan Tiket ${ticketNumber}</title>
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
          border-radius: 20px;
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
        .response-card {
          background-color: #fafafa;
          border-radius: 12px;
          padding: 20px;
          margin: 28px 0;
          border: 1px solid #eaeaea;
        }
        .response-label {
          font-size: 12px;
          font-weight: 600;
          color: #1e1e1e;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .response-message {
          color: #2c2c2c;
          line-height: 1.6;
          font-size: 15px;
          white-space: pre-wrap;
        }
        .button {
          display: inline-block;
          background-color: #ffffff;
          color: #1e1e1e;
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
          background-color: #1e1e1e;
          color: #ffffff;
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
            Tiket Anda telah mendapatkan balasan dari tim support kami.
          </p>
          <div class="ticket-card">
            <div class="ticket-label">NOMOR TIKET</div>
            <div class="ticket-number">${ticketNumber}</div>
            <div class="title-text">${ticketTitle}</div>
          </div>
          <div class="response-card">
            <div class="response-label">
              <span>💬</span> BALASAN DARI TIM SUPPORT
            </div>
            <div class="response-message">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="text-align: center; margin: 28px 0 16px;">
            <a href="${process.env.NEXTAUTH_URL}/track" class="button">Lacak Status Tiket →</a>
          </div>
          <p style="font-size: 13px; color: #8a8a8a; text-align: center; margin-top: 20px;">
            Gunakan nomor tiket di atas untuk memantau perkembangan laporan Anda.
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
    subject: `Balasan Admin - Tiket ${ticketNumber}`,
    html: htmlContent,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { message } = await req.json();

  const ticket = await prisma.ticket.findUnique({
    where: { id: id },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const response = await prisma.ticketResponse.create({
    data: {
      ticketId: id,
      adminId: (session.user as any).id,
      message,
    },
  });

  if (ticket.status === "Open") {
    await prisma.ticket.update({
      where: { id: id },
      data: { status: "In Progress" },
    });
  }

  try {
    await sendEmail(ticket.clientEmail, ticket.ticketNumber, message, ticket.title, ticket.clientName);
  } catch (emailError) {
    console.log("Email not sent:", emailError);
  }

  return NextResponse.json(response);
}