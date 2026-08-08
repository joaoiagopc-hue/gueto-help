const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
// 🚨 CONSTRUTOR OFICIAL POR EXTENSO DO GOOGLE SDK:
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('🧱 Central GUETO HELP Ativa!'));
app.listen(process.env.PORT || 3000, () => console.log('📡 Porta ativa para o Render.'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

// 🧠 Inicializa o motor com a propriedade GoogleGenerativeAI oficial de fábrica!
let modeloGeminiMestre = null;
try {
    if (process.env.GEMINI_KEY) {
        const ai = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        modeloGeminiMestre = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        console.log('🤖 [Google AI] Motor do Gemini instanciado com sucesso na raiz!');
    } else {
        console.log('⚠️ [Aviso] GEMINI_KEY não encontrada nas variáveis de ambiente.');
    }
} catch (error) {
    console.error('❌ Erro ao instanciar o motor do Gemini no index.js:', error);
}

function carregarModuloSeguro(nomeArquivo) {
    const caminho = path.join(__dirname, nomeArquivo);
    if (fs.existsSync(caminho)) {
        try {
            delete require.cache[require.resolve(caminho)];
            return require(caminho);
        } catch (err) {
            console.error(`❌ Erro ao ler o script local em: ${caminho}`, err);
        }
    }
    return null;
}

client.once('ready', async () => {
    console.log(`🧱 [BOT HELP] ${client.user.tag} online com suporte a Slash Commands e IA integrados na raiz!`);

    const commands = [
        new SlashCommandBuilder().setName('painel-ticket').setDescription('Envia o painel esmero público de suporte da cidade.'),
        new SlashCommandBuilder().setName('top-avaliar').setDescription('Exibe o ranking de avaliação e média da Staff.'),
        new SlashCommandBuilder().setName('painel-armadilha').setDescription('Envia o painel de métricas do sistema Anti-Scam.'),
        new SlashCommandBuilder().setName('cria-embed').setDescription('🔒 Comando Staff: Abre o formulário para criar uma Embed personalizada em parágrafo.')
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('🔄 Sincronizando comandos barra com o Discord...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Todos os comandos barra (/) foram injetados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao registrar Slash Commands:', error);
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const txt = message.content.trim();

    // 🎙️ COMANDO !IA: Envia o modelo mestre já pré-carregado no index!
    if (txt.toLowerCase().startsWith('!ia')) {
        try {
            const ajudaModule = carregarModuloSeguro('ajuda.js');
            if (ajudaModule) {
                await ajudaModule.executeComandoIA(message, modeloGeminiMestre);
            }
        } catch (error) {
            console.error('Erro ao processar comando da Alexa Humana:', error);
        }
        return;
    }

    // Escudo Anti-Raid e Anti-Troll (armadilha.js)
    try {
        const armadilhaModule = carregarModuloSeguro('armadilha.js');
        if (armadilhaModule && typeof armadilhaModule.verificarAmeacasArmadilha === 'function') {
            const interceptouAmeaca = await armadilhaModule.verificarAmeacasArmadilha(message);
            if (interceptouAmeaca) return;
        }
    } catch (e) { }

    // IA decifradora passiva de socorro do chat geral (ajuda.js)
    try {
        const ajudaModule = carregarModuloSeguro('ajuda.js');
        if (ajudaModule && typeof ajudaModule.verificarGatilhosHelp === 'function') {
            await ajudaModule.verificarGatilhosHelp(message);
        }
    } catch (e) { }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;
        if (commandName === 'painel-ticket') {
            try { const m = carregarModuloSeguro('ticket.js'); if (m) await m.executePrefixPainel(interaction); } catch (e) { console.error(e); }
            return;
        }
        if (commandName === 'top-avaliar') {
            try { const m = carregarModuloSeguro('ticket.js'); if (m) await m.executeRanking(interaction); } catch (e) { console.error(e); }
            return;
        }
        if (commandName === 'painel-armadilha') {
            try { const m = carregarModuloSeguro('armadilha.js'); if (m) await m.executePrefixArmadilha(interaction); } catch (e) { console.error(e); }
            return;
        }
        if (commandName === 'cria-embed') {
            try { const m = carregarModuloSeguro('cria_embed.js'); if (m) await m.executeSlashCriaEmbed(interaction); } catch (e) { console.error(e); }
            return;
        }
    }

    if (interaction.isButton() || interaction.isModalSubmit()) {
        try {
            const ticketBotoesModule = carregarModuloSeguro('ticket_botoes.js');
            if (ticketBotoesModule) await ticketBotoesModule.handleInteractions(interaction);
        } catch (e) { console.error(e); }
    }
});

client.login(process.env.DISCORD_TOKEN);
