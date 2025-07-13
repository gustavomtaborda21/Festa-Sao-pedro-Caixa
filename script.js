// script.js

const produtos = [
  { nome: "Bolo", preco: 5, imagem: "imagens/bolo.jpg" },
  { nome: "Candela", preco: 6, imagem: "imagens/candela.jpg" },
  { nome: "Chocolate Quente", preco: 5, imagem: "imagens/chocolate-quente.jpg" },
  { nome: "Churrasco Bovino", preco: 100, imagem: "imagens/churrasco-bovino.jpg" },
  { nome: "Churrasco Suíno", preco: 75, imagem: "imagens/churrasco-suino.jpg" },
  { nome: "Empanado", preco: 5, imagem: "imagens/empanado.jpg" },
  { nome: "Estalinho Pequeno", preco: 5, imagem: "imagens/estalinho.jpg" },
  { nome: "Maionese", preco: 8, imagem: "imagens/maionese.jpg" },
  { nome: "Mini Pizza", preco: 7, imagem: "imagens/mini-pizza.jpg" },
  { nome: "Pastel", preco: 7, imagem: "imagens/pastel.jpg" },
  { nome: "Pescaria", preco: 7, imagem: "imagens/pescaria.jpg" },
  { nome: "Pão Francês", preco: 5, imagem: "imagens/pao.jpg" },
  { nome: "Quentão", preco: 5, imagem: "imagens/quentao.jpg" },
  { nome: "Refrigerante", preco: 5, imagem: "imagens/refrigerante.jpg" },
];

let carrinho = [];
let numeroPedido = parseInt(localStorage.getItem("pedidoAtual")) || 1;

function carregarProdutos() {
  const container = document.getElementById("produtos");
  produtos.forEach((produto, index) => {
    const card = document.createElement("div");
    card.className = "produto";
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
    `;
    card.onclick = () => selecionarQuantidade(index);
    container.appendChild(card);
  });
}

function selecionarQuantidade(index) {
  const qtd = prompt(`Quantas unidades de ${produtos[index].nome}?`);
  if (!qtd || isNaN(qtd)) return;
  carrinho.push({ ...produtos[index], quantidade: parseInt(qtd) });
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const total = document.getElementById("total");
  lista.innerHTML = "";
  let soma = 0;
  carrinho.forEach((item, i) => {
    const li = document.createElement("li");
    const subtotal = item.preco * item.quantidade;
    li.textContent = `${item.nome} x${item.quantidade} - R$ ${subtotal.toFixed(2)}`;
    lista.appendChild(li);
    soma += subtotal;
  });
  total.textContent = soma.toFixed(2);
}

function finalizarPedido() {
  document.getElementById("pagamento").style.display = "block";
  document.getElementById("carrinho").style.display = "none";
}

let formaPagamento = "";

function selecionarPagamento(tipo) {
  formaPagamento = tipo;
  if (tipo === "dinheiro") {
    document.getElementById("trocoSection").style.display = "block";
  } else {
    document.getElementById("trocoSection").style.display = "none";
  }
}

function calcularTroco() {
  const recebido = parseFloat(document.getElementById("valorRecebido").value);
  const total = parseFloat(document.getElementById("total").textContent);
  const troco = recebido - total;
  document.getElementById("troco").textContent = troco.toFixed(2);
}

  function confirmarPagamento() {
  salvarVenda();
  window.location.href = `impressão.html?pedido=${numeroPedido}`;
  localStorage.setItem("pedidoAtual", numeroPedido + 1);
  numeroPedido++;
}

function salvarVenda() {
  const vendas = JSON.parse(localStorage.getItem("vendas") || "[]");
  vendas.push({ numero: numeroPedido, carrinho, formaPagamento });
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function gerarCupom() {
  const cupom = document.getElementById("cupom");
  const tickets = document.getElementById("tickets");
  cupom.innerHTML = `<h3>Festa de São Pedro</h3><p>Pedido #${numeroPedido}</p>`;
  let total = 0;
  carrinho.forEach((item) => {
    cupom.innerHTML += `<p>${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}</p>`;
    for (let i = 0; i < item.quantidade; i++) {
      tickets.innerHTML += `
        <div class="ticket">
          <h4>${item.nome}</h4>
          <p>Pedido #${numeroPedido}</p>
          <p>Deus abençoe</p>
          <hr />
        </div>
      `;
    }
    total += item.preco * item.quantidade;
  });
  cupom.innerHTML += `<p><strong>Total: R$ ${total.toFixed(2)}</strong></p>`;
  cupom.innerHTML += `<p>Pagamento: ${formaPagamento}</p>`;
  cupom.innerHTML += `<p>Deus abençoe</p>`;
}

function fecharCaixa() {
  const vendas = JSON.parse(localStorage.getItem("vendas") || "[]");
  let total = 0;
  let porProduto = {};
  let porPagamento = { dinheiro: 0, cartao: 0 };

  vendas.forEach((venda) => {
    venda.carrinho.forEach((item) => {
      total += item.preco * item.quantidade;
      porProduto[item.nome] = (porProduto[item.nome] || 0) + item.quantidade;
    });
    porPagamento[venda.formaPagamento] += venda.carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
  });

  alert(`Fechamento de Caixa:\nTotal: R$ ${total.toFixed(2)}\n` +
        `Cartão: R$ ${porPagamento.cartao.toFixed(2)}\n` +
        `Dinheiro: R$ ${porPagamento.dinheiro.toFixed(2)}`);
}

document.addEventListener("DOMContentLoaded", carregarProdutos);


