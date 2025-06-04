import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <img
            src="../../public/404notfound.png"
            alt="404 Not Found"
            loading="lazy"
            className="mb-12"
          />
          <div className="w-[50%] flex flex-col gap-4">
            <p className="text-center text-6xl font-medium">Page Not Found</p>
            <p className="text-center text-lg">
              The page you are looking for might have been removed had its name
              changed or is temporarily unavailable.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-[#8AC732] text-white font-sans max-w-[146px] w-full h-[48px] rounded-[100px] font-medium text-sm"
                onClick={() => navigate("/")}
              >
                Home Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
