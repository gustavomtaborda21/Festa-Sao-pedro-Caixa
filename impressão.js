// impressao.js

function getPedidoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("pedido"));
}

function gerarImpressao(pedidoId) {
  const vendas = JSON.parse(localStorage.getItem("vendas") || "[]");
  const pedido = vendas.find(v => v.numero === pedidoId);
  if (!pedido) {
    document.getElementById("conteudo").innerHTML = `<p>Pedido não encontrado.</p>`;
    return;
  }

  const cupom = document.getElementById("cupom");
  const tickets = document.getElementById("tickets");
  let total = 0;

  cupom.innerHTML = `
    <h3>Festa de São Pedro</h3>
    <p>Pedido #${pedido.numero}</p>
    <hr />
  `;

  pedido.carrinho.forEach((item) => {
    total += item.preco * item.quantidade;
    cupom.innerHTML += `<p>${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}</p>`;
    for (let i = 0; i < item.quantidade; i++) {
      tickets.innerHTML += `
        <div class="ticket">
          <h4>${item.nome}</h4>
          <p>Pedido #${pedido.numero}</p>
          <p>Deus abençoe</p>
        </div>
      `;
    }
  });

  cupom.innerHTML += `
    <hr />
    <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
    <p>Pagamento: ${pedido.formaPagamento}</p>
    <p>Deus abençoe</p>
  `;
}

function voltar() {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const pedidoId = getPedidoId();
  gerarImpressao(pedidoId);
});


