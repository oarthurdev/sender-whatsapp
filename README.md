Este script foi criado como projeto de estudo para praticar programação em JavaScript e usar a API do Twilio para enviar mensagens do WhatsApp.

## Instalação

1. Clone o repositório para sua máquina local.
2. Na pasta raiz do projeto, execute `npm install` para instalar as dependências.

## Configuração

Antes de executar o script, você precisará configurar algumas variáveis de ambiente no arquivo `.env`. Para isso, copie o arquivo `.env.example` e renomeie-o para `.env`.

Em seguida, adicione suas credenciais da Twilio (você pode criar uma conta gratuita no site da Twilio) e um número de telefone verificado na sua conta Twilio que possa enviar mensagens do WhatsApp para os destinatários.

## Uso

Para iniciar o script, execute `npm start` na pasta raiz do projeto. O script fará uma saudação e pedirá que você selecione o país do destinatário. Em seguida, ele solicitará o número do destinatário, a mensagem que deseja enviar e se você gostaria de incluir uma imagem junto com a mensagem.

O script usa a API do Twilio para enviar a mensagem para o número de telefone do destinatário fornecido.

Após o envio da primeira mensagem, o script perguntará se você gostaria de enviar outra mensagem ou encerrar a sessão.

## Contribuição

Se você quiser contribuir para este projeto, sinta-se à vontade para criar um pull request ou abrir uma issue.
