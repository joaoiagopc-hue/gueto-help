const {
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    UserSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

const fs = require('fs');
const path = require('path');

// Caminhos dos bancos de dados
const rankingPath = path.join(__dirname, '../../usuarios_ranking.json');
const ticketsPath = path.join(__dirname, '../../usuarios_tickets.json');

// =========================================================
// 📊 SISTEMA DE AVALIAÇÃO
// =========================================================

function salvarNotaStaff(staffId, estrelas) {
    if (!fs.existsSync(rankingPath)) {
        fs.writeFileSync(
            rankingPath,
            JSON.stringify([], null, 2)
        );
    }

    let dados = [];

    try {
        dados = JSON.parse(
            fs.readFileSync(rankingPath, 'utf8')
        );
    } catch (e) {
        dados = [];
    }

    let staff = dados.find(
        s => s.id === staffId
    );

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

    staff.totalEstrelas =
        staff.notas.reduce(
            (a, b) => a + b,
            0
        );

    staff.media = parseFloat(
        (
            staff.totalEstrelas /
            staff.notas.length
        ).toFixed(1)
    );

    fs.writeFileSync(
        rankingPath,
        JSON.stringify(dados, null, 2)
    );

    return staff;
}

// =========================================================
// 📦 EXPORTAÇÃO
// =========================================================

module.exports = {

    handleInteraction: async function (interaction) {
        return await module.exports.processarTudo(interaction);
    },

    handleInteractions: async function (interaction) {
        return await module.exports.processarTudo(interaction);
    },

    async processarTudo(interaction) {

        // =====================================================
        // ⚙️ CONFIGURAÇÕES
        // =====================================================

        const CATEGORIA_TICKET_ID = '1515730442714611832';
        const CARGO_STAFF_ID = '1515730228528418956';
        const CANAL_LOGS_TICKETS = '1530263063436202024';
        const CANAL_AVALIACOES_PUB = '1532848984358518916';

        if (!interaction.client.staffTickets) {
            interaction.client.staffTickets = new Map();
        }

        // =====================================================
        // 🎫 BOTÕES
        // =====================================================

        if (interaction.isButton()) {

            // =================================================
            // 🎫 ABRIR TICKET
            // =================================================

            if (
                interaction.customId ===
                'abrir_ticket_suporte'
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
                        fs.readFileSync(
                            ticketsPath,
                            'utf8'
                        )
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
                            `❌ **Ação Negada!** Você já possui uma sala ativa em: <#${jaAberto.canalId}>.`,
                        ephemeral: true
                    });
                }

                await interaction.reply({
                    content:
                        '⏳ Criando sua sala de atendimento privada civil...',
                    ephemeral: true
                });

                try {

                    const canal =
                        await interaction.guild.channels.create({
                            name:
                                `suporte-${interaction.user.username}`,

                            type: 0,

                            parent:
                                CATEGORIA_TICKET_ID,

                            permissionOverwrites: [

                                {
                                    id:
                                        interaction.guild.id,

                                    deny: [
                                        PermissionFlagsBits.ViewChannel
                                    ]
                                },

                                {
                                    id:
                                        interaction.user.id,

                                    allow: [
                                        PermissionFlagsBits.ViewChannel,
                                        PermissionFlagsBits.SendMessages,
                                        PermissionFlagsBits.ReadMessageHistory
                                    ]
                                },

                                {
                                    id:
                                        CARGO_STAFF_ID,

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
                        JSON.stringify(
                            tDados,
                            null,
                            2
                        )
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
                                `> Aguarde um membro da Staff clicar no botão abaixo para assumir o suporte!`
                            )
                            .setColor('#2f3136');

                    const linhaBotoes =
                        new ActionRowBuilder()
                            .addComponents(

                                new ButtonBuilder()
                                    .setCustomId(
                                        'assumir_ticket_suporte'
                                    )
                                    .setLabel(
                                        '🟢 Atender'
                                    )
                                    .setStyle(
                                        ButtonStyle.Success
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        'btn_trocar_atendente'
                                    )
                                    .setLabel(
                                        '🔄 Transferir'
                                    )
                                    .setStyle(
                                        ButtonStyle.Secondary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        'gatilho_fechar_ticket'
                                    )
                                    .setLabel(
                                        '🔒 Fechar'
                                    )
                                    .setStyle(
                                        ButtonStyle.Danger
                                    )
                            );

                    await canal.send({
                        content:
                            `${interaction.user} | <@&${CARGO_STAFF_ID}>`,
                        embeds: [
                            embedBoasVindas
                        ],
                        components: [
                            linhaBotoes
                        ]
                    });

                    return interaction.editReply({
                        content:
                            `✅ Sala de atendimento privado aberta: <#${canal.id}>`
                    });

                } catch (err) {

                    console.error(err);

                    return interaction.editReply({
                        content:
                            '❌ Erro mecânico ao tentar criar a sua sala.'
                    });
                }
            }

            // =================================================
            // 🟢 ASSUMIR TICKET
            // =================================================

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
                            '❌ Apenas membros oficiais da Staff podem assumir atendimentos.',
                        ephemeral: true
                    });
                }

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
                            '❌ Não foi possível carregar os tickets.',
                        ephemeral: true
                    });
                }

                const ticket =
                    tDados.find(
                        t =>
                            t.canalId ===
                                interaction.channel.id &&
                            t.status === 'ABERTO'
                    );

                if (!ticket) {
                    return interaction.reply({
                        content:
                            '❌ Este chamado já foi arquivado ou não consta no sistema.',
                        ephemeral: true
                    });
                }

                if (ticket.staffId) {
                    return interaction.reply({
                        content:
                            `⚠️ Este chamado já está sendo atendido pelo administrador <@${ticket.staffId}>!`,
                        ephemeral: true
                    });
                }

                ticket.staffId =
                    interaction.user.id;

                fs.writeFileSync(
                    ticketsPath,
                    JSON.stringify(
                        tDados,
                        null,
                        2
                    )
                );

                try {

                    await interaction.channel
                        .permissionOverwrites
                        .set([

                            {
                                id:
                                    interaction.guild.id,

                                deny: [
                                    PermissionFlagsBits.ViewChannel
                                ]
                            },

                            {
                                id:
                                    ticket.moradorId,

                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory
                                ]
                            },

                            {
                                id:
                                    interaction.user.id,

                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory
                                ]
                            },

                            {
                                id:
                                    CARGO_STAFF_ID,

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
                        `🟢 **Atendimento Iniciado:** O administrador <@${interaction.user.id}> assumiu a responsabilidade por este chamado!`
                });
            }

            // =================================================
            // 🔒 FECHAR TICKET
            // =================================================

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
                            '❌ Apenas membros oficiais da Staff podem fechar chamados.',
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
                            'Qual o motivo do fechamento deste chamado?'
                        )
                        .setStyle(
                            TextInputStyle.Paragraph
                        )
                        .setPlaceholder(
                            'Ex: Dúvida tirada in-game / Ação de denúncia resolvida.'
                        )
                        .setRequired(true);

                modalFechar.addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            campoMotivo
                        )
                );

                return interaction.showModal(
                    modalFechar
                );
            }

            // =================================================
            // 🔄 TRANSFERIR ATENDENTE
            // =================================================

            if (
                interaction.customId ===
                'btn_trocar_atendente'
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
                            '❌ Apenas membros da Staff podem transferir chamados.',
                        ephemeral: true
                    });
                }

                const menuSelecaoStaff =
                    new UserSelectMenuBuilder()
                        .setCustomId(
                            'menu_transferir_atendente'
                        )
                        .setPlaceholder(
                            '👋 Selecione o novo membro da Staff para assumir o caso...'
                        )
                        .setMinValues(1)
                        .setMaxValues(1);

                return interaction.reply({
                    content:
                        '🔄 **Escala de Turno:** Escolha qual administrador do menu vai assumir este chamado a partir de agora:',

                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                menuSelecaoStaff
                            )
                    ],

                    ephemeral: true
                });
            }

            // =================================================
            // ⭐ AVALIAÇÃO
            // =================================================

            if (
                interaction.customId.startsWith(
                    'nota_'
                )
            ) {

                const partes =
                    interaction.customId.split('_');

                const nota =
                    parseInt(
                        partes[1],
                        10
                    );

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
                        `✅ **Obrigado!** Sua avaliação de ${nota} Estrelas foi enviada para o ranking municipal da prefeitura.`,
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
                                    name:
                                        '👮 Staff Avaliado',

                                    value:
                                        `<@${staffId}>`,

                                    inline: true
                                },

                                {
                                    name:
                                        '📊 Nota Recebida',

                                    value:
                                        `${'⭐'.repeat(nota)} (${nota}/5)`,

                                    inline: true
                                },

                                {
                                    name:
                                        '📈 Nova Média Geral',

                                    value:
                                        `⭐ ${dadosAtualizados.media} (Total de ${dadosAtualizados.notas.length} votos)`,

                                    inline: false
                                }
                            )
                            .setColor(
                                '#00ff00'
                            )
                            .setTimestamp();

                    await cAvaliacao.send({
                        embeds: [
                            embedPub
                        ]
                    });

                } catch (e) {
                    console.error(e);
                }

                return;
            }
        }

        // =====================================================
        // 📝 MODAL DE FECHAMENTO
        // =====================================================

        if (
            interaction.isModalSubmit()
        ) {

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
                            '❌ Não foi possível carregar os dados do ticket.',
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

                if (
                    ticketIndex === -1
                ) {
                    return interaction.reply({
                        content:
                            '❌ Ticket já arquivado.',
                        ephemeral: true
                    });
                }

                const ticket =
                    tDados[ticketIndex];

                ticket.status =
                    'FECHADO';

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

                // =============================================
                // 📩 AVALIAÇÃO NA DM
                // =============================================

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
                                `Olá! O seu chamado de suporte foi finalizado pelo administrador <@${staffId}>!\n\n` +
                                `Por favor, vote clicando nas estrelas abaixo para avaliar a qualidade do suporte recebido:`
                            )
                            .setColor(
                                '#ffaa00'
                            );

                    const AppEstrelas =
                        new ActionRowBuilder()
                            .addComponents(

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_1_${staffId}`
                                    )
                                    .setLabel(
                                        '⭐ 1'
                                    )
                                    .setStyle(
                                        ButtonStyle.Primary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_2_${staffId}`
                                    )
                                    .setLabel(
                                        '⭐⭐ 2'
                                    )
                                    .setStyle(
                                        ButtonStyle.Primary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_3_${staffId}`
                                    )
                                    .setLabel(
                                        '⭐⭐⭐ 3'
                                    )
                                    .setStyle(
                                        ButtonStyle.Primary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_4_${staffId}`
                                    )
                                    .setLabel(
                                        '⭐⭐⭐⭐ 4'
                                    )
                                    .setStyle(
                                        ButtonStyle.Primary
                                    ),

                                new ButtonBuilder()
                                    .setCustomId(
                                        `nota_5_${staffId}`
                                    )
                                    .setLabel(
                                        '⭐⭐⭐⭐⭐ 5'
                                    )
                                    .setStyle(
                                        ButtonStyle.Primary
                                    )
                            );

                    await moradorDM.send({
                        embeds: [
                            embedDM
                        ],

                        components: [
                            AppEstrelas
                        ]
                    });

                } catch (e) {
                    console.error(
                        'Erro ao enviar avaliação:',
                        e
                    );
                }

                // =============================================
                // 📋 LOG
                // =============================================

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
                            .setColor(
                                '#ff0000'
                            )
                            .setTimestamp();

                    await cLogs.send({
                        embeds: [
                            embedLog
                        ]
                    });

                } catch (e) {
                    console.error(
                        'Erro ao enviar log:',
                        e
                    );
                }

                await interaction.reply({
                    content:
                        '🔒 **Chamado Arquivado!** Motivo registrado com sucesso. Deletando esta sala de atendimento em 5 segundos...'
                });

                setTimeout(() => {

                    interaction.channel
                        .delete()
                        .catch(
                            () => null
                        );

                }, 5000);

                return;
            }
        }

        // =====================================================
        // 🔄 MENU DE TRANSFERÊNCIA
        // =====================================================

        if (
            interaction.isUserSelectMenu()
        ) {

            if (
                interaction.customId ===
                'menu_transferir_atendente'
            ) {

                const novoAtendenteId =
                    interaction.values[0];

                const atendenteAntigoId =
                    interaction.user.id;

                if (
                    novoAtendenteId ===
                    atendenteAntigoId
                ) {

                    return interaction.reply({
                        content:
                            '⚠️ Você já é o responsável ativo por esta sala! Escolha outro administrador.',
                        ephemeral: true
                    });
                }

                await interaction
                    .deferUpdate()
                    .catch(
                        () => null
                    );

                try {

                    let tDados =
                        JSON.parse(
                            fs.readFileSync(
                                ticketsPath,
                                'utf8'
                            )
                        );

                    const ticket =
                        tDados.find(
                            t =>
                                t.canalId ===
                                    interaction.channel.id &&
                                t.status === 'ABERTO'
                        );

                    if (ticket) {

                        ticket.staffId =
                            novoAtendenteId;

                        fs.writeFileSync(
                            ticketsPath,
                            JSON.stringify(
                                tDados,
                                null,
                                2
                            )
                        );
                    }

                    const canalSuporte =
                        interaction.channel;

                    await canalSuporte
                        .permissionOverwrites
                        .create(
                            atendenteAntigoId,
                            {
                                ViewChannel: true,
                                SendMessages: false,
                                ReadMessageHistory: true
                            }
                        );

                    await canalSuporte
                        .permissionOverwrites
                        .create(
                            novoAtendenteId,
                            {
                                ViewChannel: true,
                                SendMessages: true,
                                ReadMessageHistory: true
                            }
                        );

                    const embedTrocaTurno =
                        new EmbedBuilder()
                            .setTitle(
                                '🧱 CENTRAL DE TICKETS — Chamado Transferido'
                            )
                            .addFields(

                                {
                                    name:
                                        '⬅️ Saindo do Turno',

                                    value:
                                        `<@${atendenteAntigoId}>`,

                                    inline: true
                                },

                                {
                                    name:
                                        '➡️ Assumindo o Caso',

                                    value:
                                        `<@${novoAtendenteId}>`,

                                    inline: true
                                }
                            )
                            .setColor(
                                '#ffaa00'
                            )
                            .setTimestamp();

                    await canalSuporte.send({
                        content:
                            `🔔 <@${novoAtendenteId}>, você foi escalado para assumir este atendimento!`,

                        embeds: [
                            embedTrocaTurno
                        ]
                    });

                } catch (error) {

                    console.error(
                        'Erro ao transferir atendente:',
                        error
                    );
                }
            }
        }
    }
};