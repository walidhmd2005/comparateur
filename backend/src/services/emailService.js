const nodemailer = require('nodemailer');
const { email: emailConfig } = require('../config/env');

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.port === 465,
  auth: { user: emailConfig.user, pass: emailConfig.pass },
});

async function sendSimulationResult(to, name, results) {
  if (!emailConfig.user) return;

  const top = results[0];
  await transporter.sendMail({
    from: `"Comparateur Énergie" <${emailConfig.user}>`,
    to,
    subject: 'Résultat de votre simulation énergétique',
    html: `
      <h2>Bonjour ${name},</h2>
      <p>Votre simulation est terminée. La meilleure offre trouvée :</p>
      <table border="1" cellpadding="8">
        <tr><th>Fournisseur</th><th>Offre</th><th>Coût annuel</th></tr>
        <tr>
          <td>${top.provider_name}</td>
          <td>${top.offer_name}</td>
          <td>${top.annual_cost} €</td>
        </tr>
      </table>
      <p>Connectez-vous pour voir le détail complet.</p>
    `,
  });
}

async function sendWelcomeEmail(to, name) {
  if (!emailConfig.user) return;

  await transporter.sendMail({
    from: `"Comparateur Énergie" <${emailConfig.user}>`,
    to,
    subject: 'Bienvenue sur Comparateur Énergie',
    html: `<h2>Bienvenue ${name} !</h2><p>Votre compte a été créé avec succès.</p>`,
  });
}

module.exports = { sendSimulationResult, sendWelcomeEmail };
