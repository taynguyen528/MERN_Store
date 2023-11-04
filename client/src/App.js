import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

function App() {
    return (
        <>
            <Router>
                <Header />
                <Footer />
            </Router>
        </>
    );
}

export default App;
