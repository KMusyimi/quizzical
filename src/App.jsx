import './App.css';
import Main from './components/Main.jsx';
import Spinner from "./components/Spinner";
import {useState} from "react";


function App() {
    const [loading, setLoading] = useState(true);
    setTimeout(() => setLoading(false), 1000);
    return (
        <>
            <main id='content'>
                <div className="circle top"></div>
                {loading && <Spinner>Loading...</Spinner>}
                {!loading && <Main/>}
                <div className="circle bottom"></div>
            </main>
        </>
    );
}

export default App
