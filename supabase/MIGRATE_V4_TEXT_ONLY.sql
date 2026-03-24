-- V4: MIGRACAO ULTRA-LEVE (APENAS TEXTO)
INSERT INTO public.system_settings (id, key, value, updated_at) VALUES ('cbb0d8d0-3d5f-4c5a-99c7-c12bbf677051', 'ticker', '{"speed":30}', '2026-03-24T00:20:06.57795+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.breaking_news (id, text, active, created_at) VALUES ('60f13c07-e5e9-477b-b69c-e1e57cd60a8f', 'RDCongo – violação do cessar-fogo - Conflitos complexos exigem cautela na interpretação de notícias. Informações oficiais e verificadas devem orientar a compreensão dos acontecimentos no leste da RDCongo.', true, '2026-02-25T01:37:13.552747+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.breaking_news (id, text, active, created_at) VALUES ('b6ac1a97-51a7-4212-836b-0bc4e64a0e82', 'Bodo/Glimt choca Milão: O Bodo/Glimt confirma que, mesmo fora dos grandes centros do futebol europeu, estratégia e eficácia podem derrubar favoritos. Acompanhe os próximos confrontos e verifique sempre resultados oficiais antes de compartilhar notícias de desporto.', true, '2026-02-25T01:37:55.053943+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.breaking_news (id, text, active, created_at) VALUES ('f99d3c70-e43c-447a-918b-70ef21d5c5de', 'Falsos CAPTCHA: Mesmo elementos familiares da internet podem ser armadilhas. Sempre verifique URLs e instruções antes de seguir comandos. A segurança online depende da atenção de cada utilizador.', true, '2026-02-25T01:38:19.707564+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.breaking_news (id, text, active, created_at) VALUES ('fa5e5bd1-5331-415e-a357-ec31f0d35200', 'Sociedade: Os números do INE refletem apenas a população residente e são fundamentais para planeamento urbano e políticas públicas. Crescimento rápido das cidades exige atenção à infraestrutura, habitação e serviços básicos.', true, '2026-02-25T02:12:39.782097+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.breaking_news (id, text, active, created_at) VALUES ('f9142d9d-8e93-49fa-99dd-c9cf0c31db0d', 'A condecoração de hoje reforça o reconhecimento institucional pelos serviços prestados à segurança pública em Angola, especialmente no quadro das comemorações dos 50 anos da Polícia Nacional. O gesto tem peso simbólico para a corporação e para a promoção da carreira policial, num contexto em que segurança interna continua no centro da agenda pública.', true, '2026-02-25T07:30:17.502383+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.opinion_articles (id, title, author, avatar_url, summary, content, published, created_at, updated_at) VALUES ('4cbefbbb-fd70-4c8a-8562-a3d8d3b7bea0', 'Questões profundas sobre o estado da liberdade de imprensa e da protecção de dados em Angola.', 'Álvaro Muenhu Yanga Xito', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'O alegado caso de espionagem denunciado pela UNITA contra o jornalista Teixeira Cândido evidencia riscos sérios para a liberdade de imprensa em Angola. Mais do que identificar culpados de imediato, torna-se essencial garantir uma investigação independente, transparente e credível, capaz de proteger jornalistas e reforçar a confiança nas instituições.', 'Na minha opinião, independentemente de quem esteja por trás da eventual vigilância, o simples facto de existir suspeita credível de uso de spyware contra um jornalista é preocupante. Jornalistas desempenham um papel essencial numa democracia: fiscalizar o poder, expor irregularidades e garantir que a sociedade tenha acesso à informação. Quando há sinais de vigilância digital, cria-se um clima de intimidação que pode afectar não apenas um profissional, mas toda a classe.

Outro ponto crítico é a transparência institucional. Casos desta natureza exigem investigações rápidas, técnicas e independentes. Sem esclarecimento público, aumentam a desconfiança nas instituições e fortalece-se a percepção de que ferramentas tecnológicas podem estar a ser usadas para fins políticos.

Também é importante evitar conclusões precipitadas. A gravidade do tema exige provas sólidas, perícia forense credível e respeito pelo devido processo legal. Defender a liberdade de imprensa não significa assumir culpados antes da investigação — significa garantir que a verdade seja apurada.

Em síntese, este caso deve servir como alerta: Angola precisa reforçar mecanismos legais e técnicos de protecção contra vigilância abusiva, criar regras claras para o uso de tecnologias de intercepção e assegurar que jornalistas possam trabalhar sem medo. A forma como este episódio for investigado e esclarecido terá impacto directo na confiança pública e na qualidade da democracia.', true, '2026-02-21T16:18:34.386569+00:00', '2026-02-21T16:18:34.386569+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.opinion_articles (id, title, author, avatar_url, summary, content, published, created_at, updated_at) VALUES ('56ffd82b-159c-4774-be84-c36de7f323a8', 'Economia de Angola: entre sinais de recuperação e desafios estruturais persistentes', 'Cláudio Segunda | Produtor de conteúdos | Economista | Mestrando em Finanças Públicas | Consultor financeiro', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'A economia de Angola vive hoje um momento de transição delicada. Nos últimos anos, registaram-se sinais claros de recuperação macroeconómica, impulsionados sobretudo pela estabilização cambial, maior disciplina fiscal e algum controlo da inflação. No entanto, estes avanços continuam longe de se traduzir em melhorias consistentes no dia a dia da maioria dos cidadãos.', 'A forte dependência do petróleo permanece como o principal calcanhar de Aquiles do país. Sempre que o preço do crude sobe, a economia respira; quando cai, o impacto sente-se de forma quase imediata nas contas públicas, no investimento e no emprego. Apesar do discurso recorrente sobre diversificação económica, os resultados práticos ainda são limitados. Agricultura, indústria transformadora e turismo continuam subaproveitados face ao potencial real que o país possui.

Outro ponto crítico é o custo de vida. Mesmo com alguma desaceleração da inflação, os preços dos bens essenciais permanecem elevados, pressionando famílias de rendimentos baixos e médios. O crescimento económico, quando existe, é muitas vezes percebido como distante, técnico e concentrado em indicadores macro, sem reflexo direto no poder de compra ou na criação de emprego sustentável.

Há também um desafio estrutural ligado ao ambiente de negócios. Embora reformas tenham sido anunciadas para atrair investimento privado e estrangeiro, persistem entraves como burocracia excessiva, dificuldades no acesso ao crédito e insegurança jurídica percebida por empresários nacionais e internacionais. Sem um setor privado forte, dinâmico e confiante, a economia dificilmente ganhará tração de longo prazo.

Por outro lado, é justo reconhecer avanços. A maior transparência nas contas públicas, o esforço de consolidação fiscal e a aposta gradual na digitalização de serviços do Estado representam passos na direção certa. O desafio está em garantir que estas reformas não fiquem confinadas aos relatórios oficiais, mas tenham impacto real na produção, no emprego e na renda das famílias.

Em síntese, a economia angolana encontra-se num ponto intermédio: já não está na crise profunda de anos anteriores, mas ainda longe de um crescimento inclusivo e sustentável. O futuro dependerá menos de choques externos favoráveis e mais da capacidade interna de diversificar a economia, fortalecer instituições e colocar o cidadão no centro das políticas económicas. Sem isso, a recuperação continuará a ser estatística — e não social.', true, '2026-02-25T19:14:22.090439+00:00', '2026-02-25T19:14:22.090439+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.opinion_articles (id, title, author, avatar_url, summary, content, published, created_at, updated_at) VALUES ('1f6c0ebc-889d-4901-8c24-3438b11bf9bb', 'Guerra no Médio Oriente: oportunidades e riscos para África e Angola', 'Ivan Lima', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'A escalada do conflito no Médio Oriente, com ataques iranianos contra bases dos EUA e retaliações em Israel e países do Golfo, não é um fenómeno isolado. Embora distante geograficamente de África, os efeitos desta guerra chegam ao continente de forma directa e indirecta, afectando economias, segurança e política internacional.', 'Vantagens potenciais para África e Angola:

Preços do petróleo e energia: Angola, enquanto produtor de petróleo, pode beneficiar de aumentos nos preços internacionais de crude provocados pela instabilidade no Golfo. Esse efeito pode gerar receitas extras para o Orçamento Geral do Estado, desde que o país consiga manter a produção estável.

Revisão de alianças diplomáticas: Conflitos de grande escala geram uma redistribuição do poder internacional. Angola pode aproveitar o momento para reforçar relações com países fora da órbita directa dos EUA e do Irã, diversificando parcerias económicas e estratégicas.

Investimentos em segurança e defesa: A percepção global de instabilidade tende a aumentar o interesse por cooperação em segurança. Angola pode negociar transferências de tecnologia militar e capacitação das suas forças armadas, fortalecendo a soberania nacional.

Desvantagens e riscos significativos:

Volatilidade económica: A alta nos preços do petróleo pode gerar lucros temporários, mas também aumenta o custo de bens importados e afecta a inflação local. Angola, com a sua economia ainda dependente de importações, pode sofrer impactos directos no custo de vida da população.

Instabilidade geopolítica global: A guerra no Médio Oriente pode criar crises alimentares e financeiras internacionais, afectando África. Países como Angola, que importam cereais e outros produtos estratégicos, podem enfrentar escassez ou aumento de preços.

Risco de envolvimento indirecto: Embora Angola não esteja directamente envolvida, pressões políticas internacionais podem exigir posicionamentos ou alianças que limitam a autonomia do país. Além disso, empresas e cidadãos angolanos no exterior podem ser afectados por evacuações e insegurança.

Conclusão:
Para Angola, a guerra no Médio Oriente é um alerta sobre a vulnerabilidade global das economias africanas. É uma oportunidade para reforçar a diplomacia, diversificar parceiros e proteger sectores estratégicos, mas também é um risco concreto para a estabilidade económica e social do país. A chave será equilíbrio: aproveitar os efeitos positivos de curto prazo sem se expor às consequências negativas da escalada militar global.', true, '2026-03-02T14:01:12.822165+00:00', '2026-03-02T14:01:12.822165+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('08ba738f-77a0-4acd-9f42-fb6fe24d8b40', 'México fica às escuras! Forças Especiais derrubam chefão do cartel', 'México fica às escuras! Forças Especiais derrubam chefão do cartel', 'https://www.youtube.com/watch?v=5hGixxn336U', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '15:59', 'Vídeo', 7233, true, '2026-02-24T18:10:26.821977+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('5f9526bd-c897-493f-91df-f5859ea7c901', 'Guerra no Oriente Médio: vídeo mostra míssil iraniano atingindo base dos EUA no Bahrein', 'Um vídeo divulgado neste sábado, 28, mostra o exato momento em que um míssil lançado pelo Irã atingiu uma instalação da Marinha dos Estados Unidos no Bahrein. O ataque é parte da retaliação da Guarda Revolucionária Iraniana aos recentes ataques coordenados de Israel.

Bases militares norte-americanas no Golfo têm sido alvo de ataques iranianos desde o início da ofensiva dos EUA na região. Mais cedo, o ex-presidente Donald Trump justificou a ação, afirmando que o Irã “nunca poderá ter armas nucleares”, após múltiplas rodadas de negociações frustradas.

A escalada do conflito aumenta significativamente a tensão no Médio Oriente, com riscos crescentes para a estabilidade regional e global.', 'https://www.youtube.com/watch?v=nAGyiRTEBOE', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '0:55', 'Vídeo', 5644, true, '2026-03-02T13:48:27.41478+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('16201738-a329-4c1a-b79a-821ccb825e06', 'Novo líder do Irã promete endurecer confronto e desafiar presença dos EUA no Oriente Médio', 'Em entrevista, o líder religioso Hossein Khaliloo comentou a escolha do sucessor de Ali Khamenei pela Assembleia de Especialistas. Segundo ele, o novo líder é jovem, próximo da Guarda Revolucionária Islâmica e deve manter a linha dura contra Estados Unidos e aliados. Khaliloo afirmou que a morte do antigo líder não enfraqueceu o regime e que o apoio popular fortalece a revolução iraniana. Ele também disse que a resistência regional tende a se intensificar no Oriente Médio. Sobre armas nucleares, afirmou que o uso é proibido pela doutrina islâmica, mas a decisão sobre desenvolver esse tipo de tecnologia dependerá do novo líder', 'https://youtu.be/dWe6UorWhXg?t=55', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '8:51', 'Vídeo', 3926, true, '2026-03-09T19:34:12.581591+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('dfd81621-5ba7-4d4e-b36e-b17f973a287d', 'PROCESSO DE EXPULSÃO DO VALDIR DO MPLA ESTÁ VAIADO DE VÍCIOS, É INCONSTITUCIONAL', 'A controvérsia em torno da expulsão de Valdir ganhou força após surgirem alegações de que o procedimento foi conduzido sem respeito pelas regras estatutárias e pelos direitos fundamentais do militante. Entre os principais pontos levantados estão a ausência de contraditório efetivo, falhas na notificação, prazos irregulares e decisões tomadas por instâncias cuja competência é questionada.

Juristas ouvidos informalmente apontam que, a confirmar-se, tais falhas configuram vícios insanáveis, capazes de tornar o ato nulo. Para além do plano interno do partido, o caso levanta dúvidas de compatibilidade com a Constituição, sobretudo no que toca ao direito de defesa, à legalidade dos atos e à proporcionalidade das sanções.

No plano político, críticos argumentam que o processo reflete uma tendência de centralização disciplinar e de punição exemplar, enquanto defensores da decisão sustentam a necessidade de preservar a coesão e a disciplina partidária. O choque entre estas leituras expõe uma tensão antiga: até onde vai a autonomia partidária e onde começam os limites impostos pelo Estado de Direito?

Sem um esclarecimento público detalhado sobre os fundamentos, a instrução e a legalidade do processo, a decisão corre o risco de fragilizar a credibilidade interna e de abrir precedentes perigosos. A questão central permanece: disciplina pode justificar atropelos procedimentais?

Sem filtros, o caso de Valdir coloca o MPLA perante um teste sensível — não apenas político, mas também jurídico — num momento em que a exigência por transparência e respeito às regras é cada vez maior.', 'https://www.youtube.com/watch?v=e2DNuPwHL0I', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '6:45', 'Vídeo', 7089, true, '2026-02-23T21:14:48.608966+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('88c38c33-10bb-4670-b809-242cd95e7cf9', 'CUBA VAI CAIR? Trump ''antecipa'' fim do comunismo na ilha caribenha: ''Muito em breve''', 'O presidente dos EUA, Donald Trump, afirmou recentemente que o governo comunista de Cuba pode “cair muito em breve”, mas isso é uma previsão política dele, não significa que o regime vá realmente acabar imediatamente.

O que Trump disse

Trump declarou em entrevista que “Cuba vai cair muito em breve” e que o governo cubano estaria interessado em negociar com os EUA.

Ele disse que pretende colocar o secretário de Estado Marco Rubio para conduzir possíveis negociações.

Segundo Trump, o regime estaria fraco por causa da crise econômica e da pressão internacional.

O que está acontecendo em Cuba agora

Há realmente uma crise forte na ilha:

Falta de combustível e apagões de energia.

Escassez de comida, medicamentos e combustível.

Pressão dos EUA com sanções e bloqueio de petróleo.

Essa situação aumentou depois que os EUA cortaram fontes de petróleo que vinham principalmente da Venezuela.

Mas o comunismo vai acabar mesmo?

Ninguém sabe. Existem três cenários possíveis:

1️⃣ Negociação com os EUA e reformas económicas (tipo Vietname ou China).
2️⃣ Mudança política interna se a crise piorar e houver grandes protestos.
3️⃣ O regime continuar, como já aconteceu muitas vezes nas últimas décadas.

Cuba é governada pelo Partido Comunista desde a revolução liderada por Fidel Castro em 1959, e já resistiu a várias crises e pressões externas.

✅ Conclusão:
Trump acredita que o regime pode cair em breve, mas isso é uma previsão política. A realidade é que Cuba está numa crise grave, mas não há confirmação de que o comunismo vá acabar imediatamente.', 'https://www.youtube.com/watch?v=cLkMiZnm7qc', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '8:46', 'Vídeo', 3777, true, '2026-03-09T19:54:52.40999+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('4d4f68db-e765-41d1-a5f9-e280190cafd5', 'Cortes Milionários no Parlamento (Estratégia ou Crise?)', 'O governo decidiu reduzir despesas ligadas ao parlamento, incluindo benefícios, viagens e custos institucionais. Mas o verdadeiro debate vai além da política: o que estes cortes revelam sobre a economia do país?
Neste vídeo fazemos uma análise clara e objetiva para entender se estamos perante uma medida de responsabilidade financeira ou um sinal de pressão económica mais profunda.
📊 Neste vídeo você vai entender:
✅ por que governos fazem cortes orçamentais
✅ o impacto dos cortes públicos na economia nacional
✅ como decisões políticas influenciam empresas e cidadãos
✅ o que investidores observam quando o Estado reduz despesas
✅ possíveis consequências económicas nos próximos anos
Este conteúdo é educativo e focado em economia, finanças públicas e análise política, ajudando a compreender os sinais económicos que muitas vezes passam despercebidos nas notícias.

👉 Na sua opinião: estes cortes mostram controlo financeiro ou indicam dificuldades económicas? Deixe o seu comentário.', 'https://www.youtube.com/watch?v=Le-zmoH9fuQ', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '10:16', 'Vídeo', 6857, true, '2026-02-26T18:09:09.767345+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('5ffa1038-cedb-4746-9ce8-853d97e7c1a1', 'Espionagem ao jornalista angolano Teixeira Candido levanta questões sobre liberdade de imprensa', 'O aparelho terá sido infectado depois de Teixeira Candido ter clicado num link enviado através do WhatsApp, permitindo aos responsáveis pelo ataque acesso completo ao conteúdo do seu telemóvel. Este é considerado o primeiro caso confirmado do uso do spyware Predator em Angola.

Para analisar este caso e os riscos que representa para os jornalistas em Angola, recebemos hoje o próprio Teixeira Candido.', 'https://youtu.be/O-47YNZeIc0', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '10:19', 'Vídeo', 7185, true, '2026-02-21T16:37:25.804725+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('35ca0c1f-12a9-42c7-8ffc-cb11a5a11207', 'Implacável! Como os EUA Executaram a Operação que Eliminou ALI KHAMENEI', 'Este vídeo analisa detalhadamente a queda do regime de Khamenei no Irã e os eventos militares e geopolíticos que levaram à operação de 28 de fevereiro de 2026. Entenda os bastidores da inteligência que localizou o Líder Supremo e as consequências econômicas imediatas para o mundo.', 'https://www.youtube.com/watch?v=GJQz7jFChCU', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '15:02', 'Vídeo', 5230, true, '2026-03-04T19:30:00.654145+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('7245513c-9c9a-4358-b23f-36cffeb8160a', 'A LEI É PARA SER CUMPRIDA, ELA NÃO É DECORATIVA. TC FAÇA JUSTIÇA', 'A lei existe para ser cumprida. Não é ornamento institucional, nem instrumento seletivo aplicado conforme conveniências políticas. Quando decisões são tomadas à margem dos procedimentos legais, o problema deixa de ser apenas interno e passa a ser estrutural.

Nos últimos dias, crescem as vozes que defendem que o Tribunal Constitucional deve intervir para repor a legalidade, face a processos contestados por vícios graves, atropelos ao direito de defesa e possíveis violações constitucionais. Para muitos juristas e observadores, o silêncio ou a inação judicial apenas reforçam a perceção de impunidade.

Num Estado de Direito, a justiça não pode funcionar como extensão de interesses partidários. A Constituição impõe limites claros, inclusive às organizações políticas, e exige que qualquer sanção respeite princípios como legalidade, proporcionalidade e contraditório. Quando estes pilares são ignorados, a justiça deixa de ser justiça — transforma-se em formalidade vazia.

O momento é decisivo. Ao Tribunal Constitucional cabe demonstrar que a lei vale para todos, sem exceção, e que o poder encontra travão na norma jurídica. Não se trata de proteger indivíduos ou estruturas, mas de preservar a credibilidade do próprio sistema.

Sem filtros, a exigência é simples e direta: a lei não é decorativa. Cabe ao Tribunal Constitucional fazer justiça — ou assumir o peso da omissão.', 'https://www.youtube.com/watch?v=nU0jS31cznc', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '6:16', 'Vídeo', 7144, true, '2026-02-23T21:17:06.337884+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('54bfee36-426c-4136-aff8-a74b9c8ae3a0', 'CARLOS CABAÇA HUMILHA MÁRIO ARAGÃO APÓS O MESMO TENTAR DEFENDER JOÃO LOURENÇO', 'O momento ocorreu num debate acalorado, onde Aragão procurou defender políticas e ações atribuídas ao chefe de Estado, tentando contextualizar algumas medidas que têm gerado críticas na sociedade. Cabaça, conhecido pelo seu estilo incisivo, não poupou comentários, evidenciando falhas nos argumentos apresentados e questionando a coerência das justificativas.

O confronto, além de pessoal, reflete tensões mais amplas dentro do cenário político, com figuras de destaque a debater não apenas políticas públicas, mas também legitimidade, lealdade partidária e eficácia das decisões governamentais. Para observadores, o episódio é um reflexo da dificuldade de conciliar defesa de lideranças com análise crítica e independente.

Sem filtros, a cena serve como um alerta: mesmo dentro de estruturas partidárias e de governo, o espaço para confrontos diretos e transparentes existe, e a capacidade de argumentar é testada constantemente — especialmente quando se toca em temas sensíveis ligados ao poder e à reputação do Presidente da República.', 'https://www.youtube.com/watch?v=yjuRvkNe7Es', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '19:58', 'Vídeo', 7042, true, '2026-02-23T21:19:33.834292+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('86739920-1ff9-4c87-a5fa-e40f7b304dfc', 'PRINCIPAIS DESTAQUES NOTICIOSOS DE 25 DE FEVEREIRO DE 2026 (CIPRA)', 'Visite o Canal oficial do CIPRA (Centro de Imprensa da Presidência da República de Angola)', 'https://www.youtube.com/watch?v=tty5RBxBojk', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '4:58', 'Vídeo', 6737, true, '2026-02-26T18:16:06.642883+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('22d8793c-183c-49f6-bd28-c2f8b8366f36', 'CNN BRASIL', 'Assista AO VIVO ao CNN 360° desta quarta-feira, 04 de março de 2026. #CNNBrasil', 'https://www.youtube.com/watch?v=Qumafxs_gAE', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '00:00', 'Vídeo', 5188, true, '2026-03-04T19:46:12.81399+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('28185966-6120-423f-b649-9a364ece9b53', 'O discurso do novo Presidente na íntegra "Trago-vos uma palavra de esperança: acreditem em Portugal".', 'António José Seguro já tomou posse como Presidente da República. No Parlamento, o sucessor de Marcelo Rebelo de Sousa falou da nova ordem mundial e do desrespeito pelo direito internacional, apresentando a Europa como solução. Exigiu compromissos entre partidos para que país seja "viável" e prometeu ser o "Presidente de Portugal inteiro." E deixou uma mensagem: "acreditem em Portugal".', 'https://www.youtube.com/watch?v=S5QHjYRfAPo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '24:11', 'Vídeo', 3665, true, '2026-03-10T08:04:46.305009+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.video_news (id, title, description, video_url, thumbnail_url, duration, category, views, published, created_at, updated_at) VALUES ('8efe9327-9d56-4288-9b31-de40111abe44', 'Preocupação do FMI com a dívida na África Subsaariana', 'O FMI e as próprias autoridades africanas têm repetidamente destacado que uma grande parte dos países da África Subsaariana enfrenta níveis elevados de dívida pública, que limitam a capacidade de financiamento de serviços essenciais e investimentos produtivos. De facto, um relatório recente do próprio Fundo mostra que vários países da região estão em risco elevado de incumprimento ou já em dificuldade de pagamento devido à elevada dívida acumulada, resultado de choques sucessivos (pandemia, choques de preços, fraca receita fiscal e custos de financiamento altos).

Georgieva: “Reduzir dívida é fundamental para crescimento sustentável”

Em diversas intervenções públicas — incluindo encontros com governos e sociedade civil — Kristalina Georgieva tem sublinhado que níveis elevados de dívida estagnam o crescimento económico e reduzem o espaço fiscal para responder a choques ou financiar prioridades sociais como saúde, educação e infra-estruturas. Ela tem apelado a que os países implementem reformas para reduzir a dívida e reforçar a resiliência económica.', 'https://hlsvod.dw.com/i/Events/mp4/vdt_pt/2020/bpor200219_006_kristalina_01g_,sd,hd,.mp4.csmil/master.m3u8', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', '1:28', 'Vídeo', 7143, true, '2026-02-24T11:57:48.861191+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('d79a7312-535e-4c77-ab01-b2c32c15b0dd', 'Tribunal Constitucional prepara eleições com milhões para carros e tecnologia', 'O Tribunal Constitucional prevê gastar mais de 6 mil milhões de Kwanzas em viaturas e sistemas tecnológicos ligados ao processo eleitoral de 2027. A maior parte do valor será usada para compra de veículos, enquanto outra parcela será aplicada na modernização de sistemas digitais e mecanismos de controlo eleitoral.', 'O Plano Anual de Contratação Pública (PAC) do Tribunal Constitucional indica que 3,8 mil milhões de Kwanzas estão reservados para a aquisição de viaturas destinadas ao apoio logístico do processo eleitoral. O documento, contudo, não revela quantos veículos serão comprados, nem quais estruturas concretas irão beneficiar da nova frota.

Outro montante de 2,4 mil milhões de Kwanzas será aplicado na compra e actualização de sistemas eleitorais e de processamento de dados. Entre os investimentos previstos estão a certificação do Centro de Processamento de Dados, a actualização dos sistemas de gestão eleitoral e a introdução de ferramentas de inteligência artificial para detecção de fraudes digitais.

O pacote tecnológico inclui ainda licenciamento de software especializado, auditorias de segurança e testes de intrusão aos sistemas informáticos. No total, estes dois projectos representam 67,4% dos 9,2 mil milhões de Kwanzas previstos no orçamento anual do Tribunal Constitucional, que também inclui verbas para manutenção da frota automóvel e até quase 200 mil dólares para reparação de equipamentos do ginásio da instituição.

Análise – Angola Sem Filtros

Sempre que se aproximam eleições em Angola, surgem novos pacotes milionários de despesas públicas, muitas vezes apresentados como “modernização do processo eleitoral”. O problema é que, na prática, uma parte considerável dessas verbas acaba direccionada para aquisição de viaturas e serviços pouco claros, enquanto detalhes essenciais permanecem vagos.

A ausência de informação sobre quantos carros serão comprados, quem os vai usar e qual a necessidade real da nova frota levanta dúvidas legítimas sobre prioridades. Num país onde grande parte da administração pública enfrenta falta de meios básicos, a compra de mais viaturas institucionais dificilmente passará despercebida aos olhos dos contribuintes.

Quanto à tecnologia eleitoral, a introdução de inteligência artificial e sistemas avançados de controlo pode parecer um passo moderno. Porém, a história recente mostra que a credibilidade das eleições em Angola não depende apenas da tecnologia, mas sobretudo da confiança nas instituições que organizam e supervisionam o processo.

No fim das contas, a questão central permanece: mais tecnologia e mais carros significam realmente eleições mais transparentes ou apenas mais despesas num sistema onde a confiança pública continua frágil?', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 2205, '2026-03-16T06:56:06.821661+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('dfe3157f-233a-4842-86c5-6aa4672d315e', 'Autoridades tradicionais acusam Governo de fornecer apenas arroz branco como merenda escolar no Huambo', 'Autoridades tradicionais e moradores da aldeia de Ngulawa, na comuna da Calima, província do Huambo, acusam o Governo de garantir às crianças merenda escolar limitada a arroz branco e papa de milho, numa realidade marcada por escolas degradadas, falta de água potável e serviços de saúde precários.', 'Escola sem cobertura e crianças em condições degradantes

As denúncias foram feitas na última semana, durante uma visita do secretário provincial do PRS ao local. Segundo o soba da aldeia, a escola funciona sem cobertura desde Novembro de 2024, após fortes chuvas acompanhadas de ventos que destruíram as chapas do edifício.

“Temos alertado a Administração da Calima várias vezes, mas até agora só recebemos promessas”, lamentou a autoridade tradicional.

Além da degradação estrutural, o director pedagógico da escola denunciou a falta de carteiras, quadros, livros e uma merenda escolar condigna, sublinhando que várias delegações governamentais já visitaram a aldeia sem apresentar soluções concretas.

Água vandalizada, saúde limitada e agricultura sem apoio

Outro problema grave apontado pela comunidade é a inoperância do chafariz local, vandalizado há cerca de quatro anos. A placa solar do sistema foi roubada pouco tempo após a inauguração, havendo suspeitas de envolvimento de técnicos ligados à montagem da infra-estrutura.

No sector da saúde, o posto médico funciona apenas durante o dia.

“As doenças não escolhem hora. Precisamos de atendimento à noite e aos fins-de-semana”, alertou o soba.

A população queixa-se ainda da escassez de fertilizantes e sementes agrícolas, apesar de promessas feitas pelo Executivo.

“Precisamos de sementes a preços acessíveis para produzir alimentos e sustentar as nossas famílias”, reforçou a autoridade tradicional.

PRS promete encaminhar queixas

O secretário provincial do PRS no Huambo, Soliya Selende Lumumba, registou as preocupações e garantiu que serão encaminhadas ao Governo Provincial do Huambo.

“É gravíssimo que uma escola esteja há mais de dois anos nestas condições sem solução”, afirmou, manifestando também preocupação com a vandalização de bens públicos e apelando à comunidade para a preservação das infra-estruturas existentes.

Durante a visita, o responsável político destacou ainda os trabalhos de terraplanagem da estrada Huambo–Ngandavila, considerando que a empresa responsável tem executado correctamente as valas de drenagem.

A deslocação enquadra-se nas acções de auscultação comunitária promovidas pelo PRS sob o lema “Paz, Democracia e Progresso”.

Rodapé Editorial — Angola Sem Filtros

Quando a merenda escolar se resume a arroz branco e papa de milho, o problema já não é apenas nutricional — é político e estrutural. As denúncias feitas no Huambo revelam um Estado ausente nas zonas rurais, onde promessas substituem soluções e as crianças continuam a estudar em condições indignas.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 6579, '2026-02-27T09:26:37.411167+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('f5c9c1fd-02dc-43aa-8b3d-7e76e2aa9894', 'Nova morte em Cabo Ledo reacende alerta sobre estrada marcada por tragédias', 'A EN-100, na zona de Cabo Ledo, registou mais um acidente mortal em menos de dois dias, aumentando a preocupação com a recorrência de tragédias naquele troço.', 'A Estrada Nacional 100 (EN-100), na zona do Cabo Ledo, província do Icolo e Bengo, voltou a ser palco de um grave acidente de viação na tarde desta terça-feira (17), envolvendo um camião contentorizado que perdeu o controlo e capotou fora da via.

De acordo com informações divulgadas pela Televisão Pública de Angola, o sinistro resultou na morte de uma pessoa, confirmada no local pelas autoridades, reacendendo o alerta sobre a perigosidade daquele troço rodoviário.

As causas do acidente ainda não foram oficialmente determinadas, mas apontam-se hipóteses como excesso de velocidade, falha mecânica ou más condições da estrada. O caso surge dias depois de outro acidente grave na mesma via, envolvendo um autocarro da Macon, que provocou várias vítimas mortais e feridos encaminhados para unidades hospitalares em Luanda e no Zango.

Análise – Angola Sem Filtros

Quando acidentes graves acontecem na mesma estrada em menos de 48 horas, deixa de ser coincidência — passa a ser padrão.

A EN-100, especialmente no troço de Cabo Ledo, há muito deixou de ser apenas uma via:
é um ponto recorrente de tragédias.

Mesmo admitindo factores imprevisíveis, há sinais que não podem ser ignorados:

frequência elevada de acidentes

veículos pesados envolvidos

relatos constantes de excesso de velocidade e falhas técnicas

A questão já não é “o que aconteceu neste acidente”, mas sim:
porque continua a acontecer tantas vezes no mesmo lugar?

Sem respostas concretas e medidas visíveis, o país arrisca-se a normalizar o inaceitável:
morrer na estrada como rotina.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 1494, '2026-03-18T17:39:23.172193+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('33826ba9-7633-4ecc-b43f-8d7d699aa394', 'Homem morto a tiro depois de invadir residência de Donald Trump em Mar-a-Lago, na Flórida', 'Austin Tucker Martin tinha 20 anos, era natural do estado da Carolina do Norte e tinha sido dado como desaparecido pela família. Porta-voz da Casa Branca fala de "um indivíduo desequilibrado".', 'Um homem foi morto a tiro este domingo, 22 de fevereiro,, depois de ter entrado no perímetro de segurança da residência do presidente norte-americano Donald Trump, em Mar-a-Lago, na Florida.

De acordo com os serviços secretos dos Estados Unidos, o homem foi “visto a entrar pelo portão norte da propriedade de Mar-a-Lago, a carregar o que parecia ser uma espingarda e um bidão de combustível”.

O incidente ocorreu às 1h30 (6h00 em Lisboa), tendo o homem sido abatido a tiro por agentes dos serviços secretos e por um delegado do xerife do condado de Palm Beach.

Embora Donald Trump costume passar os fins de semana com a primeira-dama, Melania Trump, em Mar-a-Lago, desta vez, no momento em que decorreu este incidente, encontrava-se na Casa Branca, em Washington D. C., revelou a agência de notícias Associated Press (AP).

O suspeito, que tinha cerca de 20 anos e era natural do estado da Carolina do Norte, foi dado como desaparecido há alguns dias pela família, adiantou a mesma agência. Os investigadores disseram acreditar que o homem deixou a Carolina do Norte e dirigiu-se para sudeste, adquirindo uma espingarda pelo caminho, disse o porta-voz dos serviços secretos, Anthony Guglielmi. A caixa da arma foi encontrada no veículo, adiantou o mesmo responsável.

O homem, identificado com o nome de Austin Tucker Martin, conseguiu passar pelo portão norte da propriedade de Mar-a-Lago quando outro veículo estava a sair e foi confrontado por agentes dos serviços secretos, tendo sido morto a tiro, sublinhou Guglielmi.

Numa publicação na rede social X, a porta-voz da Casa Branca, Karoline Leavitt, confirmou o ataque “enquanto a maioria dos americanos dormia”, enaltecendo que os Serviços Secretos dos Estados Unidos agiram com rapidez e decisão para neutralizar um indivíduo desequilibrado, armado com uma pistola e gás lacrimogéneo, que invadiu a residência do presidente Trump”, escreveu.

Pam Bondi, procuradora-geral dos Estados Unidos, revelou também no X que esteve em contato com o presidente Trump na sequência do incidente, ao mesmo tempo que esteve em “coordenação com os parceiros federais durante toda a manhã em relação à invasão e ao tiroteio em Mar-a-Lago”. Nessa publicação mostrou-se “grata” pelo facto de Trump e os agentes da lei “estarem seguros”.

Por sua vez, Kash Patel, diretor do FBI, garantiu que a sua agência iria dedicar “todos os recursos necessários” à investigação sobre este caso. E a verdade é na tarde deste domingo, vários veículos bloquearam a entrada de uma propriedade em Cameron, no estado da Carolina do Norte, que consta dos registos públicos como sendo o endereço do suspeito baleado em Mar-a-Lago.

A propriedade, segundo a AP, fica no final de uma estrada particular acidentada e arenosa, rodeada por casas modestas e cercadas por pinheiros. ', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 7088, '2026-02-23T19:47:40.171064+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('8c9c3f8c-be42-4f85-8efd-313ce6a93ce6', 'Armas de guerra retiradas de empresas de segurança passam agora para as Forças Armadas Angolanas', 'O processo de recolha de armas de guerra em empresas privadas de segurança em Angola está concluído. Mais de 40 mil armas, incluindo metralhadoras, pistolas e caçadeiras, foram retiradas, em grande parte de forma coerciva, e passam agora para as Forças Armadas Angolanas. As empresas privadas estão proibidas de adquirir ou usar armamento de guerra para auto-protecção.', 'As armas de guerra que estavam na posse das empresas privadas de segurança e os sistemas de auto-protecção recolhidos pela Polícia Nacional incluem sobretudo metralhadoras AKM, PKM, GALILI, Mini Uzi, pistolas e caçadeiras.

A província de Luanda concentrou o maior número de recolhas, com mais de 22 mil armas, muitas vezes feitas de forma coerciva. Seguem-se as províncias de Benguela e Lunda-Norte.

O processo de substituição das armas de guerra ocorreu em duas fases:

Entrega voluntária: 2023/2024

Recolha coerciva: 2025 até à presente data

A Polícia Nacional afirma também manter controlo estatístico sobre as empresas de segurança privada, que possuem mais de 180 mil efectivos.

Das mais de 40 mil armas de guerra recolhidas a nível nacional, mais de 36 mil estavam na posse das empresas privadas ou eram armas de auto-protecção. O restante foi recolhido na fase piloto, antes de 2021.

Entre outubro de 2023 e fevereiro de 2026, a PN recolheu 100% das armas de guerra das empresas privadas, além de mais de 35 mil carregadores e 199 mil munições. A maior parte das recolhas ocorreu por via coerciva, segundo a polícia.

Conforme a PN, todo o armamento de guerra recolhido será agora entregue às Forças Armadas Angolanas (FAA).

Deste modo, as empresas privadas de segurança estão expressamente proibidas de adquirir ou utilizar armas de guerra, incluindo para auto-protecção.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 7274, '2026-02-23T20:18:16.366817+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('3cffc995-b7a3-4a22-bcba-a7d6868d4c42', 'UNITA denuncia espionagem a jornalista angolano Teixeira Cândido', 'Notícia adaptada sobre UNITA denuncia espionagem a jornalista angolano Teixeira Cândido.', 'A UNITA denunciou hoje a alegada espionagem ao jornalista angolano Teixeira Cândido, utilizando ferramentas de vigilância avançadas. O partido exige uma investigação profunda por parte do Ministério Público para apurar as responsabilidades e proteger a liberdade de imprensa no país.

Investigações técnicas indicaram que o telefone do jornalista foi infectado em 2024 através de links maliciosos enviados por mensagem, permitindo acesso a chamadas, mensagens, ficheiros e até ao microfone e câmara do dispositivo.
Organizações como a Amnistia Internacional confirmaram vestígios forenses da utilização do spyware, sendo este o primeiro caso publicamente documentado em Angola.

⚖️ Reacções e próximos passos

Teixeira Cândido anunciou que pretende apresentar participação à Procuradoria-Geral da República para que seja aberta uma investigação e identificados os responsáveis.
A UNITA classificou a situação como “espionagem escandalosa” e pediu responsabilização dos envolvidos, defendendo que o caso representa um risco para a liberdade de imprensa no país.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 7172, '2026-02-21T16:11:11.969467+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('4e7ece34-d2b7-4a66-a051-7a9293ebec4c', 'Foto de avião em chamas no Aeroporto de Guadalajara foi manipulada para amplificar o pânico após morte de El Mencho', 'Circula nas redes sociais uma imagem que mostra um avião em chamas supostamente no Aeroporto Internacional de Guadalajara, associada à onda de violência que se seguiu à morte do narcotraficante Nemesio Oseguera Cervantes (El Mencho). A imagem é falsa. Foi manipulada digitalmente e não representa um ataque real ao terminal.', 'O que é facto

Houve operação militar que resultou na morte de El Mencho, líder do Cartel Jalisco Nova Geração.

Seguiu-se violência real em vários estados: confrontos, bloqueios, incêndios e pânico em espaços públicos.

O aeroporto registou tensão e correria, mas nenhuma aeronave foi incendiada no local.

O que é falso

A fotografia de um avião em chamas dentro do aeroporto.

A legenda que afirma “ataque de cartel ao aeroporto” não tem lastro factual.

Como se fabrica a mentira

A imagem viral foi empurrada com texto alarmista sobreposto — técnica clássica para dar “contexto” falso a um visual impactante. Submetida a ferramentas de detecção, o resultado é consistente: alta probabilidade de geração por IA/edição digital. O truque é simples: um evento real serve de pano de fundo para prova visual inventada.

Desmentidos oficiais

O director do aeroporto, Martin Pablo Zazueta Chávez, confirmou que os acontecimentos não ocorreram dentro do perímetro do terminal.

O Governo de Jalisco classificou a imagem como falsa e alertou para a circulação de conteúdos manipulados.

O Grupo Aeroportuário del Pacífico reiterou que não houve ataque nem incêndio de aeronave, explicando que o pânico entre passageiros não equivale a um incidente operacional.

Leitura crítica (Sem Filtros)

A violência existiu. A foto não.
Em cenários de choque, a desinformação disputa atenção com os factos — e vence quando a imprensa e o público confundem impacto visual com evidência. Inflar o caos com imagens falsas não informa, deseduca e alimenta pânico. O jornalismo não pode ser correia de transmissão do sensacionalismo.

Conclusão

❌ Não houve avião incendiado no Aeroporto de Guadalajara

❌ A imagem é manipulada

✅ A crise é real, o “registo visual” não

Sem Filtros: crise não autoriza mentira. Verificar não é opcional — é obrigação.', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 6918, '2026-02-25T00:23:26.469533+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('684aad02-2622-44ca-b05e-98c87a0b76be', 'Curandeiro detido por “blindar” marginais contra a polícia no Cuanza-Sul', 'Um suposto curandeiro foi detido no município da Gabela, acusado de realizar rituais para proteger criminosos e dificultar a sua captura pelas autoridades. A operação resultou ainda na detenção de dois indivíduos armados, suspeitos de envolvimento em assaltos.', 'Efectivos da Polícia Nacional de Angola (PNA), em coordenação com o Serviço de Investigação Criminal (SIC), detiveram um cidadão acusado de práticas ocultas com o alegado objectivo de proteger marginais contra a acção policial. A detenção ocorreu no bairro Nguéria, no município da Gabela, província do Cuanza-Sul.

Durante a mesma micro-operação, foram capturados dois indivíduos, de 28 e 51 anos, por posse ilegal de arma de fogo, nomeadamente uma pistola do tipo Makarov com uma munição. Segundo as autoridades, a arma estaria a ser utilizada em assaltos à mão armada na via pública.

As investigações indicam que o suposto “quimbanda” realizava rituais e banhos tradicionais para alegadamente impedir que os suspeitos fossem capturados. Os três detidos serão encaminhados ao Ministério Público para os procedimentos legais, no âmbito das acções de combate à criminalidade na região.

Análise – Angola Sem Filtros

Este caso expõe uma realidade desconfortável: a criminalidade em Angola não vive apenas de armas e assaltos — também se alimenta de crenças profundamente enraizadas. A ideia de que rituais podem “proteger” criminosos revela o nível de influência que práticas tradicionais ainda exercem, inclusive em contextos de ilegalidade.

Mas há um ponto mais sério: marginais não deixam de ser presos por causa de rituais — deixam de ser presos por falhas no sistema de segurança. Quando criminosos recorrem a este tipo de práticas, isso diz mais sobre o estado psicológico e cultural do meio onde operam do que sobre qualquer eficácia real desses rituais.

Por outro lado, a actuação das autoridades levanta uma linha sensível entre combate ao crime e respeito pelas práticas culturais. Nem todo curandeirismo é crime, mas quando entra no circuito da criminalidade, passa a ser parte do problema.

No fim, o essencial não é o “quimbanda” — é o contexto: criminalidade persistente, crenças exploradas e um sistema que ainda luta para ser plenamente eficaz na prevenção e dissuasão do crime.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 1716, '2026-03-17T22:07:07.998724+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('5b2529dc-fc30-441b-b70c-9aac2cf06eba', 'MPLA reage ao “Pacto de Transição” da UNITA e alerta contra narrativa de vitória antecipada', 'O MPLA reagiu às declarações do presidente da UNITA, Adalberto Costa Júnior, sobre um “Pacto de Transição” para as eleições de 2027, acusando a oposição de tentar criar uma narrativa de vitória antecipada e questionando a deslegitimação sistemática das instituições eleitorais.', 'O debate político em Angola voltou a intensificar-se após Costa Júnior defender a necessidade de um pacto que previna instabilidade pré e pós-eleitoral. O deputado do MPLA, João Mpilamosi, admitiu que, se respeitar a Constituição, a ideia não seria problemática, mas alertou que a proposta da UNITA levanta dúvidas quanto à sua intenção política real.

Segundo Mpilamosi, ao discutir um pacto de transição antes das eleições, a UNITA pode estar a projetar uma vitória antecipada ou preparar o discurso de contestação em caso de derrota. O parlamentar garantiu que, mesmo se o MPLA não vencer, aceitaria os resultados de forma pacífica: “Jamais levaríamos o país ao caos. Seríamos os primeiros a felicitar o partido e o presidente vencedor”.

O deputado também criticou a oposição por questionar constantemente a credibilidade da Comissão Nacional Eleitoral (CNE) e do Tribunal Constitucional, defendendo que estas instituições atuam dentro da legalidade. “Devemos respeitar as instituições, quer as decisões favoreçam a oposição, quer favoreçam o Governo”, afirmou, alertando para o perigo da deslegitimação sistemática dos órgãos do Estado.

Numa provocação direta, João Mpilamosi desafiou a UNITA a apresentar primeiro o seu programa de governo, permitindo que o eleitor compare propostas com o MPLA, e reiterou a confiança na vitória do seu partido em 2027, destacando a preparação contínua do MPLA entre ciclos eleitorais.

Por outro lado, o secretário-geral do Bloco Democrático, Mwata Sebastião, apoiou a ideia do pacto, defendendo que é necessário prevenir rupturas e capturas institucionais recorrentes, lembrando os Acordos de Alvor (1975), Bicesse (1991) e o Memorando do Luena (2002) como exemplos de transições falhadas. Sebastião alertou que a alternância política exige garantias mútuas e maior envolvimento da sociedade civil, para evitar perseguições políticas e consolidar a democracia no país.

Sem filtros, o debate sobre o “Pacto de Transição” reflete não apenas divergências partidárias, mas também a tensão entre legitimidade institucional, narrativa política e a necessidade de mecanismos que assegurem estabilidade democrática em Angola.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 7342, '2026-02-23T21:35:57.37462+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('51e895c1-3732-48f6-87da-6910d8e9b70c', 'Árbitro Slavko Vincic envolvido em polêmica de 2020: festa com drogas, armas e prostitutas', 'O árbitro esloveno Slavko Vincic, nomeado para apitar o jogo Real Madrid-Benfica pela UEFA, viu o seu nome ligado a um caso polémico ocorrido em maio de 2020 na Bósnia e Herzegovina, onde uma festa foi alvo de uma rusga policial com apreensão de drogas, armas e suspeita de rede de prostituição. Vincic afirma ter estado no local por engano e foi libertado sem acusações.', 'O incidente remonta a quase seis anos, na cidade de Bijeljina, quando Slavko Vincic se encontrou numa quinta onde se realizava uma festa. Durante a operação policial, foram detidas várias pessoas — incluindo Tijana Maksimovic, alegadamente líder de uma rede de prostituição — e apreendidos 4 pacotes de cocaína, 10 pistolas, 3 coletes de proteção e mais de 10 mil euros em diferentes moedas. No total, 26 homens e 9 mulheres foram detidos ou levados para depor.

O árbitro, que conduziu a final da Champions League 2023/24, explicou ao jornal esloveno Vecer que se dirigia a um almoço de negócios e acabou na festa por engano. “Estava sentado à mesa com a minha companhia, de repente a polícia apareceu. Não tenho nada a ver com o grupo que foi detido, nem com os meus parceiros de negócios”, afirmou, descrevendo a situação como um erro de circunstâncias.

A Associação de Árbitros de Futebol da Eslovénia, através do presidente Vlado Sajn, reforçou a inocência de Vincic, sublinhando que ele não foi acusado de qualquer crime. “Foi apenas um caso de estar no lugar errado à hora errada”, afirmou.

O episódio reacende discussões sobre a imagem de figuras públicas ligadas ao desporto e o impacto de associações polémicas, mesmo quando não existe envolvimento direto. Sem filtros, a história mostra como circunstâncias infelizes podem colocar em causa reputações, mesmo de profissionais de topo, e a importância de contextualizar antes de julgar.', 'Desporto', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 7094, '2026-02-23T21:28:03.985903+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('c45b90c9-d0d1-4e91-87a5-a4eb71c699a9', 'UNITA promete Governo inclusivo em 2027 e garante que João Lourenço “não precisa de abandonar o País', 'A UNITA afirmou esta quarta-feira que o Presidente da República, João Lourenço, “não precisa de abandonar o País” em 2027, quando o MPLA perder as eleições. A garantia foi dada pelo secretário-geral do partido do “Galo Negro”, Liberty Chiyaka, durante uma conferência de imprensa em Luanda.', 'Resumo (3 alíneas):

A UNITA afirma que, caso vença as eleições de 2027, formará um Governo inclusivo, integrando militantes do MPLA, outras forças políticas e a sociedade civil.

O partido assegura que o Presidente João Lourenço não terá de sair do País, defendendo transições pacíficas e sem receios de alternância do poder.

As declarações surgem no âmbito das comemorações dos 60 anos da UNITA, que incluem actos políticos e celebrações no Moxico e em Muangai.

Segundo o dirigente, um eventual Governo liderado pela UNITA será inclusivo e participativo, integrando militantes do MPLA, outras formações políticas e representantes da sociedade civil. A proposta enquadra-se no chamado “Pacto de Estabilidade”, iniciativa do partido que, de acordo com Chiyaka, visa assegurar transições políticas pacíficas, com segurança e confiança no futuro, afastando o medo associado às alternâncias do poder.

O responsável político defendeu ainda que a falta de unidade nacional e a ausência de uma visão comum desde a independência, em 1975, continuam a pesar negativamente sobre o País, contribuindo para o empobrecimento de quase metade da população angolana.

A conferência serviu igualmente para anunciar que o Grupo Parlamentar da UNITA realizará jornadas parlamentares na província do Moxico. As comemorações do 60.º aniversário do partido, que se assinala a 13 de Março, incluirão actividades políticas, culturais e desportivas, com destaque para uma celebração especial em Muangai, local da fundação da UNITA.

De acordo com Liberty Chiyaka, seis décadas depois da sua criação e sob a liderança do actual presidente do partido, Adalberto Costa Júnior, a UNITA continua a apresentar-se como um projecto político de unidade, orientado para a liberdade, dignidade, prosperidade e fraternidade, sustentado por um novo pacto social.

Angola Sem Filtros – Análise
A promessa de um Governo inclusivo surge como resposta directa ao medo histórico da alternância, mas carece de detalhes concretos sobre como será implementada numa estrutura política profundamente polarizada.

Ao garantir que João Lourenço não precisará abandonar o País, a UNITA tenta desarmar narrativas de instabilidade, embora o passado angolano mostre que a retórica conciliadora nem sempre sobrevive à disputa real pelo poder.

O desafio maior não está no discurso, mas na capacidade prática de romper com lógicas de exclusão que atravessam décadas e resistem tanto no poder como na oposição.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 5089, '2026-03-04T14:59:35.684524+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('fa43cabb-cd38-4d08-9869-3c1e50fb45b6', 'Mundial-2026: Visto é barreira para muitos adeptos africanos', 'Para milhares de adeptos de países africanos e do Haiti, assistir ao Mundial-2026 nos Estados Unidos continua a ser um sonho dependente da obtenção de visto. Entre os mais afectados estão torcedores da Costa do Marfim, Senegal e Haiti, cujas seleções vão disputar jogos nos Estados Unidos e no Canadá.', 'O sistema migratório norte-americano, mais restritivo nos últimos anos, limita o acesso de turistas de várias nacionalidades. Apesar de exceções para jogadores, equipas técnicas e familiares, os adeptos enfrentam exigências rigorosas, incluindo reservas de voo e prova de capacidade financeira significativa, algo que muitos não possuem.

Para minimizar os obstáculos, a FIFA implementou um "passe FIFA" que agiliza a marcação de entrevistas nas embaixadas, mas a posse do passe não garante a emissão do visto, alertam autoridades.

Na Costa do Marfim, o Comité Nacional de Adeptos centraliza solicitações e apoia a logística da viagem, prevendo cerca de 500 torcedores que, com os já residentes nos EUA, podem totalizar até 2.000 por jogo. No Senegal, a organização Allez Casa também tenta facilitar a presença dos fãs, apesar da limitação de recursos.

O Haiti enfrenta um desafio adicional: a suspensão da emissão de vistos para o país, incluindo os de turismo, dificulta a presença da diáspora no país anfitrião. Muitos adeptos legais nos Estados Unidos ainda temem interferência do ICE (Serviço de Imigração e Controlo de Alfândegas), responsável por fiscalizações rigorosas que podem gerar tensão nos estádios.

Apesar das dificuldades, alguns torcedores, como Alphonse Occil, engenheiro haitiano, arriscaram-se e conseguiram bilhetes para os jogos, mas permanecem preocupados com a segurança e a possibilidade de medidas que perturbem o ambiente desportivo.

O cenário evidencia a complexidade para os adeptos de certas nacionalidades desfrutarem plenamente do Mundial-2026, entre regulamentos de imigração restritivos, exigências financeiras e desafios logísticos, reforçando o contraste entre a emoção do futebol e os obstáculos administrativos que ainda limitam o acesso de muitos fãs ao evento.

Análise Sem Filtros
O Mundial-2026 revela uma contradição clara: promove-se o futebol como evento global, mas políticas migratórias restritivas, sob Donald Trump, excluem milhares de adeptos africanos e caribenhos logo à partida.

O “passe FIFA” não resolve o problema, pois não garante visto nem elimina o receio de controlo e detenções por parte do ICE, transformando o apoio às selecções num risco.

Sem adeptos livres e presentes, o Mundial perde essência: deixa de ser festa popular e torna-se um espectáculo elitista, politizado e distante do verdadeiro espírito do futebol.', 'Desporto', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 5598, '2026-03-02T16:44:46.545184+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('18b021b0-082a-40a6-8181-c41bbbfb7f0a', 'Presidente João Lourenço manifesta solidariedade às vítimas do conflito no Médio Oriente', 'Luanda – O Governo de Angola expressou, esta segunda-feira, profunda preocupação com a escalada do conflito no Médio Oriente e apelou a todas as partes para que exerçam contenção máxima, privilegiando o diálogo diplomático para a cessação imediata das hostilidades e o restabelecimento da paz e estabilidade na região.', 'Em comunicado oficial, o Executivo angolano acompanhou “com extrema preocupação” os ataques registados no Irão e as subsequentes retaliações nos Emiratos Árabes Unidos, Arábia Saudita, Bahrein, Qatar, Kuweit e Omã. O Governo reafirmou solidariedade aos povos e às vítimas afetadas pelo conflito.

O comunicado sublinha a necessidade urgente de redução das tensões e de pleno respeito pelo Direito Internacional, em conformidade com a Carta das Nações Unidas e os princípios de soberania, integridade territorial e não-agressão. “A República de Angola exorta todas as partes a priorizar o diálogo através dos canais diplomáticos, envidando esforços para a cessação imediata das hostilidades e o restabelecimento da paz e estabilidade regionais”, refere o texto.

Desde sábado último, o Ministério das Relações Exteriores tem monitorizado de perto a evolução do conflito, mantendo articulação permanente com as Missões Diplomáticas de Angola na região. Em medidas preventivas, foi acionado um plano de contingência para proteger cidadãos angolanos, em colaboração com as missões em Israel, Qatar, Turquia, Emirados Árabes Unidos e Arábia Saudita.

Como parte do plano, o primeiro grupo de nove cidadãos angolanos, incluindo familiares e pessoal não essencial, foi evacuado de Israel e chegou a Luanda no sábado, 27 de fevereiro. O Ministério garante que o processo de evacuação continuará de forma faseada, organizada e segura.

O Governo reafirma o compromisso de proteger e assistir os cidadãos angolanos no exterior, assegurando a adoção de todas as medidas necessárias para a sua segurança.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5760, '2026-03-02T13:37:38.037961+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('d0c89db6-244e-4dde-9a6e-13b83f357df7', 'Seguradoras marítimas cancelam cobertura contra riscos de guerra; transporte de petróleo ficará mais caro', 'Cingapura, 2 de Março – Seguradoras marítimas internacionais estão a cancelar apólices de cobertura contra riscos de guerra, numa medida que deve aumentar os custos de transporte de petróleo, após a intensificação do conflito no Irão. Pelo menos três petroleiros foram danificados, um marinheiro perdeu a vida e cerca de 150 navios ficaram encalhados no Estreito de Ormuz.', 'O Irão retaliou ataques dos EUA e Israel iniciados no sábado, elevando drasticamente os riscos para a navegação comercial nas últimas 24 horas. Entre os navios afetados estão petroleiros e transportadores de gás natural liquefeito, responsáveis por aproximadamente um quinto da demanda global de petróleo proveniente da Arábia Saudita, Emirados Árabes Unidos, Iraque, Irão e Kuwait.

A interrupção provocou aumento de 9% nos preços globais do petróleo nesta segunda-feira. Entre as seguradoras que suspenderam cobertura estão Gard, Skuld, NorthStandard, London P&I Club e American Club, com os cancelamentos vigentes a partir de 5 de Março. A cobertura deixa de abranger as águas iranianas, o Golfo Pérsico e regiões adjacentes, embora algumas empresas estudem opções para restabelecer seguros.

O Grupo MS&AD do Japão anunciou igualmente a suspensão da subscrição de apólices de riscos de guerra em águas ao redor do Irão, Israel e países vizinhos. Analistas de mercado preveem que as taxas de frete spot do Médio Oriente para a Ásia, já em níveis recordes nos últimos seis anos, continuarão a subir devido à relutância dos armadores em navegar na região. Desde o início de 2026, o índice de referência TD3C praticamente triplicou.

O aumento dos custos logísticos ameaça pressionar ainda mais os preços de combustíveis e derivados a nível global, evidenciando a vulnerabilidade do comércio marítimo face à instabilidade geopolítica.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5685, '2026-03-02T14:28:35.817501+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('c69e2d30-fb4f-4c35-a5b5-90beff32a360', 'Sem Filtros | Ataques com falsos CAPTCHA disparam 563% em 2025: saiba como se proteger', 'Os CAPTCHA, tradicionalmente usados para diferenciar humanos de bots, tornaram-se uma nova arma dos cibercriminosos. Segundo o Global Threat Report 2026, da CrowdStrike, os ataques que exploram falsos CAPTCHA cresceram 563% em 2025, substituindo outras técnicas clássicas de phishing, como alertas falsos de atualização do navegador.', 'O que é um CAPTCHA

CAPTCHA (Completely Automated Public Turing Test to tell Computers and Humans Apart) é um mecanismo de verificação presente em websites para confirmar que o utilizador é humano.

Desafios comuns: selecionar imagens, escrever letras ou números distorcidos, manter botões pressionados.

Função: impedir spam, bloqueio de bots, compras automatizadas e recolha abusiva de dados.

Apesar de às vezes serem frustrantes, continuam a ser uma camada essencial de proteção online.

Como os criminosos exploram CAPTCHAs falsos

Os atacantes criam CAPTCHAs falsos que parecem legítimos mas escondem ações maliciosas:

Apresentam janelas ou puzzles que parecem normais, mas pedem ações fora do comum, como copiar comandos para a janela “Executar” do Windows.

Executando essas instruções, o utilizador instala involuntariamente malware no sistema.

Alguns ataques redirecionam para sites falsos, com códigos QR ou links que roubam dados pessoais.

O crescimento desta técnica deve-se à variedade de formatos de CAPTCHA legítimos, que facilita a criação de versões falsas difíceis de distinguir.

Sinais de alerta de CAPTCHA falso

Solicita copiar comandos para o computador.

Instruções envolvendo atalhos do sistema (ex.: Win + R).

Downloads adicionais não solicitados.

Redirecionamentos inesperados para outros sites.

URLs ou domínios ligeiramente diferentes do original.

⚠️ Se identificar um CAPTCHA suspeito, feche imediatamente a página e não siga nenhuma instrução.

Leitura crítica (Sem Filtros)

O que era um mecanismo de segurança está a ser transformado em ferramenta de ataque.
Os criminosos digitais exploram comportamento humano e não vulnerabilidades técnicas, tornando proteções tradicionais menos eficazes.

Em um mundo em que ataques evoluem rapidamente, atenção aos detalhes continua a ser a melhor defesa.', 'Opinião', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 6895, '2026-02-25T01:34:32.642062+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('099a1026-638b-404e-93a8-ef628d98b27d', 'Abertas candidaturas para a sucessão de Hélder Pitta Grós na Procuradoria-Geral da República', 'O Conselho Superior da Magistratura do Ministério Público anunciou esta quarta-feira a abertura de candidaturas ao cargo de procurador-geral da República, actualmente ocupado por Hélder Pitta Grós, que comunicou ao plenário a intenção de cessar funções.', 'Resumo (3 alíneas):

O Conselho Superior da Magistratura do Ministério Público abriu formalmente o processo para substituir Hélder Pitta Grós, que anunciou a saída do cargo de procurador-geral da República.

As candidaturas exigem CV até cinco páginas e seguem regras estritas de elegibilidade e incompatibilidades eleitorais.

A votação ocorrerá num único dia, sendo depois remetidos ao Presidente da República os três nomes mais votados.

O anúncio foi publicado no Jornal de Angola e surge após o ainda PGR — que acumula funções como presidente do Conselho Superior da Magistratura do Ministério Público — ter formalizado a sua saída, desencadeando o processo sucessório.

De acordo com o regulamento, o processo eleitoral será conduzido por uma Comissão Eleitoral composta por cinco membros designados pelo plenário do Conselho Superior, obedecendo a um calendário próprio que define o início e o termo das suas actividades.

As candidaturas devem ser dirigidas ao presidente da comissão, mediante requerimento acompanhado de Curriculum Vitae (máximo de cinco páginas), a remeter ao Secretariado do Conselho Superior da Magistratura do Ministério Público ou para o correio electrónico institucional.

Têm capacidade eleitoral activa os vogais do Conselho Superior da Magistratura do Ministério Público, perdendo esse direito os vogais que se apresentem como candidatos. A capacidade eleitoral passiva é reservada aos procuradores-gerais adjuntos da República e aos juízes conselheiros em exercício de funções.

Compete à Comissão Eleitoral assegurar toda a logística e organização do processo, validar candidaturas, organizar a lista eleitoral por sorteio, garantir a segurança da urna, apreciar reclamações, conduzir a votação e proceder à contagem e validação dos votos, divulgando os resultados finais.

A votação realizar-se-á num único dia, em local a definir, podendo cada eleitor votar em três candidatos. Concluído o escrutínio, o presidente do Conselho Superior comunicará, por escrito, ao Presidente da República os nomes dos três candidatos mais votados, por ordem decrescente.

Angola Sem Filtros – Análise
A saída de Hélder Pitta Grós abre uma sucessão sensível num momento em que a credibilidade e a eficácia da justiça estão sob forte escrutínio público.

O modelo de eleição, fechado a um círculo restrito de magistrados, reforça a ideia de um processo interno e corporativo, distante do debate público sobre o rumo da PGR.

Sem transparência real sobre os perfis e projectos dos candidatos, a mudança corre o risco de ser mais de nomes do que de práticas, mantendo intactos os problemas estruturais do sistema judicial angolano.

', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 5227, '2026-03-04T14:15:12.251316+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('8fd64637-e0ec-40ae-b564-314fa41f19a2', 'Caso AGT/2025: PCA desmonta acusação do MP e reduz desfalque de “100 mil milhões” para 6,4 mil milhões Kz', 'O presidente do conselho de administração da Administração Geral Tributária (AGT), José Leiria, desmentiu em tribunal a narrativa central do Ministério Público segundo a qual o desfalque nos cofres da AGT ultrapassa os 100 mil milhões de kwanzas. Em depoimento prolongado, garantiu que o valor efectivamente detectado e comunicado pelas estruturas internas da AGT é de 6,4 mil milhões Kz, envolvendo apenas dois funcionários. A discrepância expõe fragilidades graves na acusação e levanta dúvidas sobre a solidez da investigação do Estado.', 'Factos essenciais

O julgamento decorre no Tribunal Supremo, sob alçada da 7.ª Secção do Tribunal da Comarca de Luanda.

Segundo José Leiria, foi a própria AGT que detectou o esquema e o comunicou ao Serviço de Investigação Criminal (SIC) em Janeiro de 2025.

O valor apurado internamente é de 6,4 mil milhões Kz, não existindo — segundo a testemunha — qualquer base técnica conhecida para a cifra superior a 100 mil milhões avançada pelo MP, supostamente sustentada por investigação da Procuradoria-Geral da República.

Os únicos funcionários que a AGT conseguiu ligar tecnicamente ao desfalque foram Alípio Edgar Pereira João e Pedro Silva Lumingo, ambos detidos no processo.

A AGT identificou mais de 100 empresas e mais de 1.500 notas de liquidação fraudulentamente reformadas; ainda assim, o MP levou a julgamento apenas cinco empresas.

Leitura crítica (Sem Filtros)

Há aqui um problema estrutural que não pode ser varrido para debaixo do tapete: como é possível um órgão técnico do Estado afirmar, sob juramento, que detectou 6,4 mil milhões Kz, enquanto o MP sustenta publicamente um rombo acima dos 100 mil milhões sem que a principal entidade lesada reconheça esse número?

Se o PCA da AGT diz não saber “de onde saíram” os 100 mil milhões, então só existem três hipóteses — todas graves:

A acusação inflacionou valores para reforçar o impacto mediático do processo;

Há uma investigação paralela que não foi partilhada com a própria instituição lesada;

Existe descoordenação profunda entre AGT, SIC, MP e PGR.

Nenhuma destas opções é aceitável num Estado que se diz comprometido com o combate à corrupção baseado em provas e rigor técnico.

Contradições que enfraquecem a acusação

A AGT afirma não conseguir ligar outros funcionários às notas fraudulentas além de dois arguidos, enquanto o MP acusa um conjunto alargado de pessoas singulares e colectivas.

A discrepância entre “mais de 100 empresas” identificadas pela AGT e apenas cinco levadas a tribunal pelo MP carece de explicação lógica.

Nove horas de interrogatório sem esclarecimento sobre a origem dos “100 mil milhões” fragilizam seriamente a credibilidade da acusação.

Conclusão

O “Caso AGT” entra numa fase delicada: a narrativa acusatória do Ministério Público foi frontalmente contrariada pela principal testemunha institucional. Se não houver uma explicação técnica, documentada e verificável para a diferença colossal entre 6,4 mil milhões e 100 mil milhões Kz, o risco é claro: transformar um processo criminal sério num caso politicamente ruidoso, juridicamente frágil e institucionalmente embaraçoso.

Num julgamento desta dimensão, factos contam mais do que números lançados para manchete. O tribunal terá agora de decidir qual das versões resiste à prova — e quem responde pelo ruído criado.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 7052, '2026-02-24T11:10:58.112353+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('6ea7121a-b8c7-44af-9d8a-1f3c32c17e2f', 'Sem Filtros | Bodo/Glimt choca Milão e elimina Inter: Leões podem ser próximos adversários', 'O Bodo/Glimt protagonizou esta terça-feira a grande surpresa da 2.ª mão do play-off de acesso aos oitavos de final da UEFA Champions League, ao vencer o Inter de Milão por 2-1, em pleno Giuseppe Meazza. Com o resultado agregado de 5-2, a equipa norueguesa eliminou o finalista vencido da última edição da Liga dos Campeões e está entre os classificados para os oitavos de final, onde poderá enfrentar o Sporting Clube de Portugal ou o Manchester City.', 'O jogo

O Inter precisava de uma reação expressiva para reverter o resultado da primeira mão, quando perdeu por 3-1 em Bodo. Apesar da pressão ofensiva intensa e dos 30 remates e 51 cruzamentos, a equipa italiana não conseguiu furar a defesa nórdica de forma consistente.

O Bodo/Glimt, por sua vez, manteve a disciplina defensiva e aproveitou os erros adversários:

58’ – Akanji falhou um passe recuado, Blomberg recuperou, Sommer defendeu, mas Hauge marcou na recarga.

72’ – Hauge, criativo de serviço, assistiu Evjen, que ampliou para 2-0.

O Inter ainda reduziu aos 75’ com Bastoni, mas a vantagem norueguesa foi suficiente para confirmar a eliminação dos italianos.

Dados-chave

Remates: Bodo/Glimt 7 → 2 golos; Inter 30 → 1 golo

Cruzamentos: Inter 51

Finalista da última edição da Champions eliminado.

Leitura crítica (Sem Filtros)

O Bodo/Glimt confirma que técnica, disciplina e eficácia podem superar orçamento e fama.

O Inter mostrou incapacidade de adaptação e dependência de volume ofensivo sem objetividade.

A surpresa coloca o Sporting ou Manchester City como próximos possíveis desafios, mostrando que na Champions qualquer equipa com estratégia clara pode derrubar gigantes europeus.

O futebol europeu volta a provar que, além de talento, erro de um jogador e organização tática bem definida podem ditar a história de uma eliminatória.', 'Desporto', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 6858, '2026-02-25T01:27:05.411957+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('316d4f64-fa77-48a8-943f-f7e5c70424ea', 'Rusgas do SME levam à detenção de mais de 100 técnicos estrangeiros e paralisam indústrias alimentares no Kikuxi', 'Uma operação do Serviço de Migração e Estrangeiros resultou na detenção de mais de uma centena de técnicos estrangeiros que trabalhavam em unidades industriais do sector alimentar na zona industrial do Kikuxi, numa acção que gerou forte preocupação entre investidores estrangeiros no país.', 'Mais de 100 engenheiros e técnicos estrangeiros foram detidos durante uma operação do Serviço de Migração e Estrangeiros em unidades industriais do Kikuxi.

As empresas alegam que os trabalhadores estavam legalmente no país, integrados em projectos aprovados pela AIPEX.

A operação provocou paralisação de linhas de produção e já há empresários a ponderar retirar investimentos de Angola.

Segundo fontes empresariais, as equipas do SME cercaram e entraram em várias fábricas na manhã de sexta-feira, abordando engenheiros de produção, técnicos especializados e supervisores responsáveis por linhas industriais. Muitos dos profissionais foram algemados e conduzidos para instalações do serviço migratório para interrogatório.

De acordo com responsáveis das empresas afectadas, a maioria dos detidos é de nacionalidade indiana e eritreia e encontrava-se a trabalhar em Angola com contratos formais, ao abrigo de projectos de investimento aprovados pela AIPEX.

Empresários contestam a actuação das autoridades e afirmam possuir toda a documentação necessária para comprovar a legalidade da permanência dos técnicos no país. Um gestor de uma das indústrias afectadas, que pediu anonimato por receio de represálias, afirmou que os trabalhadores estrangeiros constam dos contratos de investimento submetidos às autoridades.

As consequências da operação já começaram a fazer-se sentir. Sem os engenheiros responsáveis por operar equipamentos industriais específicos — muitos deles de origem estrangeira — várias linhas de produção foram interrompidas, afectando a produção de bens alimentares considerados essenciais.

Alguns empresários admitem que, caso a situação não seja rapidamente esclarecida, poderão suspender operações ou retirar capitais do país, alertando para o impacto que este tipo de acções pode ter no ambiente de negócios e na confiança de investidores estrangeiros.

Angola Sem Filtros – Análise
A operação levanta sérias questões sobre coordenação entre instituições do Estado, sobretudo quando técnicos ligados a investimentos aprovados oficialmente acabam detidos em operações de fiscalização.

Num momento em que Angola procura atrair investimento estrangeiro, acções desta natureza enviam sinais contraditórios ao mercado, podendo gerar desconfiança entre investidores internacionais.

Se confirmadas detenções de trabalhadores com documentação regular, o episódio expõe um problema recorrente: burocracia descoordenada e excesso de poder operacional, factores que continuam a fragilizar o ambiente económico do país.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 4904, '2026-03-05T19:02:16.334875+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('b0e2c1d7-0abe-422b-8999-2b4545015306', 'Vem aí o maior recrutamento da Polícia Nacional: MININT promete mais de 50 mil novos efectivos', 'O Ministério do Interior de Angola anunciou que pretende recrutar mais de 50 mil novos efectivos para a Polícia Nacional de Angola, numa tentativa de reforçar a segurança pública. Apesar da dimensão do anúncio, o Governo ainda não avançou datas concretas, mantendo a expectativa — e a pressão — sobretudo entre os jovens.', 'O maior processo de incorporação da história recente da Polícia Nacional está em preparação. O Ministério do Interior (MININT) confirmou que pretende recrutar, nos próximos tempos, mais de 50 mil novos agentes, com o objetivo de reforçar todos os órgãos da polícia em todo o país.

Segundo o ministro do Interior, Manuel Homem, a necessidade real de efectivos vai além deste número. No entanto, o processo será condicionado pelas capacidades financeiras do ministério e pela chamada “articulação financeira equilibrada” com os restantes órgãos da administração pública.

Na prática, o anúncio ainda não saiu do plano das intenções. Manuel Homem afirmou que o recrutamento só avançará quando estiverem criadas as condições logísticas e financeiras necessárias, sem, contudo, indicar uma data concreta para o início do concurso público — uma promessa aguardada há meses pela população.

Em 2025, o Conselho Superior da Polícia Nacional já tinha sinalizado a intenção de aumentar o efectivo em todas as áreas, visando uma actuação mais eficiente e orientada para a segurança pública. Actualmente, a corporação conta com mais de 100 mil efectivos, número que o próprio Governo considera insuficiente face aos desafios do país.

Para 2026, as prioridades da Polícia Nacional passam pelo aumento do efectivo, expansão e modernização das infra-estruturas, redução da criminalidade violenta e diminuição da sinistralidade rodoviária. Está igualmente prevista a melhoria das capacidades técnicas da investigação criminal, através da DIIP, e o reforço contínuo da formação policial, alinhada à Estratégia de Desenvolvimento 2023–2027.

A necessidade de novos agentes já tinha sido sublinhada pelo Presidente da República, João Lourenço, no seu discurso sobre o Estado da Nação, ao defender que o aumento do número de efectivos é essencial para melhorar a capacidade de resposta da polícia e prevenir o crime.

Sem datas, sem cronograma público e com uma promessa que se repete há meses, o anúncio do maior recrutamento da Polícia Nacional levanta uma questão central: quando a intenção se vai transformar, finalmente, em concurso real?
Até lá, a expectativa cresce — e a resposta continua em aberto.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 7104, '2026-02-23T20:48:03.819658+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('827bdc61-35cb-4b7e-8054-079b8c4c7655', 'As reações à morte do líder supremo do Irão Ali Khamenei', 'O Irão confirmou hoje a morte do ''ayatollah'' Ali Khamenei na operação conjunta dos Estados Unidos e Israel lançada no sábado contra a República Islâmica.', 'líder supremo do Irão, de 86 anos, foi morto num ataque preciso quando participava numa reunião em Teerão com outros dirigentes iranianos, incluindo chefes militares.

 
Seguem-se as principais reações internacionais à morte do líder supremo iraniano:

Irão

Vingar o líder supremo é um "direito e um dever legítimo" para a República Islâmica, afirmou o Presidente iraniano, Masoud Pezeshkian, num comunicado divulgado pela TV estatal.

Pezeshkian considerou que a morte de Ali Khamenei constituía uma "declaração de guerra contra os muçulmanos e, em particular, contra os xiitas em todo o mundo".

Justificou tratar-se da "mais alta autoridade política da República Islâmica do Irão e de um eminente líder do xiismo no mundo".

O Corpo de Guardas da Revolução Islâmica, conhecida como Guarda Revolucionária, condenou os "atos criminosos e terroristas cometidos pelos governos maléficos dos Estados Unidos e do regime sionista [Israel]".

A força que protege o regime xiita fundamentalista no Irão prometeu vingar a morte de Ali Khamenei, que era o guia supremo desde 1989.

Estados Unidos

"Khamenei, uma das pessoas mais diabólicas da História, morreu", anunciou o Presidente Donald Trump na rede social de que é proprietário, sem poupar nas palavras, como é seu hábito.

"Isto é apenas justiça para os iranianos, mas também para todos os grandes norte-americanos e pessoas de muitos países do mundo que foram mortos ou mutilados por Khamenei e pelo seu bando de vagabundos sedentos de sangue", acrescentou.

Israel

O ministro da Defesa, Israel Katz, afirmou que foi feita justiça e que "o eixo do mal [liderado pelo Irão] sofreu um revés esmagador".

"Continuaremos a agir com firmeza para proteger o Estado de Israel", assegurou Katz.

O exército israelita, que reivindicou a morte de Ali Khamenei no ataque realizado no sábado, descreveu-o como "o arquiteto do plano para destruir o Estado de Israel".

"Era conhecido como a ''cabeça do polvo iraniano'', estendendo os braços por todo o Médio Oriente e pelas fronteiras do Estado de Israel", disseram os militares.

Filho do antigo xá do Irão

"Com a sua morte, a República Islâmica terminou efetivamente e será em breve enviada para o caixote do lixo da História", regozijou-se Reza Pahlavi, o filho mais velho de xá e considerado o herdeiro do trono no Irão.

"Às forças armadas, de segurança e à polícia: qualquer tentativa de apoiar um regime em colapso está condenada ao fracasso", acrescentou.

Iraque

O influente líder xiita Moqtada Sadr anunciou três dias de luto no Iraque.

"É com profunda tristeza e imensa dor que endereçamos as nossas condolências a todo o mundo islâmico pelo martírio do líder da revolução islâmica", escreveu nas redes sociais.

Outra voz de destaque do mundo xiita, o grande ''ayatollah'' iraquiano Ali al-Sistani, nascido no Irão, juntou-se às condolências das últimas horas, denunciando a operação conjunta.

"Está claro que os inimigos procuram causar dano ao nosso querido Irão através do martírio", afirmou Al-Sistani.

"Só posso esperar deste país que mantenha a unidade e a coesão nacionais nestas circunstâncias difíceis e delicadas, e não permita que os agressores alcancem os seus objetivos sinistros", acrescentou.

Em Bagdade, manifestantes tentaram invadir a zona que acolhe a embaixada dos Estados Unidos, mas foram impedidos pela polícia.

Eixo de Resistência

A ação dos Estados Unidos e Israel foi criticada por grupos que integram o chamado "Eixo de Resistência" contra Israel e os Estados Unidos, liderado pelo Irão.

O Hamas palestiniano condenou um "crime abominável" pelo qual responsabilizou os Estados Unidos e Israel.

Os dois países carregam a "inteira responsabilidade por esta agressão flagrante e por este crime odioso contra a soberania da República Islâmica do Irão, bem como pelas suas graves repercussões na segurança e estabilidade da região", considerou.

O grupo armado Jihad Islâmica, aliado do Hamas, disse tratar-se de um "crime de guerra" cometido numa "ataque traiçoeiro e mal-intencionado".

O libanês Hezbollah garantiu que vai "enfrentar a agressão" norte-americana e israelita que vitimou Khamenei, "quaisquer que sejam os sacrifícios".

Os huthis do Iémen descreveram o ataque como um "crime atroz" e uma "violação flagrante de todas as leis e normas internacionais".

"O martírio de Ali Khamenei aumentará a força e a determinação do povo iraniano, e o caminho da jihad e da defesa da verdade prosseguirá sem recuo", acrescentaram.

Reino Unido

"Poucas pessoas chorarão" a morte de Khamenei, afirmou o secretário da Defesa britânico, John Healey, considerando que "o Irão e o regime que ele dirigiu durante tanto tempo constituem uma fonte de mal".

"A preocupação agora, claro, é que este regime responda (...) de forma cada vez mais indiscriminada e alargada, e as pessoas temerão realmente que os alvos não sejam apenas militares", advertiu Healey.

Rússia

O presidente russo, Vladimir Putin, considerou tratar-se de um assassínio "cometido com uma cínica violação de todas as normas da moral humana e do direito internacional" num telegrama enviado a Pezeshkian.

China

Para Pequim, a morte do líder iraniano constitui "uma violação grave da soberania e da segurança do Irão, um atropelo dos objetivos e princípios da Carta das Nações Unidas e das normas fundamentais das relações internacionais".

União Europeia

A chefe da diplomacia europeia, Kaja Kallas, considerou tratar-se de um "momento decisivo" na história do Irão.

"O que se seguirá é incerto. Mas existe agora um caminho aberto para um Irão diferente, [em] que o seu povo poderá ter mais liberdade para moldar", afirmou.', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5953, '2026-03-01T18:43:08.745375+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('20759a05-fe83-4c5c-bba4-24a4bc4e2f85', 'Secretária clínica detida por furto de cartão Multicaixa de paciente internado após AVC', 'O Serviço de Investigação Criminal deteve dois cidadãos suspeitos de envolvimento num esquema de furto e utilização indevida de cartão de débito pertencente a um paciente internado no Hospital Geral Bispo Emílio de Carvalho.', 'O SIC deteve uma secretária clínica e um cúmplice acusados de furtar e utilizar o cartão Multicaixa de um paciente internado após sofrer um AVC.

A vítima terá perdido cerca de 1 milhão de kwanzas em levantamentos efectuados após o alegado furto.

O caso ocorreu no Hospital Geral Bispo Emílio de Carvalho, no Zango 8 Mil, município de Icolo e Bengo.

Entre os detidos está uma mulher de 50 anos, que exercia funções de secretária clínica na referida unidade hospitalar, e um jovem de 23 anos, pedreiro. Ambos foram detidos no município de Icolo e Bengo, em cumprimento do Mandado de Detenção n.º 652/026-CLB.

De acordo com as autoridades, a funcionária é suspeita de ter subtraído o cartão Multicaixa do cidadão Silveiro Simão Miguel, de 63 anos, que se encontrava internado depois de sofrer um Acidente Vascular Cerebral na via pública.

Segundo as investigações preliminares, após se apropriar do cartão bancário do paciente, os suspeitos terão realizado vários levantamentos, que totalizaram cerca de um milhão de kwanzas retirados da conta da vítima.

O caso está agora sob investigação do SIC, que procura esclarecer todos os contornos da alegada prática criminosa e apurar eventuais responsabilidades adicionais.

Angola Sem Filtros – Análise
O caso expõe um problema grave de ética e segurança dentro das unidades hospitalares, onde pacientes vulneráveis dependem da integridade dos profissionais que os assistem.

Se confirmadas as acusações, trata-se de um acto que ultrapassa o simples crime patrimonial, revelando abuso de confiança contra um doente incapaz de se defender.

Episódios deste tipo reforçam a necessidade de maior controlo interno e responsabilização no sistema de saúde, para evitar que instituições destinadas a salvar vidas se transformem em espaço de exploração de quem já se encontra fragilizado.', 'Saúde', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 4854, '2026-03-05T19:08:52.164967+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('9b0b0d64-5110-4dc4-b1c9-5bb0a765f092', 'Porta-voz do M23 morre em ataque com drone no leste da RD-Congo', 'O porta-voz do movimento rebelde M23, Willy Ngoma, morreu na madrugada de terça-feira após um ataque com drone atribuído às Forças Armadas da República Democrática do Congo (FARDC), no Kivu do Norte. O incidente ocorre num contexto de intensificação militar, disputa por zonas mineiras estratégicas e negociações frágeis de cessar-fogo mediadas internacionalmente.', 'Willy Ngoma foi morto por volta das 03h00 locais, nas proximidades de Rubaya, uma área sob influência do M23, após vários dias de bombardeamentos com drones levados a cabo pelo exército congolês. Fontes do grupo rebelde e do Governo confirmaram a ocorrência, segundo informações avançadas pela Reuters.

Rubaya é considerada um ponto estratégico central no conflito, por ser um dos principais polos de exploração de coltan no mundo — responsável por cerca de 15% da produção global do minério. O controlo da região representa uma importante fonte de financiamento para o M23. Recentemente, Kinshasa incluiu a zona numa lista restrita de activos mineiros estratégicos propostos aos Estados Unidos, no âmbito da cooperação no sector dos minerais críticos, o que aumenta o peso geopolítico da área.

Paralelamente, organizações da sociedade civil relataram confrontos intensos em localidades próximas desde domingo, provocando o deslocamento forçado de centenas de famílias. A escalada militar acontece apesar dos esforços diplomáticos em curso.

A morte de Ngoma surge num momento sensível, em que o Governo da RDCongo e o M23 assinaram, em Doha, acordos para a criação de um mecanismo conjunto de monitorização e verificação do cessar-fogo, com mediação do Qatar e observação dos Estados Unidos e da União Africana. A implementação prática desses compromissos continua, no entanto, frágil no terreno.

Ngoma encontrava-se sob sanções da União Europeia desde dezembro de 2022, devido ao seu papel como figura pública e porta-voz do M23. Nem a Presidência congolesa nem o exército comentaram oficialmente o ataque.

O M23 mantém o controlo de vastas áreas no Kivu do Norte e no Kivu do Sul, após uma ofensiva relâmpago no ano passado, durante a qual tomou cidades estratégicas como Goma e Bukavu. Em dezembro, o grupo chegou a capturar Uvira, cidade retomada pelas FARDC no mês passado, permitindo a reabertura da fronteira com o Burundi esta semana.

A missão de paz das Nações Unidas destacou entretanto uma equipa de avaliação para Uvira, com o objetivo de apoiar o mecanismo de cessar-fogo e avaliar as condições de segurança.

Sem filtros, a morte do porta-voz do M23 evidencia uma realidade incontornável: enquanto a diplomacia discute cessar-fogo em mesas internacionais, o conflito no leste da RDCongo continua a ser decidido por drones, minerais estratégicos e controlo territorial.', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 6868, '2026-02-25T16:49:50.649087+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('d938665e-01e8-4b30-94c9-dd343181f837', 'Mais de 50 empresas de transporte operam na ilegalidade e arriscam expulsão do sector', 'A Agência Nacional dos Transportes Terrestres (ANTT) identificou 55 empresas de transporte interprovincial a operar com veículos irregulares. A instituição anunciou o cancelamento imediato das licenças para operadores que não regularizarem a situação, alegando riscos à segurança e violação grave da lei.', 'A Agência Nacional dos Transportes Terrestres (ANTT) anunciou o cancelamento das licenças de actividade de empresas de transporte interprovincial que operam com veículos sem licenciamento válido. A decisão baseia-se no Decreto Presidencial n.º 355/19, que regula o sector em Angola.

Segundo a ANTT, auditorias operacionais recentes revelaram que dezenas de operadores continuam a utilizar viaturas com licenças caducadas para transporte de passageiros entre províncias. Ao todo, foram identificadas 55 empresas em situação irregular, já notificadas para procederem à regularização imediata.

A entidade reguladora considera a prática uma infracção grave, alertando que a continuidade dessas operações compromete não só a legalidade do sector, mas também a segurança dos passageiros. As medidas de fiscalização foram reforçadas e as empresas que não cumprirem as exigências poderão ver as suas licenças definitivamente canceladas.

Análise – Angola Sem Filtros

O mais preocupante neste caso não é apenas a existência de 55 empresas em situação irregular, mas sim o facto de estas estarem a operar assim até serem apanhadas. Isto levanta uma questão directa: onde estava a fiscalização antes destas auditorias?

Num país onde o transporte interprovincial é essencial para milhares de cidadãos, permitir que empresas circulem com veículos sem condições legais é mais do que uma falha administrativa — é um risco real à vida humana. A reacção da ANTT mostra acção, mas também expõe uma possível fiscalização tardia ou selectiva.

Por outro lado, há um problema estrutural que raramente é discutido: quantas destas empresas operam na informalidade por incapacidade de cumprir exigências legais e quantas o fazem por pura negligência? Sem atacar as causas — burocracia, custos de licenciamento e falta de controlo contínuo — o sector continuará preso num ciclo de irregularidade, punição e reincidência.

No fim, quem paga o preço não são as empresas — são os passageiros, que continuam a viajar sem garantias mínimas de segurança num sistema que só reage depois do problema exposto.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 1895, '2026-03-17T11:01:15.513893+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('db6549bf-92ff-44d3-9ab2-3c3ca3cc42a4', 'Denúncia interna no MPLA aponta irregularidades no alargamento do Comité Nacional da OMA', 'Quadros do MPLA tornaram público um protesto interno no qual denunciam alegadas irregularidades no processo de alargamento do Comité Nacional da OMA, acusando responsáveis partidários de desrespeitarem orientações superiores e favorecerem determinadas figuras ligadas ao partido.', 'alegam que foram integrados 58 novos membros, quando o previsto seria apenas a inclusão de cerca de 14 adicionais.

O documento refere ainda que entre os novos nomes constariam esposas de generais e familiares de figuras influentes do partido, levantando suspeitas de critérios de favorecimento. Os denunciantes apontam também a inclusão de quadros sem trajectória política conhecida na OMA, bem como a nomeação de Zayda Payama para o Gabinete da Vice-Presidente da organização, alegadamente sem percurso relevante na estrutura feminina do MPLA.

Ponto de vista — Sem Filtros:
As denúncias revelam que as disputas internas no MPLA continuam longe de terminar. Quando estruturas partidárias são acusadas de favorecer círculos familiares e interesses de bastidores, o debate deixa de ser apenas político e passa a ser sobre credibilidade institucional — algo que o partido no poder dificilmente pode ignorar.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 4965, '2026-03-05T10:53:52.523101+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('ae279751-25cd-491d-a54b-f6ab2226cc0c', 'Quando Desporto e Rock Colidem: O Lado Inusitado de Rodman', 'Por trás da aparência excêntrica, do cabelo pintado e das unhas arranjadas, o lendário basquetebolista Dennis Rodman sempre escondeu uma profunda luta interna, caos e dor. Numa recente conversa com Joe Buck, o famoso atleta revelou como a música da banda Pearl Jam ajudou a salvar-lhe a vida num dos momentos mais difíceis', 'A crise instalou-se em 1992. Depois de Chuck Daly, o treinador dos Detroit Pistons que Rodman via como uma figura paterna, ter deixado a equipa, o seu mundo desmoronou-se. Ao mesmo tempo, passava por um divórcio difícil com a sua esposa, Annie Bakes, enquanto os meios de comunicação social o criticavam incessantemente.

«Tudo estava a desmoronar-se. Fechei-me em casa durante 45 dias. Não queria falar com ninguém», recorda Rodman.
A ajuda dos Pearl Jam
Uma noite, estava sentado na sua carrinha, em frente ao pavilhão dos Pistons, com uma pistola carregada, enquanto a música Black dos Pearl Jam, que fora lançada no ano anterior, tocava no rádio.

A polícia encontrou-o horas mais tarde a dormir no veículo, com a música ainda a tocar. Rodman explicou que a sua intenção não era «matar o Dennis», mas sim libertar-se do que se tinha tornado – um homem quebrado e perdido que não sabia a que lugar pertencia. «Eu só queria mudar a minha vida», disse a antiga figura da NBA.

A transformação
Pouco depois, foi trocado para os San Antonio Spurs, onde a sua transformação começou. Começou a mudar a sua aparência, a pintar o cabelo e a usar roupas provocadoras, saias e maquilhagem. Essa reviravolta, segundo ele, marcou o seu novo começo.

«Comecei a matar o meu antigo eu e a viver como alguém novo», explicou.

Hoje, aos 63 anos, Rodman fala abertamente sobre os demónios com os quais ainda luta, mas também sobre a gratidão por ter sobrevivido a momentos difíceis: «As pessoas apostavam que eu morreria antes dos 40. E aqui estou eu, ainda vivo. Veem-me como um tipo selvagem e louco, mas sei que fiz muitas coisas boas neste planeta. Só que ninguém quer ver isso.»

Rodman ''apaga'' LeBron
O norte-americano também falou sobre quem é o melhor basquetebolista de todos os tempos e mantém a firme convicção de que é o seu antigo colega de equipa. Rodman e Michael Jordan jogaram juntos nos Chicago Bulls durante três anos, durante os quais conquistaram três anéis de campeão e ficaram na memória como parte da melhor equipa da história do basquetebol.

«Já viram Michael Jordan a simular faltas? É tudo o que tenho a dizer. Basquetebol não é sobre quanto tempo se joga, mas sim sobre quão alto o seu jogo atinge quando é mais necessário. Longevidade não é grandeza, o auge é grandeza. Mike é grandeza e ninguém o vai tocar. LeBron usou o número 23 por quase 20 anos e não aprendeu o que isso significa. Apenas os seus fãs, ao vê-lo perder em finais, o tornam maior do que ganhar seis campeonatos. De onde eu venho, isso chama-se delírio, não legado. Sempre que as coisas ficam difíceis, LeBron faz as malas, chama estrelas e forma uma nova super-equipa. Mike não foi para outra equipa, não se escondeu, não chorou. Jordan apanhava pancada de Detroit, Boston e ficava mais forte. LeBron apanha uma pancada e procura a câmara mais próxima. Se me disserem que LeBron é melhor, então não estão a ver basquetebol, estão a ver os resumos», atirou.

Dennis Rodman ficou na memória como um dos maiores excêntricos da história do basquetebol. Jogou em Detroit, Dallas, San Antonio, Chicago, Los Angeles, e conquistou cinco anéis e dois prémios de Melhor Defensor do Ano. É um dos melhores jogadores de sempre nos ressaltos e, desde 2011, membro do Hall of Fame da NBA.', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 7158, '2026-02-23T20:34:36.781579+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('bd6d5cd1-21ec-4a16-ae8a-a18b9dca0a2b', 'Angola brilha na ITB Berlim 2026, exibindo diversidade cultural e maravilhas naturais', 'A ITB Berlin 2026 começou a 2 de Março com destaque especial para Angola, país anfitrião desta edição histórica do 60º aniversário do evento. Angola apresentou ao mundo a sua cultura vibrante e as belezas naturais do território, com uma cerimónia de abertura que reuniu mais de 700 convidados VIP. Este ano, a feira foi dedicada ao tema “O Ritmo da Vida”, refletindo a oferta turística única do país e projetando a sua imagem internacional.', 'Celebrações culturais e participação de alto nível
A cerimónia de abertura proporcionou um espectáculo visual e sonoro que capturou a essência angolana. O programa cultural Travessia – Do Tradicional ao Moderno levou os convidados numa viagem pela música e dança angolanas, do semba, rebita e rumba até interpretações contemporâneas. A presença de figuras internacionais, incluindo o prefeito de Berlim, Dr. Christopher Ploss, e o presidente do Conselho Mundial de Viagens e Turismo (WTTC), reforçou a importância da estreia de Angola no turismo global.

Angola como destino turístico emergente
Para mostrar as potencialidades do país, Angola organizou um evento focado nas suas maravilhas naturais, incluindo as Cataratas de Kalandula e o Deserto da Namíbia, acompanhado de tecnologia avançada e exposições culturais que destacaram a flora e fauna locais. O ecoturismo e o turismo de aventura foram enfatizados, criando novas oportunidades para operadores e especialistas do sector turístico.

Com o slogan “Visite Angola – O Ritmo da Vida”, o país apresenta-se como uma nação vibrante, oferecendo experiências únicas aos visitantes. Angola alia autenticidade cultural e sustentabilidade, apostando num turismo responsável e adaptado às tendências globais.

Perspectivas para o futuro
A participação de Angola na ITB Berlin 2026 consolida o país como um destino turístico em ascensão. Analistas e operadores internacionais demonstraram grande interesse no sector turístico angolano, reconhecendo o potencial do país para atrair turistas internacionais. Angola aposta no turismo cultural e ecológico, promovendo a conservação ambiental e o património cultural como pilares estratégicos para o crescimento futuro.

Conclusão | Sem Filtros
A presença de Angola na ITB Berlin 2026 marca um ponto de viragem para o turismo nacional, posicionando o país como um destino inovador e sustentável. A feira destaca Angola não apenas pelas suas paisagens e cultura, mas também pela capacidade de oferecer experiências autênticas e diversificadas, abrindo caminho para se tornar uma potência turística no continente africano.', 'Cultura', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5776, '2026-03-02T14:19:09.278102+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('48f1877d-bcee-49de-834a-d714885903d9', 'Conflito entre Estados Unidos, Israel e Irão ameaça disparar preço do petróleo', 'As tensões no Médio Oriente entre os Estados Unidos, Israel e o Irão podem provocar uma forte subida do preço do petróleo no mercado internacional. Especialistas alertam que, caso o conflito se intensifique, o valor do barril poderá ultrapassar 100 dólares, acima dos actuais 72 dólares, com possíveis impactos na economia mundial e nos países produtores como Angola.', 'O agravamento das tensões no Médio Oriente entre os Estados Unidos, Israel e o Irão tem levantado preocupações nos mercados internacionais de energia. Analistas do sector petrolífero alertam que uma eventual escalada do conflito poderá impulsionar o preço do barril de petróleo para valores superiores a 100 dólares, face aos cerca de 72 dólares registados actualmente nos mercados internacionais.

Especialistas indicam que o Médio Oriente continua a ser uma das regiões mais estratégicas para a produção e exportação de petróleo. Qualquer instabilidade política ou militar pode afectar diretamente o fornecimento global da matéria-prima, provocando reacções imediatas nos mercados financeiros e energéticos.

Um dos principais pontos de preocupação é o Estreito de Ormuz, uma das rotas marítimas mais importantes do mundo para o transporte de petróleo, situado próximo do Irão. Grande parte do petróleo produzido na região passa por esta via, sendo que qualquer bloqueio ou ameaça à sua segurança pode reduzir a oferta global e elevar os preços.

Analistas internacionais defendem que, historicamente, crises geopolíticas no Médio Oriente têm provocado aumentos significativos no preço do petróleo, devido à incerteza quanto à estabilidade da produção e do transporte da commodity.

Caso o preço do barril ultrapasse a marca dos 100 dólares, os efeitos poderão ser sentidos em várias economias do mundo, nomeadamente através do aumento do custo dos combustíveis, da energia e do transporte, factores que tendem a pressionar a inflação global.

Para países produtores como Angola, um aumento do preço do petróleo pode representar um crescimento das receitas provenientes da exportação, uma vez que o crude continua a ser uma das principais fontes de receita da economia nacional.

Contudo, economistas alertam que a volatilidade dos preços no mercado petrolífero exige cautela por parte dos países dependentes deste recurso, defendendo a necessidade de diversificação económica para reduzir a exposição às oscilações do mercado internacional.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5684, '2026-03-02T14:13:49.381282+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('b398a2c1-3f0e-4c88-9e99-5895e07a63d8', 'Novo Presidente de Portugal sinaliza vontade de reforçar cooperação com Angola', 'O novo Presidente português, António José Seguro, manifestou abertura para aprofundar as relações entre Portugal e Angola, logo no dia da sua tomada de posse em Lisboa. Antes do início da cerimónia na Assembleia da República Portuguesa, Seguro dirigiu-se ao Presidente angolano, João Lourenço, com quem manteve uma breve conversa num dos corredores do Parlamento.', 'Embora o conteúdo do diálogo não tenha sido tornado público, ficou evidente a satisfação do novo Chefe de Estado português pela presença de João Lourenço na cerimónia e a intenção de fortalecer os laços históricos entre os dois países. O encontro aconteceu pouco antes de António José Seguro prestar juramento constitucional e assumir formalmente as funções de Presidente da República.

As relações entre Angola e Portugal, formalmente estabelecidas após a independência angolana, mantêm-se como uma das parcerias mais relevantes no espaço lusófono. A cooperação abrange áreas como economia, segurança, educação e investimento, com Portugal a manter-se entre os principais parceiros europeus de Angola.

Deputada luso-angolana vê futuro positivo na cooperação

A deputada luso-angolana Eva Cruzeiro, eleita pelo Partido Socialista, considerou que a chegada de António José Seguro à Presidência poderá fortalecer ainda mais a relação entre os dois países. Em declarações ao Jornal de Angola, a parlamentar descreveu o novo Presidente como uma figura aberta ao diálogo e próxima dos países lusófonos.

Segundo Eva Cruzeiro, os angolanos podem encarar com optimismo o novo ciclo político em Portugal, defendendo que o novo Chefe de Estado deverá dar prioridade à cooperação com os países de língua portuguesa, incluindo Angola.

Sem Filtros (fecho opinativo):
Entre Angola e Portugal, a política muda, mas a ligação mantém-se. Governos passam, presidentes mudam, mas os interesses económicos, a língua comum e a história partilhada continuam a puxar os dois países para a mesma mesa. O desafio agora será transformar boas palavras diplomáticas em cooperação concreta que beneficie realmente os dois povos.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 3673, '2026-03-10T06:47:45.140014+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('afc842f7-cfc1-47c8-86f6-e6e2f855a2f1', 'Relações comerciais: Angola surge na 103.ª posição entre os parceiros de Western Australia em 2025', 'Em 2025, Angola ocupou a 103.ª posição entre os parceiros comerciais de Western Australia, com as trocas bilaterais concentradas sobretudo na exportação de maquinaria pesada destinada à indústria mineira angolana, reforçando a cooperação no sector extractivo.', 'A directora executiva para Parcerias Globais da Investment & Trade Western Australia, Robyn Bobb, afirmou que Angola foi o 103.º parceiro comercial do Estado de Western Australia em 2025, sublinhando que as trocas bilaterais têm incidido, sobretudo, na exportação de maquinaria pesada destinada à indústria mineira angolana. A responsável falava durante um encontro com a Missão Diplomática de Angola naquele Estado australiano, no âmbito do reforço da cooperação económica entre as duas regiões.

De acordo com os dados apresentados, Western Australia lidera o ranking do Produto Interno Bruto entre os estados australianos e é responsável por cerca de 45% do total das exportações da Austrália. A sua economia assenta, maioritariamente, na exploração e transformação de recursos naturais, com destaque para a extracção de minério de ferro, ouro, gás natural liquefeito (LNG) e processamento de lítio, matéria-prima essencial para o fabrico de baterias utilizadas na indústria automóvel.

Impulsionada por esta forte capacidade industrial, a agência estadual de promoção de investimentos conta actualmente com 17 representações internacionais, distribuídas por cidades estratégicas da Europa, Ásia, Médio Oriente e América do Norte, com o objectivo de promover a economia local e estabelecer novas parcerias comerciais.

Perante este cenário, o embaixador de Angola na Austrália, António Luvualu, convidou o sector empresarial de Western Australia a investir em Angola, destacando as oportunidades existentes em diversos sectores da economia nacional, desde a mineração e energia até à agricultura, indústria transformadora e infra-estruturas.

A proposta angolana foi bem acolhida pela Investment & Trade Western Australia, que manifestou interesse e disponibilidade em aprofundar as relações institucionais e empresariais com a congénere angolana, perspectivando o reforço da cooperação económica e a dinamização do intercâmbio comercial entre as duas partes.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 5263, '2026-03-04T08:00:35.327338+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('78385e5b-105b-4f84-bdf6-89b0f99771c7', 'Justiça à prova: será que o poder está a cercar o Higino Carneiro?', 'Higino Carneiro, antigo general e ex-governador, volta a ser alvo da justiça angolana após anunciar candidatura à liderança do MPLA. Acusado de peculato e burla qualificada, o seu caso levanta suspeitas de “engenharia jurídica” para travar ambições políticas. Mais do que o destino de um dirigente, está em jogo a credibilidade e independência da justiça em Angola.', 'Em maio de 2022, o Tribunal Supremo arquivou processos contra Higino Carneiro, deixando-o livre de julgamento. Na altura, isso parecia marcar o fim de um ciclo judicial que pairava sobre o general. Mas a situação mudou quando Carneiro anunciou publicamente a sua candidatura à liderança do MPLA, colocando-se na corrida à sucessão de João Lourenço.

Pouco depois, a Procuradoria-Geral da República constituiu-o arguido, acusando-o de peculato e burla qualificada, crimes alegadamente cometidos durante os mandatos como governador do Cuando Cubango e de Luanda. No processo 48/20, é acusado de receber mais de 60 viaturas de uma empresa privada, distribuindo-as sem pagamento enquanto governava Luanda.

O momento em que os processos foram reativados levantou suspeitas. Analistas e setores da oposição sugerem que se trata de uma “engenharia jurídica” para travar a candidatura de Carneiro. Mais do que discutir culpabilidade, esta situação expõe um problema estrutural: a fragilidade da confiança pública na independência da justiça angolana.

Num Estado verdadeiramente democrático, a justiça não pode ser instrumento de perseguição política. Quando decisões judiciais coincidem com disputas internas pelo poder, a linha entre legalidade e conveniência política torna-se quase invisível. A confiança das instituições depende tanto da imparcialidade real quanto da percepção pública dessa imparcialidade.

Carneiro reagiu na sua página oficial no Facebook, afirmando: “Nestes processos judiciais, depositamos confiança não como um simples acto de esperança, mas como um compromisso firme com a verdade, com a justiça e com a responsabilidade que nos orienta”. Acrescentou ainda: “Onde existe integridade, existem resultados”. A declaração reforça a sua defesa institucional, mas indica que o embate será judicial e político.

O ponto central, porém, vai além de Higino Carneiro. Está em causa saber se Angola tem uma justiça independente ou se persiste a ideia de que o poder executivo pode influenciar processos. Quando cidadãos — sejam figuras públicas ou anónimos — sentem que a sua posição política os torna alvo de perseguição seletiva, o Estado de Direito enfraquece.

A consolidação democrática exige instituições fortes, autónomas e credíveis. Processos judiciais devem ser conduzidos com rigor técnico, transparência e respeito pelo devido processo legal. Se houver provas, que se julgue; se não houver, que se arquive. O que não pode existir é a sensação de que a justiça funciona ao ritmo das conveniências políticas.

O caso de Higino Carneiro é um teste decisivo para Angola. Mais do que definir o destino de um dirigente, mede a maturidade institucional do país e a credibilidade do sistema judicial. Num momento de renovação de lideranças e aprofundamento democrático, a independência da justiça deve deixar de ser apenas um princípio e tornar-se uma realidade inquestionável.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 7008, '2026-02-23T19:41:37.889827+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('5ed35a0b-7df1-4101-a978-148e543159c5', 'TAAG abre hoje venda de bilhetes para rota Luanda-Abidjan', 'A TAAG Angola Airlines realiza, na tarde desta sexta-feira, numa unidade hoteleira da capital angolana, o lançamento oficial da venda de bilhetes para a nova rota internacional que vai ligar Luanda a Abidjan, na Côte d''Ivoire. A iniciativa marca mais um passo na expansão da rede de destinos da companhia aérea angolana no continente africano.', 'A TAAG Angola Airlines procede, nesta sexta-feira, à abertura oficial das vendas de bilhetes para a nova rota internacional que vai ligar Luanda a Abidjan, na Côte d''Ivoire, num acto que decorre numa das unidades hoteleiras da capital angolana.

A implementação desta rota resulta do Acordo sobre Serviços Aéreos assinado em 2024, em Luanda, entre Angola e a Côte d’Ivoire, instrumento que visa reforçar a cooperação bilateral no sector da aviação civil e promover uma maior integração regional no continente africano.

Considerada uma das principais portas de entrada para a África Ocidental francófona, Abidjan destaca-se como um importante centro financeiro e comercial, recebendo anualmente milhões de visitantes e desempenhando um papel estratégico na dinamização das actividades económicas da região.

De acordo com a transportadora nacional, a nova ligação aérea enquadra-se na estratégia de expansão da TAAG em África, com o objectivo de reforçar a conectividade regional, facilitar a mobilidade de passageiros e estimular as relações comerciais, empresariais e turísticas entre Angola e a Côte d’Ivoire.

O evento de lançamento das vendas de bilhetes deverá contar com a presença de autoridades angolanas e ivoirienses, bem como de representantes do sector da aviação e parceiros institucionais, marcando mais um passo no reforço da presença da TAAG no mercado africano.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 4784, '2026-03-06T09:39:50.266261+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('b33ac629-92b5-45f1-adae-82e1b7c79b02', 'Octávio Capapa: a morte que expõe o esquecimento dos que serviram o Estado', 'A morte de Octávio Capapa, antigo servidor ligado à comunicação e mobilização durante a guerra, levanta críticas sobre o abandono de figuras que dedicaram a vida ao Estado.

O caso reacendeu o debate sobre memória, responsabilidade institucional e apoio a antigos quadros.

Para muitos observadores, o episódio revela uma contradição entre o discurso de reconhecimento histórico e a realidade vivida por alguns veteranos.', 'A morte de Octávio Capapa reacendeu um debate incómodo sobre a forma como Angola trata alguns dos homens que, em diferentes fases da sua história, serviram o Estado e as estruturas políticas dominantes.

Capapa foi durante anos uma figura associada à mobilização política e à comunicação em períodos marcados pela guerra e pela consolidação do poder do MPLA. No entanto, relatos recentes indicam que terá vivido os últimos anos em condições de grande vulnerabilidade social.

A situação ganhou visibilidade pública depois de ser exposta pelo jornalista Jorge Eurico, que chamou atenção para o estado em que Capapa se encontrava. O caso gerou reacções divididas: enquanto alguns criticaram a exposição, outros consideraram que foi a única forma de trazer à luz uma realidade ignorada.

A morte de Capapa reabre um debate mais amplo sobre o destino de muitos quadros que participaram em momentos decisivos da história política do país, mas que, com o passar dos anos, acabam afastados das estruturas de poder e de qualquer rede efectiva de apoio.

Angola Sem Filtros – Análise
O caso de Octávio Capapa tornou-se simbólico porque expõe uma contradição profunda entre o discurso de reconhecimento histórico e a prática institucional.

Em Angola, o sistema político tem mostrado capacidade para recompensar alguns com privilégios duradouros, mas revela fragilidade quando se trata de garantir dignidade mínima a todos os que serviram o Estado.

A morte de Capapa levanta uma pergunta incómoda: quem cuida daqueles que já cumpriram a sua missão e deixaram de ser úteis ao poder? Sem memória institucional e mecanismos de protecção, o país arrisca transformar antigos servidores em nomes esquecidos da sua própria história.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 4551, '2026-03-06T18:13:02.606441+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('a10a8b75-8012-412e-9cfb-284ff1ef5f36', 'Preços dos materiais de construção subiram 12% em 2025, mas ritmo de aumento começa a abrandar em Angola', 'Os preços dos materiais de construção em Angola aumentaram em média 12% em 2025, apesar de um abrandamento gradual registado nos últimos meses do ano. De acordo com dados do Instituto Nacional de Estatística, o Índice de Preços dos Materiais de Construção (IPMC) caiu 0,9 pontos percentuais em Dezembro face a Novembro, atingindo a taxa homóloga mais baixa dos últimos 28 meses.', 'Apesar da desaceleração, os preços continuam a subir e a pressionar o custo da construção no país. Materiais como blocos, vigas, tijolos e aço registaram as maiores variações anuais, com aumentos superiores a 17%. Especialistas alertam que a ausência de uma indústria nacional robusta de materiais de construção e a fraca fiscalização de preços têm contribuído para a escalada dos custos no sector.

Um dos casos mais polémicos continua a ser o cimento. Nos últimos meses de 2025, o produto chegou a ser vendido no mercado informal por mais de 10 mil kwanzas o saco, valor muito superior ao praticado à porta das fábricas. Ainda assim, o relatório do INE aponta uma variação mensal mínima para o cimento em Dezembro, o que tem levantado dúvidas entre analistas sobre os métodos de recolha e classificação de preços utilizados nas estatísticas oficiais.

Sem Filtros (fecho opinativo):
Quando o preço dos materiais dispara, o sonho da casa própria afasta-se ainda mais da maioria das famílias. Entre especulação no mercado, fraca fiscalização e dependência de importações, construir em Angola continua a ser um luxo. Enquanto o sector não ganhar base industrial sólida, o cimento e o ferro continuarão a pesar tanto no orçamento quanto nas paredes das casas. 🏗️', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 3201, '2026-03-12T06:26:41.375562+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('f0cecef2-1b7d-4fdb-8e5a-d7fc3a99bb2e', 'Irão ameaça fechar Estreito de Ormuz e alerta para petróleo a 200 dólares', 'A guerra no Médio Oriente entrou no 12.º dia de confrontos intensos, com o Irão a atacar pelo menos três navios mercantes no Golfo Pérsico para reforçar a ameaça de bloqueio do estratégico Estreito de Ormuz. O porta-voz militar iraniano, Ebrahim Zolfaqari, avisou que o preço do petróleo pode disparar para 200 dólares por barril caso a instabilidade na região continue.', 'Segundo relatos da imprensa internacional, pelo menos um dos cargueiros atingidos — de bandeira tailandesa — teve de ser evacuado após um incêndio a bordo próximo de Omã. Outros navios afectados foram conduzidos para portos dos Emirados Árabes Unidos. No mesmo período, os Estados Unidos anunciaram ter destruído 16 embarcações iranianas utilizadas para lançar minas marítimas, numa tentativa de manter aberta a rota energética mais importante do planeta.

Cerca de 20% do petróleo e do gás natural liquefeito transportado por via marítima no mundo passa pelo Estreito de Ormuz. A escalada militar já provocou forte volatilidade no mercado energético, com o barril de referência Brent crude oil a oscilar acima dos 90 dólares depois de ter chegado perto dos 120. No terreno, os confrontos também envolveram ataques a infra-estruturas e posições militares ligadas a aliados de Teerão, incluindo o Hezbollah.

Sem Filtros (fecho opinativo):
Quando o Estreito de Ormuz entra na linha de fogo, o impacto deixa de ser apenas regional — torna-se global. O petróleo é a artéria da economia mundial, e qualquer ameaça a essa rota transforma um conflito militar numa crise energética capaz de abalar governos, mercados e consumidores em todo o planeta. 🌍⛽', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 3257, '2026-03-12T06:50:52.208106+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('a9c5093c-5f4a-47d0-8a71-60dd009b8e3b', 'Mercado petrolífero: Brent crude oil toca os 80 dólares', 'O barril de Brent crude oil, referência para as exportações de Angola, foi negociado ontem no mercado de futuros de Londres entre 75,30 e 80,20 dólares, reflectindo oscilações ao longo da sessão.', 'Preço do barril do Brent “bate” nos 80 dólares

O preço do barril de petróleo da referência internacional Brent crude oil atingiu, esta semana, a marca dos 80 dólares, impulsionado por factores ligados às tensões geopolíticas, cortes na produção e expectativas em torno da procura global de energia.

Nos mercados internacionais, o aumento do Brent reflecte a sensibilidade dos investidores a riscos associados ao fornecimento, particularmente em regiões estratégicas produtoras de petróleo. Analistas indicam que qualquer instabilidade nas cadeias de abastecimento tende a provocar reacções imediatas nos preços, dada a importância do crude para a economia mundial.

Além das questões geopolíticas, decisões da OPEP e seus aliados relativamente aos níveis de produção continuam a influenciar directamente o comportamento do mercado. A gestão da oferta, aliada à recuperação gradual da procura em várias economias, tem contribuído para sustentar a valorização da matéria-prima.

Para Angola, país produtor e membro da OPEP, a subida do preço do Brent representa um potencial reforço das receitas fiscais e cambiais, num contexto em que o petróleo continua a desempenhar papel determinante no Orçamento Geral do Estado e na balança comercial.

Economistas, no entanto, alertam para a volatilidade do mercado petrolífero, sublinhando que oscilações bruscas podem ocorrer em função de factores externos, como decisões políticas, evolução da economia global e alterações na oferta internacional.

A manutenção do Brent em torno dos 80 dólares poderá trazer maior previsibilidade às contas públicas, mas especialistas defendem prudência e continuidade dos esforços de diversificação económica para reduzir a dependência do sector petrolífero.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5517, '2026-03-03T11:19:46.137282+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('3709dac3-4cbb-4151-be49-48c3ae5635d7', 'Falta de investimentos trava crescimento de Icolo e Bengo', 'A província de Icolo e Bengo necessita de novos investimentos para impulsionar o sector dos recursos minerais, petróleo e gás, segundo um relatório divulgado pela Agência Nacional de Recursos Minerais (ANRM). O documento, tornado público na quinta-feira, analisa a situação dos títulos mineiros na região e aponta a necessidade de maior dinamização do sector para potenciar o desenvolvimento económico local.', 'apesar do potencial geológico identificado na província, ainda há necessidade de maior participação de investidores e operadores do sector para impulsionar projectos de prospecção, pesquisa e exploração de recursos minerais. Segundo a ANRM, a mobilização de capital e tecnologia é fundamental para transformar esse potencial em projectos produtivos capazes de gerar impacto económico.

De acordo com o relatório, o desenvolvimento do sector extractivo em Icolo e Bengo pode desempenhar um papel relevante na diversificação da economia local, contribuindo para o aumento da produção mineral, criação de postos de trabalho e dinamização de cadeias de valor associadas à actividade mineira.

A agência reguladora sublinha ainda que o reforço de investimentos permitirá melhorar o aproveitamento dos títulos mineiros já atribuídos, bem como incentivar a realização de novos estudos geológicos e a identificação de outras áreas com potencial de exploração.

Especialistas do sector defendem que, para tornar a província mais atractiva aos investidores, será igualmente importante reforçar as infra-estruturas de apoio à actividade mineira, como estradas, energia e logística, factores considerados essenciais para viabilizar projectos de exploração em grande escala.

Com estas medidas, a expectativa é que Icolo e Bengo possa afirmar-se gradualmente como uma das regiões com maior potencial para o desenvolvimento do sector mineiro em Angola, contribuindo para o crescimento económico regional e para o fortalecimento da indústria extractiva nacional.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 4845, '2026-03-06T09:56:25.228458+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('172cfaf7-af9b-4aac-a241-ac496762a8da', 'Transferência das operações para Aeroporto António Agostinho neto concluída', 'O processo de transferência das operações regulares de passageiros do Aeroporto Internacional 4 de Fevereiro para o Aeroporto Internacional Dr. António Agostinho Neto (AIAAN), na província de Icolo e Bengo, está oficialmente concluído.', 'Iniciado a 10 de Novembro de 2024, a conclusão do processo foi assinalada este domingo, 1 de Março deste ano, com o início das operações da Airlink, segundo um comunicado de imprensa enviado ao Jornal de Angola Online.

O primeiro voo da companhia sul-africana aterrou no AIAAN às 12h20, transportando 80 passageiros a bordo de uma aeronave Embraer 190.

Com sede em Joanesburgo, a Airlink assegura ligações entre Angola e a África do Sul desde 21 de Outubro de 2021.

A partir de agora, a transportadora passa a realizar quatro frequências semanais, estabelecendo a ligação entre o Aeroporto Internacional Oliver Tambo, em Joanesburgo, e o Aeroporto Internacional Dr. António Agostinho Neto, localizado na província do Icolo e Bengo.
', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5914, '2026-03-01T21:00:28.691606+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('cf2562d4-2e05-4929-affa-ec1d63fc34a3', 'Senegal desafia CAF e recusa devolver troféu da CAN em meio a acusações de corrupção', 'A Federação Senegalesa de Futebol recusa-se a devolver o troféu da CAN após decisão polémica da CAF que atribui o título a Marrocos. O caso pode seguir para o Tribunal Arbitral do Desporto.', 'A Federação Senegalesa de Futebol rejeitou devolver o troféu da Taça das Nações Africanas, após a Confederação Africana de Futebol ter retirado o título ao Senegal e atribuído uma vitória administrativa por 3-0 a Marrocos, 58 dias depois da final disputada em campo.

A decisão, considerada inédita, gerou forte reacção por parte da federação senegalesa, que acusa a CAF de corrupção e promete levar o caso ao Tribunal Arbitral do Desporto, na Suíça, para contestar a legalidade da medida.

O título havia sido conquistado pelo Senegal dentro das quatro linhas, o que agrava ainda mais a polémica em torno da decisão administrativa que reverte o resultado desportivo.

Análise – Angola Sem Filtros

Se isto se confirmar, não é apenas uma polémica —
é um abalo sério na credibilidade do futebol africano.

Retirar um título quase dois meses depois da final é uma decisão extrema e levanta questões pesadas:

o que aconteceu de tão grave para justificar isso?

por que não foi resolvido antes?

quem ganha com esta reviravolta?

A reacção do Senegal não é só emocional — é estratégica. Ao levar o caso ao TAD, mostra que não aceita uma decisão que considera política e não desportiva.

No meio disso tudo, fica uma imagem perigosa:
a de que títulos em África podem ser decididos fora do campo.

E quando isso acontece, o futebol perde a sua base mais importante:
a confiança.', 'Desporto', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 1549, '2026-03-18T17:44:24.85294+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('2ab67af4-afc7-49b8-bbbe-14590aa265da', 'Antigos combatentes aplaudem programa de habitação social anunciado por João Lourenço', 'Delegações provinciais de antigos combatentes manifestaram apoio à iniciativa do Presidente da Angola, João Lourenço, que autorizou a construção de habitações sociais destinadas a antigos combatentes portadores de deficiência. O programa deverá beneficiar cidadãos nas províncias do Icolo e Bengo, Bengo, Bié, Moxico e Cuando Cubango.', 'Segundo representantes das delegações provinciais, a decisão é vista como um passo importante para reduzir as dificuldades sociais enfrentadas por muitos antigos combatentes, sobretudo aqueles que vivem com limitações físicas resultantes da sua participação em momentos marcantes da história do país.

Os antigos combatentes consideram que o programa de habitação representa também um reconhecimento do contributo dado por milhares de cidadãos na luta pela independência e na defesa da soberania nacional, esperando que a medida traga melhorias concretas nas condições de vida dos beneficiários.

Sem Filtros (fecho opinativo):
Durante décadas, muitos antigos combatentes viveram entre promessas e dificuldades. Programas como este mostram reconhecimento, mas o verdadeiro desafio será garantir que as casas saiam do papel e cheguem efectivamente a quem mais precisa. Em Angola, a diferença entre anúncio e realidade ainda é um teste constante às políticas públicas. 🇦🇴🏠', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 3186, '2026-03-12T06:32:27.304702+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('e257c749-705d-4077-a5b9-3f37b3dadc31', 'Isabel dos Santos alerta para retrocesso na produção de cimento em Angola', '“Angola voltou a importar cimento depois de quase 10 anos. Antes, o cimento produzido a nível nacional era suficiente”, afirmou.', 'A empresária angolana Isabel dos Santos manifestou preocupação com a retoma das importações de cimento em Angola, após quase dez anos em que a produção nacional satisfazia a procura interna.

Em declarações nos stories do seu perfil no Instagram, Isabel dos Santos considerou preocupante que o país volte a depender do mercado externo para suprir as necessidades do sector da construção civil.

Durante o período de maior estabilidade industrial, investimentos significativos na indústria cimenteira permitiram reduzir importações, fortalecer a cadeia de valor da construção e dinamizar o emprego. Para a empresária, a decisão atual representa um sinal de enfraquecimento da capacidade produtiva interna.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 7090, '2026-02-23T20:08:22.34507+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('525ac056-4580-49e8-a957-b2d91a0b480e', 'Ministério da Saúde inicia certificação de médicos especialistas a 26 deste mês', 'O Ministério da Saúde de Angola começa a entrega de certificados aos médicos especialistas formados no âmbito do Projecto de Recursos Humanos em Saúde, consolidando competências e reforçando a capacidade técnica do Sistema Nacional de Saúde.', 'O Ministério da Saúde dará início, a partir de 26 de fevereiro, à cerimónia oficial de certificação dos médicos especialistas formados pelo Projecto de Recursos Humanos em Saúde. A iniciativa foi orientada pela ministra Sílvia Lutucuta e pretende formalizar o reconhecimento institucional do esforço e dedicação dos profissionais do setor.

Nesta segunda-feira, 23, decorreu no Instituto de Especialização em Saúde (IES) um encontro técnico de concertação para harmonizar e validar todos os procedimentos logísticos e institucionais da certificação. O evento contou com a presença do coordenador do projeto, Job Monteiro, do director-adjunto do IES, Eduardo Caiangula, membros da Direcção da Unidade de Implementação do Projecto (UIP) e representantes do Gabinete de Comunicação Institucional do MINSA.

Segundo Job Monteiro, a maioria dos especialistas concluiu a formação no último trimestre de 2025, enquanto outros finalizaram em janeiro deste ano. Todas as condições técnicas foram consideradas reunidas para o acto de certificação, considerado um momento de reconhecimento da competência dos quadros nacionais.

A ministra Sílvia Lutucuta destacou que a valorização dos especialistas é um compromisso estratégico do Executivo, essencial para garantir a qualidade, humanização e eficiência dos serviços de saúde. A iniciativa reafirma o empenho do Governo de Angola em modernizar e fortalecer o Sistema Nacional de Saúde, alinhando formação, reconhecimento e prática profissional.

Rodapé editorial (Sem Filtros)

Nota do editor: A certificação de especialistas médicos reforça a capacidade técnica do Sistema Nacional de Saúde e evidencia a prioridade do Governo na formação contínua de profissionais qualificados. Acompanhar de perto estas iniciativas é essencial para compreender o desenvolvimento do setor em Angola.', 'Saúde', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 7128, '2026-02-25T02:19:14.266299+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('591edccc-6d60-47b1-8f17-ab6851f9a5c8', '📰 Moçambique contrata consultora dos EUA após críticas do FMI e gera debate interno', 'Depois das críticas do Fundo Monetário Internacional à situação económica de Moçambique, o Governo decidiu contratar a consultora norte-americana Alvarez & Marsal para apoiar a reorganização das contas públicas. A decisão está a gerar contestação entre especialistas, que questionam os custos e a necessidade de recorrer a apoio externo quando existem quadros nacionais qualificados.', 'A contratação de uma consultora internacional pelo Governo moçambicano surge na sequência de alertas do Fundo Monetário Internacional sobre a fragilidade do ambiente macroeconómico do país. Entre as principais preocupações estão o crescimento moderado, a redução da ajuda externa, a vulnerabilidade fiscal e o aumento da dívida interna.

O Ministério das Finanças anunciou a contratação da empresa norte-americana especializada em reestruturação e revitalização de instituições em crise, com o objectivo de apoiar o Executivo a reorganizar as contas públicas e melhorar a gestão financeira do Estado.

A medida, porém, gerou debate no meio académico e económico. A economista Teresa Boene questiona a necessidade de recorrer a especialistas estrangeiros, defendendo que Moçambique possui profissionais qualificados nas áreas de economia e finanças capazes de apoiar reformas fiscais.

Outra preocupação levantada prende-se com o custo da consultoria e o chamado custo de oportunidade — isto é, quanto o Estado irá gastar e que benefícios concretos poderá obter em comparação com outras prioridades de investimento público.

O FMI, por sua vez, recomenda contenção salarial e reformas estruturais para restaurar a estabilidade macroeconómica, proteger grupos vulneráveis e criar bases para um crescimento sustentável e inclusivo.

Já o analista Anísio Buanaissa defende uma abordagem alternativa, argumentando que o aumento da procura interna e a valorização da produção nacional podem dinamizar a economia, estimular o investimento privado e contribuir para maior arrecadação fiscal.

O debate evidencia um dilema recorrente em economias em desenvolvimento: equilibrar apoio técnico internacional com o aproveitamento da capacidade interna, garantindo ao mesmo tempo transparência, eficiência e resultados concretos para a população.', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 7002, '2026-02-24T11:49:34.524597+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('772f4887-02c5-415c-844c-3d22f5c94a34', 'Sem Filtros | RDCongo: Governo e M23 trocam acusações de violação do cessar-fogo mediado por Angola', 'O Governo da República Democrática do Congo e o grupo armado Movimento 23 de Março (M23) acusaram-se mutuamente de violar o cessar-fogo proposto por Angola para o leste da RDCongo.', 'O contexto

Angola propôs que o cessar-fogo entrasse em vigor na quarta-feira.

Kinshasa aceitou a proposta, mas sem confirmar uma data específica.

O M23 reagiu acusando o Governo de manipulação e alegou que o cessar-fogo já teria sido violado.

O leste da RDCongo enfrenta mais de 30 anos de conflitos contínuos. Desde 2021, o M23 ressurgiu, retomando vastas áreas nos Kivu do Norte e Kivu do Sul, com alegado apoio do Ruanda. Em dezembro, o grupo lançou uma ofensiva contra Uvira, mesmo durante negociações entre RDCongo e Ruanda sob mediação norte-americana, irritando Washington.

O quadro atual

A intensidade dos combates diminuiu temporariamente na quarta e quinta-feira, segundo fontes locais.

Hoje, o exército congolês acusou o M23 de atacar posições em Kivu do Norte e Kivu do Sul, afirmando que o grupo sabotou o processo de paz.

O M23 denunciou, por sua vez, violações do cessar-fogo pelas forças de Kinshasa.

Fontes locais indicam retoma dos combates nos arredores de Minembwe, planaltos do Kivu do Sul, onde o exército congolês, apoiado por milícias locais e soldados burundeses, enfrenta milícias alinhadas ao M23. Nos restantes pontos da frente, a calma relativa foi mantida.

Leitura crítica (Sem Filtros)

A situação demonstra a fragilidade das mediações externas: mesmo com Angola e os EUA a tentar impor cessar-fogo, a desconfiança mútua e a pressão militar imediata tornam qualquer acordo temporário e volátil.

A escalada em Minembwe evidencia que linhas de frente locais continuam a ser palco de confrontos, independentemente dos anúncios formais de cessar-fogo.

A narrativa oficial de ambos os lados é de acusação mútua, enquanto o terreno mostra que o conflito é estrutural e resistente a acordos pontuais, indicando que qualquer trégua terá de ser acompanhada de fiscalização real e comprometimento militar concreto.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 7160, '2026-02-25T01:18:22.933063+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('b901ef67-a68f-42d3-b02e-e7ca0210b26a', 'João Lourenço troca liderança na PGR e nomeia Pedro Mendes de Carvalho', 'O Presidente da República nomeou Pedro Mendes de Carvalho como novo procurador-geral da República, substituindo Hélder Pita Grós, após validação do processo pelo órgão competente.', 'O Presidente João Lourenço nomeou, esta quarta-feira (18), Pedro Mendes de Carvalho para o cargo de procurador-geral da República, marcando o fim do mandato de Hélder Pita Grós.

A nomeação acontece após a homologação dos resultados da eleição dos candidatos pelo Conselho Superior da Magistratura do Ministério Público, órgão responsável pela condução do processo.

A decisão foi formalizada na 4.ª sessão extraordinária do órgão, referente ao 4.º ano do 5.º mandato, realizada no passado dia 16 de Março de 2026.

Análise – Angola Sem Filtros

Mudam-se os nomes, mas a grande questão mantém-se:
vai mudar alguma coisa na justiça angolana?

A saída de Hélder Pita Grós encerra um ciclo marcado por forte mediatização do combate à corrupção, mas também por críticas quanto à selectividade dos processos e aos resultados práticos.

A entrada de Pedro Mendes de Carvalho levanta expectativas, mas também desconfiança:

haverá continuidade ou ruptura?

o Ministério Público ganhará mais independência real ou manterá alinhamento político?

Num país onde a justiça é frequentemente vista como instrumento e não como árbitro, o novo procurador-geral entra com um desafio claro:
provar, com actos — não discursos — que a lei é igual para todos.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 1417, '2026-03-18T17:36:16.065234+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('e50be5a3-1b60-40e0-958e-d3d8432002ff', 'Angolanos retirados de Israel chegam a Luanda após operação de evacuação marcada por tensão no Médio Oriente', 'O Governo angolano concluiu a segunda fase da operação de retirada de cidadãos nacionais que se encontravam em Israel, num contexto de crescente tensão militar no Médio Oriente. Oito angolanos chegaram esta sexta-feira a Luanda depois de vários dias de incerteza, numa operação organizada pelo Ministério das Relações Exteriores para garantir a segurança dos compatriotas.', 'Segundo o embaixador de Angola em Israel, Nelson Cosme, esta etapa do plano de contingência envolveu uma longa deslocação terrestre de mais de dez horas entre Telavive e o Cairo, no Egipto, antes do embarque aéreo com escala em Adis Abeba, na Etiópia, até Luanda. Na primeira fase da operação, realizada na semana passada, já tinham sido retirados nove cidadãos.

As autoridades angolanas indicam que, para já, não está prevista uma terceira evacuação. Parte dos angolanos que continuam em Israel são religiosos ou têm vínculos familiares no país e optaram por permanecer. No total, as duas fases da operação permitiram o regresso a Angola de 22 cidadãos, num momento em que o conflito regional se intensifica após ataques e retaliações militares envolvendo Israel, Irão e os Estados Unidos.

Sem Filtros (fecho opinativo):
A evacuação mostra que, quando há vontade política, o Estado consegue proteger os seus cidadãos no exterior. Mas também expõe uma realidade: milhares de angolanos vivem e trabalham em zonas de risco no mundo, muitas vezes longe da atenção do próprio país. Em tempos de crise internacional, a diplomacia deixa de ser protocolo e passa a ser, simplesmente, uma questão de salvar vidas.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 3893, '2026-03-09T17:40:33.724165+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('66cb7e74-0658-44f8-84cb-9e09f0c5cd62', 'Irão condiciona passagem no Estreito de Ormuz à expulsão de diplomatas dos Estados Unidos e de Israel', 'A Guarda Revolucionária Islâmica anunciou que permitirá passagem livre pelo Estreito de Ormuz apenas a navios provenientes de países árabes ou europeus que decidam expulsar diplomatas dos Estados Unidos e de Israel. A declaração surge num momento de forte escalada política e militar na região do Golfo.', 'O estreito de Ormuz é considerado um dos corredores marítimos mais estratégicos do mundo, por onde passa cerca de 20 por cento do comércio global de petróleo. Actualmente, a região enfrenta um bloqueio quase total, depois de ameaças das forças iranianas contra qualquer embarcação que tente atravessar a zona sem autorização.

Segundo a imprensa internacional, o impacto da medida já se faz sentir nos mercados energéticos globais. O preço do barril de petróleo ultrapassou os 100 dólares, reflexo directo da crescente tensão geopolítica no Médio Oriente e do receio de interrupções no fornecimento mundial de energia.

Sem Filtros (fecho opinativo):
Quando o petróleo entra na equação, a política internacional torna-se ainda mais explosiva. O Estreito de Ormuz não é apenas uma rota marítima — é uma peça-chave da economia mundial. Qualquer ameaça ao seu funcionamento transforma-se imediatamente num problema global, capaz de afectar desde governos até o bolso de milhões de consumidores. 🌍⛽', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 3354, '2026-03-11T10:44:24.41516+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('5878c5af-444e-4448-9132-9e44d6a39fc6', 'Escolha do novo líder supremo do Irão provoca irritação em Washington e reacção de Trump', 'A nomeação de Mojtaba Khamenei como novo Líder Supremo do Irão gerou desconforto em Washington. O Presidente dos Estados Unidos, Donald Trump, manifestou esta segunda-feira desagrado pela escolha, que sucede ao longo domínio do aiatolá Ali Khamenei, numa transição que pode agravar a tensão entre Irão e Estados Unidos.', 'Questionado sobre a possibilidade de uma intervenção militar norte-americana, Trump afirmou que não existe qualquer decisão nesse sentido e que Washington está “longe de avançar” para o envio de tropas para território iraniano. A reacção surge num momento de forte instabilidade regional e de escalada de confrontos indirectos entre potências no Médio Oriente.

Considerado próximo da Guarda Revolucionária Islâmica, Mojtaba Khamenei é visto por analistas como defensor de uma linha conservadora semelhante à seguida pelo pai. Especialistas em relações internacionais alertam que a sucessão, formalmente supervisionada pela Assembleia de Peritos, poderá endurecer ainda mais a postura de Teerão perante a pressão externa de Washington e de aliados como Israel.

Sem Filtros (fecho opinativo):
No Irão, o poder raramente muda de rumo — muda apenas de mãos. A irritação de Washington revela mais frustração estratégica do que surpresa política. O verdadeiro problema não é quem lidera em Teerão, mas o facto de o confronto entre as duas potências continuar preso a um ciclo de desconfiança que mantém o Médio Oriente permanentemente à beira da explosão.', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 3879, '2026-03-09T19:25:50.730123+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('a962fd5a-7eed-499a-b017-97039bba67a3', 'Presidente autoriza 4,5 mil milhões Kz para medicamentos de doenças crónicas', 'O Presidente da República, João Lourenço, autorizou uma despesa no valor de 4,5 mil milhões de kwanzas para a aquisição de medicamentos destinados ao tratamento da diabetes, hipertensão arterial e anemia falciforme, segundo um decreto presidencial divulgado esta terça-feira.', 'Resumo (3 alíneas):

O Presidente da República autorizou uma despesa de 4,5 mil milhões de kwanzas para a aquisição de medicamentos destinados à diabetes, hipertensão e anemia falciforme.

A medida inclui a abertura de um concurso público para um acordo-quadro de fornecimento aos hospitais públicos.

O Executivo justifica a decisão com a necessidade de garantir a continuidade dos tratamentos e melhorar a assistência médica.

Num despacho consultado pela Lusa, o Chefe de Estado formaliza igualmente a abertura de um concurso público para a celebração de um acordo-quadro que viabilize a compra destes medicamentos, considerados essenciais para o funcionamento das unidades hospitalares públicas.

De acordo com o decreto, o objectivo central da medida é assegurar a assistência médica e medicamentosa aos doentes que recorrem ao sistema público de saúde, garantindo a continuidade dos tratamentos e a melhoria da qualidade dos serviços prestados.

O despacho presidencial delega à Ministério da Saúde a competência para aprovar as peças do procedimento do concurso, nomear a comissão de avaliação e verificar a validade e legalidade de todos os actos praticados no âmbito do processo, com possibilidade de subdelegação.

Angola Sem Filtros – Análise
A autorização da despesa responde a uma necessidade real num país onde as doenças crónicas afectam milhares de famílias, muitas vezes sem acesso regular a medicamentos básicos.

Contudo, o histórico de concursos públicos na saúde levanta dúvidas sobre transparência, prazos e execução efectiva, factores que frequentemente travam medidas anunciadas como urgentes.

Sem fiscalização rigorosa e garantia de distribuição equitativa, o risco é que os 4,5 mil milhões de kwanzas fiquem no papel, enquanto os hospitais continuam a lidar com rupturas de stock e doentes sem tratamento.

', 'Saúde', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 5173, '2026-03-04T15:06:26.117451+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('fb9bb88d-b2e9-40af-b3f0-ab330b60e77e', 'Noite grande na Liga dos Campeões: quatro jogos prometem espectáculo e tensão europeia', 'A UEFA Champions League volta a aquecer os relvados europeus esta noite com quatro partidas que prometem emoção e equilíbrio. O destaque inicial vai para o duelo entre Galatasaray SK e Liverpool FC, marcado para as 18h45, num confronto em que os turcos apostam na força do ambiente em Istambul para travar o poder ofensivo inglês.', 'Às 21h00 entram em campo três confrontos de peso. O Newcastle United FC recebe o FC Barcelona, num duelo entre tradição europeia e o renascimento competitivo do clube inglês. No mesmo horário, o Atlético de Madrid mede forças com o Tottenham Hotspur FC, partida que promete intensidade táctica entre duas equipas conhecidas pela disciplina defensiva e transições rápidas.

A jornada fecha com um confronto de gigantes ofensivos entre Atalanta BC e FC Bayern München. A equipa italiana tenta impor o seu futebol ofensivo diante de um dos clubes mais poderosos da Europa, num jogo que pode decidir posições importantes na competição.

Sem Filtros (fecho opinativo):
A Champions não vive apenas de nomes grandes, vive de noites imprevisíveis. Quando clubes históricos e equipas emergentes se encontram no mesmo palco, a lógica muitas vezes fica no balneário. E é exactamente por isso que estas noites europeias continuam a ser o verdadeiro espectáculo do futebol mundial. ⚽', 'Desporto', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 3753, '2026-03-10T06:39:22.883477+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('fe9e4476-712b-4a9a-b61a-85f5ee370e88', 'Inundações e deslizamentos de terra provocam pelo menos 30 mortos na Etiópia', 'Pelo menos 30 pessoas morreram na sequência de fortes inundações e deslizamentos de terra registados no sul da Etiópia, segundo informações divulgadas pelas autoridades locais. A tragédia atingiu sobretudo a região de Gamo, uma zona densamente povoada situada a sudoeste da capital, Adis Abeba.', 'Num comunicado citado pela agência Lusa, a administração regional informou que as equipas locais estão a prestar assistência às populações afectadas, mobilizando apoio para reduzir os impactos do desastre e evitar novos danos. A região de Gamo é conhecida pela sua vegetação densa e pela produção agrícola, com destaque para o cultivo de bananas.

Nos últimos dias, vários países da África Oriental têm sido afectados por chuvas torrenciais e inundações. No Quénia, pelo menos 49 pessoas morreram na sexta-feira devido a fenómenos semelhantes. Especialistas alertam que eventos climáticos extremos, alternando entre secas severas e chuvas intensas, têm-se tornado mais frequentes nas últimas duas décadas, fenómeno associado às alterações climáticas.

Sem Filtros (fecho opinativo):
A cada nova tragédia climática em África repete-se o mesmo padrão: vidas perdidas, infra-estruturas frágeis e respostas tardias. Enquanto o debate global sobre o clima continua, muitas comunidades africanas enfrentam na prática as consequências mais duras de um problema que pouco contribuíram para criar. 🌧️🌍', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 3370, '2026-03-11T10:35:57.660907+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('8e7fbcec-62ff-4452-94ac-f2946fc9c86a', 'CNE ganha novo rosto: Manuel Sabonete Camati assume função de porta-voz em pleno arranque do ciclo eleitoral', 'A Comissão Nacional Eleitoral (CNE) nomeou o comissário Manuel Sabonete Camati como novo porta-voz da instituição. A decisão surge numa fase em que o órgão eleitoral prepara o próximo ciclo eleitoral e após mudanças recentes na composição da comissão, num contexto político marcado pela ausência de representantes da oposição na estrutura actual.', 'A Comissão Nacional Eleitoral (CNE) designou, esta quinta-feira, o comissário Manuel Sabonete Camati para assumir a função de porta-voz da instituição responsável por organizar, coordenar e conduzir os processos eleitorais em Angola. Na nova função, Caber-lhe-á assegurar a divulgação das posições institucionais da CNE e a relação com os órgãos de comunicação social.

O cargo estava vago desde 2024, quando Lucas Manuel João Quilundo, que exercia essa responsabilidade, foi nomeado juiz conselheiro do Tribunal Constitucional pelo Presidente da República, João Lourenço, para um mandato de sete anos não renováveis naquele tribunal superior.

Durante a reunião que formalizou a designação, os membros da CNE analisaram também vários temas ligados à preparação do próximo ciclo eleitoral, incluindo o relatório-síntese dos concursos públicos destinados a garantir meios logísticos e técnicos para as eleições gerais previstas para o próximo ano.

A actual composição da CNE foi igualmente consolidada depois de o Tribunal Constitucional considerar improcedentes dois processos interpostos pelo grupo parlamentar da UNITA. Com isso, o Parlamento aprovou a nova composição da comissão eleitoral, que actualmente não conta com representantes do principal partido da oposição, mantendo a distribuição de comissários baseada nos resultados das eleições de 2022.

Análise – Angola Sem Filtros

A escolha de um novo porta-voz para a CNE surge num momento politicamente sensível: o país aproxima-se de um novo ciclo eleitoral e a credibilidade das instituições eleitorais continua sob escrutínio público. Mais do que uma função meramente comunicacional, o cargo de porta-voz torna-se central para gerir a narrativa institucional num ambiente de desconfiança política.

A ausência de representantes da UNITA na actual composição da CNE agrava a percepção de desequilíbrio político dentro do órgão que deve garantir imparcialidade eleitoral. Mesmo que a decisão tenha respaldo jurídico do Tribunal Constitucional, no plano político a situação reforça a tensão entre governo e oposição.

No fundo, a questão que permanece não é apenas quem fala pela CNE, mas até que ponto a instituição consegue convencer o país de que o processo eleitoral será conduzido com transparência e equilíbrio. Em Angola, a batalha eleitoral começa muitas vezes antes do voto — começa na confiança nas instituições que organizam as eleições.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 2061, '2026-03-16T07:25:53.466278+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('9a857800-42b4-4c9c-b755-d5e46e70f928', 'Vera Daves desafia críticos e garante: financiamento externo para o OGE “não assusta”', 'A ministra das Finanças afirmou, em Luanda, que a captação de financiamento — sobretudo externo — para o Orçamento Geral do Estado (OGE) em vigor não representa motivo de preocupação, sublinhando a existência de linhas disponíveis com custos considerados baixos e margem de manobra para ajustes entre financiamento interno e externo.', 'Contexto
Durante a V edição do programa Conversas Economia 100 Makas, conduzido por Carlos Rosado de Carvalho, a ministra Vera Daves de Sousa abordou o tema “OGE 2026, as Empresas e as Famílias”. A discussão ocorre num momento em que o Executivo prepara a cobertura das necessidades de financiamento do próximo exercício orçamental, após a aprovação do Plano Anual de Endividamento.

Factos e declarações
Segundo a ministra, “o número do financiamento externo não me assusta”, argumentando que há “bastante financiamento” disponível, em especial através de agências de crédito à exportação, o que reduz significativamente o custo. De acordo com Vera Daves, essas linhas podem situar-se “em torno de 3% ou menos”.

O Joao Lourenco aprovou o Plano Anual de Endividamento 2026, que prevê a captação de 15,03 biliões de kwanzas (cerca de 13,8 mil milhões de euros), equivalentes a 11,01% do PIB, para financiar o OGE de 2026.

A ministra indicou ainda que, havendo capacidade de execução, o Governo pode desembolsar até quatro biliões de kwanzas por meio de linhas já contratadas, classificadas como “não muito caras”. Para o remanescente, apontou alternativas como emissões nos mercados internacionais, recursos junto de multilaterais — como o Banco Mundial e o Banco Africano de Desenvolvimento — e a diversificação de praças financeiras.

No total, Angola projeta mobilizar 7,93 biliões de kwanzas em financiamento externo e 7,11 biliões de kwanzas no mercado interno.

Análise crítica
A ministra reconheceu que a mobilização interna pode ser “mais exigente”, dependendo da existência de poupanças ociosas em seguradoras e fundos de pensões. Defendeu que, sendo elegíveis para o mercado primário via BODIVA, essas instituições podem contribuir para reforçar a captação doméstica. Caso contrário, o Executivo admite remanejamentos entre as parcelas interna e externa ou a calibração da despesa em função do financiamento efetivamente obtido.

A estratégia apresentada aposta na flexibilidade e na combinação de fontes, mas pressupõe capacidade de execução e disciplina na gestão do endividamento, sobretudo num contexto de volatilidade externa e restrições internas de poupança.

Fecho
As declarações de Vera Daves sinalizam confiança do Executivo na engenharia financeira do OGE 2026, apoiada em linhas concessionais e acesso a mercados. O teste decisivo será a velocidade de desembolso, o custo médio efetivo da dívida e a capacidade de o financiamento se traduzir em impacto económico sem pressionar excessivamente as contas públicas.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 6976, '2026-02-25T16:43:04.764156+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('224af30c-b328-4d31-9645-71dd87b279e0', 'Benfica foi ao Bernabéu tentar roubar a coroa, mas o feitiço do Real Madrid voltou a impor-se', 'O Benfica caiu esta noite na Liga dos Campeões, depois de perder por 2-1 frente ao Real Madrid, no Santiago Bernabéu. As águias estiveram perto do impossível, fizeram um jogo de coragem e qualidade, mas sucumbiram novamente ao pragmatismo europeu dos merengues, com Vinícius Júnior decisivo.', 'O Bernabéu não obedece às leis do futebol comum

No Santiago Bernabéu, o futebol segue regras próprias. O que vale noutros relvados não se aplica ali. É um território onde o jogo pode ser dominado pelo adversário, mas o resultado acaba quase sempre por sorrir aos de branco.

O Benfica entrou sem medo, com personalidade, coragem e ideias claras. Aos 14 minutos, Rafa Silva colocou justiça no marcador ao fazer o 1-0, acendendo a esperança encarnada numa noite que parecia destinada a algo maior.

Durante largos períodos, as águias foram melhores. Circularam a bola, encontraram espaços e chegaram a encostar o Real Madrid às cordas. Rafa Silva esteve em noite inspirada, acertou na barra quando o empate já estava no marcador e deixou a sensação clara de que a eliminatória podia cair para o lado português.

Mas o Bernabéu não perdoa falhas.

Pouco jogo, máximo castigo

Num raro erro do Benfica, Aurélien Tchouaméni empatou a partida ainda na primeira parte, num daqueles momentos em que o Real transforma uma ocasião isolada em golo.

Na segunda parte, quando o jogo parecia equilibrado e emocionalmente aberto, bastou um duelo perdido e um passe vertical de Federico Valverde para Vinícius surgir no espaço e sentenciar a eliminatória com frieza. Dois remates enquadrados, dois golos. Trinta tentativas do Benfica, apenas um golo. O retrato perfeito do feitiço merengue.

Tão perto, tão longe — outra vez

O Benfica sai da Champions com frustração, mas também com dignidade. Jogou olhos nos olhos com o rei da Europa, mostrou organização, talento e ambição. Faltou apenas aquilo que o Real Madrid tem de sobra nesta competição: instinto assassino e uma relação quase mística com a vitória.

O resultado final (5-2 no agregado) parece pesado face ao que se passou em campo, mas no Bernabéu não se contam merecimentos — contam-se golos.

O Real Madrid segue para os oitavos-de-final. O Benfica regressa a casa com a sensação amarga de quem esteve muito perto de escrever história… mas foi travado pelo feitiço mais antigo da Liga dos Campeões.

Rodapé Editorial — Sem Filtros

No Bernabéu, a esperança é concedida para ser retirada no momento exato. O Benfica ousou sonhar, jogou como grande, mas descobriu — mais uma vez — que, na Europa, o Real Madrid não precisa dominar para vencer. Precisa apenas esperar.', 'Desporto', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 6821, '2026-02-26T11:39:15.994647+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('a5dc513b-bbb3-41fa-abbd-29b2dd3baadb', 'Morte de “El Mencho” desencadeia onda de violência e bloqueios de transportes no México', 'O estado mexicano de Jalisco entrou em alerta máximo de segurança após uma série de ataques coordenados atribuídos a grupos do narcotráfico, que incendiaram veículos, postos de combustíveis e lojas de...', 'O estado mexicano de Jalisco entrou em alerta máximo de segurança depois de uma série de ataques coordenados atribuídos a grupos do narcotráfico. As ações violentas foram registadas principalmente na cidade de Guadalajara, onde criminosos incendiaram veículos, postos de combustíveis e lojas de conveniência.

De acordo com autoridades locais, os ataques ocorreram em diferentes pontos da região e provocaram momentos de pânico entre moradores e comerciantes. Várias vias foram bloqueadas e equipes de emergência foram mobilizadas para conter os incêndios e garantir a segurança da população.

As forças de segurança mexicanas reforçaram o patrulhamento e iniciaram operações para localizar os responsáveis pelos ataques. Até ao momento, não foram divulgados detalhes sobre possíveis detenções relacionadas com os incidentes.

As autoridades continuam a monitorizar a situação e apelam à população para manter a calma e seguir as orientações das forças de segurança.
', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 6933, '2026-02-23T15:36:22.507074+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('543fdcfe-7091-4cd3-9b8b-f955baf08922', 'Angola e Namíbia reforçam cooperação judiciária com acordo de troca de reclusos', 'Angola e Namíbia avançam no aprofundamento da cooperação judiciária e penitenciária, após a identificação de 176 cidadãos angolanos detidos na Prisão Central de Windhoek, passo decisivo para a operacionalização do mecanismo de transferência de reclusos entre os dois Estados.', 'No quadro do aprofundamento das relações bilaterais no domínio da justiça, uma delegação técnica e multissectorial angolana procedeu à identificação de 176 cidadãos nacionais presos na Namíbia, especificamente na Prisão Central de Windhoek.

A iniciativa enquadra-se no processo de verificação consular, jurídica e administrativa, necessário para a operacionalização do acordo de troca e transferência de reclusos, permitindo que cidadãos condenados possam cumprir o remanescente da pena no seu país de origem, mediante enquadramento legal.

🔎 Leitura Angola Sem Filtros

Número revela padrão, não excepção: A identificação de 176 reclusos evidencia uma realidade persistente da migração transfronteiriça com impacto directo no sistema penal.

Diplomacia técnica em marcha: O processo indica avanço concreto da cooperação institucional, muitas vezes antecedendo anúncios políticos formais.

Dimensão humana do sistema penal: A eventual transferência poderá mitigar isolamento familiar, linguístico e social, factores críticos para a reinserção.

Integração regional: A iniciativa alinha-se com os princípios de cooperação judiciária no espaço da Comunidade de Desenvolvimento da África Austral, que incentiva mecanismos comuns de justiça e segurança.

De acordo com informações institucionais, a transferência de reclusos deverá ocorrer de forma faseada, dependendo do consentimento dos detidos, do trânsito em julgado das sentenças e da validação simultânea das autoridades judiciais e penitenciárias de ambos os países.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 7067, '2026-02-25T07:19:36.003846+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('5ec5f785-b0b8-40d7-9f61-0af204d89f0f', 'Rede de exploração sexual em hotel de Viana expõe tráfico de mulheres estrangeiras em Luanda', 'Uma operação do Serviço de Investigação Criminal desmantelou em Luanda uma alegada rede de exploração sexual que operava num hotel do município de Viana. Dois homens — um cidadão chinês, proprietário do estabelecimento, e um gestor angolano — foram detidos sob suspeita de tráfico de seres humanos, lenocínio e associação criminosa.', 'Durante a operação, os investigadores resgataram 21 mulheres estrangeiras, maioritariamente provenientes do Vietname, que alegadamente eram recrutadas para participar em espectáculos nocturnos de pole dance e para manter relações sexuais mediante pagamento. Entre as vítimas identificadas estão 13 cidadãs vietnamitas, duas do Camboja, uma da China e uma de Marrocos, além de outras nacionalidades ainda por confirmar.

Nas buscas realizadas no local, o SIC apreendeu cerca de 12 milhões de kwanzas em numerário, uma substância suspeita de ser droga e produtos de origem animal, incluindo escamas de pangolim e chifres de antílopes africanos, indícios que levantam suspeitas de ligação a redes de caça furtiva e contrabando. As vítimas estão agora sob acompanhamento das autoridades, enquanto os detidos aguardam apresentação ao Ministério Público.

Sem Filtros (fecho opinativo):
O caso revela mais do que um simples crime num hotel de Luanda: expõe como redes internacionais conseguem infiltrar-se e operar à sombra da fiscalização. Quando tráfico humano, exploração sexual e contrabando aparecem no mesmo lugar, a pergunta que fica no ar é simples — durante quanto tempo isto funcionou sem que ninguém visse, ou sem que alguém quisesse ver?', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 3863, '2026-03-09T19:39:29.94671+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('fdb0c822-e979-4071-b58e-a52c9bc2133c', '“UBUNTU”: projecto angolano quer colocar África no mapa das redes sociais globais', 'A ByteKwanza prepara o lançamento da rede social “UBUNTU” até 2027, com foco na identidade africana e ambição de competir com plataformas internacionais.', 'A ByteKwanza anunciou um plano estratégico que visa transformar Angola num polo tecnológico africano, com destaque para o desenvolvimento da rede social “UBUNTU”, pensada para disputar espaço com gigantes como a Meta.

A plataforma promete ir além do modelo tradicional, apostando na valorização da identidade africana, inclusão digital e criação de oportunidades de rendimento para utilizadores, através de ferramentas de monetização de conteúdos.

Segundo a empresa, o projecto encontra-se em fase avançada de planeamento, envolvendo equipas multidisciplinares no desenvolvimento de tecnologias próprias, como inteligência artificial, sistemas de pagamento integrados e soluções de segurança digital adaptadas ao contexto africano.

Análise – Angola Sem Filtros

A ambição é clara:
não é só criar uma rede social — é disputar poder digital.

Mas o desafio é brutal.

Concorrer com plataformas como a Meta significa enfrentar:

bilhões em investimento

infraestruturas globais

hábitos já consolidados dos utilizadores

Por outro lado, há uma vantagem que poucos exploraram a sério:
👉 conteúdo africano para africanos, com lógica africana

Se o “UBUNTU” conseguir:

facilitar ganhos reais para criadores

garantir boa experiência e estabilidade

conquistar confiança dos utilizadores

pode encontrar um espaço próprio.

Se falhar nisso, será apenas mais uma ideia forte que não escala.

No fim, o jogo não é tecnológico —
é de adopção. E adopção não se impõe, conquista-se.', 'Tecnologia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 1478, '2026-03-18T18:05:41.923453+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('6dff55c3-e118-4e2a-b578-f49cfb063498', 'Papa Leão XIV anuncia visita apostólica de quatro dias a Angola', 'Torna-se público que Papa Leão XIV efectuará uma Viagem Apostólica de quatro dias a Angola, com chegada a Luanda marcada para 18 de Abril de 2026, segundo informação oficial da Santa Sé.', 'Durante a deslocação, Sua Santidade visitará Luanda, Muxima e Saurimo, num programa que deverá combinar momentos pastorais, encontros institucionais e celebrações religiosas de grande dimensão, com especial destaque para o Santuário de Muxima, um dos principais símbolos da fé católica em Angola.

A visita ocorre num contexto de reforço do papel da Igreja Católica no diálogo social, na promoção da paz e na mediação moral em países africanos marcados por desafios económicos, sociais e institucionais. Angola, onde a Igreja mantém forte implantação histórica e influência comunitária, surge assim como paragem estratégica no itinerário africano do novo pontificado.

Fontes eclesiásticas indicam que a agenda deverá incluir mensagens dirigidas à juventude, às autoridades civis e às comunidades mais vulneráveis, bem como apelos à reconciliação, justiça social e valorização da dignidade humana.

As autoridades angolanas e a Conferência Episcopal deverão anunciar, nas próximas semanas, os detalhes logísticos e de segurança, bem como o programa oficial das cerimónias públicas.

Rodapé Editorial — Angola Sem Filtros
A visita de Leão XIV coloca Angola novamente no centro do mapa diplomático-religioso internacional. Para além do simbolismo espiritual, o gesto carrega leitura política e social: a Igreja volta a lembrar que fé, justiça social e responsabilidade do poder caminham juntas — sobretudo em países onde a esperança continua a disputar espaço com a desigualdade.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 6838, '2026-02-25T11:58:46.649133+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('83406e58-f688-48bf-b425-fe5237ac330c', 'Sector petrolífero mobiliza mais de 70 mil milhões de dólares em investimentos', 'O sector petrolífero de Angola prevê atrair, nos próximos cinco anos, investimentos avaliados em cerca de 70 mil milhões de dólares, reforçando a aposta na expansão e dinamização da indústria nacional de petróleo.', ' valor representa uma média anual entre 14,5 e 15 mil milhões de dólares.

A depender de novas descobertas, o sector de Petróleo e Gás prevê investimentos acima do valor avançado, mas também garante que está a trabalhar afincadamente para manter a produção acima de um milhão de barris/dia.

De acordo com o presidente do Conselho de Administração da Agência Nacional de Petróleo, Gás e Biocombustíveis, Paulino Jerónimo, esta projecção mantém um alinhamento com as estimativas anuais apresentadas pelo Governo.

Em 2026, reforçou, o OGE projecta uma produção de 1,05 milhões de barris, depois de ter concretizado 1,03 milhões em 2025.

Na entrevista exclusiva concedida ao Jornal de Economia & Finanças, Paulino Jerónimo disse que a Concessionária Nacional, entre 2019 e 2025, licitou 64 concessões, depois de nove anos sem processos similares.

O plano é avançar com mais nove concessões, em negociação, para chegar-se ao total de 73 concessões e manter o país na meta de produzir acima de um milhão de barris/dia e vencer os níveis actuais de declínio que se estima entre 15 e 16 por cento.

Novas descobertas
O gestor máximo da ANPG fez saber que, neste momento, o país coloca, anualmente, para a produção nacional, 50 a 70 mil barris, o que permite manter a produção anual dos últimos anos, sobretudo desde 2022.

Todo este ambiente é visto como positivo, num sector que é desafiado a manter ou aumentar os 30 mil postos de trabalho já garantidos até aqui. Destes empregos gerados, 87 por cento representa a presença angolana no sector.

Paulino Jerónimo lembra que, para todo este ambiente positivo, as respostas céleres do Governo têm sido fundamentais.

Por exemplo, as reformas legislativas operadas pelo Governo assim como a decisão de o país deixar a Organização de Países Exportadores de Petróleo (OPEP) são parte destes incentivos.

Relativamente ao conteúdo local, o PCA da ANPG entende que as empresas operadoras, 100 por cento nacionais, têm direito à exclusividade no negócio numa quota de 12 a 13 por cento e não 2,0 por cento como se tem ouvido de alguns círculos de opinião.

Transição energética
Paulino Jerónimo disse, em relação à transição energética, que esta opção não nega a produção de petróleo e gás natural.

A transição energética, apenas, obriga a que o país introduza um novo tipo de fonte de geração de electricidade.

“Se olhar para Angola, somos já um bom exemplo”, disse', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5512, '2026-03-03T09:55:50.338169+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('a13a2410-865b-4768-a0b9-15d000bd2bc8', 'Presidente João Lourenço condecora hoje oficiais da Polícia Nacional por mérito e serviço', 'João Lourenço, Presidente da República de Angola, decretou hoje a condecoração de oficiais comissários da Polícia Nacional de Angola com a Medalha de Valor do Serviço Policial Classe Única, em reconhecimento pelo seu contributo na garantia da ordem constitucional, manutenção da segurança pública e combate à criminalidade.', 'O Chefe de Estado determinou, através de Decreto Presidencial, a outorga de medalhas aos comissários-chefes Sebastião José António Martins e Ângelo de Barros Veiga Tavares, bem como aos comissários Eduardo Filomeno Bárber Leiro Octávio e Mateus André, como forma de reconhecer os seus feitos e méritos no serviço à sociedade angolana.

A iniciativa integra as comemorações dos 50 anos da Polícia Nacional, a assinalar-se no dia 28 deste mês, e enquadra-se no sistema de condecorações e distinções da corporação.

Este decreto presidencial faz parte de um processo mais amplo que já incluiu a condecoração de centenas de efectivos da Polícia Nacional com diversas honrarias, incluindo medalhas de Ordem Pública, Serviços Distintos e Bravura Canina, conforme actos anteriores do mesmo executivo presidencial.

A entrega material das condecorações ficará a cargo de autoridades competentes, com a Medalha de Valor do Serviço Policial Classe Única entregue diretamente pelo Presidente da República.

Rodapé Editorial — Angola Sem Filtros

A condecoração de hoje reforça o reconhecimento institucional pelos serviços prestados à segurança pública em Angola, especialmente no quadro das comemorações dos 50 anos da Polícia Nacional. O gesto tem peso simbólico para a corporação e para a promoção da carreira policial, num contexto em que segurança interna continua no centro da agenda pública.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 6942, '2026-02-25T07:30:00.175728+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('415c7c0d-2605-48af-b479-fa67ecd67f11', 'Mais de 200 pessoas beneficiam de cuidados médicos no Luacano', 'Mais de 200 cidadãos, com idades compreendidas entre 15 dias e 89 anos, beneficiaram esta terça-feira (24) de cuidados médicos gratuitos em várias especialidades clínicas, no âmbito do Projecto Tata Uhayele, desenvolvido ao longo do corredor ferroviário do Lobito, na província do Moxico Leste.', 'Última expedição médica do Ano Zero

Esta acção marca a 6.ª e última expedição médica do Ano Zero do projecto, com atendimentos a decorrerem até quarta-feira, nas imediações da estação do Luacano, abrangendo comunidades residentes ao longo da linha férrea.

A cerimónia de abertura foi presidida pela Ana Dias Lourenço, Primeira-Dama da República e impulsionadora da iniciativa, através da Fundação Ngana Zenza para o Desenvolvimento Comunitário.

Para chegar ao local, a Primeira-Dama percorreu cerca de duas horas de viagem ferroviária, desde a estação do Luau até ao Luacano, onde manteve contacto directo com a população, abordando preocupações ligadas à saúde pública e ao acesso a cuidados básicos.

Expansão do projecto em avaliação

Durante o encontro com a imprensa, Ana Dias Lourenço revelou a ambição de expandir o Projecto Tata Uhayele para os Caminhos-de-Ferro de Moçâmedes (CFM) e Caminhos-de-Ferro de Luanda (CFL), após a experiência piloto realizada nos Caminhos-de-Ferro de Benguela (CFB).

A Primeira-Dama admitiu igualmente a possibilidade de reintroduzir a especialidade de estomatologia, retirada numa fase inicial por limitações operacionais, sublinhando que, numa primeira etapa, será priorizada a educação para a saúde e higiene oral.

“Estamos a pensar, vamos discutir e vamos ver se conseguiremos fazer isto ou não”, afirmou.

Resultados clínicos e impacto social

Sob o lema “Todo o Cidadão tem Direito à Saúde”, o projecto contou com uma farmácia abastecida em parceria com o Ministério da Saúde de Angola.
A CECOMA assegurou o fornecimento de medicamentos, o INEMA garantiu o apoio em emergências e evacuações médicas, enquanto a gestão clínica ficou a cargo da Clínica Sagrada Esperança.

Durante o dia de atendimento:

Foram identificados casos relevantes de hérnia inguino-escrotal em pediatria;

Realizaram-se 21 ecografias obstétricas e quatro ginecológicas;

Foram dispensados mais de 4.000 medicamentos à população assistida.

A equipa médica integrou 23 profissionais multidisciplinares, incluindo especialistas por área, serviços de laboratório e farmácia. Os diagnósticos e exames são realizados localmente, com encaminhamento para unidades hospitalares de referência sempre que são necessários cuidados cirúrgicos ou terciários.

Rodapé Editorial — Sem Filtros

Num país onde o acesso à saúde continua desigual, iniciativas como o Projecto Tata Uhayele revelam o impacto concreto de políticas de proximidade. Levar cuidados médicos a comunidades esquecidas do interior não é apenas assistência social — é uma afirmação prática do direito constitucional à saúde.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 6761, '2026-02-26T11:59:10.937371+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('73b22114-fc9b-481c-a2e4-772346ae7139', 'MINSA homenageia enfermeiros após tragédia inesperada em Cabo Ledo', 'O Ministério da Saúde realiza, em Luanda, uma cerimónia de homenagem aos enfermeiros que perderam a vida num acidente de viação em Cabo Ledo. O país acompanha com dor uma tragédia marcada pelo carácter imprevisível.', 'Decorre, desde as primeiras horas desta quarta-feira (18), no Complexo Hospitalar Pedro Maria Tonha “Pedalé”, em Luanda, a cerimónia de homenagem aos enfermeiros vítimas do acidente de viação ocorrido em Cabo Ledo, que resultou em várias mortes.

A cerimónia é orientada pela ministra Sílvia Lutucuta, que destacou o empenho das autoridades em garantir um adeus digno às vítimas, cujos restos mortais deverão ser trasladados para diferentes províncias, incluindo Cabinda.

No Uíge, na cidade do Bago Vermelho, dois dos profissionais já foram a enterrar, num ambiente de profunda dor e consternação, com a presença de familiares, autoridades locais e membros da comunidade.

Análise – Angola Sem Filtros

Nem todas as tragédias têm culpados claros. Há momentos em que o país é confrontado com o imprevisível — acontecimentos que escapam ao controlo humano e deixam apenas dor e silêncio.

Este acidente entra nesse campo sensível:
uma fatalidade que interrompeu vidas dedicadas a salvar outras.

Mais do que procurar responsabilidades imediatas, o momento impõe respeito, luto e reconhecimento. Ainda assim, permanece uma reflexão inevitável: mesmo diante do imprevisível, é sempre legítimo questionar se tudo estava preparado para proteger quem serve o país.

Porque quando a perda atinge profissionais de saúde, o impacto vai além das famílias — atinge directamente o próprio sistema e a sociedade.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 1497, '2026-03-18T17:32:25.937223+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('09ef7b2d-4ce6-47b9-82d5-fdb454026932', 'Trump endurece entrada nos EUA: caução até 15 mil dólares já atinge 50 países', 'Os Estados Unidos alargaram para 50 países a exigência de caução para vistos de curta duração, numa medida que reforça o controlo migratório e levanta críticas internacionais.', 'A administração do presidente Donald Trump decidiu expandir a política de caução para vistos, passando a abranger cidadãos de 50 países, incluindo Angola, que terão de pagar entre 5.000 e 15.000 dólares para solicitar entrada nos EUA.

A medida aplica-se a vistos de turismo e negócios (B1/B2) e entra em vigor a 2 de Abril. O valor funciona como garantia financeira e é devolvido caso o viajante cumpra as regras ou nem chegue a viajar.

Segundo o governo americano, o objectivo é reduzir a permanência ilegal após o fim do visto, num contexto de reforço das políticas migratórias, que já incluem deportações mais agressivas e maior controlo sobre estrangeiros.

Análise – Angola Sem Filtros

Isto não é apenas política migratória —
é uma barreira económica disfarçada.

Na prática, os EUA estão a dizer:
👉 “podes entrar, mas tens de provar que tens dinheiro suficiente para sair”.

E há um detalhe que não passa despercebido:
a maioria dos países na lista são africanos.

O argumento oficial é controlo de permanência ilegal.
Mas a leitura política é outra:

selecção económica de quem pode viajar

filtragem indirecta de países considerados “de risco”

pressão sobre mobilidade global de países mais pobres

Para muitos cidadãos, especialmente em África, esta medida não regula —
exclui.

No fim, o visto deixa de ser apenas um processo administrativo
e passa a ser um privilégio financeiro.', 'Mundo', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 1454, '2026-03-18T17:49:04.10805+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('e9c31ab9-0231-4a33-a8a9-08c5562d5bf1', 'Depú dispara na Liga tanzaniana com seis golos em quatro jogos', 'O avançado angolano Depú continua em grande forma na Liga da Tanzânia, representando o Young Africans, com seis golos e uma assistência em apenas quatro partidas, destacando-se como peça-chave do ataque e aumentando a sua visibilidade no futebol africano.', 'Depú tem mostrado eficácia impressionante desde a sua chegada ao Young Africans, contribuindo diretamente para os resultados da equipa e reforçando a moral do grupo. Além dos seis golos, o avançado contabiliza uma assistência, evidenciando não apenas capacidade de finalização, mas também visão de jogo e envolvimento coletivo.

Analistas locais sublinham que o internacional angolano tem sido determinante em momentos decisivos, criando oportunidades e oferecendo soluções ofensivas que fazem a diferença em partidas equilibradas. Este rendimento coloca Depú entre os atacantes mais promissores de Angola no exterior, consolidando a sua reputação e aumentando o interesse de clubes e observadores do continente.

Sem filtros, a performance do jogador é um alerta: a Liga tanzaniana não é apenas um palco competitivo, mas também uma vitrine para talentos angolanos que procuram destaque internacional. A consistência e a capacidade de decidir partidas tornam Depú uma referência dentro e fora do campo.', 'Desporto', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 6991, '2026-02-23T21:32:51.741661+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('5b143a89-c476-467a-aec0-59038642ec12', 'Kilamba Kiaxi: Dois oficiais do SIC detidos ao tentarem facilitar B.I. angolano a cidadão estrangeiro', 'Dois oficiais subalternos do Serviço de Investigação Criminal (SIC) foram detidos em flagrante no município do Kilamba Kiaxi, em Luanda, quando tentavam persuadir técnicos do posto de registo de identificação civil a emitir Bilhete de Identidade angolano para um cidadão estrangeiro.', 'Denúncia interna levou à detenção

A detenção ocorreu esta quarta-feira, 25, após denúncia feita por um operacional da própria instituição, que alertou para a presença e actuação suspeita dos dois oficiais no posto de registo local.

Segundo informações oficiais, os implicados — com idades de 37 e 57 anos — foram apanhados no momento em que tentavam condicionar os técnicos do registo civil para facilitar a atribuição indevida do documento de identificação nacional.

Processo criminal e disciplinar em curso

O SIC informou que os dois efectivos serão apresentados ao Ministério Público (MP) para os procedimentos legais subsequentes.

O porta-voz do SIC-Geral, Manuel Halaiwa, garantiu ainda a abertura de processos disciplinares internos, sublinhando que a instituição não tolera desvios de conduta por parte dos seus agentes.

“A conduta dos efectivos do SIC deve ser sempre exemplar, tanto em serviço como na vida privada. A violação destas normas pode resultar em sanções severas, incluindo a expulsão”, afirmou.

Alerta para fragilidades no sistema de identificação

O caso volta a levantar sérias preocupações sobre tentativas de corrupção em sectores sensíveis do Estado, como o sistema de identificação civil, cuja integridade é fundamental para a segurança nacional, controlo migratório e exercício de direitos cívicos.

Rodapé Editorial — Angola Sem Filtros

Quando agentes encarregues de investigar crimes passam a facilitar ilegalidades, o problema deixa de ser individual e torna-se institucional. A detenção destes oficiais expõe a necessidade de reforço dos mecanismos de controlo interno e de responsabilização efectiva, para que o combate à corrupção não seja apenas discurso oficial.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 6515, '2026-02-27T10:32:52.478408+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('26296114-1589-4522-9e4a-7c10a25adf97', 'Funcionária da Shoprite sobrevive a ataque violento no Luena', 'Uma funcionária do supermercado Shoprite, no Luena (Moxico), sobreviveu a uma tentativa de homicídio dentro do estabelecimento. Domingas Cambolembole, de 24 anos, foi atacada com uma faca por Félix Dumba, de 28 anos, reincidente e sob efeito de drogas. O ataque, registado pelas câmaras de vigilância, deixou a população em choque. O caso está a ser investigado, e a segurança do supermercado foi reforçada.', 'Uma trabalhadora do supermercado Shoprite, no Luena (Moxico), escapou ilesa a uma tentativa de homicídio dentro do estabelecimento, na noite de quarta-feira, 18, por volta das 19h24.

O ataque

Domingas Cambolembole, de 24 anos, que integra o corpo de segurança da loja, foi atacada com uma faca por Félix Dumba, de 28 anos, reincidente em crimes e sob efeito de drogas. O incidente foi captado pelas câmaras de videovigilância, mostrando que o ataque ocorreu sem motivo aparente, enquanto a vítima atendia clientes.

O suspeito

Segundo a Polícia Nacional e Anabela Navita, chefe de secção do Departamento de Ilícitos Penais, Félix Dumba tem antecedentes por roubo de telemóveis e consumo de liamba. O suspeito afirmou não se recordar do ocorrido, alegando falta de consciência sobre o ato.

Consequências e segurança

A vítima ficou em estado de choque e apresenta sequelas em várias partes do corpo. João Bandeca, responsável pela segurança do supermercado, garantiu que o incidente ocorreu rapidamente, mas que a segurança interna foi reforçada.

O caso está sob investigação das autoridades competentes.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, false, true, 7169, '2026-02-23T19:57:05.881069+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('04c2bc9a-8898-413f-a98a-ebd0685a1e42', 'População de Luanda cresce mais de 1 milhão em uma década', 'A capital angolana regista 8.665.510 habitantes, um crescimento de 1.720.124 pessoas em relação ao Censo de 2024, com população predominantemente jovem e urbana, revelou o Instituto Nacional de Estatística (INE).', 'A Luanda tem hoje 8.665.510 habitantes, segundo dados apresentados pelo Instituto Nacional de Estatística (INE – Instituto Nacional de Estatística) nesta terça-feira. Este número representa um acréscimo de 1.720.124 pessoas em relação ao Censo realizado em 2024.

De acordo com Carlos Lemos, responsável pelos Serviços Provinciais do INE em Luanda, 99,3% da população reside em áreas urbanas, e apenas 0,7% em zonas rurais. A capital tem 4.263.902 homens e 4.401.607 mulheres, resultando num índice de masculinidade de 96,9% — ou seja, 97 homens para cada 100 mulheres.

Municípios mais populosos

Kilamba Kiaxi: 1.120.781 habitantes

Mulenvos: 882.014 habitantes

Cacuaco: 875.071 habitantes

Viana: 865.863 habitantes

Cazenga: 823.025 habitantes

Perfil etário

0 a 14 anos: 32%

0 a 24 anos: 54%

15 a 64 anos: 62%

65 anos ou mais: 6%

A população de Luanda é predominantemente jovem, o que gera desafios em educação, emprego e serviços urbanos, mas também oferece oportunidades para crescimento econômico e inovação social.

Rodapé editorial (Sem Filtros)

Nota do editor: Os números do INE refletem apenas a população residente e são fundamentais para planeamento urbano e políticas públicas. Crescimento rápido das cidades exige atenção à infraestrutura, habitação e serviços básicos.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 7069, '2026-02-25T02:04:13.364835+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('9972e738-a60f-4b55-80e8-afc98477e6c1', 'Ataque iraniano expõe fragilidade da segurança nos EAU e coloca Dubai em estado de choque', 'A narrativa de estabilidade absoluta nos Emirados Árabes Unidos sofreu um abalo sério este sábado. Mísseis disparados pelo Irão atingiram o país, provocando pelo menos uma morte em Abu Dhabi e lançando o pânico em áreas urbanas estratégicas.', 'Informações confirmadas indicam que projécteis seguiram em direcção a Dubai, coração financeiro e vitrina internacional dos EAU. Alguns mísseis terão sido interceptados, mas as explosões no ar e os alarmes disparados deixaram claro que o sistema defensivo não impediu o impacto psicológico nem o risco real. Como medida de contenção, o Burj Khalifa foi evacuado — um gesto simbólico e revelador: nem o ícone máximo do poder e do luxo esteve imune ao medo.

O Governo dos EAU condenou o ataque e avisou que se reserva o direito de responder, mas o facto central permanece: o conflito regional já atravessou fronteiras e atingiu directamente um dos países que mais investiram na imagem de segurança, controlo e invulnerabilidade.

Este episódio não é apenas um incidente militar. É um aviso estratégico. Mostra que a escalada no Médio Oriente deixou de ser abstracta e passou a ameaçar centros económicos globais, turismo, investimentos e vidas civis. A questão agora não é se haverá resposta, mas até onde esta escalada pode ir — e quem pagará o preço real.', 'Política', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', true, true, true, 6219, '2026-02-28T17:14:15.39777+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('5f450493-1815-468b-9021-b2412a3fbd6e', 'Homem é detido após tentar assaltar fiéis da igreja católica em Luanda', 'Um indivíduo foi detido depois de ter entrado numa igreja em Luanda, fingindo ser membro da comunidade, e ter tentado assaltar os fiéis com uma faca.', 'Alcides Piluca, de 27 anos, foi detido após tentar assaltar fiéis na Paróquia do Imaculado Coração de Maria, no bairro do Morro Bento, em Luanda. O suspeito dirigiu-se ao gabinete paroquial, fingindo ser membro da comunidade, e retirou uma faca de cozinha, ameaçando os presentes.

Graças à rápida intervenção do padre Inácio Kahamba, membro da Congregação dos Filhos do Imaculado Coração de Maria (Missionários Claretianos), e de outros fiéis, o agressor foi desarmado, contido e entregue às autoridades para os procedimentos legais.

O presumível autor deverá responder judicialmente pelo crime de tentativa de assalto, enquanto as autoridades investigam as motivações do ato.

Em comunicado, o padre Kahamba apelou à serenidade e à vigilância da comunidade, solicitando orações pelos missionários em risco e agradecendo pela protecção recebida.', 'Sociedade', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, true, true, 5883, '2026-03-02T15:01:21.482663+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('998dd40e-0df8-4fb6-9709-a940070d2d7c', 'Angola divulga instrumento para atrair investimento no sector do turismo', 'O Executivo de Angola vai apresentar o Guia de Investimentos no Turismo (Angola Tourism Doing Business) durante um evento paralelo à ITB Berlim, que decorre de 3 a 5 deste mês, com o objectivo de promover oportunidades e atrair investidores para o sector turístico nacional', '

O Executivo de Angola prepara-se para apresentar oficialmente o Guia de Investimentos no Turismo – Angola Tourism Doing Business, uma iniciativa que visa consolidar o sector como um dos pilares centrais da estratégia de diversificação económica do país.

De acordo com informações avançadas pelo Ministério do Turismo, o lançamento do documento terá lugar durante o “Angola Leaders Dinner”, evento realizado em parceria com o Fórum Global para o Turismo e a ONU Turismo. A representação angolana será assegurada ao mais alto nível institucional, contando com a presença do ministro de Estado para a Coordenação Económica, José de Lima Massano, e do ministro do Turismo, Márcio Daniel.

Concebido com o apoio técnico da ONU Turismo, o guia surge como um instrumento estruturante para orientar investidores nacionais e estrangeiros interessados em explorar o potencial turístico do país. O documento reúne informação detalhada de natureza técnica, jurídica e económica, facilitando a compreensão do enquadramento legal e das oportunidades disponíveis no mercado angolano.

O portefólio apresentado contempla projectos prioritários nas áreas do ecoturismo, turismo de natureza, hotelaria, resorts, turismo cultural e histórico, além de iniciativas estruturantes em regiões consideradas estratégicas, como a área do Okavango e diversas zonas costeiras com elevado valor ambiental e paisagístico.

Segundo o Executivo, a iniciativa pretende ainda fortalecer a coordenação institucional, aumentar a previsibilidade e garantir maior segurança jurídica nos processos administrativos ligados ao investimento turístico, contribuindo para a melhoria do ambiente de negócios.

Com esta medida, Angola reafirma a intenção de posicionar o turismo como um sector competitivo e sustentável, capaz de atrair capital, gerar emprego e impulsionar o crescimento económico no contexto africano e internacional.', 'Economia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 5651, '2026-03-03T07:44:51.757837+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.news_articles (id, title, summary, content, category, image_url, author, is_hero, is_breaking, published, views, created_at, updated_at) VALUES ('8fd1a450-4a46-4b08-a633-7c8dcc11bb44', 'Deepfakes e fraude digital: IA torna-se mais persuasiva e agrava risco de cibercrime', 'O avanço acelerado da inteligência artificial está a tornar os conteúdos digitais cada vez mais convincentes — e perigosos. Segundo o mais recente Internet Safety Report, imagens, vídeos e áudios gerados por IA estão a ser explorados de forma crescente por redes de cibercrime, elevando os riscos de fraude, burla financeira e roubo de identidade a níveis sem precedentes.', 'Quando o falso se torna credível

À medida que os sistemas de IA evoluem tecnicamente, são treinados com feedback humano e se integram no quotidiano digital, tornam-se também mais persuasivos. O relatório alerta que esta combinação cria um terreno fértil para abusos, com impactos diretos na confiança online.

O debate ganhou novo fôlego após investigações envolvendo a plataforma X, detida por Elon Musk, devido à circulação de imagens sexualizadas criadas por deepfake através do chatbot Grok. Para especialistas, porém, o problema vai muito além do conteúdo explícito: trata-se de uma ameaça estrutural à segurança digital.

Deepfakes como arma de fraude

A facilidade com que conteúdos falsos altamente realistas podem ser produzidos ficou evidente num vídeo viral onde Tom Cruise e Brad Pitt surgiam a lutar numa cena fictícia. O realizador Ruairi Robinson revelou que o vídeo foi criado a partir de um simples prompt de duas linhas.

Casos como este demonstram como a tecnologia deixou de estar confinada a laboratórios avançados, passando a estar acessível através de ferramentas gratuitas ou de baixo custo — um fator decisivo para a sua adoção por criminosos digitais.

Em paralelo, a Comissão Europeia e vários Estados-membros iniciaram investigações à plataforma X, reforçando a preocupação regulatória em torno da proliferação de conteúdos manipulados por IA.

Empresas e instituições no alvo

Segundo especialistas da Planet VPN, os ataques tornaram-se mais sofisticados e difíceis de detetar. Konstantin Levinzon, cofundador da empresa, alerta que vídeos manipulados já estão a ser usados para imitar administradores e CEO, levando colaboradores a autorizar transferências financeiras indevidas.

Instituições financeiras enfrentam riscos acrescidos, uma vez que imagens e vídeos falsificados podem ser utilizados para contornar sistemas de verificação de identidade online, explorando a confiança nos meios digitais.

“Um dos aspetos mais perigosos da IA é a dificuldade crescente em distinguir o que é real do que é fabricado”, sublinha Levinzon.

Como identificar e reduzir riscos

Apesar da sofisticação crescente, os deepfakes continuam a deixar sinais: movimentos faciais pouco naturais, sombras incoerentes, distorções ou desfoque nas bordas do rosto. Existem ferramentas especializadas para deteção, mas os resultados são probabilísticos, não absolutos.

Entre as recomendações práticas destacam-se:

Reduzir a exposição de vídeos pessoais online;

Ativar autenticação multifator em todas as contas;

Utilizar redes VPN para proteger o tráfego de dados;

Reforçar a literacia digital em ambientes profissionais.

Um desafio de liderança e governação

A expansão dos deepfakes coloca desafios diretos à liderança empresarial, aos reguladores e aos cidadãos. A IA continua a oferecer ganhos reais de eficiência e inovação, mas sem mecanismos robustos de controlo e educação digital, o seu poder persuasivo pode transformar-se numa ameaça sistémica.

Rodapé Editorial — Sem Filtros

A tecnologia não é neutra. À medida que a inteligência artificial se torna mais convincente, cresce também a responsabilidade de governos, empresas e utilizadores. Ignorar o impacto dos deepfakes hoje é abrir caminho para um colapso silencioso da confiança digital amanhã.', 'Tecnologia', 'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop', 'Redacção', false, false, true, 6729, '2026-02-26T11:50:36.522235+00:00', '2026-03-24T08:30:00.184503+00:00') ON CONFLICT DO NOTHING;
