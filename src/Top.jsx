import logo from './assets/logo.png'

function Top(){
    return(
<div className='flex flex-row m-2 pl-2'>
        <img src={logo} className='h-14 w-19' ></img>
      <h1 className="text-2xl font-semibold text-indigo-800 mt-3 pl-2   hover:text-indigo-700 ">
         Timple Saree Destination
      </h1>
      </div>
    )
}

export default Top

