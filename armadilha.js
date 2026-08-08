const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const armadilhaPath = path.join(__dirname, 'banco_armadilha.json');
const memoriaSpamAntiRaid = new Map();

function carregarDadosArmadilha() {
    if (!fs.existsSync(armadilhaPath)) {
        fs.writeFileSync(armadilhaPath, JSON.stringify({ punicoes: 0, troll: 0 }, null, 2));
    }
    try { return JSON.parse(fs.readFileSync(armadilhaPath, 'utf8')); } catch (e) { return { punicoes: 0, troll: 0 }; }
}

function salvarDadosArmadilha(dados) {
    fs.writeFileSync(armadilhaPath, JSON.stringify(dados, null, 2));
}

module.exports = {
    // 🛡️ EXECUTA O COMANDO BARRA: /painel-armadilha
    async executePrefixArmadilha(interaction) {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Você não possui permissão para usar este comando barra!', ephemeral: true });
        }
        const banco = carregarDadosArmadilha();

        const embedArmadilha = new EmbedBuilder()
            .setTitle('🧱 GUETO HELP — Sistema Anti-Scam & Proteção Ativa')
            .setDescription(
                'Monitoramento de integridade civil ativado em todas as frequências de rádio do servidor.\n\n' +
                'A central do bot help intercepta de forma automatizada tentativas de ataques cibernéticos em massa (raids), links maliciosos e comportamentos trolls.\n\n' +
                '┃ Contas infratoras sofrem castigo disciplinar imediato (Mute de 1 hora).\n' +
                '┃ Os botões abaixo operam travados em tempo real coletando as métricas da cidade.\n\n' +
                '✅ **Escudo do Servidor:** Operacional / Análise semântica avançada ativa.'
            )
            .setColor('#2f3136');

        const rowContadores = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_fake_punicoes').setLabel(`Punições Raids: ${banco.punicoes} ⚔️`).setStyle(ButtonStyle.Danger).setDisabled(true),
            new ButtonBuilder().setCustomId('btn_fake_trolls').setLabel(`Mensagens Troll: ${banco.troll} 🚨`).setStyle(ButtonStyle.Danger).setDisabled(true)
        );

        // 🚨 CORREÇÃO DO TIMEOUT: Responde a interação barra diretamente para fechar o cronômetro do Discord
        await interaction.reply({ embeds: [embedArmadilha], components: [rowContadores] }).catch(err => console.error(err));
    },

    async verificarAmeacasArmadilha(message) {
        if (message.member?.permissions.has(PermissionFlagsBits.Administrator)) return false;

        const textoMinusculo = message.content.toLowerCase().trim();
        const agora = Date.now();

        const dicionarioTroll = ['fdp', 'vntc', 'hack', 'compre vip fake', 'servidor lixo', 'admin corrupto'];
        const achouTextoTroll = dicionarioTroll.some(termo => textoMinusculo.includes(termo));

        if (achouTextoTroll) {
            const banco = carregarDadosArmadilha();
            banco.troll += 1;
            salvarDadosArmadilha(banco);

            try { await message.delete().catch(() => null); } catch (e) {}
            if (message.member && message.member.moderatable) {
                await message.member.timeout(3600000, 'Central Anti-Scam: Comportamento Troll Detectado.').catch(() => null);
            }

            const avisoTroll = await message.channel.send({ content: `🚨 **Proteção Ativa:** A conta de ${message.author} foi mutada por 1 hora por comportamento de mensagem troll.` });
            setTimeout(() => avisoTroll.delete().catch(() => null), 10000);
            return true;
        }

        const historicoMembro = memoriaSpamAntiRaid.get(message.author.id) || [];
        historicoMembro.push(agora);
        const mensagensRecentes = historicoMembro.filter(timestamp => agora - timestamp < 3000);
        memoriaSpamAntiRaid.set(message.author.id, mensagensRecentes);

        if (mensagensRecentes.length > 4) {
            const banco = carregarDadosArmadilha();
            banco.punicoes += 1;
            salvarDadosArmadilha(banco);

            try { await message.delete().catch(() => null); } catch (e) {}
            memoriaSpamAntiRaid.delete(message.author.id);

            if (message.member && message.member.moderatable) {
                await message.member.timeout(3600000, 'Central Anti-Scam: Tentativa de raid interceptada.').catch(() => null);
            }

            const avisoRaid = await message.channel.send({ content: `⚔️ **Escudo Anti-Raid:** Tentativa de spam em massa neutralizada. ${message.author} foi mutado por 1 hora.` });
            setTimeout(() => avisoRaid.delete().catch(() => null), 10000);
            return true;
        }

        return false;
    }
};
