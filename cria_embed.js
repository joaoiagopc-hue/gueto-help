const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    // 🔒 Configuração nativa do Comando Barra (/) do Discord.js v14
    async executeSlashCriaEmbed(interaction) {
        // Trava de segurança: Garante que apenas administradores usem o comando
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ **Acesso Negado!** Apenas administradores podem utilizar este comando.', ephemeral: true });
        }

        // Avisa no canal que o bot abriu o sensor de escuta por 2 minutos
        await interaction.reply({ 
            content: '🎙️ **Gerador de Embed:** Digite ou cole o texto completo da sua Embed no chat abaixo (pode usar parágrafos, quebras de linha e emojis). Eu tenho **2 minutos** para copiar!\n*⚠️ Esta instrução vai sumir automaticamente.*'
        });

        // Coletor de mensagens focado na conta do administrador que usou o comando barra
        const filtro = m => m.author.id === interaction.user.id;
        const coletor = interaction.channel.createMessageCollector({ filter: filtro, max: 1, time: 120000 });

        coletor.on('collect', async message => {
            const textoDigitado = message.content;

            // 🎨 MOLDAGEM COMPLETA DA EMBED PÚBLICA (Puxa os parágrafos livres idênticos)
            const embedCustomizada = new EmbedBuilder()
                .setTitle('🧱 COMUNICADO OFICIAL — GUETO RP')
                .setDescription(textoDigitado) // Copia o parágrafo bruto formatado do chat
                .setColor('#2f3136')
                .setTimestamp()
                .setFooter({ text: 'Administração Gueto RP — Gestão Civil' });

            try {
                // 🟥 PASSO A: Apaga a mensagem digitada pelo admin para não poluir o chat
                await message.delete().catch(() => null);

                // 🟥 PASSO B: Apaga a instrução amarela inicial do bot
                await interaction.deleteReply().catch(() => null);

                // 🟩 PASSO C: Dispara a Embed final magnífica no canal público
                await interaction.channel.send({ embeds: [embedCustomizada] });
            } catch (error) {
                console.error('Erro ao processar limpeza de mensagens da Embed:', error);
            }
        });

        coletor.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({ content: '⏰ **Tempo Esgotado!** Você demorou mais de 2 minutos para enviar o texto e o gerador foi cancelado.', ephemeral: true }).catch(() => null);
            }
        });
    }
};
