import Background from "./components/universal/ctuBackground";
import UserAuth from "./components/universal/userAuth";

export default function Home() {
  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <Background />
      <UserAuth />
    </main>
  );
}
