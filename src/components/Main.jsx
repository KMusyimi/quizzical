import Button from "./Button";
import {createContext, useState} from "react";
import Questions from "./Questions.jsx";

const StartGameContext = createContext();

function Main() {

    const [start, setStart] = useState(false);

    function startGame() {
        console.log("Starting Game");
        setStart(true);
        document.getElementById('start-screen').classList.remove('show');
    }

    function startScreen() {
        return (
            <section className='start-screen' id='start-screen'>
                <h1>Quizzical</h1>
                <p>Test your intelligence. Attempt the quiz challenges and challenge your intelligence. </p>
                <Button className='start-btn btn' onClick={startGame}>Start quiz</Button>
            </section>
        )
    }

    return (
        <StartGameContext.Provider value={start}>
            {!start && startScreen()}
            {start && <Questions start={start}/>}
        </StartGameContext.Provider>
    )
}

export default Main;
export {StartGameContext};