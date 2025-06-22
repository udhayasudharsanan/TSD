// GoHomeButton.jsx
import { useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io"; // Home icon

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center bg-indigo-700 text-white px-4 py-2  rounded-2xl hover:bg-indigo-800 mt-4"
    >
      <IoMdHome className=" h-5 w-5" />
    </button>
  );
}

export default HomeButton;
