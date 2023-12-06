import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../features/login/Login";
import SignUp from "../features/register/signUp";
import ChatHome from "../features/chatHome/chatHome";
import TestError from "../features/error/testError";
import ServerErrorView from "../features/error/ServerError";
import RequireAuth from "./RequireAuth";
import TestSimplePeer from "../features/testSimplePeer/testSimplePeer";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            // authenticated routes
            // {element: <RequireAuth />, children: [
            //     {path: 'checkout', element: <CheckoutWrapper />},
            //     {path: 'orders', element: <Orders />},
            // ]},
            // admin routes
            // {element: <RequireAuth roles={['Admin']} />, children: [
            //     {path: 'inventory', element: <Inventory />},
            // ]},
            {element: <RequireAuth />, children: [
                {path: 'chathome', element: <ChatHome />},
            ]},
            {path: 'test', element: <TestSimplePeer />},
            {path: 'login', element: <Login />},
            {path: 'signup', element: <SignUp />},            
            {path: 'server-error', element: <ServerErrorView />},
            {path: 'error', element: <TestError />},
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
])