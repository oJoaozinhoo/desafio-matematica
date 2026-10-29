
const app = document.getElementById("app");

const perguntas = [
    {
        pergunta: "Ana tem 3 camisetas e 2 calças.",
        complemento: "Quantos conjuntos diferentes ela pode formar?",
        alternativas: [
            "5 conjuntos",
            "6 conjuntos",
            "3 conjuntos",
            "9 conjuntos"
        ],
        correta: 1,
        explicacao: "Princípio multiplicativo: 3 × 2 = 6 conjuntos."
    },
    {
        pergunta: "Uma pessoa pode escolher uma bebida.",
        complemento: "Existem 4 sucos ou 3 refrigerantes. Quantas opções há?",
        alternativas: [
            "7 bebidas",
            "12 bebidas",
            "4 bebidas",
            "1 bebida"
        ],
        correta: 0,
        explicacao: "Princípio aditivo: 4 + 3 = 7 opções."
    },
    {
        pergunta: "Existem 10 meias em 9 gavetas.",
        complemento: "O que podemos afirmar?",
        alternativas: [
            "Cada gaveta tem uma meia",
            "Uma gaveta tem pelo menos 2 meias",
            "Todas têm 2 meias",
            "Uma gaveta fica vazia"
        ],
        correta: 1,
        explicacao: "10 meias em 9 gavetas garantem pelo menos 2 em alguma gaveta."
    },
    {
        pergunta: "Uma lanchonete oferece 3 sanduíches.",
        complemento: "Também oferece 4 sucos. Quantos pedidos com 1 de cada?",
        alternativas: [
            "7 pedidos",
            "12 pedidos",
            "4 pedidos",
            "9 pedidos"
        ],
        correta: 1,
        explicacao: "Princípio multiplicativo: 3 × 4 = 12 pedidos."
    },
    {
        pergunta: "Em uma turma há 13 alunos.",
        complemento: "Podemos garantir dois no mesmo mês de aniversário?",
        alternativas: [
            "Não, existem 13 meses",
            "Sim, existem 12 meses",
            "Apenas se forem gêmeos",
            "Nunca podemos garantir"
        ],
        correta: 1,
        explicacao: "13 alunos e 12 meses garantem pelo menos 2 no mesmo mês."
    },
    {
        pergunta: "Um restaurante oferece 2 entradas.",
        complemento: "Ou 5 pratos principais. Quantas opções há?",
        alternativas: [
            "10 opções",
            "3 opções",
            "7 opções",
            "5 opções"
        ],
        correta: 2,
        explicacao: "Princípio aditivo: 2 + 5 = 7 opções."
    },
    {
        pergunta: "Uma senha tem 2 dígitos.",
        complemento: "Cada dígito vai de 0 a 9, com repetição. Quantas senhas?",
        alternativas: [
            "20 senhas",
            "100 senhas",
            "10 senhas",
            "90 senhas"
        ],
        correta: 1,
        explicacao: "Princípio multiplicativo: 10 × 10 = 100 senhas."
    },
    {
        pergunta: "Há 8 bolas e 3 caixas.",
        complemento: "Qual a menor quantidade garantida em alguma caixa?",
        alternativas: [
            "Pelo menos 2 bolas",
            "Pelo menos 3 bolas",
            "Pelo menos 4 bolas",
            "Pelo menos 8 bolas"
        ],
        correta: 1,
        explicacao: "8 bolas em 3 caixas garantem pelo menos 3 em alguma caixa."
    }
];

let jogador = "";
let pontuacao = 0;
let indice = 0;
let respondeu = false;

// Evita que textos digitados pelo jogador sejam interpretados como HTML.
function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

// CARREGAR RANKING
function carregarRanking() {
    try {
        return JSON.parse(
            localStorage.getItem("ranking_matematica")
        ) || [];
    } catch {
        return [];
    }
}

// SALVAR RANKING
function salvarRanking(ranking) {
    try {
        localStorage.setItem(
            "ranking_matematica",
            JSON.stringify(ranking)
        );
    } catch {
        alert("Não foi possível salvar o ranking neste navegador.");
    }
}

// MENU PRINCIPAL
function mostrarMenu() {
    app.innerHTML = `
        <section class="painel">
            <h1>DESAFIO DA MATEMÁTICA</h1>
            <p class="subtitulo">DISCRETA</p>

            <p>Teste seus conhecimentos!</p>

            <input
                type="text"
                id="nome"
                maxlength="25"
                placeholder="Digite seu nome"
                autocomplete="off"
            >

            <button id="iniciar">Começar desafio</button>

            <button id="ver-ranking" class="secundario">
                Ver ranking
            </button>

            <p class="pequeno">
                8 perguntas • 4 alternativas • Boa sorte!
            </p>
        </section>
    `;

    document.getElementById("iniciar")
        .addEventListener("click", iniciarJogo);

    document.getElementById("nome")
        .addEventListener("keydown", evento => {
            if (evento.key === "Enter") iniciarJogo();
        });

    document.getElementById("ver-ranking")
        .addEventListener("click", mostrarRanking);
}

// INICIAR JOGO
function iniciarJogo() {
    const campo = document.getElementById("nome");

    jogador = campo.value.trim();

    if (!jogador) {
        alert("Por favor, digite seu nome!");
        campo.focus();
        return;
    }

    pontuacao = 0;
    indice = 0;
    respondeu = false;

    mostrarPergunta();
}

