export default function AssinaturaCanceladaPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-6 text-center">
      <h1 className="text-3xl font-bold">Assinatura não concluída</h1>
      <p className="text-(--muted-foreground) text-lg">
        Parece que você cancelou ou fechou o checkout. Se quiser tentar novamente, clique abaixo.
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
