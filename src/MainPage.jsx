import  App  from './App.jsx';
import Products from './Products.jsx';
import Header from './Header.jsx';
import { FaPlane, FaLock, FaBoxOpen } from "react-icons/fa";
import Footer from './Footer.jsx';
import Top from './Top.jsx'





function MainPage({search,setSearch,items}){
 
  
    
    return(
        <div className='relative max-auto'>
        <Top />


        <Header 
        
        search={search}
        setSearch={setSearch}

        />

        <Products
        items = {items}
         />
     
        <div className="mt-8 mx-4 bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold text-center mb-4 text-gray-700">Why Shop With Us?</h2>

        <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm text-gray-600">

          {/* Flight Delivery */}
          <div className="flex items-center gap-2 justify-center">
            <FaPlane className="animate-flight text-blue-500 text-xl" />
            <span>Fast Delivery All Over India</span>
          </div>

          {/* Secure Payment */}
          <div className="flex items-center gap-2 justify-center">
            <FaLock className="animate-pulse text-green-500 text-xl" />
            <span>100% Secure UPI Payments</span>
          </div>

          {/* Easy Returns */}
          <div className="flex items-center gap-2 justify-center">
            <FaBoxOpen className="animate-bounce text-yellow-500 text-xl" />
            <span>Easy Returns & Refunds</span>
          </div>

        </div>
        </div>
        
        
       <Footer/>      
    
    </div>
    )
}

export default MainPage