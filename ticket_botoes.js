const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, UserSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Caminhos dos bancos de dados locais da cidade
const rankingPath = path.join(__dirname, 'usuarios_ranking.json');
const ticketsPath = path.join(__dirname, 'usuarios_tickets.json');

/**
 * 📊 SISTEMA DE AVALIAÇÃO: Salva a nota e atualiza a média matemática da Staff no JSON
 */
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

    fs.writeFileSync(rankingPath, JSON.stringify(dados, null, 2));

    return staff;
}

module.exports = {
    async handleInteractions(interaction) {

        // ⚙️ CONFIGURAÇÕES INTERNAS
        const CATEGORIA_TICKET_ID = '1515730442714611832';
        const CARGO_STAFF_ID = '1515730228528418956';
        const CANAL_LOGS_TICKETS = '1530263063436202024';
        const CANAL_AVALIACOES_PUB = '1532848984358518916';

        if (!interaction.client.staffTickets) {
            interaction.client.staffTickets = new Map();
        }

        // 🎫 A) TRATAMENTO DE BOTÕES
        if (interaction.isButton()) {

            // 🚨 1. ABERTURA DO TICKET
            if (interaction.customId === 'abrir_ticket_suporte') {

                if (!fs.existsSync(ticketsPath)) {
                    fs.writeFileSync(ticketsPath, JSON.stringify([], null, 2));
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
                        content: `❌ **Ação Negada!** Você já possui uma sala de suporte ativa em: <#${jaAberto.canalId}>.`,
                        ephemeral: true
                    });
                }

                await interaction.reply({
                    content: '⏳ **Gueto Help:** Moldando a sua sala de atendimento privada civil...',
                    ephemeral: true
                });

                try {

                    const canal = await interaction.guild.channels.create({
                        name: `suporte-${interaction.user.username}`,
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

                    const embedBoasVindas = new EmbedBuilder()
                        .setTitle('🧱 CENTRAL DE ATENDIMENTO — GUETO HELP')
                        .setDescription(
                            `Olá ${interaction.user}, seja bem-vindo ao seu chamado privado!\n\n` +
                            `📌 **Instruções:**\n` +
                            `> Explique detalhadamente o seu problema, dúvida ou anexe prints e vídeos de provas.\n` +
                            `> Aguarde um membro da equipe de <@&${CARGO_STAFF_ID}> assumir o seu caso!`
                        )
                        .setColor('#2f3136');

                    const linhaBotoes = new ActionRowBuilder().addComponents(

                        new ButtonBuilder()
                            .setCustomId('fechar_ticket_suporte')
                            .setLabel('🔒 Fechar Ticket')
                            .setStyle(ButtonStyle.Danger),

                        new ButtonBuilder()
                            .setCustomId('btn_trocar_atendente')
                            .setLabel('🔄 Trocar Atendente')
                            .setStyle(ButtonStyle.Secondary)

                    );

                    await canal.send({
                        content: `${interaction.user} | <@&${CARGO_STAFF_ID}>`,
                        embeds: [embedBoasVindas],
                        components: [linhaBotoes]
                    });

                    return interaction.editReply({
                        content: `✅ **Sucesso!** Sua sala de atendimento privado foi aberta: <#${canal.id}>`
                    });

                } catch (err) {

                    console.error(
                        'Erro crítico ao abrir canal de ticket:',
                        err
                    );

                    return interaction.editReply({
                        content: '❌ Erro mecânico ao tentar criar a sua sala de ticket.'
                    });
                }
            }

            // 🚨 2. FECHAMENTO DO TICKET
            if (interaction.customId === 'fechar_ticket_suporte') {

                if (
                    !interaction.member.permissions.has(
                        PermissionFlagsBits.ManageChannels
                    ) &&
                    !interaction.member.roles.cache.has(CARGO_STAFF_ID)
                ) {
                    return interaction.reply({
                        content: '❌ **Acesso Negado!** Apenas membros oficiais da Staff podem encerrar e arquivar chamados na cidade.',
                        ephemeral: true
                    });
                }

                let tDados = [];

                try {
                    tDados = JSON.parse(
                        fs.readFileSync(ticketsPath, 'utf8')
                    );
                } catch (e) {
                    tDados = [];
                }

                const ticketIndex = tDados.findIndex(
                    t =>
                        t.canalId === interaction.channel.id &&
                        t.status === 'ABERTO'
                );

                if (ticketIndex === -1) {
                    return interaction.reply({
                        content: '❌ Este chamado não foi localizado no banco ou já se encontra arquivado.',
                        ephemeral: true
                    });
                }

                const ticket = tDados[ticketIndex];

                ticket.status = 'FECHADO';

                fs.writeFileSync(
                    ticketsPath,
                    JSON.stringify(tDados, null, 2)
                );

                const moradorId = ticket.moradorId;
                const staffId = interaction.user.id;

                // 📨 DM DE AVALIAÇÃO
                try {

                    const moradorDM =
                        await interaction.guild.members.fetch(moradorId);

                    const embedDM = new EmbedBuilder()
                        .setTitle('🧱 AVALIE O ATENDIMENTO — GUETO RP')
                        .setDescription(
                            `Olá! O seu chamado de suporte foi finalizado pelo administrador <@${staffId}>!\n\n` +
                            `Por favor, clique nas estrelas abaixo para registrar a sua nota e avaliar a qualidade do suporte recebido:`
                        )
                        .setColor('#ffaa00');

                    const linhaEstrelas =
                        new ActionRowBuilder().addComponents(

                            new ButtonBuilder()
                                .setCustomId(`nota_1_${staffId}`)
                                .setLabel('⭐ 1')
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId(`nota_2_${staffId}`)
                                .setLabel('⭐⭐ 2')
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId(`nota_3_${staffId}`)
                                .setLabel('⭐⭐⭐ 3')
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId(`nota_4_${staffId}`)
                                .setLabel('⭐⭐⭐⭐ 4')
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId(`nota_5_${staffId}`)
                                .setLabel('⭐⭐⭐⭐⭐ 5')
                                .setStyle(ButtonStyle.Primary)

                        );

                    await moradorDM.send({
                        embeds: [embedDM],
                        components: [linhaEstrelas]
                    });

                } catch (e) {

                    console.log(
                        '⚠️ DM do morador trancada, logs enviados direto para a prefeitura sem nota.'
                    );
                }

                // 📁 LOG DO TICKET
                try {

                    const cLogs =
                        await interaction.guild.channels.fetch(
                            CANAL_LOGS_TICKETS
                        );

                    const embedLog = new EmbedBuilder()
                        .setTitle('🔒 ATENDIMENTO CIVIL ARQUIVADO')
                        .addFields(
                            {
                                name: '👤 Morador Atendido',
                                value: `<@${moradorId}>`,
                                inline: true
                            },
                            {
                                name: '👮 Staff Responsável',
                                value: `<@${staffId}>`,
                                inline: true
                            },
                            {
                                name: '📂 Identificação do Canal',
                                value: `#${interaction.channel.name}`,
                                inline: true
                            }
                        )
                        .setColor('#ff0000')
                        .setTimestamp();

                    await cLogs.send({
                        embeds: [embedLog]
                    });

                } catch (e) {}

                await interaction.reply({
                    content: '🔒 **Canal Arquivado!** Deletando esta sala de atendimento em 5 segundos...'
                });

                setTimeout(
                    () =>
                        interaction.channel
                            .delete()
                            .catch(() => null),
                    5000
                );

                return;
            }

            // 🚨 3. BOTÕES DE ESTRELAS
            if (interaction.customId.startsWith('nota_')) {

                const partes =
                    interaction.customId.split('_');

                const nota = parseInt(partes[1]);
                const staffId = partes[2];

                const dadosAtualizados =
                    salvarNotaStaff(staffId, nota);

                await interaction.update({
                    content: `✅ **Avaliação Concluída!** Sua nota de \`${nota} Estrelas\` foi enviada para o ranking municipal da prefeitura. Muito obrigado!`,
                    components: []
                });

                try {

                    const cAvaliacao =
                        await interaction.guild.channels.fetch(
                            CANAL_AVALIACOES_PUB
                        );

                    const embedPub = new EmbedBuilder()
                        .setTitle('⭐ SUPORTE AVALIADO — PREFEITURA')
                        .setDescription(
                            'Um morador acabou de classificar a qualidade de um atendimento privado!'
                        )
                        .addFields(

                            {
                                name: '👮 Staff Avaliado',
                                value: `<@${staffId}>`,
                                inline: true
                            },

                            {
                                name: '📊 Nota Recebida',
                                value: `\`${'⭐'.repeat(nota)}\` (${nota}/5)`,
                                inline: true
                            },

                            {
                                name: '📈 Nova Média Geral',
                                value: `\`⭐ ${dadosAtualizados.media}\` (Total de ${dadosAtualizados.notas.length} votos)`,
                                inline: false
                            }

                        )
                        .setColor('#00ff00')
                        .setTimestamp();

                    await cAvaliacao.send({
                        embeds: [embedPub]
                    });

                } catch (e) {}

                return;
            }

            // 🚨 4. BOTÃO TROCAR ATENDENTE
            if (interaction.customId === 'btn_trocar_atendente') {

                if (
                    !interaction.member.permissions.has(
                        PermissionFlagsBits.ManageChannels
                    ) &&
                    !interaction.member.roles.cache.has(CARGO_STAFF_ID)
                ) {
                    return interaction.reply({
                        content: '❌ Apenas membros oficiais da Staff podem transferir chamados.',
                        ephemeral: true
                    });
                }

                const menuSelecaoStaff =
                    new UserSelectMenuBuilder()
                        .setCustomId('menu_transferir_atendente')
                        .setPlaceholder(
                            '👋 Selecione o novo membro da Staff para assumir o caso...'
                        )
                        .setMinValues(1)
                        .setMaxValues(1);

                const linhaComponente =
                    new ActionRowBuilder().addComponents(
                        menuSelecaoStaff
                    );

                return interaction.reply({
                    content: '🔄 **Escala de Turno:** Escolha qual administrador do menu vai assumir este chamado a partir de agora:',
                    components: [linhaComponente],
                    ephemeral: true
                });
            }
        }

        // 🎫 B) MENU DE SELEÇÃO HUMANA
        if (interaction.isUserSelectMenu()) {

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
                        content: '⚠️ Você já é o responsável por este canal! Escolha outro administrador no menu.',
                        ephemeral: true
                    });
                }

                await interaction.deferUpdate();

                try {

                    const canalSuporte =
                        interaction.channel;

                    // 🟥 Remove envio do Staff antigo
                    await canalSuporte.permissionOverwrites.create(
                        atendenteAntigoId,
                        {
                            ViewChannel: true,
                            SendMessages: false,
                            ReadMessageHistory: true
                        }
                    );

                    // 🟩 Libera o novo Staff
                    await canalSuporte.permissionOverwrites.create(
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
                                    name: '⬅️ Saindo do Turno',
                                    value: `<@${atendenteAntigoId}>`,
                                    inline: true
                                },
                                {
                                    name: '➡️ Assumindo o Caso',
                                    value: `<@${novoAtendenteId}>`,
                                    inline: true
                                }
                            )
                            .setColor('#ffaa00')
                            .setTimestamp();

                    await canalSuporte.send({
                        content: `🔔 <@${novoAtendenteId}>, você foi escalado para assumir este atendimento!`,
                        embeds: [embedTrocaTurno]
                    });

                } catch (error) {

                    console.error(
                        'Erro de permissão na troca de turno:',
                        error
                    );

                    return interaction.followUp({
                        content: '❌ Erro mecânico ao tentar reconfigurar os privilégios de escrita dos canais.',
                        ephemeral: true
                    });
                }
            }
        }
    }
};