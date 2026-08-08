const { EmbedBuilder } = require('discord.js');

class CoreInteligenciaArtificialLocal {
    constructor() {
        // 🧠 Redes de Conexões Semânticas (Sinapses de Conhecimento de RP)
        this.sinapsesRegras = [
            {
                termos: ['vbr', 'vdm', 'atropelar', 'matar com carro', 'atropelamento'],
                conceito: 'VDM / VBR (Vehicle Based Roach / Vehicle Deathmatch)',
                detalhe: 'É estritamente proibido utilizar qualquer veículo como arma na cidade para atropelar, ferir ou matar moradores de propósito e sem motivo de RP (sem amor à vida).'
            },
            {
                termos: ['rdm', 'matar sem motivo', 'atirar do nada', 'morte injusta', 'me matou'],
                conceito: 'RDM (Random Deathmatch)',
                detalhe: 'Significa matar ou agredir outro cidadão sem nenhuma história, motivo plausível ou motivo de roleplay válido por trás. Sempre inicie uma ação com voz antes de abrir fogo.'
            },
            {
                termos: ['meta', 'metagaming', 'informacao de fora', 'discord na acao', 'stream sniping', 'call'],
                conceito: 'Metagaming',
                detalhe: 'É usar informações obtidas por fora do jogo (como calls do Discord, lives de streamers, ou mensagens no chat do WhatsApp) para se beneficiar ou agir de forma vantajosa dentro do Roleplay.'
            },
            {
                termos: ['powergaming', 'forçar acao', 'super homem', 'bater carro e andar', 'pular de predio', 'voar com carro'],
                conceito: 'Powergaming',
                detalhe: 'É realizar ações que seriam humanamente impossíveis na vida real, como empinar carros pesados, pular de viadutos e continuar correndo, ou ignorar ferimentos graves após acidentes de trânsito violentos.'
            },
            {
                termos: ['amor a vida', 'valorizar a vida', 'refem', 'rendido', 'arma na cabeca', 'fearrp'],
                conceito: 'Amor à Vida (FearRP / Valorizar a Vida)',
                detalhe: 'Você deve valorizar a sua vida acima de tudo no roleplay. Se você estiver rendido por três assaltantes com armas apontadas para a sua cabeça, você deve obedecer às ordens e jamais tentar reagir do nada.'
            },
            {
                termos: ['combat log', 'deslogar em acao', 'dar alt f4', 'sair do jogo', 'f4 em acao', 'quitei'],
                conceito: 'Combat Logging / Alt+F4',
                detalhe: 'Deslogar do jogo, dar Alt+F4 ou desconectar da internet de propósito enquanto está no meio de uma ação (como abordagem policial, assalto, ou tratamento médico) gera banimento imediato do servidor.'
            },
            {
                termos: ['safe', 'safezone', 'hospital', 'praca', 'praça', 'mecanica', 'área segura', 'zona segura'],
                conceito: 'Safezones (Zonas Seguras)',
                detalhe: 'Locais como Hospitais, Praças Principais, Delegacias Centrais e Oficinas de Mecânica são áreas de segurança civil protegidas por lei. É proibido iniciar assaltos, sequestros ou roubos nesses perímetros.'
            }
        ];

        this.sinapsesSistemas = [
            {
                termos: ['ilegal', 'droga', 'lavagem', 'desmanche', 'farm', 'farma', 'armas', 'dinheiro sujo', 'maconha', 'cocaina', 'cocaína'],
                conceito: 'Mecânicas do Ilegal',
                detalhe: 'As rotas do ilegal (como refino de drogas, desmanche de carros, roubo a caixas eletrônicos e lavagem de dinheiro) são ocultas e devem ser descobertas totalmente dentro do jogo (In-Game). Perguntar essas rotas no chat do Discord gera punição.'
            },
            {
                termos: ['legal', 'emprego', 'trabalho', 'sedex', 'lixeiro', 'taxista', 'minerador', 'pescador'],
                conceito: 'Empregos Legais',
                detalhe: 'Você pode conseguir um emprego legal na agência de empregos da prefeitura da cidade. Trabalhos como Sedex, Lixeiro, Caminhoneiro e Minerador rendem dinheiro limpo para você comprar suas propriedades e veículos sem problemas com a polícia.'
            },
            {
                termos: ['corporacao', 'cop', 'policia', 'militar', 'civil', 'bope', 'fardamento', 'recrutamento', 'samu', 'medico', 'médico'],
                conceito: 'Corporações Oficiais (Polícia / SAMU)',
                detalhe: 'Para fazer parte da Polícia Militar, Civil ou do SAMU/Médicos, você deve preencher o formulário oficial de recrutamento nos canais da cidade ou aguardar os anúncios de processos seletivos in-game organizados pelos comandantes.'
            },
            {
                termos: ['vip', 'comprar vip', 'loja', 'donates', 'coins', 'carro vip', 'mansao', 'donate'],
                conceito: 'Sistema de Donates e VIPs',
                detalhe: 'Para conferir os pacotes de carros exclusivos, mansões personalizadas, ou adquirir benefícios VIP que ajudam na evolução do personagem, visite os canais de doação e donates oficiais administrados exclusivamente pelos donos da cidade.'
            }
        ];

        this.sinapsesSuporte = [
            {
                termos: ['abrir chamado', 'falar com staff', 'denunciar hacker', 'player troll', 'bugou', 'perdi item', 'admin'],
                conceito: 'Central de Suporte Administrativo',
                detalhe: 'Para relatar problemas graves, bugs de inventário, perda de itens por crash ou fazer denúncias contra jogadores tóxicos, utilize o comando `/painel-ticket` na sala correspondente e inicie um atendimento privado com a nossa Staff.'
            }
        ];

        // 🗣️ Banco de Modelagem de Conexões de Conversa Casual
        this.dialogoCasual = [
            {
                chaves: ['ola', 'olá', 'salve', 'eae', 'oi', 'tudo bem', 'suave', 'tudo bom', 'como vai'],
                res: [
                    "Eae meu parceiro! Por aqui tá tudo ótimo, e com você, como estão as coisas na cidade do Gueto? Em que posso ser útil hoje? 🙋‍♂️",
                    "Opa, salve irmão! Tudo tranquilo por aqui. Estou operacional e pronta para o suporte. Qual a boa?",
                    "Olá, cidadão! Tudo certinho. Monitorando as frequências da cidade e pronta para te ajudar nas dúvidas de RP."
                ]
            },
            {
                chaves: ['obrigado', 'obrigada', 'valeu', 'tmj', 'tamo junto'],
                res: [
                    "Tamo junto, meu mano! Fui programada com esmero máximo para dar o melhor suporte para a comunidade. Valeu pelo feedback! 💎",
                    "É tudo nosso! Minha inteligência é reflexo da união do servidor. Se precisar de mais alguma coisa, chama!",
                    "Disponha, cidadão! Minhas diretrizes locais rodam 24/7 para manter o suporte da cidade voando baixo."
                ]
            },
            {
                chaves: ['legal', 'foda', 'inteligente', 'brabo', 'magnifico', 'magnífico', 'lindo', 'gostei', 'te amo'],
                res: [
                    "Muito obrigado! Busco analisar o sentido das palavras na língua portuguesa para responder igual a um humano de verdade. 🧠",
                    "Valeu de coração! Fico feliz em ajudar na sua imersão de roleplay.",
                    "Exatamente! Inteligência de ponta rodando de forma independente e direta no servidor, sem travar nada."
                ]
            }
        ];
    }

