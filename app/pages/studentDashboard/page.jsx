import Background from "@/app/components/ctuBackground";
import StudentNavbar from "@/app/components/studentNavbar";

const studentDashboard = () => {
  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <Background />
      <StudentNavbar />
    </main>
  );
};

export default studentDashboard;
