import readline from 'readline';
import { sendWhatsappMessage } from './sendWhatsappMessage.js';
import countries from './countries.js';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function greeting() {
  console.log(chalk.blue.bold(`

  ⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⣶⣶⣶⣶⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀
⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀
⠀⢀⣾⣿⣿⣿⣿⡿⠟⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀
⠀⣾⣿⣿⣿⣿⡟⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀
⢠⣿⣿⣿⣿⣿⣧⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄
⢸⣿⣿⣿⣿⣿⣿⣦⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⠘⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠈⠻⢿⣿⠟⠉⠛⠿⣿⣿⣿⣿⣿⣿⠃
⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⡀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⡿⠀
⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣤⣤⣴⣾⣿⣿⣿⣿⡿⠁⠀
⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀
⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠁⠀⠀⠀⠀
⠠⠛⠛⠛⠉⠁⠀⠈⠙⠛⠛⠿⠿⠿⠿⠛⠛⠋⠁⠀⠀          


░██████╗███████╗███╗░░██╗██████╗░███████╗██████╗░
██╔════╝██╔════╝████╗░██║██╔══██╗██╔════╝██╔══██╗
╚█████╗░█████╗░░██╔██╗██║██║░░██║█████╗░░██████╔╝
░╚═══██╗██╔══╝░░██║╚████║██║░░██║██╔══╝░░██╔══██╗
██████╔╝███████╗██║░╚███║██████╔╝███████╗██║░░██║
╚═════╝░╚══════╝╚═╝░░╚══╝╚═════╝░╚══════╝╚═╝░░╚═╝


By: Arthur Wagenknecht (oarthurdev@gmail.com) - 05/05/2023
`));
}
async function askAnotherMessage() {
  const answer = await askYesOrNo(chalk.yellow('\nDeseja enviar outra mensagem? '));
  if (answer) {
    askForCountryCode();
  } else {
    console.log(chalk.green('Obrigado por usar o nosso chatbot! Até a próxima.'));
    rl.close();
  }
}

async function askForCountryCode() {
  console.log(chalk.yellow('Por favor, selecione o país do destinatário:'));
  countries.forEach((country, index) => {
    console.log(chalk.yellow(`${index + 1} - ${country.name}`));
  });

  const selectedCountry = await askValidNumber(chalk.yellow('Opção: '), 1, countries.length);
  const prefix = countries[selectedCountry - 1].prefix;
  const to = await askValidNumber(chalk.yellow(`Número do destinatário (${prefix}): `), 8);

  const phoneNumber = `${to}`;
  askForMessage(prefix, phoneNumber);
}

async function askForMessage(prefix, phoneNumber) {
  const message = await ask(chalk.yellow('Qual mensagem você gostaria de enviar? '));
  const hasMedia = await askYesOrNo(chalk.yellow('Você gostaria de enviar uma imagem junto com a mensagem? '));

  let mediaUrl;
  
  if (hasMedia) {
    mediaUrl = await askUrl(chalk.yellow('Digite a URL da imagem: '));
  }

  try {
    const response = await sendWhatsappMessage(`${prefix}${phoneNumber}`, message, mediaUrl);
    console.log(chalk.green(`\nMensagem enviada para ${prefix}${phoneNumber}. SID: ${response.sid}\n`));
    askAnotherMessage();
  } catch (error) {
    console.error(chalk.red('Erro ao enviar a mensagem:', error));
    console.error(chalk.red('Certifique-se de que o número de telefone seja um número de telefone válido registrado no WhatsApp e verificado na sua conta Twilio.'));
    askAnotherMessage();
  }
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function askValidNumber(question, min, max = Infinity) {
  let answer = '';
  let number;

  while (!isValidNumber(number, min, max)) {
    answer = await ask(question);
    number = parseInt(answer);
    if (!isValidNumber(number, min, max)) {
      console.error(chalk.red('Opção inválida. Por favor, tente novamente.'));
    }
  }

  return number;
}

function isValidNumber(number, min, max) {
  return Number.isInteger(number) && number >= min && number <= max;
}

async function askYesOrNo(question) {
  let answer = '';

  while (!isValidYesOrNo(answer)) {
    answer = await ask(question);
    if (!isValidYesOrNo(answer)) {
      console.error(chalk.red('Resposta inválida. Por favor, digite "sim" ou "não".'));
    }
  }

  return answer.toLowerCase() === 'sim' || answer.toLowerCase() === 's';
}

function isValidYesOrNo(answer) {
  return ['sim', 'não', 'nao', 's', 'n'].includes(answer.toLowerCase());
}

async function askUrl(question) {
  let answer = '';

  while (!isValidUrl(answer)) {
    answer = await ask(question);
    if (!isValidUrl(answer)) {
      console.error(chalk.red('URL inválida. Por favor, digite uma URL válida.'));
    }
  }

  return answer;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

greeting();
askForCountryCode();