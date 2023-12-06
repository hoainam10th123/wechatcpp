import './App.css';
import { Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './common/components/Header';
import { ToastContainer } from 'react-toastify';
import { useStore } from './stores/stores';
import { useEffect } from 'react';


function App() {
  const { userStore, socketStore } = useStore()

  useEffect(()=>{
    if(userStore.user && !socketStore.IsConnected){
      socketStore.createConnection()
    }
  }, [userStore.user, socketStore])

  return (
    <>
      <CssBaseline />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      <Header />
      <Container sx={{mt: 4}}>
        <Outlet />     
      </Container>
    </>
  );
}

export default App;
