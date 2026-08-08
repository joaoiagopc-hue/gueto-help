const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const rankingPath = path.join(__dirname, 'ranking_staff.json');

module.exports = {
    // 🎫 EXECUTA O COMANDO BARRA: /painel-ticket
    async executePrefixPainel(interaction) {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Você não possui permissão administrativa para usar este comando barra!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🧱 GUETO HELP — Central de Suporte')
            .setDescription(
                `Atendimento: **Disponível 24/7**\n\n` +
                'Sistema ativo para gerenciar denúncias contra quebras de diretrizes, relatórios de bugs e dúvidas gerais sobre a jogabilidade.\n\n' +
                '┃ Canais abertos por este painel são privados entre você e a equipe.\n' +
                '┃ Mensagem troll ou abuso do sistema recebe **warn administrativo**.\n' +
                '┃ Ao encerrar, o morador poderá avaliar o suporte de **1 a 5 estrelas**.\n\n' +
                '✅ **Verificações ativas:** Logs criptografadas, avaliação de staff e pings.'
            )
            .setColor('#2f3136');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('abrir_ticket_suporte').setLabel('Suporte Geral 🛠️').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('abrir_ticket_denuncia').setLabel('Denúncias 🚨').setStyle(ButtonStyle.Danger)
        );

        // 🚨 CORREÇÃO DO TIMEOUT: Responde a interação barra diretamente para fechar o cronômetro do Discord
        await interaction.reply({ embeds: [embed], components: [row] }).catch(err => console.error(err));
    },

    // 🏆 EXECUTA O COMANDO BARRA: /top-avaliar
    async executeRanking(interaction) {
        let dados = {};
        if (fs.existsSync(rankingPath)) {
            try { dados = JSON.parse(fs.readFileSync(rankingPath, 'utf8')); } catch (e) { dados = {}; }
        }
        const listaStaff = Object.keys(dados).map(id => {
            const media = (dados[id].totalEstrelas / dados[id].totalAtendimentos).toFixed(1);
            return { id, media, ...dados[id] };
        });

        listaStaff.sort((a, b) => b.totalEstrelas - a.totalEstrelas);

        const embed = new EmbedBuilder().setTitle('🧱 GUETO HELP — Ranking da Staff').setColor('#2f3136').setTimestamp();
        if (listaStaff.length === 0) {
            embed.setDescription('🟨 Nenhuma avaliação de ticket computada no sistema até o momento.');
        } else {
            let txt = 'Confira o desempenho e as notas da nossa equipe administrativa nos atendimentos:\n\n';
            listaStaff.forEach((staff, idx) => {
                const med = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⚫';
                txt += `${med} **${idx + 1}° Lugar** — <@${staff.id}>\n┃ Nota Média: \`${staff.media} ⭐\`\n┃ Tickets Fechados: \`${staff.totalAtendimentos}\` | Estrelas Ganhas: \`${staff.totalEstrelas}\`\n\n`;
            });
            embed.setDescription(txt);
        }
        
        // 🚨 CORREÇÃO DO TIMEOUT: Responde a interação barra diretamente
        return interaction.reply({ embeds: [embed] }).catch(err => console.error(err));
    }
};
