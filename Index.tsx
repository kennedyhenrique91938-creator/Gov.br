import GovHeader from "@/components/layout/GovHeader";
import LoginCard from "@/components/features/LoginCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <main className="flex-1 flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </main>
    </div>
  );
};

export default Index;
