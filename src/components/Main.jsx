import Button from "./Button";
import {createContext,  useState} from "react";
import Questions from "./Questions.jsx";
const StartGameContext = createContext();
function Main() {

    const [start, setStart] = useState(false);

    function newGame() {
        console.log("Starting Game");
        setStart(!start);
        document.getElementById('start-screen').classList.remove('show');
    }

    function homeScreen() {
        return (
            <section className='start-screen' id='start-screen'>
                <h1>Quizzical</h1>
                <p>Test your intelligence. Attempt the quiz challenges and challenge your intelligence. </p>
                <Button className='start-btn btn' onClick={newGame}>Start quiz</Button>
            </section>
        )
    }

    return (
        <>
            {!start && homeScreen()}
            <StartGameContext.Provider value={{start}}>
                {start && <Questions/>}
            </StartGameContext.Provider>
        </>
    )
}

export default Main;
export {StartGameContext}