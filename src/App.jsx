import { useEffect, useState } from "react"
import { Routes , Route } from 'react-router-dom'
import './App.css'
import MainPage from './MainPage';
import SeperateProduct from "./SeperateProduct";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "./Cart";
import MyOrders from "./MyOrders";
import { useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import UserInfo from "./UserInfo";
import Checkout from "./Checkout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from './firebase'; 
import { doc, setDoc, getDoc } from "firebase/firestore";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminProtectedRoute from "./AdminProtected";
import { collection, getDocs } from "firebase/firestore";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminAnalysis from "./AdminAnalysis";
import AdminUsers from "./AdminUser";
function App() {
  const[items,setItems]= useState([
    { 
      id:1,
      title:"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price:109.95,
      description :"Your perfect pack for everyday use and walks in the forest.",
      category:"men's clothing",
      image:"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating:{	
      rate:3.9,
      count:120
      
     }
    }]);

  const [search,setSearch]=useState('') 

  const [searchResult,setSearchResult]=useState([])

  
const [cartItems, setCartItems] = useState(() => {
  const stored = localStorage.getItem("cartItems");
  return stored ? JSON.parse(stored) : [];
});



const hasMounted = useRef(false);

useEffect(() => {
  if (!hasMounted.current) {
    hasMounted.current = true;
    return;
  }
  // Only save when cartItems actually changed
  const prevCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const current = JSON.stringify(cartItems);
  const previous = JSON.stringify(prevCart);
  if (current !== previous) {
    localStorage.setItem("cartItems", current);
  }
}, [cartItems]);


const addToCart = (product, quantity = 1) => {
  setCartItems((prevCart) => {
    const index = prevCart.findIndex(item => item.firebaseId === product.firebaseId);
    if (index !== -1) {
      // Copy the item and safely increment
      const updated = [...prevCart];
      const currentQty = updated[index].quantity || 0;
      updated[index] = {
        ...updated[index],
        quantity: currentQty + quantity
      };
      return updated;
    }
    return [...prevCart, { ...product, quantity }];
  });
};


const removeCart = (id) => {
  setCartItems((prevCart) => {
    const index = prevCart.findIndex(item => item.firebaseId === id);
    if (index !== -1) {
      const updated = [...prevCart];
       const currentQty = index !==-1 ? updated[index].quantity : -1 ;
      if (updated[index].quantity > 1) {
        updated[index] ={
          ...updated[index],
          quantity: (currentQty - 1)
        };
      } else {
        updated.splice(index, 1);
      }
      return updated;
    }
    return prevCart;
  });
};


  useEffect(() => {
  const fetch = async () => {
    const snap = await getDocs(collection(db, "products"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(data);
  };
  fetch();
}, []);

  

  useEffect(()=>{
    const filteredResult = items.filter((prod)=> ((prod.title).toLowerCase()).includes(search.toLowerCase()))
    setSearchResult(filteredResult)
  },[search, items])
  
   const [user, setUser] = useState(null);
     const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
    setUser(loggedInUser);

    if (!loggedInUser) {
      if (window.location.pathname !== "/admin-login") {
        navigate("/login");
      }
    } else {
      
      const docRef = doc(db, "users", loggedInUser.uid);
      const docSnap = await getDoc(docRef);
      const role = docSnap.exists() ? docSnap.data().role : "user";

      localStorage.setItem("admin", role === "admin");

      if (role === "admin" && window.location.pathname === "/admin-login") {
        navigate("/admin-dashboard");
      } else if (role !== "admin" && window.location.pathname === "/login") {
        navigate("/");
      }
    }
  });

  return () => unsubscribe();
}, []);




  
  const saveCartToDB = async (cartItems) => {
  const user = auth.currentUser;
  if (user) {
    const cartRef = doc(db, "carts", user.uid);
    await setDoc(cartRef, { cartItems }, { merge: true });
  }
};

const clearCart = () => setCartItems([]);

useEffect(() => {
  if (cartItems.length > 0) {
    saveCartToDB(cartItems);
  }
}, [cartItems]);


  return (
    <>
    <Routes>
      
      <Route path="/" element={
        <ProtectedRoute>
        < MainPage 
        items={searchResult}
        search={search}
        setSearch={setSearch}

        />
        </ProtectedRoute>
      } 
      />


      <Route path= "/:id" element={
        <ProtectedRoute>
        <SeperateProduct 
        items={searchResult}
     
        addToCart={addToCart}
        />
        </ProtectedRoute>
      }
      />

      <Route path="/login" element ={<Login />}  />

      <Route path="/cart" element ={
       <ProtectedRoute>
        <Cart 
      addToCart={addToCart}
      cartItems={cartItems}
      removeCart={removeCart}
      />
       </ProtectedRoute>
       
     
    } />

    <Route path="/checkout" element ={
        <ProtectedRoute>
       <Checkout cartItems={cartItems}
       setCartItems={setCartItems}
       clearCart={clearCart}
        />
      </ProtectedRoute>
    } />


    <Route path="/payment-success" element={
      
      <PaymentSuccess />
      
    } />
    <Route path="/payment-failure" element={
      <ProtectedRoute>
      <PaymentFailure />
      </ProtectedRoute>} />

    <Route path="/my-orders" element={
      <ProtectedRoute>
        <MyOrders />
      </ProtectedRoute>
    } />  

    <Route path="/user-info" element={
      <ProtectedRoute>
          <UserInfo />
      </ProtectedRoute>
    } />

    <Route path="/admin-login" element={<AdminLogin />} />



    <Route path="/admin-dashboard" element={
   <AdminProtectedRoute>
    <AdminDashboard />
   </AdminProtectedRoute>
      }
    
    />
    <Route path="/admin-orders" element={
      <AdminProtectedRoute>
         <AdminOrders/> 
      </AdminProtectedRoute>
    }/>
    <Route path="/admin-products" element={
      <AdminProtectedRoute>
         <AdminProducts/> 
      </AdminProtectedRoute>
    }/>
    <Route path="/admin-users" element={
      <AdminProtectedRoute>
         <AdminUsers/> 
      </AdminProtectedRoute>
    }/>
    <Route path="/admin-analysis" element={
      <AdminProtectedRoute>
         <AdminAnalysis/> 
      </AdminProtectedRoute>
    }/>
    

    </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
 
}

export default App
