import Header from './components/Header'
import React from 'react';
import ProductContainer from './components/ProductContainer';
import About from './components/About';
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import {Outlet} from 'react-router-dom'
import ProductDetails from './components/ProductDetails';
import Login from './components/Login';
import Add from './components/Add';
import Register from './components/Register';
import MyProducts from './components/MyProducts';
import io from 'socket.io-client';
import {AuthProvider} from './components/AuthContext'
import Profile from './components/Profile';
import PurchasedProducts from './components/PurchasedProducts'

const socket = io("http://192.168.48.239:5000");
const url="http://192.168.48.239:5000";
export const SocketContext = React.createContext();
export const SocketContextAd=React.createContext();
export const DomainContext=React.createContext();
const Home = () => {
  const name = 'Tomy'
  const a = 20
  return (<>
    <Header />
    <Outlet/>
  </>)
}
const router=createBrowserRouter([{
  path:'/',
  element:<Home/>
,children:[{
  path:'/',
  element: <ProductContainer />
},{
  path:'/login',
  element:<Login/>
},
{
  path:'/profile',
  element:<Profile/>
},{
  path:'/register',
  element:<Register/>
},{
  path:'/about',
  element:<About/>
},{
  path:'/add',
  element:<Add/>
},{
  path:'/myProducts',
  element:<MyProducts/>
},{
  path:'/product/:productId',
  element:<ProductDetails/>
},
{
  path:'/purchasedProducts',
  element:<PurchasedProducts/>
}]}])
const App=()=>{
  return(
    <DomainContext.Provider value={url}>
    <AuthProvider>
    <SocketContext.Provider value={socket}>
      <RouterProvider router={router} />
    </SocketContext.Provider>
    </AuthProvider>
    </DomainContext.Provider>
  )
}
export default App

