let paymentId = null;

async function criarPagamento(){
  const res = await fetch('/api/create-payment');
  const data = await res.json();

  paymentId = data.id;

  const qr = data.point_of_interaction.transaction_data.qr_code_base64;

  document.getElementById('pix-area').innerHTML = `
    <p style="margin-bottom:10px;">Escaneie o QR Code para pagar:</p>
    <img src="data:image/png;base64,${qr}" style="width:220px;" />
    <p style="margin-top:10px;">Aguardando pagamento...</p>
  `;

  verificarStatus();
}

async function verificarStatus(){
  if(!paymentId) return;

  const res = await fetch('/api/check-payment?id=' + paymentId);
  const data = await res.json();

  if(data.status === 'approved'){
    pagamentoVerificado = true;
    go('s-result');
    buildResult();
  } else {
    setTimeout(verificarStatus, 3000);
  }
}