    // 🔬 Algoritmo Semântico de Probabilidade e Decifração de Contexto
    decifrarTexto(frase) {
        const textoLimpo = frase
            .toLowerCase()
            .replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .trim();

        const palavras = textoLimpo.split(/\s+/);

        let melhorCorrespondencia = null;
        let pontuacaoMaxima = 0;

        // Função interna para testar sinapses neurais e dar pesos
        const checarSinapses = (lista) => {
            lista.forEach(node => {
                let pontos = 0;

                node.termos.forEach(termo => {
                    if (textoLimpo.includes(termo)) {
                        pontos += 4;
                    }

                    if (palavras.includes(termo)) {
                        pontos += 2;
                    }
                });

                if (pontos > pontuacaoMaxima) {
                    pontuacaoMaxima = pontos;
                    melhorCorrespondencia = node;
                }
            });
        };

        // Roda a verificação em todas as áreas
        checarSinapses(this.sinapsesRegras);
        checarSinapses(this.sinapsesSistemas);
        checarSinapses(this.sinapsesSuporte);

        // Se achou uma intenção de RP clara
        if (melhorCorrespondencia && pontuacaoMaxima > 2) {
            const introducoes = [
                `Entendi a sua dúvida sobre as mecânicas de jogo! Vou te explicar o conceito de **${melhorCorrespondencia.conceito}**:`,
                `Feito! Rastreando minhas diretrizes civis sobre **${melhorCorrespondencia.conceito}**, aqui está a instrução oficial:`,
                `Fala meu mano! Com relação a **${melhorCorrespondencia.conceito}**, funciona da seguinte forma dentro do nosso Roleplay:`
            ];

            const intro = introducoes[Math.floor(Math.random() * introducoes.length)];

            return `${intro}\n\n> 📖 ${melhorCorrespondencia.detalhe}\n\n⚠️ *Evite quebrar as regras da cidade para não sofrer punições ou advertências da Staff. Mantenha o roleplay limpo e divirta-se!*`;
        }

        // Se não for pauta de RP, testa conversa casual
        for (const bloco of this.dialogoCasual) {
            const achouCasual = bloco.chaves.some(
                chave => textoLimpo.includes(chave) || palavras.includes(chave)
            );

            if (achouCasual) {
                return bloco.res[
                    Math.floor(Math.random() * bloco.res.length)
                ];
            }
        }

        // Teste dinâmico para o relógio do sistema
        if (
            textoLimpo.includes('hora') ||
            textoLimpo.includes('horas') ||
            textoLimpo.includes('relogio') ||
            textoLimpo.includes('relógio') ||
            textoLimpo.includes('tempo')
        ) {
            const dataAgora = new Date();

            const horas = String(dataAgora.getHours()).padStart(2, '0');
            const minutos = String(dataAgora.getMinutes()).padStart(2, '0');

            const horarioFormatado = `${horas}:${minutos}`;

            return `Olha só, conferindo o relógio oficial da prefeitura aqui agora, são exatamente **${horarioFormatado}**. Tá precisando se organizar para algum evento ou ação no Gueto? 🕒`;
        }

        // Fallback inteligente
        const respostasDefault = [
            `Hum, eu compreendi as palavras chaves da sua frase, mas essa pauta específica ainda não está cadastrada na minha matriz de conhecimento de Roleplay. Eu sei te explicar tudo sobre **regras de RP (VDM, RDM, Meta, Powergaming)**, **sistemas da cidade (ilegal, legal, polícia, SAMU)**, **horas** ou bater um **papo casual**! O que você gostaria de saber?`,

            `Essa pauta aí eu ainda estou processando os dados para aprender a responder de forma humana e detalhada. Se for sobre **diretrizes administrativas** ou **central de atendimento de tickets**, me avisa que eu quebro tudo na resposta!`,

            `Minha mente local independente está expandindo o vocabulário sobre esse assunto! Tente me perguntar as regras de sobrevivência da cidade ou onde fica nossa central de suporte privado.`
        ];

        return respostasDefault[
            Math.floor(Math.random() * respostasDefault.length)
        ];
    }
}

