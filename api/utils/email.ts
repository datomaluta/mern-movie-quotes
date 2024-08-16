import nodemailer from "nodemailer";

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message?: string;
  html: string;
}) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: parseInt(process.env.EMAIL_PORT as string, 10),
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    service: "gmail",
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Movie Quotes" <movie-quuotes@info.com>',
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};
