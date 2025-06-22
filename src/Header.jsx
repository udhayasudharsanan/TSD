import { IoMdCart } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Header({ search, setSearch, user }) {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate("/user-info");
  };

  return (
    <div>
      <header className="flex flex-row justify-between items-center m-4 pr-3.5">
       
        <form className="flex-grow max-w-xl border-2 rounded-full px-4 py-1 h-10 mx-4">
          <input
            placeholder="Type here to search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:outline-none w-full"
          />
        </form>

       
        <Link to="/cart" className="mr-4">
          <IoMdCart className="w-8 h-8 text-gray-700 hover:text-indigo-800" />
        </Link>

        
        <button
          onClick={handleUserClick}
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-800"
        >
          <FaUserCircle className="w-6 h-6" />
          {user?.displayName || "User"}
        </button>
      </header>
    </div>
  );
}

export default Header;
