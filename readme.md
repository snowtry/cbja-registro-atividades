# CBJA — Registro de Atividades

## O que está incluído
- Site público com pesquisa e filtros por tipo de atividade e canal.
- Função Netlify para ler registros e receber novos registros autenticados.
- Armazenamento persistente com Netlify Blobs.
- A página mostra dados de demonstração até o site ser publicado e a API responder.

## Publicar no Netlify
1. Envie todos os arquivos deste projeto para um repositório Git ou faça deploy da pasta no Netlify.
2. Nas configurações do site no Netlify, adicione uma variável de ambiente chamada `CBJA_API_KEY` com uma senha longa e aleatória.
3. Faça novo deploy após adicionar a variável.
4. Abra o endereço publicado. A primeira carga poderá demorar alguns segundos enquanto a função inicia.

## Integrar o BDFD
A função aceita `POST /api/activities` com cabeçalho `x-api-key` e corpo JSON, por exemplo:

{
  "type": "Promoção",
  "member": "Nome ou ID do membro",
  "responsible": "Nome ou ID de quem promoveu",
  "oldRole": "Soldado",
  "newRole": "Cabo",
  "channel": "registros-de-promocao",
  "note": "Promoção aprovada"
}

O segredo deve ser guardado como variável de ambiente no Netlify e usado no comando BDFD por meio de `$httpAddHeader[x-api-key;SUA_CHAVE]`. Não coloque a chave no HTML público nem a compartilhe em mensagens ou capturas de tela.

## Limitação importante
O BDFD pode enviar registros por comandos usando HTTP requests. Isso, por si só, não faz o BDFD detectar automaticamente todas as alterações manuais de cargos. Para automatizar essas alterações, será necessário confirmar se o seu bot consegue receber esse evento; se não, será preciso um pequeno bot complementar conectado ao Discord Gateway com as permissões adequadas.

## Segurança e próximos passos
- Configure `CBJA_API_KEY` antes de permitir envio de registros.
- Restringir os comandos de registro a cargos autorizados.
- Nunca compartilhar token do bot Discord.
- Este projeto é uma base inicial; teste em um servidor/canal de teste antes de usar como registro oficial.
