import nodemailer from "nodemailer";
import { create } from "express-handlebars";
import path from "path";

// Setup handlebars engine
const hbs = create({
  extname: ".hbs",
  defaultLayout: false,
});

// Create the transporter instance
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  port: Number(process.env.EMAIL_PORT),
  service: process.env.EMAIL_SERVICE!,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

// Function to initialize Handlebars for Nodemailer
(async () => {
  const { default: nodemailerhbs } = await import(
    "nodemailer-express-handlebars"
  );

  const handlebarsOptions = {
    viewEngine: hbs,
    viewPath: path.resolve(__dirname, "../mailers/hbs"),
    extName: ".hbs",
  };

  transporter.use("compile", nodemailerhbs(handlebarsOptions));
})();

// Call this function in your main app file (e.g. `app.ts`)
export default transporter;