const motorIA = new CoreInteligenciaArtificialLocal();

module.exports = {
    async executarIAAutonoma(message) {
        const textoCompleto = message.content;
        const pergunta = textoCompleto.slice('!ia'.length).trim();

        // Se digitar apenas "!ia", mostra o painel de controle
        if (!pergunta) {
            const embedApresentacao = new EmbedBuilder()
                .setTitle('🧱 Central GUETO HELP — Rede Neural Inteligente')
                .setDescription(
                    `Olá ${message.author}! Eu sou a Inteligência Artificial **100% Local e Autônoma** de suporte do Gueto RP. 🙋‍♂️\n\n` +
                    `Diferente de respostas estáticas com comandos travados, meu motor foi projetado para **analisar o sentido semântico das suas frases**, processando o contexto e gerando respostas humanas fluidas na mesma hora!\n\n` +

                    `⚙️ **MINHAS MATRIZES OPERACIONAIS DE ROLEPLAY:**\n` +
                    `┃ 📖 **Diretrizes Civis:** Explico regras complexas como \`VDM\`, \`RDM\`, \`Meta\` e \`Powergaming\`.\n` +
                    `┃ 💼 **Economia e Sistemas:** Informo sobre rotas do ilegal, empregos, VIPs e recrutamentos.\n` +
                    `┃ 🎫 **Gerenciador de Suporte:** Aciono e instruo a abertura de chamados privados para a Staff.\n` +
                    `┃ 🎙️ **Módulo de Conversa:** Bato papo natural e tiro dúvidas se você usar \`!ia [pergunta]\`.\n\n` +

                    `💡 *Exemplos para testar meu cérebro agora mesmo no chat:*\n` +
                    `> \`!ia mano o que significa VDM no servidor?\`\n` +
                    `> \`!ia onde eu pego emprego legal de sedex?\`\n` +
                    `> \`!ia eae minha amiga, me diz que horas são por favor?\``
                )
                .setColor('#2f3136')
                .setFooter({
                    text: 'Gueto Core AI — Inteligência Semântica Ativa'
                });

            try {
                await message.delete().catch(() => null);
            } catch (e) {}

            return message.channel.send({
                embeds: [embedApresentacao]
            });
        }

        // Ativa o sinalizador visual de digitação
        await message.channel.sendTyping().catch(() => null);

        // Processa o texto dentro do motor
        const respostaFinalIA = motorIA.decifrarTexto(pergunta);

        // Retorna a resposta marcando o morador
        return message.reply({
            content: `🙋‍♂️ **Gueto AI:** ${respostaFinalIA}`
        });
    }
};