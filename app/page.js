import LoginModal from "./components/loginModal";
import SignupModal from "./components/signupModal";

export default function Home() {
  return (
    <main className="h-[100vh] w-full">
      <LoginModal />
      <SignupModal />
    </main>
  );
}
