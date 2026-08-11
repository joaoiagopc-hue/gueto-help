const {
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const rankingPath = path.join(__dirname, 'usuarios_ranking.json');
const ticketsPath = path.join(__dirname, 'usuarios_tickets.json');

function salvarNotaStaff(staffId, estrelas) {
    if (!fs.existsSync(rankingPath)) {
        fs.writeFileSync(rankingPath, JSON.stringify([], null, 2));
    }

    let dados = [];

    try {
        dados = JSON.parse(fs.readFileSync(rankingPath, 'utf8'));
    } catch (e) {
        dados = [];
    }

    let staff = dados.find(s => s.id === staffId);

    if (!staff) {
        staff = {
            id: staffId,
            notas: [],
            totalEstrelas: 0,
            media: 0
        };

        dados.push(staff);
    }

    staff.notas.push(estrelas);
    staff.totalEstrelas = staff.notas.reduce((a, b) => a + b, 0);
    staff.media = parseFloat(
        (staff.totalEstrelas / staff.notas.length).toFixed(1)
    );

    fs.writeFileSync(
        rankingPath,
        JSON.stringify(dados, null, 2)
    );

    return staff;
}

module.exports = {
    handleInteraction: async function(interaction) {
        return await module.exports.processarTudo(interaction);
    },

    handleInteractions: async function(interaction) {
        return await module.exports.processarTudo(interaction);
    },

    async processarTudo(interaction) {

        const CATEGORIA_TICKET_ID = '1515730442714611832';
        const CARGO_STAFF_ID = '1515730228528418956';
        const CANAL_LOGS_TICKETS = '1530263063436202024';
        const CANAL_AVALIACOES_PUB = '1532848984358518916';

        if (interaction.isButton()) {

            if (
                interaction.customId === 'abrir_ticket_suporte' ||
                interaction.customId === 'abrir_ticket_denuncia' ||
                interaction.customId === 'abrir_suporte'
            ) {

                if (!fs.existsSync(ticketsPath)) {
                    fs.writeFileSync(
                        ticketsPath,
                        JSON.stringify([], null, 2)
                    );
                }

                let tDados = [];

                try {
                    tDados = JSON.parse(
                        fs.readFileSync(ticketsPath, 'utf8')
                    );
                } catch (e) {
                    tDados = [];
                }

                const jaAberto = tDados.find(
                    t =>
                        t.moradorId === interaction.user.id &&
                        t.status === 'ABERTO'
                );

                if (jaAberto) {
                    return interaction.reply({
                        content:
                            `❌ Você já possui uma sala de atendimento ativa em: <#${jaAberto.canalId}>.`,
                        ephemeral: true
                    });
                }

                await interaction.reply({
                    content:
                        '⏳ Criando sua sala de atendimento privada...',
                    ephemeral: true
                });

                let nomeDoCanal =
                    `suporte-${interaction.user.username}`;

                if (
                    interaction.customId ===
                    'abrir_ticket_denuncia'
                ) {
                    nomeDoCanal =
                        `denuncia-${interaction.user.username}`;
                }

                try {

                    const canal =
                        await interaction.guild.channels.create({
                            name: nomeDoCanal,
                            type: 0,
                            parent: CATEGORIA_TICKET_ID,

                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [
                                        PermissionFlagsBits.ViewChannel
                                    ]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [
                                        PermissionFlagsBits.ViewChannel,
                                        PermissionFlagsBits.SendMessages,
                                        PermissionFlagsBits.ReadMessageHistory
                                    ]
                                },
                                {
                                    id: CARGO_STAFF_ID,
                                    allow: [
                                        PermissionFlagsBits.ViewChannel,
                                        PermissionFlagsBits.SendMessages,
                                        PermissionFlagsBits.ReadMessageHistory
                                    ]
                                }
                            ]
                        });

                    tDados.push({
                        canalId: canal.id,
                        moradorId: interaction.user.id,
                        status: 'ABERTO',
                        staffId: null
                    });

                    fs.writeFileSync(
                        ticketsPath,
                        JSON.stringify(tDados, null, 2)
                    );

                    const embedBoasVindas =
                        new EmbedBuilder()
                            .setTitle(
                                '🧱 CENTRAL DE ATENDIMENTO — GUETO HELP'
                            )
                            .setDescription(
                                `Olá ${interaction.user}, seja bem-vindo ao seu chamado privado!\n\n` +
                                `📌 **Instruções:**\n` +
                                `> Explique detalhadamente o seu caso ou anexe suas provas de vídeo.\n` +
                                `> Aguarde um membro da Staff clicar no botão abaixo para assumir o atendimento!`
                            )
                            .setColor('#2f3136');

                    const linhaBotoes =
                        new ActionRowBuilder()
                            .addComponents(

                                new ButtonBuilder()
                                    .setCustomId(
                                        'assumir_ticket_suporte'
                                    )
                                    .setLabel('🟢 Atender')
                                    .setStyle(
                                        ButtonStyle.Success
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        'gatilho_fechar_ticket'
                                    )
                                    .setLabel('🔒 Fechar')
                                    .setStyle(
                                        ButtonStyle.Danger
                                    )
                            );

                    await canal.send({
                        content:
                            `${interaction.user} | <@&${CARGO_STAFF_ID}>`,
                        embeds: [embedBoasVindas],
                        components: [linhaBotoes]
                    });

                    return interaction.editReply({
                        content:
                            `✅ Sala de atendimento aberta com sucesso: <#${canal.id}>`
                    });

                } catch (err) {

                    console.error(err);

                    return interaction.editReply({
                        content:
                            '❌ Erro ao tentar criar a sala de suporte.'
                    });
                }
            }

            if (
                interaction.customId ===
                'assumir_ticket_suporte'
            ) {

                if (
                    !interaction.member.roles.cache.has(
                        CARGO_STAFF_ID
                    ) &&
                    !interaction.member.permissions.has(
                        PermissionFlagsBits.ManageChannels
                    )
                ) {
                    return interaction.reply({
                        content:
                            '❌ Apenas membros da Staff podem assumir atendimentos.',
                        ephemeral: true
                    });
                }

                let tDados;

                try {
                    tDados = JSON.parse(
                        fs.readFileSync(ticketsPath, 'utf8')
                    );
                } catch (e) {
                    return interaction.reply({
                        content:
                            '❌ Erro ao carregar os tickets.',
                        ephemeral: true
                    });
                }

                const ticket = tDados.find(
                    t =>
                        t.canalId === interaction.channel.id &&
                        t.status === 'ABERTO'
                );

                if (!ticket) {
                    return interaction.reply({
                        content:
                            '❌ Este chamado não existe ou já foi fechado.',
                        ephemeral: true
                    });
                }

                if (ticket.staffId) {
                    return interaction.reply({
                        content:
                            `⚠️ Este chamado já está sendo atendido por <@${ticket.staffId}>.`,
                        ephemeral: true
                    });
                }

                ticket.staffId = interaction.user.id;

                fs.writeFileSync(
                    ticketsPath,
                    JSON.stringify(tDados, null, 2)
                );

                try {

                    await interaction.channel.permissionOverwrites.set([
                        {
                            id: interaction.guild.id,
                            deny: [
                                PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: ticket.moradorId,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        },
                        {
                            id: CARGO_STAFF_ID,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.ReadMessageHistory
                            ],
                            deny: [
                                PermissionFlagsBits.SendMessages
                            ]
                        }
                    ]);

                } catch (e) {
                    console.error(e);
                }

                return interaction.reply({
                    content:
                        `🟢 **Atendimento Iniciado:** <@${interaction.user.id}> assumiu este chamado.`
                });
            }

            if (
                interaction.customId ===
                'gatilho_fechar_ticket'
            ) {

                if (
                    !interaction.member.roles.cache.has(
                        CARGO_STAFF_ID
                    ) &&
                    !interaction.member.permissions.has(
                        PermissionFlagsBits.ManageChannels
                    )
                ) {
                    return interaction.reply({
                        content:
                            '❌ Apenas membros da Staff podem fechar chamados.',
                        ephemeral: true
                    });
                }

                const modalFechar =
                    new ModalBuilder()
                        .setCustomId(
                            'modal_fechar_ticket_motivo'
                        )
                        .setTitle(
                            '🔒 Encerramento de Atendimento'
                        );

                const campoMotivo =
                    new TextInputBuilder()
                        .setCustomId(
                            'campo_motivo_texto'
                        )
                        .setLabel(
                            'Motivo do fechamento'
                        )
                        .setStyle(
                            TextInputStyle.Paragraph
                        )
                        .setPlaceholder(
                            'Ex: Dúvida resolvida / Denúncia resolvida.'
                        )
                        .setRequired(true);

                modalFechar.addComponents(
                    new ActionRowBuilder().addComponents(
                        campoMotivo
                    )
                );

                return interaction.showModal(
                    modalFechar
                );
            }

            if (
                interaction.customId.startsWith('nota_')
            ) {

                const partes =
                    interaction.customId.split('_');

                const nota =
                    parseInt(partes[1], 10);

                const staffId =
                    partes[2];

                if (
                    isNaN(nota) ||
                    nota < 1 ||
                    nota > 5 ||
                    !staffId
                ) {
                    return interaction.reply({
                        content:
                            '❌ Avaliação inválida.',
                        ephemeral: true
                    });
                }

                const dadosAtualizados =
                    salvarNotaStaff(
                        staffId,
                        nota
                    );

                await interaction.update({
                    content:
                        `✅ **Obrigado!** Sua avaliação de ${nota} estrelas foi enviada para o ranking.`,
                    components: []
                });

                try {

                    const cAvaliacao =
                        await interaction.guild.channels.fetch(
                            CANAL_AVALIACOES_PUB
                        );

                    const embedPub =
                        new EmbedBuilder()
                            .setTitle(
                                '⭐ SUPORTE AVALIADO — PREFEITURA'
                            )
                            .setDescription(
                                'Um morador avaliou a qualidade de um atendimento finalizado!'
                            )
                            .addFields(
                                {
                                    name: '👮 Staff Avaliado',
                                    value:
                                        `<@${staffId}>`,
                                    inline: true
                                },
                                {
                                    name: '📊 Nota Recebida',
                                    value:
                                        `${'⭐'.repeat(nota)} (${nota}/5)`,
                                    inline: true
                                },
                                {
                                    name: '📈 Nova Média',
                                    value:
                                        `⭐ ${dadosAtualizados.media} (${dadosAtualizados.notas.length} votos)`,
                                    inline: false
                                }
                            )
                            .setColor('#00ff00')
                            .setTimestamp();

                    await cAvaliacao.send({
                        embeds: [embedPub]
                    });

                } catch (e) {
                    console.error(e);
                }

                return;
            }
        }

        if (interaction.isModalSubmit()) {

            if (
                interaction.customId ===
                'modal_fechar_ticket_motivo'
            ) {

                const motivoFechamento =
                    interaction.fields.getTextInputValue(
                        'campo_motivo_texto'
                    );

                let tDados;

                try {

                    tDados = JSON.parse(
                        fs.readFileSync(
                            ticketsPath,
                            'utf8'
                        )
                    );

                } catch (e) {

                    return interaction.reply({
                        content:
                            '❌ Erro ao carregar os dados do ticket.',
                        ephemeral: true
                    });
                }

                const ticketIndex =
                    tDados.findIndex(
                        t =>
                            t.canalId ===
                                interaction.channel.id &&
                            t.status === 'ABERTO'
                    );

                if (ticketIndex === -1) {
                    return interaction.reply({
                        content:
                            '❌ Este ticket já foi arquivado.',
                        ephemeral: true
                    });
                }

                const ticket =
                    tDados[ticketIndex];

                ticket.status = 'FECHADO';

                fs.writeFileSync(
                    ticketsPath,
                    JSON.stringify(
                        tDados,
                        null,
                        2
                    )
                );

                const moradorId =
                    ticket.moradorId;

                const staffId =
                    interaction.user.id;

                try {

                    const moradorDM =
                        await interaction.guild.members.fetch(
                            moradorId
                        );

                    const embedDM =
                        new EmbedBuilder()
                            .setTitle(
                                '🧱 AVALIE O ATENDIMENTO — GUETO RP'
                            )
                            .setDescription(
                                `Olá! Seu chamado foi finalizado pelo administrador <@${staffId}>!\n\n` +
                                `Avalie o atendimento clicando em uma das estrelas abaixo:`
                            )
                            .setColor('#ffaa00');

                    const linhaEstrelas =
                        new ActionRowBuilder()
                            .addComponents(

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_1_${staffId}`
                                    )
                                    .setLabel('⭐ 1')
                                    .setStyle(
                                        ButtonStyle.Primary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_2_${staffId}`
                                    )
                                    .setLabel('⭐⭐ 2')
                                    .setStyle(
                                        ButtonStyle.Primary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_3_${staffId}`
                                    )
                                    .setLabel('⭐⭐⭐ 3')
                                    .setStyle(
                                        ButtonStyle.Primary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_4_${staffId}`
                                    )
                                    .setLabel('⭐⭐⭐⭐ 4')
                                    .setStyle(
                                        ButtonStyle.Primary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_5_${staffId}`
                                    )
                                    .setLabel('⭐⭐⭐⭐⭐ 5')
                                    .setStyle(
                                        ButtonStyle.Primary
                                    )
                            );

                    await moradorDM.send({
                        embeds: [embedDM],
                        components: [linhaEstrelas]
                    });

                } catch (e) {
                    console.error(
                        'Erro ao enviar avaliação:',
                        e
                    );
                }

                try {

                    const cLogs =
                        await interaction.guild.channels.fetch(
                            CANAL_LOGS_TICKETS
                        );

                    const embedLog =
                        new EmbedBuilder()
                            .setTitle(
                                '🔒 ATENDIMENTO CIVIL ARQUIVADO'
                            )
                            .addFields(
                                {
                                    name:
                                        '👤 Morador Atendido',
                                    value:
                                        `<@${moradorId}>`,
                                    inline: true
                                },
                                {
                                    name:
                                        '👮 Staff Responsável',
                                    value:
                                        `<@${staffId}>`,
                                    inline: true
                                },
                                {
                                    name:
                                        '📂 Canal Deletado',
                                    value:
                                        `#${interaction.channel.name}`,
                                    inline: true
                                },
                                {
                                    name:
                                        '📝 Motivo do Encerramento',
                                    value:
                                        `\`\`\`text\n${motivoFechamento}\n\`\`\``,
                                    inline: false
                                }
                            )
                            .setColor('#ff0000')
                            .setTimestamp();

                    await cLogs.send({
                        embeds: [embedLog]
                    });

                } catch (e) {
                    console.error(
                        'Erro ao enviar log:',
                        e
                    );
                }

                await interaction.reply({
                    content:
                        '🔒 **Chamado Arquivado!** Motivo registrado com sucesso. Deletando esta sala em 5 segundos...'
                });

                setTimeout(() => {
                    interaction.channel
                        .delete()
                        .catch(() => null);
                }, 5000);

                return;
            }
        }
    }
};