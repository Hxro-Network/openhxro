import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from '@contexts/walletContext';
import Home from '@pages/Home';
import { NotifyContainer } from '@utils/notify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <WalletProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
          </Routes>
        </Router>
      </WalletProvider>
      <NotifyContainer />
    </>
  );
}

export default App;
