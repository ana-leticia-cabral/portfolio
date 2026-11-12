/* =====================================================
   DADOS DO PORTFÓLIO — é aqui que você edita o conteúdo.
   O painel inteiro (números, gráficos, filtros) se recalcula sozinho.

   Imagens: coloque o arquivo em assets/img/ e use img("nome-do-arquivo.webp").
   Currículo: coloque o PDF em assets/curriculo.pdf (veja CURRICULO, abaixo).
===================================================== */
const img = arquivo => "assets/img/" + arquivo;

const CURRICULO = {
  arquivo: "assets/curriculo.pdf",
  nomeDownload: "Curriculo-Ana-Leticia-Cabral-do-Rosario.pdf"
};

const PROJETOS = [
  {categoria: "Manipulação e Análise",
   ano: "Outubro, 2026",
   titulo: "Manipulação e análise da base MUNIC 2024 (Pesquisa de Informações Básicas Municipais)",
   link: "https://ana-leticia-cabral.github.io/formacao-plena-analise-ciencia-dados-2026/6-modulo-intermediario-I-setembro2026/projeto-multidisciplinar-II.html",
   descricao: "Projeto Multidisciplinar II da formação de Análise e Ciência de dados da Udemy, no qual eu realizei análise das estruturas políticas dos municípios brasileiros para a gestão de assuntos relacionados à igualdade racial, segundo a pesquisa MUNIC 2024 (Pesquisa de Informações Básicas Municipais).",
   imagem: img("projeto-munic.png"),
   tags: ["Python", "NumPy", "Pandas", "Matplotlib"],
  },
  {categoria: "ESTATÍSTICA E SIMULAÇÃO",
   ano: "Setembro, 2026",
   titulo: "Simulação de IMC e risco cardíaco com Python",
   link: "https://ana-leticia-cabral.github.io/formacao-plena-analise-ciencia-dados-2026/6-modulo-intermediario-I-setembro2026/projeto-multidisciplinar-I.html",
   descricao: "Projeto Multidisciplinar I da formação de Análise e Ciência de dados da Udemy, no qual eu realizei a simulação em Python que gera 200 mil indivíduos com altura, peso e sexo a partir da distribuição normal, calcula o IMC e o classifica conforme a OMS, associando cada faixa a um nível de risco cardíaco. A análise usa funções próprias de tendência central, dispersão e posição para comparar os grupos com e sem risco e interpretar a distribuição dos dados.",
   tags: ["Python", "NumPy", "Pandas", "Matplotlib"],
   imagem: img("projeto-imc.webp")
  },
  {
    categoria: "DASHBOARD",
    ano: "Agosto, 2026",
    titulo: "Mortalidade Evitável no Brasil",
    link: "https://app.powerbi.com/view?r=eyJrIjoiZmVkYWY3NjktMDNhYi00YmEyLTk5MmYtMjY5NmU0NmZhYzIxIiwidCI6Ijk0MDBmNTdkLWIwY2EtNGQzOC1iNzA5LWYxYTA3ZDIyMTY4NyJ9",
    descricao: "Análise da mortalidade evitável no Brasil com dados do DATASUS/SIM, aplicando a classificação de evitabilidade de Malta et al. em um pipeline de ETL e visualização em Power BI.",
    tags: ["Power BI", "DAX"],
    imagem: img("projeto-mortalidade.webp")
  },
  {
    categoria: "ESTUDO DE CASO",
    ano: "Maio, 2026",
    titulo: "Como uma empresa de bem-estar pode ser inteligente?",
    link: "https://www.kaggle.com/code/ninha0911/h-bitos-de-usu-rios-fitbit",
    descricao: "Projeto final de conclusão do programa Google Data Analytics: identificar o comportamento dos consumidores de dispositivos inteligentes e como transformar em estratégia de marketing.",
    tags: ["Google", "Coursera", "Kaggle", "Python"],
    imagem: img("projeto-fitbit.webp")
  },
  {
    categoria: "DASHBOARD",
    ano: "Maio, 2026",
    titulo: "Popularidade de Músicas no Spotify",
    link: "https://public.tableau.com/app/profile/ana.let.cia.cabral.do.ros.rio/viz/AnlisedepopularidadedemsicasnoSpotify/Painel1",
    descricao: "Análise de popularidade de músicas lançadas entre 1970 e 2020 no Spotify em 2021, com destaques e tendências históricas.",
    tags: ["MySQL", "Google Sheets", "Python", "Tableau"],
    imagem: img("projeto-spotify.png")
  },
  {
    categoria: "DASHBOARD",
    ano: "Fevereiro, 2026",
    titulo: "Relatório de Vendas — Chaska Café",
    link: "https://app.powerbi.com/view?r=eyJrIjoiOTE3YjI5NGItYTg4Yi00ZWI1LWI5MWEtZWUxNDk3ZDYwOWE2IiwidCI6IjQ5Nzc0MTY5LTBmZWMtNDdmNy04YTlhLTE0YzIzMGI1MTIyMiJ9",
    descricao: "Meu primeiro projeto: Análise de vendas de uma rede de fast-food, cobrindo desempenho por produto, sazonalidade e insights de negócio.",
    tags: ["Power BI", "Google Sheets"],
    imagem: img("projeto-chaska.webp")
  },
];

