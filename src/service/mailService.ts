import nodemailer from "nodemailer"
export const mailService = {
  async transporter() {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
    return transporter
  },
  async sendActivationMail(to: string, link: string) {
    const tramsporter = await this.transporter()
    tramsporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Activation accaunt on " + process.env.API_URL,
      text: "",
      html: `<div>
      <h1>To activate your account follow the link</h1>
      <a href="${link}">${link}</a>
      </div>`,
    })
  },
}
