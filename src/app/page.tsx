import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-radial p-4">
      <div className="flex flex-col items-center justify-center">
        <h1>Bem vindo!</h1>
        <Link href="/login" className="rounded p-4 bg-black">ENTRAR</Link>
      </div>
    </div>
  );
}