const PRATICA = [
  {
    categoria: "Banco de dados e SQL",
    titulo: "Resolução de queries e modelagem de dados",
    descricao: "Repositório com consultas SQL, scripts e projetos de modelagem desenvolvidos durante meus estudos de bancos de dados relacionais, utilizando ferramentas como MySQL e PostgreSQL. O objetivo é centralizar esse material como referência para revisões futuras e apoio na resolução de problemas semelhantes.",
    tags: ["SQL", "MySQL", "PostgreSQL"],
    link: "https://github.com/ana-leticia-cabral/estudos-banco-de-dados"
  },
  {
    categoria: "Python",
    titulo: "Estudos de Python para Análise de Dados",
    descricao: "Repositório com exercícios e scripts desenvolvidos durante meus estudos de Python aplicado à análise de dados, utilizando bibliotecas como pandas e NumPy. O objetivo é centralizar esse material como referência para revisões futuras e apoio na resolução de problemas semelhantes.",
    tags: ["Jupyter Notebook", "NumPy", "Pandas"],
    link: "https://github.com/ana-leticia-cabral/estudos-python"
  },
];

const CERTIFICACAO = [
  {
    categoria: "Formação plena",
    ano: "Em andamento",
    titulo: "Análise e Ciência de dados — Udemy",
    descricao: "Formação em Data Science e IA (Python, R e Excel). Foco na consolidação do ciclo de dados (coleta, tratamento, análise e sumarização) e no aprendizado de Machine Learning e Inteligência Artificial para desenvolvimento de análises preditivas.",
    tags: ["Estatística", "Probabilidade", "Excel", "Python", "R", "Machine Learning"],
    link: "https://github.com/ana-leticia-cabral/formacao-plena-analise-ciencia-dados-2026",
    linkTexto: "Ver progresso →"
  },
  {
    categoria: "Certificação profissional",
    ano: "2026",
    titulo: "Google Data Analytics — Coursera",
    descricao: "Formação cobrindo os fundamentos da análise de dados, englobando do tratamento ao storytelling para tomada de decisão. Certificação obtida em maio de 2026 por meio de uma bolsa de estudos concedida em parceria com a agência de estágio, como marco de início das minhas atividades na sede do Banco do Brasil (Brasília).",
    tags: ["Google Sheets", "Google BigQuery", "SQL", "Python", "Tableau"],
    selo: img("selo-google.webp"),
    imagem: img("cert-google.jpg"),
    link: "https://coursera.org/verify/professional-cert/CR74ZLTJVJ95",
    linkTexto: "Verificar certificado →"
  },
  {
    categoria: "Curso", ano: "2026",
    titulo: "Pensamento computacional: fundamentos da computação e lógica de programação — Alura/UniBB",
    descricao: "", tags: ["Lógica de programação"], imagem: img("cert-pensamento-computacional.webp"), selo: img("selo-alura.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "Python para Dados: primeiros passos — Alura/UniBB",
    descricao: "", tags: ["Python", "Análise de dados"], imagem: img("cert-python-dados.webp"), selo: img("selo-alura.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "Copilot Studio: criando solução multiagentes — Alura/UniBB",
    descricao: "", tags: ["Copilot Studio", "Agentes de IA"], imagem: img("cert-copilot-studio.webp"), selo: img("selo-alura.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "Trabalhando com dados: fundamentos da análise de dados — Alura/UniBB",
    descricao: "", tags: ["Análise de dados", "Habilidades analíticas"], imagem: img("cert-trabalhando-dados.webp"), selo: img("selo-alura.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "Data Storytelling: transformando dados em histórias impactantes — Alura/UniBB",
    descricao: "", tags: ["Storytelling com dados"], imagem: img("cert-data-storytelling.webp"), selo: img("selo-alura.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "Segurança da informação — Curso em Vídeo",
    descricao: "", tags: ["Segurança da informação", "Redes sociais"], imagem: img("cert-seguranca-informacao.webp"), selo: img("cert-seguranca-informacao.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "JAVA POO — Curso em Vídeo",
    descricao: "Programação Orientada a Objetos com a linguagem de programação JAVA.",
    tags: ["Java", "Programação Orientada a Objetos"],
    link: "https://github.com/ana-leticia-cabral/estudos-java", linkTexto: "Acessar repositório →",
    imagem: img("cert-java-poo.webp"), selo: img("cert-java-poo.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "GIT E GITHUB — Curso em vídeo",
    descricao: "", tags: ["GIT", "GITHUB", "GITHUB DESKTOP"], imagem: img("cert-git-github.webp"), selo: img("cert-git-github.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "JAVA BÁSICO — Curso em Vídeo",
    descricao: "", tags: ["Java", "NetBeans"],
    link: "https://github.com/ana-leticia-cabral/estudos-java", linkTexto: "Acessar repositório →",
    imagem: img("cert-java-basico.webp"), selo: img("cert-java-basico.webp")
  },
  {
    categoria: "Curso", ano: "2025",
    titulo: "MYSQL — Curso em Vídeo",
    descricao: "", tags: ["SQL", "MYSQL"], imagem: img("cert-mysql.webp"), selo: img("cert-mysql.webp")
  },
  {
    categoria: "Evento", ano: "2025",
    titulo: "BB Digital Week 2025 — Banco do Brasil",
    descricao: "Participação no evento promovido pelo Banco do Brasil, realizado no Centro de Convenções Ulysses Guimarães, em Brasília-DF, nos dias 28, 29 e 30 de outubro de 2025.",
    tags: ["Banco do Brasil", "Brasília", "18 horas"], selo: img("selo-bb-digital-week.jpg"), imagem: img("cert-bb-digital-week.jpg")
  },
];

/* Trajetória (anos inteiros; fim: null = em andamento) */
const TRAJETORIA = [
  { nome: "Ciência da Computação", org: "Universidade Católica de Brasília", ini: 2024, fim: null,  cor: "#9c5460" },
  { nome: "Estágio em Dados",      org: "Banco do Brasil",                    ini: 2025, fim: 2026, cor: "#b5677a" },
  { nome: "Google Data Analytics", org: "Google · Coursera",                  ini: 2025, fim: 2026, cor: "#e6b4bb" },
];

/* Ferramentas principais. "alias" = marcas (tags) contadas como a mesma ferramenta */
const SKILLS = [
  { nome: "Power BI",      alias: ["power bi"],                      uso: "Dashboards e visualização" },
  { nome: "SQL",           alias: ["sql", "mysql", "postgresql"],    uso: "Consultas e bancos de dados" },
  { nome: "Python",        alias: ["python"],                        uso: "Análise e manipulação de dados" },
  { nome: "R",             alias: ["r"],                             uso: "Análise estatística" },
  { nome: "Excel",         alias: ["excel"],                         uso: "Análise e manipulação de dados" },
  { nome: "Google Sheets", alias: ["google sheets"],                 uso: "Análise e manipulação de dados" },
];

const TIPOS_CERT = ["Formação plena", "Certificação profissional", "Curso", "Evento"];
const COR_TIPO = {
  "Formação plena": "#9c5460",
  "Curso": "#b5677a",
  "Certificação profissional": "#e6b4bb",
  "Evento": "#f1d3d7"
};
const NAO_FERRAMENTA = ["google", "coursera", "kaggle"];  // plataformas, não entram na contagem de tecnologias
