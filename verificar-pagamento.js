// api/verificar-pagamento.js
// Função serverless Vercel — consulta o Mercado Pago e verifica se o Pix foi pago

export default async function handler(req, res) {
  // Permite requisições do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ pago: false, mensagem: 'ID do pagamento não informado.' });
  }

  // Token do Mercado Pago (salvo como variável de ambiente no Vercel)
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({ pago: false, mensagem: 'Configuração de servidor incompleta.' });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(400).json({ pago: false, mensagem: 'Pagamento não encontrado.' });
    }

    const payment = await response.json();

    // Verifica se o pagamento está aprovado e se o valor é R$ 9,00
    const aprovado = payment.status === 'approved';
    const valorCorreto = payment.transaction_amount >= 9.0;

    if (aprovado && valorCorreto) {
      // Gera um token de acesso assinado com timestamp (válido por 2h)
      const token = Buffer.from(
        JSON.stringify({ ok: true, ts: Date.now(), id: paymentId })
      ).toString('base64');

      return res.status(200).json({ pago: true, token });
    } else {
      return res.status(200).json({
        pago: false,
        mensagem: payment.status === 'pending'
          ? 'Pagamento ainda em processamento. Aguarde alguns instantes.'
          : 'Pagamento não aprovado.',
      });
    }
  } catch (err) {
    console.error('Erro ao consultar MP:', err);
    return res.status(500).json({ pago: false, mensagem: 'Erro ao verificar pagamento.' });
  }
}
