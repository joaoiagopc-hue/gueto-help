const { EmbedBuilder } = require('discord.js');

module.exports = {
    // 🎙️ 1. O COMANDO MESTRE: !ia alimentado pelo motor da raiz!
    async executeComandoIA(message, modeloGeminiMestre) {
        const textoCompleto = message.content;
        const perguntaMorador = textoCompleto.slice('!ia'.length).trim();

        if (!perguntaMorador) {
            return message.reply({ content: '🙋‍♂️ **Olá! Eu sou a Inteligência Artificial oficial do Gueto RP.** Estou conectada diretamente à API do Gemini do Google! Pode me perguntar absolutamente qualquer coisa do universo digitando após o comando, ex: `!ia você é muito legal`' });
        }

        if (!modeloGeminiMestre) {
            return message.reply({ content: '⚠️ **Ih, deu uma travada na minha inicialização principal!** O motor do Gemini não está ativo. Verifique se o token `GEMINI_KEY` foi colocado corretamente nas configurações do Render.' });
        }

        await message.channel.sendTyping().catch(() => null);

        try {
            // 🧠 DIRETRIZ DE PERSONALIDADE: Puxa a resposta direto do motor pronto sem abrir conexões novas!
            const promptSistema = 
                `Você é a Inteligência Artificial oficial do servidor de Discord "Gueto RP". ` +
                `Você deve responder de forma extremamente humana, amigável, acolhedora e usando gírias leves brasileiras de roleplay se achar adequado. ` +
                `Você entende tudo e conversa sobre qualquer assunto do universo, agindo como um assistente magnífico, prestativo e inteligente. ` +
                `Responda de forma direta e natural, sem formatações robóticas exageradas ou tópicos mecânicos. ` +
                `Aqui está a mensagem do usuário: ${perguntaMorador}`;

            const resultadoAI = await modeloGeminiMestre.generateContent(promptSistema);
            const respostaTextoHumano = resultadoAI.response.text();

            return message.reply({ content: `🙋‍♂️ **Gueto AI:** ${respostaTextoHumano}` });

        } catch (error) {
            console.error('Erro na API do Gemini Google dentro do ajuda.js:', error);
            return message.reply({ content: '⚠️ **Ih, deu uma travada na minha mente agora!** O servidor do Google recusou a requisição. Certifique-se de que a chave está ativa e sem restrições no Render.' });
        }
    },

    // 🧠 2. GATILHOS PASSIVOS: Monitoramento silencioso tradicional do chat geral
    async verificarGatilhosHelp(message) {
        const CANAL_TICKET_ID = '1515730581734948885'; // 📝 COLOQUE O ID DA SUA SALA DE TICKETS AQUI

        if (message.author.bot) return;
        if (message.channel.name.startsWith('suporte-') || message.channel.name.startsWith('denuncia-') || message.channel.name.startsWith('ticket-')) return;

        const textoLimpo = message.content.toLowerCase().replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
        const palavrasFrase = textoLimpo.split(/\s+/);
        const dicionarioAlvo = ['ajuda', 'help', 'ticket', 'suporte', 'duvida', 'bug', 'vip', 'roubo', 'denuncia', 'comprar'];

        const possuiPalavraChave = dicionarioAlvo.some(palavra => palavrasFrase.includes(palavra));
        if (!possuiPalavraChave) return;

        let pesoSentido = 0;
        const marcadoresPessoais = ['me', 'mim', 'pf', 'pff', 'por favor', 'preciso', 'quero', 'como', 'onde', 'to com', 'estou com', 'tenho', 'meu', 'minha', 'sumiu', 'bugou', 'aqui', 'aq', 'cade', 'cadê'];
        const marcadoresExternos = ['vc', 'voce', 'vcs', 'voces', 'quer', 'querem', 'ajudo', 'precisa', 'precisam', 'alguem quer', 'quem quer', 'vou te', 'posso te'];

        palavrasFrase.forEach(palavra => { if (marcadoresPessoais.includes(palavra)) pesoSentido += 2; });
        const possuiTermoFalso = marcadoresExternos.some(termo => textoLimpo.includes(termo)) || textoLimpo.startsWith('que ajuda') || textoLimpo.startsWith('quem ajuda');
        if (possuiTermoFalso) pesoSentido -= 5;
        if (textoLimpo.includes('alguem') && (textoLimpo.includes('ajuda') || textoLimpo.includes('ticket') || textoLimpo.includes('onde'))) pesoSentido += 3;

        if (pesoSentido <= 0) return;

        const embedGuetoHelp = new EmbedBuilder()
            .setTitle('🧱 GUETO HELP — Assistente Virtual')
            .setDescription(`Olá ${message.author}, percebi que você está precisando de suporte em nossa city!\n\nPara tirar dúvidas, relatar bugs ou fazer denúncias, vá em <#${CANAL_TICKET_ID}> e abra o seu ticket privado.\n\n⏳ *Este aviso some em 10 segundos...*`)
            .setColor('#2f3136');

        try {
            const respostaBot = await message.reply({ embeds: [embedGuetoHelp] });
            setTimeout(() => respostaBot.delete().catch(() => null), 10000);
        } catch (error) { }
    }
};
