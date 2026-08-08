const { EmbedBuilder } = require('discord.js');

/**
 * 🧱 CÉREBRO MONUMENTAL DE IA LOCAL V2
 * Sistema Especialista em Processamento de Linguagem Natural (NLP)
 * Autônomo para Roleplay.
 */
class MotorInteligenciaArtificialMonumental {
    constructor() {
        // ID Oficial do canal de tickets
        this.CANAL_TICKET_ID = '1515730581734948885';

        // 🧠 DICIONÁRIO DE SINAPSES NEURAIS
        this.baseConhecimento = [
            {
                id: 'central_ticket',
                nome: 'Central de Atendimento e Tickets',
                gatilhos: [
                    'ticket',
                    'suporte',
                    'chamado',
                    'atendimento',
                    'abrir',
                    'abre',
                    'cria',
                    'criar',
                    'ajuda',
                    'help',
                    'bug',
                    'denuncia',
                    'denúncia',
                    'roubo',
                    'furtado',
                    'assaltado',
                    'perdi',
                    'sumiu',
                    'inventario',
                    'inventário',
                    'staff',
                    'adm',
                    'administracao',
                    'administração',
                    'moderador',
                    'mod',
                    'falar com alguém'
                ],
                respostas: [
                    "Fala meu mano, beleza? Se você está precisando de suporte administrativo, relatar um bug, fazer uma denúncia ou recuperar itens perdidos por crash, o caminho certo é a nossa central de atendimento privado! Vá até o canal <#CANAL_TICKET_ID> e clique no botão correspondente do painel. Uma sala exclusiva e trancada entre você e a Staff vai nascer no mesmo segundo! 🎫",

                    "Opa! Precisa falar com a Staff ou com algum ADM? Corre lá na sala <#CANAL_TICKET_ID>. Não trate de assuntos administrativos ou denúncias no chat geral para manter a imersão da cidade. Clica no botão do painel de suporte e a nossa equipe já te puxa para ajudar de forma humanizada! 🛠️",

                    "Tudo certinho? Problemas com inventário, bugs ou denúncias contra trolls devem ser resolvidos no privado. Dá um pulo em <#CANAL_TICKET_ID>, abra o seu ticket privado e anexe suas provas (prints ou vídeos) para que a moderação aplique as diretrizes da cidade!"
                ]
            },

            {
                id: 'regra_vdm',
                nome: 'VDM / VBR (Vehicle Deathmatch)',
                gatilhos: [
                    'vdm',
                    'vbr',
                    'atropelar',
                    'atropelou',
                    'atropelamento',
                    'matar com carro',
                    'jogar o carro',
                    'veiculo como arma',
                    'veículo como arma'
                ],
                respostas: [
                    "🚨 **Diretriz de VDM/VBR:** É estritamente proibido utilizar qualquer tipo de veículo (carro, moto, caminhão) como arma na cidade para atropelar, ferir ou matar moradores de propósito e sem um motivo de Roleplay extremamente válido. Isso fere o princípio de amor à vida e gera banimento punitivo!",

                    "Fique ligado nas regras! Atropelar pessoas de propósito sem contexto ou usar o carro para esmagar outros cidadãos configura VDM (Vehicle Deathmatch) ou VBR. Se alguém fez isso com você, junte as provas de vídeo e abra um chamado privado para a Staff avaliar!"
                ]
            },

            {
                id: 'regra_rdm',
                nome: 'RDM (Random Deathmatch)',
                gatilhos: [
                    'rdm',
                    'matar sem motivo',
                    'atirar do nada',
                    'me matou',
                    'me deu tiro',
                    'tiro do nada',
                    'morte injusta',
                    'matar civil'
                ],
                respostas: [
                    "⚔️ **Diretriz de RDM:** RDM (Random Deathmatch) significa agredir, atirar ou matar outro cidadão na cidade sem nenhuma história, motivo plausível, conversa prévia ou contexto de Roleplay por trás. Sempre inicie uma ação com comando de voz claro antes de abrir fogo!",

                    "Matar do nada é contra as leis da nossa cidade! Toda ação agressiva precisa de um motivo dentro do Roleplay. Atirar sem anunciar a abordagem ou sem um diálogo prévio configura RDM e resulta em castigo administrativo."
                ]
            },

            {
                id: 'regra_meta',
                nome: 'Metagaming',
                gatilhos: [
                    'meta',
                    'metagaming',
                    'informacao de fora',
                    'informação de fora',
                    'discord na acao',
                    'discord na ação',
                    'stream sniping',
                    'sniping',
                    'call do discord',
                    'conversar por fora'
                ],
                respostas: [
                    "🖥️ **Diretriz de Metagaming:** Metagaming é a infração de utilizar informações obtidas por fora do universo do jogo (como calls privadas do Discord, transmissões ao vivo de streamers na Twitch/YouTube ou conversas de WhatsApp) para se beneficiar ou tomar decisões vantajosas dentro do seu Roleplay. Mantenha a imersão!",

                    "Lembre-se: o seu personagem in-game não sabe o que você descobre assistindo lives ou conversando no Discord oficial. Usar dados de fora para interceptar ações, achar rotas ou caçar rivais é Metagaming e gera punições severas."
                ]
            },

            {
                id: 'regra_power',
                nome: 'Powergaming',
                gatilhos: [
                    'power',
                    'powergaming',
                    'forcar acao',
                    'forçar ação',
                    'super homem',
                    'bater carro e andar',
                    'pular de predio',
                    'pular de prédio',
                    'voar com carro',
                    'ações impossíveis',
                    'capotar e continuar'
                ],
                respostas: [
                    "🏃‍♂️ **Diretriz de Powergaming:** Powergaming consiste em realizar ações dentro do jogo que seriam humanamente ou fisicamente impossíveis de acontecer na vida real. Exemplos clássicos: pular com o carro de viadutos e continuar correndo, capotar várias vezes e ignorar o acidente, ou forçar uma situação onde o outro jogador não tenha nenhuma chance de reação.",

                    "Seja realista no seu Roleplay! Ignorar ferimentos graves, andar com o carro totalmente destruído ou agir como se fosse um super-herói imune a fraturas é Powergaming. Respeite os limites da física real para manter o nível do RP lá no topo."
                ]
            },

            {
                id: 'amor_vida',
                nome: 'Amor à Vida (FearRP)',
                gatilhos: [
                    'amor a vida',
                    'amor à vida',
                    'valorizar a vida',
                    'refem',
                    'refém',
                    'rendido',
                    'arma na cabeca',
                    'arma na cabeça',
                    'reagir',
                    'fearrp',
                    'fear rp'
                ],
                respostas: [
                    "❤️ **Diretriz de Amor à Vida:** Você deve valorizar a vida do seu personagem acima de tudo! Se você for abordado por assaltantes armados e estiver em desvantagem numérica ou com uma arma apontada para a cabeça, você é obrigado a se render, levantar as mãos e obedecer. Jamais tente puxar uma arma ou reagir nessa situação!",

                    "Valorize a vida do seu personagem igual você valoriza a sua na vida real. Reagir a assaltos de mãos vazias contra armas de fogo ou ignorar ameaças de morte iminentes viola a regra de FearRP/Amor à vida e quebra totalmente a seriedade do simulador."
                ]
            },

            {
                id: 'safezones',
                nome: 'Safezones (Zonas Seguras)',
                gatilhos: [
                    'safe',
                    'safezone',
                    'hospital',
                    'praca',
                    'praça',
                    'mecanica',
                    'oficina',
                    'área segura',
                    'zona segura',
                    'delegacia',
                    'dp'
                ],
                respostas: [
                    "🛡️ **Diretriz de Safezones:** Perímetros como Hospitais, Praça Principal, Delegacias de Polícia e Oficinas de Mecânicos são áreas de segurança civil protegidas pelas diretrizes da prefeitura. É expressamente proibido iniciar assaltos, furtos, sequestros, agressões ou disparos de armas de fogo dentro dessas demarcações!",

                    "As zonas seguras servem para garantir que os moradores possam trabalhar, fazer tratamentos médicos ou customizar carros em paz. Qualquer ato de violência ou roubo cometido dentro de hospitais, praças ou delegacias gera banimento imediato."
                ]
            },

            {
                id: 'sistema_ilegal',
                nome: 'Mecânicas do Ilegal',
                gatilhos: [
                    'ilegal',
                    'droga',
                    'drogas',
                    'lavagem',
                    'desmanche',
                    'farm',
                    'farma',
                    'farmar',
                    'armas',
                    'dinheiro sujo',
                    'maconha',
                    'cocaina',
                    'cocaína',
                    'metanfetamina',
                    'metafetanima',
                    'roubo a banco',
                    'assalto a banco'
                ],
                respostas: [
                    "🕵️‍♂️ **Mecânicas do Ilegal:** Todas as rotas de farm ilegal (como refino de entorpecentes, desmanches clandestinos de veículos, lavagem de dinheiro sujo e esquemas de contrabando de armas) são segredos de estado ocultos! Elas devem ser descobertas 100% de forma interpretativa dentro do jogo (In-Game) conversando com facções. Perguntar localizações dessas rotas no chat do Discord gera punição por quebra de imersão.",

                    "Procurando o ilegal? O bot não pode te dar as coordenadas geográficas! Use o seu personagem dentro da cidade, faça contatos com as facções e descubra o submundo do crime de forma interpretativa."
                ]
            },

            {
                id: 'sistema_legal',
                nome: 'Empregos Legais',
                gatilhos: [
                    'legal',
                    'emprego',
                    'trabalho',
                    'sedex',
                    'lixeiro',
                    'taxista',
                    'minerador',
                    'pescador',
                    'trabalhar',
                    'conseguir dinheiro',
                    'fazer dinheiro limpo',
                    'caminhoneiro'
                ],
                respostas: [
                    "🚚 **Mecânicas de Empregos Legais:** Você pode iniciar a sua jornada de trabalho legal na Agência de Empregos da Prefeitura da cidade! Trabalhos honestos como Sedex, Lixeiro, Taxista, Minerador, Caminhoneiro e Pescador rendem dinheiro limpo direto na sua carteira para você comprar seus imóveis e carros de luxo de forma tranquila.",

                    "Quer crescer na vida de forma honesta? Vá até o ícone da prefeitura no seu mapa, assine a carteira de trabalho para o emprego desejado e siga os checkpoints de entrega na cidade para faturar seu pagamento oficial."
                ]
            },

            {
                id: 'corporacoes',
                nome: 'Corporações Oficiais (Polícia e SAMU)',
                gatilhos: [
                    'corporacao',
                    'corporação',
                    'cop',
                    'policia',
                    'polícia',
                    'militar',
                    'civil',
                    'bope',
                    'fardamento',
                    'recrutamento',
                    'samu',
                    'medico',
                    'médico',
                    'bombeiro',
                    'entrar na policia',
                    'recrutamento pm'
                ],
                respostas: [
                    "👮‍♂️ **Corporações do Servidor:** Para fazer parte das nossas forças de segurança (Polícia Militar, BOPE, Polícia Civil) ou atuar na equipe médica do SAMU, você deve aguardar a abertura dos processos seletivos e preencher o formulário oficial de inscrição que a Staff divulga nos canais de avisos!",

                    "O recrutamento para as forças da lei e equipes médicas acontece de forma rigorosa! Fique atento aos anúncios públicos enviados pelos comandantes e diretores no Discord. Mantenha sua ficha limpa e faça o teste quando os editais estiverem abertos."
                ]
            },

            {
                id: 'sistema_vips',
                nome: 'VIPs, Coins e Donates',
                gatilhos: [
                    'vip',
                    'comprar vip',
                    'loja',
                    'donates',
                    'donate',
                    'coins',
                    'carro vip',
                    'mansao',
                    'mansão',
                    'vips',
                    'ajudar o servidor',
                    'comprar carro'
                ],
                respostas: [
                    "💎 **Central de Donates e Benefícios:** Para adquirir pacotes VIP exclusivos, ter acesso a garagens com carros importados raros ou encomendar benefícios para sua organização na cidade, visite a nossa aba oficial de doações e donates gerenciada diretamente pelos fundadores da cidade!",

                    "Quer conferir as vantagens de ser um morador VIP? Dê uma olhada na categoria de canais de doação e apoie a hospedagem do servidor. Todas as transações e entregas de coins são feitas com suporte dos donos."
                ]
            },

            {
                id: 'conversa_casual',
                nome: 'Bate-papo Humano',
                gatilhos: [
                    'ola',
                    'olá',
                    'salve',
                    'eae',
                    'oi',
                    'tudo bem',
                    'suave',
                    'tudo bom',
                    'como vai',
                    'fala comigo',
                    'bom dia',
                    'boa tarde',
                    'boa noite',
                    'beleza',
                    'fala tu'
                ],
                respostas: [
                    "Eae meu parceiro! Por aqui tá tudo ótimo, e com você, como estão as coisas na nossa cidade? Em que posso ser útil para você hoje? 🙋‍♂️",

                    "Opa, salve irmão! Tudo tranquilo por aqui. Estou totalmente operacional e pronta para te dar suporte nas regras ou pautas civis. Qual a boa?",

                    "Olá, cidadão! Tudo certinho. Monitorando as frequências de rádio do servidor e pronta para te ajudar. Como posso te ajudar agora?"
                ]
            },

            {
                id: 'elogios_bot',
                nome: 'Recepção de Elogios',
                gatilhos: [
                    'legal',
                    'foda',
                    'inteligente',
                    'brabo',
                    'magnifico',
                    'magnífico',
                    'lindo',
                    'gostei',
                    'te amo',
                    'ia top',
                    'bot brabo',
                    'perfeito'
                ],
                respostas: [
                    "Muito obrigado de coração! Busco analisar o sentido de cada frase na língua portuguesa para responder igual a um ser humano de verdade, mantendo a imersão do Gueto lá no topo. 🧠💎",

                    "Valeu pelo feedback, meu mano! Fui programada com esmero máximo para dar o suporte mais rápido possível para a nossa comunidade.",

                    "É tudo nosso! Minha inteligência local roda 24/7 direto na memória do servidor para te ajudar. Se precisar de mais alguma coisa, manda a pauta!"
                ]
            },

            {
                id: 'perguntas_pessoais',
                nome: 'Identidade e Sexualidade',
                gatilhos: [
                    'gay',
                    'homossexual',
                    'lesbica',
                    'bi',
                    'sexualidade',
                    'genero',
                    'gosto de homem',
                    'gosto de mulher'
                ],
                respostas: [
                    "🏳️‍🌈 **Orientação e Identidade:** Olhe, eu sou uma Inteligência Artificial local feita de linhas de código, então eu não possuo sentimentos, gênero ou orientação sexual! Mas aqui na nossa cidade, nós respeitamos 100% todos os moradores, independentemente de quem eles amem ou de sua identidade na vida real. O preconceito ou a homofobia geram punição conforme as diretrizes civis! Sinta-se acolhido e faça o seu melhor Roleplay! ❤️"
                ]
            }
        ];
    }

