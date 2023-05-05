import readline from 'readline';
import { sendWhatsappMessage } from './sendWhatsappMessage.js';
import countries from './countries.js';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function greeting() {
  console.log(chalk.blue.bold('Olá! Sou um bot de mensagens do WhatsApp. Como posso ajudar?'));
}

function askAnotherMessage() {
  rl.question(chalk.yellow('\nDeseja enviar outra mensagem? (sim/não) '), (answer) => {
    if (answer.toLowerCase() === 'sim') {
      askRecipientAndMessage();
    } else {
      console.log(chalk.green('Obrigado por usar o nosso chatbot! Até a próxima.'));
      rl.close();
    }
  });
}

function askForCountryCode() {
  console.log(chalk.yellow('Por favor, selecione o país do destinatário:'));
  countries.forEach((country, index) => {
    console.log(chalk.yellow(`${index + 1} - ${country.name}`));
  });

  rl.question(chalk.yellow('Opção: '), (answer) => {
    const selectedCountry = parseInt(answer);
    if (Number.isNaN(selectedCountry) || selectedCountry <= 0 || selectedCountry > countries.length) {
      console.error(chalk.red('Opção inválida. Por favor, tente novamente.'));
      askForCountryCode();
    } else {
      const prefix = countries[selectedCountry - 1].prefix;
      askForRecipient(prefix);
    }
  });
}

function askForRecipient(prefix) {
  rl.question(chalk.yellow(`Número do destinatário (${prefix}): `), (to) => {
    if (!/^\d{8,}$/.test(to)) {
      console.error(chalk.red('Número de telefone inválido. Certifique-se de incluir somente números e não usar caracteres especiais.'));
      askForRecipient(prefix);
    } else {
      const phoneNumber = `${prefix}${to}`;
      askForMessage(phoneNumber);
    }
  });
}

function askForMessage(to) {
  rl.question(chalk.yellow('Qual mensagem você gostaria de enviar? '), (message) => {
    rl.question(chalk.yellow('Você gostaria de enviar uma imagem junto com a mensagem? (sim/não) '), (answer) => {
      if (answer.toLowerCase() === 'sim') {
        rl.question(chalk.yellow('Digite a URL da imagem: '), (mediaUrl) => {
          sendWhatsappMessage(to, message, mediaUrl)
            .then((response) => {
              console.log(chalk.green(`\nMensagem enviada para ${to}. SID: ${response.sid}\n`));
              askAnotherMessage();
            })
            .catch((error) => {
              console.error(chalk.red('Erro ao enviar a mensagem:', error));
              console.error(chalk.red('Certifique-se de que o número de telefone seja um número de telefone válido registrado no WhatsApp e verificado na sua conta Twilio.'));
              askAnotherMessage();
            });
        });
      } else {
        sendWhatsappMessage(to, message)
          .then((response) => {
            console.log(chalk.green(`\nMensagem enviada para ${to}. SID: ${response.sid}\n`));
            askAnotherMessage();
          })
          .catch((error) => {
            console.error(chalk.red('Erro ao enviar a mensagem:', error));
            console.error(chalk.red('Certifique-se de que o número de telefone seja um número de telefone válido registrado no WhatsApp e verificado na sua conta Twilio.'));
            askAnotherMessage();
          });
      }
    });
  });
}

greeting();
askForCountryCode();