import Link from 'next/link';

export default function Home() {
  return (
    <main style={{padding: 24, fontFamily: 'system-ui'}}>
      <h1>FuturoSimples</h1>
      <p>Sem misticismo. Só números. Seu dinheiro em 5, 10 e 20 anos.</p>
      <Link href="/dashboard">Ir para o Dashboard →</Link>
    </main>
  );
}
