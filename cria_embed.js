const { PermissionFlagsBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    // 🎨 A) CONFIGURAÇÃO DO COMANDO: Abre a caixa de diálogo nativa do Discord no formato Parágrafo
    async executeSlashCriaEmbed(interaction) {
        // Trava de segurança para apenas Administradores / Staff usarem o comando
        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Você não possui permissão para criar anúncios oficiais na cidade!', ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId('modal_gerador_embed')
            .setTitle('Criador de Embed Clean');

        // 🚨 CAMPO DE PARÁGRAFO: Permite pular linhas e escrever textos gigantescos sem estourar limites!
        const inputParagrafo = new TextInputBuilder()
            .setCustomId('embed_descricao')
            .setLabel('Texto da Embed (Suporta Parágrafos):') // Rótulo curto abaixo de 45 caracteres ok!
            .setStyle(TextInputStyle.Paragraph) // Ativa o modo de digitação de parágrafo longo!
            .setPlaceholder('Digite aqui o seu comunicado oficial. Você pode apertar Enter para pular linhas e estruturar seus parágrafos...')
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(inputParagrafo));

        // Exibe o popup estético na tela do Staff
        await interaction.showModal(modal).catch(err => console.error("Erro ao abrir modal de parágrafo:", err));
    },

    // 📬 B) COMPILA O FORMULÁRIO ENVIADO E ATIRA A EMBED CLEAN NA SALA
    async processarEnvioModalEmbed(interaction) {
        // Segura a resposta da API imediatamente para evitar o erro de "aplicativo não respondeu"
        await interaction.deferReply({ ephemeral: true });

        // Extrai o texto inteiro digitado, respeitando todas as quebras de linha e enters
        const textoParagrafo = interaction.fields.getTextInputValue('embed_descricao');

        // Monta o design com o corpo do texto e a cor limpa clean padrão do Gueto
        const embedClean = new EmbedBuilder()
            .setDescription(textoParagrafo)
            .setColor('#2f3136'); 

        // Posta de forma solta no canal de texto onde o comando foi usado
        await interaction.channel.send({ embeds: [embedClean] }).catch(err => console.error(err));
        
        // Finaliza a interação avisando apenas ao Staff que o anúncio foi criado
        await interaction.editReply({ content: '✅ Embed com parágrafos gerada e enviada com sucesso!' });
    }
};