// MOSTRAR PERGUNTAS
function mostrarPergunta() {
    respondeu = false;

    const p = perguntas[indice];

    const progresso =
        (indice / perguntas.length) * 100;

    app.innerHTML = `
        <section class="painel">

            <div class="topo-quiz">
                <span>Jogador: ${escapar(jogador)}</span>
                <span>Pontos: ${pontuacao}</span>
            </div>

            <div class="barra-fundo">
                <div
                    class="barra-progresso"
                    style="width: ${progresso}%"
                ></div>
            </div>

            <p>
                Pergunta ${indice + 1} de ${perguntas.length}
            </p>

            <h2 class="pergunta">
                ${escapar(p.pergunta)}
            </h2>

            <p>
                ${escapar(p.complemento)}
            </p>

            <div id="alternativas">
                ${p.alternativas.map((alternativa, i) => `
                    <button
                        class="alternativa"
                        data-indice="${i}"
                    >
                        ${escapar(alternativa)}
                    </button>
                `).join("")}
            </div>

            <div id="area-feedback"></div>

        </section>
    `;

    document.querySelectorAll(".alternativa")
        .forEach(botao => {
            botao.addEventListener("click", () => {
                responder(Number(botao.dataset.indice));
            });
        });
}

// RESPONDER PERGUNTA
function responder(escolha) {
    if (respondeu) return;

    respondeu = true;

    const p = perguntas[indice];

    const botoes =
        document.querySelectorAll(".alternativa");

    botoes.forEach((botao, i) => {
        botao.disabled = true;

        if (i === p.correta) {
            botao.classList.add("correta");
        } else if (i === escolha) {
            botao.classList.add("errada");
        }
    });

    const acertou = escolha === p.correta;

    if (acertou) {
        pontuacao++;
    }

    document.querySelector(".topo-quiz")
        .lastElementChild.textContent =
        `Pontos: ${pontuacao}`;

    const feedback =
        document.getElementById("area-feedback");

    feedback.innerHTML = `
        <div class="feedback">

            <strong>
                ${acertou
                    ? "✅ Resposta correta!"
                    : "❌ Resposta incorreta!"
                }
            </strong>

            <p>${escapar(p.explicacao)}</p>

        </div>

        <button id="continuar">
            ${indice === perguntas.length - 1
                ? "Ver resultado"
                : "Próxima pergunta"
            }
        </button>
    `;

    document.getElementById("continuar")
        .addEventListener("click", proximaPergunta);
}

// PRÓXIMA PERGUNTA
function proximaPergunta() {
    indice++;

    if (indice < perguntas.length) {
        mostrarPergunta();
    } else {
        finalizarJogo();
    }
}

// FINALIZAR E REGISTRAR PONTUAÇÃO
function finalizarJogo() {
    const ranking = carregarRanking();

    ranking.push({
        nome: jogador,
        pontos: pontuacao,
        total: perguntas.length,
        data: new Date().toLocaleDateString("pt-BR")
    });

    ranking.sort((a, b) => b.pontos - a.pontos);

    salvarRanking(ranking.slice(0, 100));

    mostrarResultado();
}

// TELA DE RESULTADO
function mostrarResultado() {
    const porcentagem = Math.round(
        (pontuacao / perguntas.length) * 100
    );

    let mensagem;

    if (pontuacao === perguntas.length) {
        mensagem = "Incrível! Você acertou tudo!";
    } else if (pontuacao >= 5) {
        mensagem = "Muito bem! Você teve um ótimo desempenho!";
    } else if (pontuacao >= 3) {
        mensagem = "Bom trabalho! Continue praticando!";
    } else {
        mensagem = "Não desanime! Tente novamente!";
    }

    app.innerHTML = `
        <section class="painel">

            <h1>DESAFIO CONCLUÍDO!</h1>

            <p>Parabéns, ${escapar(jogador)}!</p>

            <div class="resultado-numero">
                ${pontuacao}/${perguntas.length}
            </div>

            <h2>${porcentagem}% de aproveitamento</h2>

            <p>${mensagem}</p>

            <button id="jogar-novamente">
                Jogar novamente
            </button>

            <button id="resultado-ranking" class="secundario">
                Ver ranking
            </button>

            <button id="voltar-menu" class="secundario">
                Voltar ao menu
            </button>

        </section>
    `;

    document.getElementById("jogar-novamente")
        .addEventListener("click", () => {
            pontuacao = 0;
            indice = 0;
            mostrarPergunta();
        });

    document.getElementById("resultado-ranking")
        .addEventListener("click", mostrarRanking);

    document.getElementById("voltar-menu")
        .addEventListener("click", mostrarMenu);
}

// TELA DE RANKING
function mostrarRanking() {
    const ranking = carregarRanking();

    const itens = ranking.length
        ? ranking.slice(0, 10).map((item, i) => `
            <div class="ranking-item">

                <span>
                    ${i + 1}º - ${escapar(item.nome)}
                </span>

                <strong>
                    ${item.pontos}/${item.total}
                </strong>

            </div>
        `).join("")
        : "<p>Nenhuma pontuação registrada ainda.</p>";

    app.innerHTML = `
        <section class="painel">

            <h1>🏆 RANKING</h1>

            <p>Melhores resultados</p>

            <div class="ranking-lista">
                ${itens}
            </div>

            <button id="voltar-menu" class="secundario">
                Voltar ao menu
            </button>

        </section>
    `;

    document.getElementById("voltar-menu")
        .addEventListener("click", mostrarMenu);
}

// ABRIR MENU AO CARREGAR A PÁGINA
mostrarMenu();
