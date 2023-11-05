import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import DieuHuongURL from './Router';
import { CartProvider } from './components/Cart/CartContext';

function App() {
  return (
    <>
      <Router>
        <CartProvider>
        <Header />
        <DieuHuongURL />
        <Footer />
        </CartProvider>
      </Router>
    </>
  );
}

export default App;