    // 🔬 ALGORITMO NEURAL DE INFERÊNCIA AVANÇADA
    analisarSentidoFrase(fraseUsuario) {
        const textoProcessado = fraseUsuario
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[?.,/#!$%^&*;:{}=\-_`~()]/g, '')
            .trim();

        const listaPalavras = textoProcessado.split(/\s+/);

        let intencaoVencedora = null;
        let pontuacaoMaxima = 0;

        this.baseConhecimento.forEach(intencao => {
            let pontosIntencao = 0;

            intencao.gatilhos.forEach(gatilho => {
                const gatilhoLimpo = gatilho
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase();

                if (textoProcessado.includes(gatilhoLimpo)) {
                    pontosIntencao += 5;
                }

                if (listaPalavras.includes(gatilhoLimpo)) {
                    pontosIntencao += 3;
                }

                if (
                    gatilhoLimpo.length > 3 &&
                    textoProcessado.includes(gatilhoLimpo.substring(0, 4))
                ) {
                    pontosIntencao += 2;
                }
            });

            if (pontosIntencao > pontuacaoMaxima) {
                pontuacaoMaxima = pontosIntencao;
                intencaoVencedora = intencao;
            }
        });

        // 🕒 Sistema de horário
        const achouHoras = [
            'hora',
            'horas',
            'relogio',
            'tempo',
            'fuso'
        ].some(h => textoProcessado.includes(h));

        if (achouHoras && pontuacaoMaxima < 8) {
            const dataAgora = new Date();

            const horas = String(dataAgora.getHours()).padStart(2, '0');
            const minutos = String(dataAgora.getMinutes()).padStart(2, '0');

            const horarioFormatado = `${horas}:${minutos}`;

            const frasesHoras = [
                `Olha só, conferindo o relógio oficial da prefeitura aqui agora, são exatamente **${horarioFormatado}**. Tá precisando se organizar para algum evento ou ação no Gueto? 🕒`,

                `Fica ligado no tempo, meu parceiro! Agora são **${horarioFormatado}** no fuso horário oficial da cidade. Se precisar de mais alguma informação é só chamar! ⏱️`
            ];

            return frasesHoras[
                Math.floor(Math.random() * frasesHoras.length)
            ];
        }

        // 📌 Retorno da resposta
        if (intencaoVencedora && pontuacaoMaxima > 2) {
            const listaRespostas = intencaoVencedora.respostas;

            const respostaBruta =
                listaRespostas[
                    Math.floor(Math.random() * listaRespostas.length)
                ];

            return respostaBruta.replace(
                /CANAL_TICKET_ID/g,
                this.CANAL_TICKET_ID
            );
        }

        // 🧠 Fallback
        const fallbacksLinguisticos = [
            "Hum, eu analisei o sentido das palavras-chave da sua frase, mas essa pauta específica ainda não está indexada na minha matriz de conhecimento de Roleplay. Eu sei te explicar absolutamente tudo sobre **Regras Civis (VDM, RDM, Meta, Powergaming, Combat Log, Amor à vida)**, **Mecânicas da Cidade (rotas do ilegal, empregos, VIPs, recrutamento PM/SAMU)**, **horas** ou bater um **papo casual**! O que você gostaria de aprender agora? 🧠",

            "Essa frase aí eu ainda estou processando os dados e cruzando os termos para aprender a responder de forma contextualizada. Se for sobre **diretrizes administrativas**, **denúncias** ou **central de atendimento de tickets**, me avisa que eu te guio para o canal correto no mesmo segundo!",

            "Minha mente local independente está expandindo o vocabulário sobre esse assunto cotidiano! Tente me perguntar as leis de sobrevivência do servidor ou onde fica a nossa central de suporte privado."
        ];

        return fallbacksLinguisticos[
            Math.floor(Math.random() * fallbacksLinguisticos.length)
        ];
    }
}

const processadorNeural = new MotorInteligenciaArtificialMonumental();

module.exports = {
    async executarIAAutonoma(message) {
        const textoCompleto = message.content;
        const pergunta = textoCompleto
            .slice('!ia'.length)
            .trim();

        // Se o morador digitar apenas "!ia"
        if (!pergunta) {
            const embedApresentacao = new EmbedBuilder()
                .setTitle('🧱 Central GUETO HELP — Inteligência Artificial Monumental')
                .setDescription(
                    `Olá ${message.author}! Eu sou o motor de IA **100% Local e Autônomo** de suporte do Gueto RP. 🙋‍♂️\n\n` +

                    `Fui desenvolvida com algoritmos avançados de Processamento de Linguagem Natural (NLP). Eu **decifro o sentido real das suas frases por peso semântico de tokens**, processando contextos complexos de Roleplay sem precisar de chaves e livre de travas externas!\n\n` +

                    `⚙️ **MINHAS MATRIZES OPERACIONAIS DE CONHECIMENTO:**\n` +

                    `┃ 📖 **Diretrizes Civis:** Explico regras como \`VDM\`, \`RDM\`, \`Meta\`, \`Powergaming\`, \`Combat Log\` e \`Amor à vida\`.\n` +

                    `┃ 💼 **Economia e Sistemas:** Informo tudo sobre rotas do ilegal, empregos legais, doações VIP e recrutamentos.\n` +

                    `┃ 🎫 **Gerenciador de Suporte:** Indico e direciono a abertura de chamados privados diretamente para a Staff.\n` +

                    `┃ 🎙️ **Módulo de Conversa:** Bato papo natural e tiro qualquer dúvida do servidor se usar \`!ia [pergunta]\`.\n\n` +

                    `💡 **Exemplos para testar meu cérebro robusto agora mesmo no canal:**\n` +

                    `> \`!ia mano como abre o ticket de suporte por favor?\`\n` +
                    `> \`!ia o que acontece se eu der alt f4 em uma ação de assalto?\`\n` +
                    `> \`!ia robô magnífico, me diz as horas da prefeitura aí?\``
                )
                .setColor('#2f3136')
                .setFooter({
                    text: 'Gueto Core NLP AI — Arquitetura de Aprendizado Local Ativa'
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

        // Processa a pergunta
        const respostaFinalIA =
            processadorNeural.analisarSentidoFrase(pergunta);

        // Retorna a resposta direta
        return message.reply({
            content: `🙋‍♂️ **Gueto AI:** ${respostaFinalIA}`
        });
    }
};