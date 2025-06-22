import App from './App'
import { Link } from "react-router-dom";

function Products({items}){

    return(
        <div className='bg-gradient-to-b from-white via-gray-50 to-white'>
        <div className='grid grid-cols-2 gap-3.5 m-3 '>
       
        {
            items.map((prod) =>
             <ul key={prod.id} className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-center hover:p-2 " >
                <li key={prod.id}  >
                   <Link to={`/${prod.id}`} >
                       <img src={prod.image} 
                       className='w-25 h-20 mx-auto object-contain hover:w-30 hover:h-25'
                       ></img>
                       <p className='text-sm'>{(prod.title).length <20?prod.title:(prod.title).slice(0,20)+ "..."}</p>
                       <p className="font-semibold text-black-600">₹{prod.price}</p>
                   </Link>
                </li>
            </ul>
            )
        }            
        </div>
        </div>
    )
}

export default Products