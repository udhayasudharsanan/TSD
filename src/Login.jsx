import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import logo from "./assets/logo.png";
import Top from "./Top";

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      let role = "user"; // default role

      if (docSnap.exists()) {
        const data = docSnap.data();
        role = data.role || "user";
      } else {
        // If user doesn't exist in Firestore, add them
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: "user", // default role
        });
      }

      if (role === "admin") {
        localStorage.setItem("admin", "true");
        navigate("/admin-dashboard");
      } else {
        navigate("/"); // Normal user
      }
    } catch (err) {
      console.error("Login failed", err.message);
    }
  };

  return (
    <>
      <Top />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-[350px] text-center">
          <img
            src={logo}
            alt="Logo"
            className="w-44 h-36 mx-auto mb-4 rounded-full"
          />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Welcome to <span className="text-indigo-900 text-nowrap">Timple Saree Destination</span>
          </h2>
          <p className="text-gray-500 mb-6 text-sm">Sign in to continue</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-indigo-800 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
