const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
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

// 🚀 REGISTRO AUTOMÁTICO DE COMANDOS BARRA (/) NA API DO DISCORD
client.once('ready', async () => {
    console.log(`🧱 [BOT HELP] ${client.user.tag} online com suporte a Slash Commands e IA unificados via HTTP!`);

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

// 🚨 ESCUTA DE CHAT (LEITOR DE PREFIXOS, ESCUDOS E COMANDO ALEXA !IA)
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const txt = message.content.trim();

    // 🎙️ COMANDO !IA: Envia a requisição direto para o cérebro no ajuda.js (que chama o google.js)
    if (txt.toLowerCase().startsWith('!ia')) {
        try {
            const ajudaModule = carregarModuloSeguro('ajuda.js');
            if (ajudaModule) {
                await ajudaModule.executeComandoIA(message);
            }
        } catch (error) {
            console.error('Erro ao processar comando da Alexa Humana:', error);
        }
        return; // Trava o fluxo aqui para não disparar os escudos de spam abaixo à toa
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

// 🎯 DISTRIBUIDOR CENTRAL DE INTERAÇÕES (BARRA, BOTÕES E MODALS)
client.on('interactionCreate', async interaction => {
    
    // A) SE FOR UM COMANDO DE BARRA ( / )
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

    // B) SE FOR UM ENVIO DE MODAL POPUP (FORMULÁRIOS)
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_gerador_embed') {
            try {
                const embedModule = carregarModuloSeguro('cria_embed.js');
                if (embedModule) await embedModule.processarEnvioModalEmbed(interaction);
            } catch (e) { console.error(e); }
            return;
        }
        
        try {
            const ticketBotoesModule = carregarModuloSeguro('ticket_botoes.js');
            if (ticketBotoesModule) await ticketBotoesModule.handleInteractions(interaction);
        } catch (e) { console.error(e); }
        return;
    }

    // C) SE FOR UM CLIQUE DE BOTÃO (TICKETS E ESTRELAS DA DM)
    if (interaction.isButton()) {
        try {
            const ticketBotoesModule = carregarModuloSeguro('ticket_botoes.js');
            if (ticketBotoesModule) await ticketBotoesModule.handleInteractions(interaction);
        } catch (e) { console.error(e); }
    }
});

client.on('error', err => console.error('Erro global no cliente Discord:', err));

client.login(process.env.DISCORD_TOKEN);
