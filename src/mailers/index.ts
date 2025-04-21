import transporter from "../config/transporter";
import { IMailData } from "../interfaces";

export const sendMail = async <T>(data: IMailData<T>): Promise<void> => {
  const { to, subject, template, context } = data;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    template,
    context: {...context},
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};