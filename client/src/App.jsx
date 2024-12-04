import React, { Suspense, lazy } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import Spinner from './components/Spinner';

const Login = lazy(()=>import('./pages/Login'));
const SignUp = lazy(()=>import('./pages/SignUp'));
const Dashboard = lazy(()=>import('./pages/Dashboard'));
const Tickets = lazy(()=>import('./pages/Tickets'));
const ForgetPassword = lazy(()=>import('./pages/ForgetPassword'));
const ResetPassword = lazy(()=>import('./pages/ResetPassword'));
const NotFound = lazy(()=>import('./pages/NotFound'));
const  AuthProvider  = lazy(()=>import('./Context/AuthContext'));
const ProtectedRoutes = lazy(()=>import('./components/ProtectedRoutes'));
const ProtectedAdminRoutes = lazy(()=>import('./components/ProtectedAdminRoutes'));
const Home = lazy(()=>import('./pages/Home'));
const AddNote = lazy(()=>import('./pages/AddNote'));
const CreateTicket = lazy(()=>import('./pages/CreateTicket'));
const CustomerHomePage = lazy(()=>import('./pages/CustomerHomePage'));
const CustomerTickets = lazy(()=>import('./pages/CustomerTickets'));
const User = lazy(()=>import('./pages/Users'));
const EditProfile = lazy(()=>import('./pages/EditProfile'));
const CustomerAddNote = lazy(()=>import('./pages/CustomerAddNote'));
const ChatPage = lazy(()=>import('./pages/ChatPage'));


const App = () => {
  return (
    <>
    <AuthProvider>
    <Router>
      <Toaster/>
      <Suspense fallback={<Spinner/>}> 
      
      <Routes>

        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        
        {/* Protected customer routes */}
        <Route path='/' element={<ProtectedRoutes> <CustomerHomePage/> </ProtectedRoutes>}/>
        <Route path='/create-ticket' element={<ProtectedRoutes> <CreateTicket/> </ProtectedRoutes>}></Route>
        <Route path='/my-tickets' element={<ProtectedRoutes> <CustomerTickets/> </ProtectedRoutes>}></Route>
        <Route path='/addNote/:id' element={<ProtectedRoutes> <CustomerAddNote/> </ProtectedRoutes>}></Route>
        <Route path='/messages/:id' element={<ProtectedRoutes> <ChatPage/> </ProtectedRoutes>}></Route>

        {/* Protectd admin routes */}
        <Route path='/dashboard' element={<ProtectedAdminRoutes> <Dashboard/> </ProtectedAdminRoutes>}>
          <Route index element={<Home/>}/>
          <Route path='/dashboard/tickets' element={<Tickets/>}/>
          <Route path='/dashboard/users' element={<User/>}/>
          <Route path='/dashboard/getTicket/:id' element={<AddNote/>}/>
          <Route path='/dashboard/edit-profile/:id' element={<EditProfile/>}/>
        </Route>

        {/* Password reset routes */}
        <Route path='/forgetPassword' element={<ForgetPassword/>}/>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}/>
        
        {/* Route for not found page */}
        <Route path='*' element={<NotFound/>}/>

      </Routes>
      </Suspense>
    </Router>
    </AuthProvider>
    </>
  )
}

export default App