import nodemailer from 'nodemailer'

const emailRegistro = async datos => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
  });

  const { email, nombre, token } = datos;

  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    //text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
        <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>
        <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `
  })
}

const emailOlvidePassword = async datos => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
  });

  const { email, nombre, token } = datos;

  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Restablece tu contraseña en BienesRaices.com',
    //text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
        <p>Hola ${nombre}, has solitcitado restablecer tu contraseña en bienesRaices.com</p>
        <p>Sigue el siguiente enlace para generar una contraseña nueva:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer Contraseña</a></p>

        <p>Si tu no solicitaste reestablecer tu contraseña, puedes ignorar el mensaje</p>
      `
  })
}

export {
    emailRegistro,
    emailOlvidePassword
}