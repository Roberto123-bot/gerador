const painel = document.getElementById('painel-numerico');
const quantidadeSpan = document.getElementById('quantidade');
const resultado = document.getElementById('resultado');
let selecionados = [];


function criarBotoes() {
  for (let i = 1; i <= 25; i++) {
    const btn = document.createElement('button');
    btn.classList.add('numero');
    btn.innerText = i.toString().padStart(2, '0');
    btn.addEventListener('click', () => toggleNumero(i, btn));
    painel.appendChild(btn);
  }
}

function toggleNumero(numero, botao) {
  const index = selecionados.indexOf(numero);
  if (index >= 0) {
    selecionados.splice(index, 1);
    botao.classList.remove('selecionado');
  } else {
    if (selecionados.length >= 23) {
      alert("Você só pode escolher no máximo 23 números.");
      return;
    }
    selecionados.push(numero);
    botao.classList.add('selecionado');
  }

  atualizarResumo();
}

function atualizarResumo() {
  quantidadeSpan.innerText = selecionados.length;
}

function sortearJogos() {
  const qtdJogos = parseInt(document.getElementById("quantidadeJogos").value);
  const dezenasPorJogo = parseInt(document.getElementById("qtdDezenas").value);

  if (selecionados.length < dezenasPorJogo) {
    alert(`Você precisa selecionar pelo menos ${dezenasPorJogo} dezenas.`);
    return;
  }
  if (qtdJogos < 1 || qtdJogos > 1000) {
    alert("Quantidade de jogos deve ser entre 1 e 1000.");
    return;
  }

  let saida = `🔢 Gerador Lotofácil - ${dezenasPorJogo} dezenas por jogo\n🧾 Total de jogos: ${qtdJogos}\n\n`;

  for (let i = 1; i <= qtdJogos; i++) {
    const jogo = sortearJogoBaseadoNosSelecionados(dezenasPorJogo);
    const linha = jogo.map(n => n.toString().padStart(2, '0')).join(" ");
    saida += `Jogo ${i}: ${linha}\n`;
  }

  resultado.value = saida;
}

function sortearJogoBaseadoNosSelecionados(qtd) {
  const copia = [...selecionados];
  const jogo = [];

  while (jogo.length < qtd) {
    const index = Math.floor(Math.random() * copia.length);
    const numero = copia.splice(index, 1)[0];
    jogo.push(numero);
  }

  return jogo.sort((a, b) => a - b);
}

function reiniciar() {
  selecionados = [];
  painel.querySelectorAll('.numero').forEach(btn => btn.classList.remove('selecionado'));
  resultado.value = "";
  atualizarResumo();
}

function copiarJogos() {
  if (resultado.value === "") {
    alert("Nenhum jogo para copiar.");
    return;
  }
  resultado.select();
  document.execCommand("copy");
  alert("Jogos copiados para a área de transferência!");
}

function baixarComoTxt() {
  const conteudo = resultado.value;
  if (!conteudo) {
    alert("Nenhum jogo para exportar.");
    return;
  }

  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "jogos-lotofacil.txt";
  link.click();
}

criarBotoes();

// Atualiza valor ao mover o slider
document.getElementById('qtdDezenas').addEventListener('input', function () {
  document.getElementById('valorDezenas').textContent = this.value;
});

document.getElementById('quantidadeJogos').addEventListener('input', function () {
  document.getElementById('valorJogos').textContent = this.value;
});

// Ajuste com botões +/-
function ajustarSlider(id, valor) {
  const input = document.getElementById(id);
  let novoValor = parseInt(input.value) + valor;
  const min = parseInt(input.min);
  const max = parseInt(input.max);
  if (novoValor < min) novoValor = min;
  if (novoValor > max) novoValor = max;
  input.value = novoValor;
  input.dispatchEvent(new Event('input'));
}

