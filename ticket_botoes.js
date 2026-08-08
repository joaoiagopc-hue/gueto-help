const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const rankingPath = path.join(__dirname, 'ranking_staff.json');

function salvarNotaStaff(staffId, estrelas) {
    let dados = {};

    if (fs.existsSync(rankingPath)) {
        try {
            dados = JSON.parse(fs.readFileSync(rankingPath, 'utf8'));
        } catch (e) {
            dados = {};
        }
    }

    if (!dados[staffId]) {
        dados[staffId] = {
            totalEstrelas: 0,
            totalAtendimentos: 0
        };
    }

    dados[staffId].totalEstrelas += estrelas;
    dados[staffId].totalAtendimentos += 1;

    fs.writeFileSync(rankingPath, JSON.stringify(dados, null, 2));
}

module.exports = {
    async handleInteractions(interaction) {

        // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        // ⚙️ AS ÚNICAS 4 LINHAS DE CONFIGURAÇÃO INTERNA DO TICKET
        // Substitua os 4 IDs abaixo pelos canais reais do seu Discord!
        // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

        const CATEGORIA_TICKET_ID = '1515730442714611832'; // 1. Categoria onde abrem os tickets
        const CARGO_STAFF_ID = '1515730228528418956'; // 2. Cargo da Staff que atende
        const CANAL_LOGS_TICKETS = '1530263063436202024'; // 3. Sala de LOGS DE TICKETS
        const CANAL_AVALIACOES_PUB = '1532848984358518916'; // 4. Sala AVALIAÇÃO STAFF

        // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

        if (!interaction.client.staffTickets) {
            interaction.client.staffTickets = new Map();
        }

        // 1. ABRIR TICKET
        if (
            interaction.customId === 'abrir_ticket_suporte' ||
            interaction.customId === 'abrir_ticket_denuncia'
        ) {
            await interaction.deferReply({ ephemeral: true });

            const tipo = interaction.customId === 'abrir_ticket_suporte'
                ? 'suporte'
                : 'denuncia';

            const nomeCanal = `${tipo}-${interaction.user.username}`.toLowerCase();

            const jaTem = interaction.guild.channels.cache.some(
                c => c.name === nomeCanal && c.parentId === CATEGORIA_TICKET_ID
            );

            if (jaTem) {
                return interaction.editReply({
                    content: '⚠️ **Bloqueado:** Você já possui um chamado ativo de suporte em andamento!'
                });
            }

            const canal = await interaction.guild.channels.create({
                name: nomeCanal,
                type: 0,
                parent: CATEGORIA_TICKET_ID !== '123456789012345678'
                    ? CATEGORIA_TICKET_ID
                    : null,

                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    },
                    ...(CARGO_STAFF_ID !== '123456789012345678'
                        ? [{
                            id: CARGO_STAFF_ID,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        }]
                        : [])
                ]
            });

            const embed = new EmbedBuilder()
                .setTitle('🧱 GUETO HELP — Atendimento')
                .setDescription(
                    `Olá ${interaction.user}, relate seu problema detalhadamente para a equipe.\n\n` +
                    `🙋‍♂️ **Assumir:** Staff fica responsável.\n` +
                    `📜 **Logs:** Salva o histórico de texto.\n` +
                    `🔒 **Fechar:** Encerra o canal e envia o formulário para a DM.`
                )
                .setColor('#2f3136');

            const bt = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('assumir_ticket')
                    .setLabel('Assumir Ticket 🙋‍♂️')
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId('salvar_logs_ticket')
                    .setLabel('Salvar Logs 📜')
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId('fechar_ticket_tentativa')
                    .setLabel('Fechar Atendimento 🔒')
                    .setStyle(ButtonStyle.Danger)
            );

            await canal.send({
                content: `${interaction.user} | ${
                    CARGO_STAFF_ID !== '123456789012345678'
                        ? `<@&${CARGO_STAFF_ID}>`
                        : '@Staff'
                } 🔔`,
                embeds: [embed],
                components: [bt]
            });

            await interaction.editReply({
                content: `✅ Seu canal de atendimento foi aberto com sucesso: ${canal.toString()}`
            });
        }

        // 2. ASSUMIR TICKET
        if (interaction.customId === 'assumir_ticket') {

            if (
                CARGO_STAFF_ID !== '123456789012345678' &&
                !interaction.member.roles.cache.has(CARGO_STAFF_ID)
            ) {
                return interaction.reply({
                    content: '❌ Você não tem permissão para assumir este chamado!',
                    ephemeral: true
                });
            }

            if (interaction.client.staffTickets.has(interaction.channel.id)) {
                return interaction.reply({
                    content: '❌ Este ticket já possui um Staff responsável encarregado!',
                    ephemeral: true
                });
            }

            interaction.client.staffTickets.set(
                interaction.channel.id,
                interaction.user.id
            );

            const nEmbed = EmbedBuilder
                .from(interaction.message.embeds[0])
                .setDescription(
                    interaction.message.embeds[0].description +
                    `\n\n📌 **RESPONSÁVEL ATUAL:** ${interaction.user}`
                );

            await interaction.update({
                embeds: [nEmbed]
            });

            await interaction.channel.send({
                content: `🙋‍♂️ **Aviso:** Este chamado agora está sob os cuidados e responsabilidade de ${interaction.user}.`
            });
        }

        // 3. SALVAR LOGS
        if (interaction.customId === 'salvar_logs_ticket') {

            await interaction.reply({
                content: '🔄 Extraindo logs de segurança...',
                ephemeral: true
            });

            const msg = await interaction.channel.messages.fetch({
                limit: 100
            });

            const txt = msg
                .reverse()
                .map(m =>
                    `[${m.createdAt.toLocaleString()}] ${m.author.tag}: ${m.content}`
                )
                .join('\n');

            const cLogs = interaction.guild.channels.cache.get(
                CANAL_LOGS_TICKETS
            );

            if (
                cLogs &&
                CANAL_LOGS_TICKETS !== '123456789012345678'
            ) {
                await cLogs.send({
                    files: [{
                        attachment: Buffer.from(txt, 'utf-8'),
                        name: `log-${interaction.channel.name}.txt`
                    }]
                });
            }

            await interaction.followUp({
                content: '✅ Histórico salvo com sucesso nas logs administrativas!',
                ephemeral: true
            });
        }

        // 4. FECHAR TICKET
        if (interaction.customId === 'fechar_ticket_tentativa') {

            if (!interaction.client.staffTickets.has(interaction.channel.id)) {
                return interaction.reply({
                    content: '❌ O ticket precisa ser assumido por um Staff antes de ser encerrado!',
                    ephemeral: true
                });
            }

            const modal = new ModalBuilder()
                .setCustomId('modal_motivo_fechamento')
                .setTitle('Fechar Atendimento');

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('input_motivo_texto')
                        .setLabel('Motivo do fechamento interno?')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                )
            );

            await interaction.showModal(modal);
        }

        // 5. MODAL DE FECHAMENTO
        if (
            interaction.isModalSubmit() &&
            interaction.customId === 'modal_motivo_fechamento'
        ) {

            await interaction.deferReply();

            const motivo = interaction.fields.getTextInputValue(
                'input_motivo_texto'
            );

            const staffId =
                interaction.client.staffTickets.get(interaction.channel.id) ||
                interaction.user.id;

            const nomeMorador = interaction.channel.name
                .split('-')
                .pop();

            const membro = interaction.guild.members.cache.find(
                m =>
                    m.user.username.toLowerCase() ===
                    nomeMorador.toLowerCase()
            );

            await interaction.editReply({
                content:
                    `🧱 **GUETO HELP:** Chamado encerrado.\n\n` +
                    `🔴 O canal será excluído permanentemente em exatamente 10 segundos.\n` +
                    `📬 *Painel enviado diretamente para a DM do cidadão!*`
            });

            // ENVIA AVALIAÇÃO PARA A DM
            if (membro) {

                const embedDM = new EmbedBuilder()
                    .setTitle('🧱 GUETO HELP — Central de Avaliação')
                    .setDescription(
                        `Olá **${membro.user.username}**, o seu chamado foi encerrado pela nossa equipe.\n\n` +
                        `Por favor, utilize os botões vermelhos abaixo para selecionar uma nota de **1 a 5 estrelas** para o atendente <@${staffId}>. ` +
                        `Após clicar, você poderá deixar seu comentário digitando no chat privado!`
                    )
                    .setColor('#2f3136');

                const dadosTrancados =
                    `${staffId}_${interaction.guild.id}_${interaction.channel.name}`;

                const bts = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`voto_1_${dadosTrancados}`)
                        .setLabel('1 ⭐')
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setCustomId(`voto_2_${dadosTrancados}`)
                        .setLabel('2 ⭐')
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setCustomId(`voto_3_${dadosTrancados}`)
                        .setLabel('3 ⭐')
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setCustomId(`voto_4_${dadosTrancados}`)
                        .setLabel('4 ⭐')
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setCustomId(`voto_5_${dadosTrancados}`)
                        .setLabel('5 ⭐')
                        .setStyle(ButtonStyle.Danger)
                );

                await membro.send({
                    embeds: [embedDM],
                    components: [bts]
                }).catch(() => null);
            }

            // SALVAR LOG FINAL
            const cLogs = interaction.guild.channels.cache.get(
                CANAL_LOGS_TICKETS
            );

            if (
                cLogs &&
                CANAL_LOGS_TICKETS !== '123456789012345678'
            ) {

                const msgs = await interaction.channel.messages.fetch({
                    limit: 100
                });

                const txtFinal = msgs
                    .reverse()
                    .map(m =>
                        `[${m.createdAt.toLocaleString()}] ${m.author.tag}: ${m.content}`
                    )
                    .join('\n');

                await cLogs.send({
                    content:
                        `🔒 **Ticket Fechado:** \`#${interaction.channel.name}\` ` +
                        `por <@${staffId}>. Motivo: \`${motivo}\``
                });

                await cLogs.send({
                    files: [{
                        attachment: Buffer.from(txtFinal, 'utf-8'),
                        name: `final-log-${interaction.channel.name}.txt`
                    }]
                }).catch(() => null);
            }

            interaction.client.staffTickets.delete(
                interaction.channel.id
            );

            setTimeout(
                () => interaction.channel.delete().catch(() => null),
                10000
            );
        }

        // 6. AVALIAÇÃO PELA DM
        if (
            interaction.isButton() &&
            interaction.customId.startsWith('voto_')
        ) {

            await interaction.deferReply({
                ephemeral: true
            });

            const partes = interaction.customId.split('_');

            const nota = parseInt(partes[1], 10) || 5;
            const staffId = partes[2];
            const guildaId = partes[3];
            const canalNome = partes.slice(4).join('_');

            const guildaObj = interaction.client.guilds.cache.get(
                guildaId
            );

            if (!guildaObj) {
                return interaction.editReply({
                    content: '❌ Erro ao sincronizar com o servidor principal.'
                });
            }

            salvarNotaStaff(
                staffId,
                nota
            );

            await interaction.editReply({
                content:
                    `✅ **Sua nota ${nota}/5 estrelas foi recebida com sucesso!**`
            });

            await interaction.channel.send({
                content:
                    `⭐ Você atribuiu a nota ${nota}/5!\n\n` +
                    `Agora, **digite o motivo ou o seu comentário** sobre o suporte aqui embaixo e envie no chat para concluir o registro público:`
            }).catch(() => null);

            const coletor =
                interaction.channel.createMessageCollector({
                    filter: m =>
                        m.author.id === interaction.user.id,
                    max: 1,
                    time: 60000
                });

            coletor.on('collect', async msg => {

                const embedPub = new EmbedBuilder()
                    .setTitle('🧱 GUETO HELP — Avaliação de Atendimento')
                    .setDescription(
                        `O cidadão avaliou o suporte recebido em nossa central pública!\n\n` +
                        `┃ **🎫 CHAMADO:** \`#${canalNome}\`\n` +
                        `┃ **👤 MORADOR:** ${interaction.user}\n` +
                        `┃ **👮 ATENDENTE:** <@${staffId}>\n\n` +
                        `📊 **NOTA DO ATENDIMENTO:**\n` +
                        `\`\`\`fix\n` +
                        `${'⭐'.repeat(nota)} (${nota}/5 Estrelas)\n` +
                        `\`\`\`\n` +
                        `💬 **COMENTÁRIO / ELOGIO:**\n` +
                        `\`\`\`md\n` +
                        `> ${msg.content}\n` +
                        `\`\`\``
                    )
                    .setColor('#2f3136')
                    .setTimestamp();

                // DESTINO 1: AVALIAÇÃO STAFF
                const canalAvaliacaoStaff =
                    guildaObj.channels.cache.get(
                        CANAL_AVALIACOES_PUB
                    );

                if (
                    canalAvaliacaoStaff &&
                    CANAL_AVALIACOES_PUB !== '123456789012345678'
                ) {
                    await canalAvaliacaoStaff.send({
                        embeds: [embedPub]
                    }).catch(() => null);
                }

                // DESTINO 2: CÓPIA NOS LOGS
                const canalLogsTicketsStaff =
                    guildaObj.channels.cache.get(
                        CANAL_LOGS_TICKETS
                    );

                if (
                    canalLogsTicketsStaff &&
                    CANAL_LOGS_TICKETS !== '123456789012345678'
                ) {
                    await canalLogsTicketsStaff.send({
                        content:
                            `📬 **Cópia de Relatório:** Avaliação vinculada ao chamado \`#${canalNome}\``,
                        embeds: [embedPub]
                    }).catch(() => null);
                }

                await msg.reply({
                    content:
                        '🎉 **Sucesso absoluto!** Sua avaliação completa com o comentário foi publicada no canal público da cidade. Muito obrigado pelo seu feedback!'
                }).catch(() => null);
            });
        }
    }
};