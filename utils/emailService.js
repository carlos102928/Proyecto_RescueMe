import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'carlosmarioescobar118@gmail.com',
    pass: 'tbvw zeyo ijas zryz', // No la contraseña del correo, sino una contraseña de aplicación
  },
});

export const enviarCorreo = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: '"Rescue Me" <carlosmarioescobar118@gmail.com>',
      to,
      subject,
      html,
    });
    console.log(`Correo enviado a ${to}`);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
};
