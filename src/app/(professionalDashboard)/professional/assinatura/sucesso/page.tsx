export default function AssinaturaSucessoPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-6 text-center">
      <h1 className="text-3xl font-bold">Assinatura confirmada!</h1>
      <p className="text-(--muted-foreground) text-lg">
        Obrigado por assinar o plano. Agora você pode ver os contatos dos clientes nos pedidos.
      </p>
      <a
        href="/professional"
        className="liquid-button inline-flex px-6 py-3 text-lg justify-center"
      >
        Voltar para oportunidades
      </a>
    </main>
  );
}
