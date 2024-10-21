import {nanoid} from 'nanoid';
import {useContext, useEffect, useId, useRef, useState} from "react";
import Form from './Form';
import Input from "./Input";
import Button from "./Button.jsx";
import Spinner from "./Spinner.jsx";
import {decode} from "html-entities";
import {StartGameContext} from "./Main.jsx";

function Questions() {
    const id = useId();
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState("Fetching questions...⛏️");
    const firstRequest = useRef(true);
    const start = useContext(StartGameContext);

    const [correctAnswers, setCorrectAnswers] = useState([]);
    const url = 'https://opentdb.com/api.php?amount=5&category=28&difficulty=medium&type=multiple';

    useEffect(() => {
        if (firstRequest.current) {
            firstRequest.current = !firstRequest.current;
            getQuestions();
        }
    }, [start]);


    function shuffleAnswers(arr) {
        const elements = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
            arr[i] = decode(arr[i]);
            elements.push(arr[i]);
        }
        return elements;
    }

    async function getQuestions() {
        try {
            const fetchPromise = await fetch(url);
            if (!fetchPromise.ok) {
                throw new Error(`Trying to fetch new questions...⛏️`);
            }
            const json = await fetchPromise.json();
            if (json.response_code === 0) {
                const arr = []
                setQuestions(json.results.map((questions) => {
                    const {question, incorrect_answers, correct_answer} = questions;
                    arr.push(correct_answer);
                    return {
                        question: decode(question), answers: shuffleAnswers([...incorrect_answers, correct_answer]),
                    }
                }));
                setCorrectAnswers(arr);
                setTimeout(() => setLoading(false), 500);
                setMessage('Almost there...🥳');
            }
        } catch (err) {
            setMessage(err.message)
        }
    }


    function handleChange(e) {
        const labelId = e.target.id;
        const {value} = e.target;
        const choiceId = e.target.parentElement.parentElement.id;

        const answersObj = {
            id: labelId, choiceId: choiceId, selectedAnswer: value
        }
        setFormData(prevFormData => {
            if (prevFormData.length > 0) {
                const idx = prevFormData.map(data => data.choiceId).indexOf(answersObj.choiceId);
                if (idx >= 0) {
                    prevFormData[idx] = {...answersObj};
                    return [...prevFormData];
                }
                return [...prevFormData, answersObj];
            }
            return [answersObj];
        })
    }

    function restartGame() {
        setLoading(true);
        setFormData([]);
        setMessage('Fetching new questions...⛏️');
        getQuestions();
    }

    function handleClick() {
        const gameBtn = document.querySelector('.btn-container > .btn');
        const msg = document.querySelector('.msg');
        let count = 0;

        if (gameBtn.classList.contains('restart-btn')) {
            gameBtn.classList.remove('restart-btn');
            restartGame();
            return;
        }
        if (formData.length < 5) {
            msg.textContent = 'Check all answers before confirming your answers...🥹';
            msg.classList.add('err-msg');
            setTimeout(() => msg.textContent = '', 5000);
        } else {

            document.querySelectorAll('label > input[type=radio]').forEach(el => el.disabled = true);

            correctAnswers.forEach(answer => {
                document.querySelector(`input[value="${answer}"]`).parentElement.style.cssText = `
                        background-color:#94D7A2; 
                        opacity:1; 
                        color: #293264; 
                        outline:transparent;`;

            });
            formData.forEach(data => {
                const idx = correctAnswers.indexOf(data.selectedAnswer);
                if (idx < 0) {
                    document.querySelector(`input[value="${data.selectedAnswer}"]`)
                        .parentElement.style.backgroundColor = '#F8BCBC';
                    return;
                }
                count++;
            })
            count >= 3 ? msg.textContent =
                `You scored ${count}/${formData.length} correct answers🥳` :
                msg.textContent = `You scored ${count}/${formData.length} correct answers😭`;

            msg.className = 'msg score-msg';
            gameBtn.textContent = 'Play again';
            gameBtn.className = 'btn restart-btn';
        }

    }

    function labelElements(arr, idx) {
        return arr.map((answer, i) => {
            const inputId = `choices-${idx + 1}-${id + i}`;
            const labelId = `${(idx + 1)}-${id}-label${i + 1}`;

            return (<label
                key={`label-${id}-${i}`}
                id={labelId}
                htmlFor={inputId}>
                {answer}
                <Input
                    id={inputId}
                    type={"radio"}
                    name={`answer-${id}-${idx}`}
                    checked={formData.length > 0 ? formData.filter(data =>
                        data.id === inputId && data.selectedAnswer === answer).length > 0 : false}
                    onChange={handleChange}
                    value={answer}
                />
            </label>)
        })
    }

    const questionsElement = () => {
        return questions.map((data, idx) => {
            const {question, answers} = data;
            const choiceId = `choices-${idx + 1}`;
            return (<section key={nanoid()} className='question'>
                <h1>{question}</h1>
                <div id={choiceId} className='label-wrapper'>{labelElements(answers, idx)}</div>
            </section>)
        })
    }

    return (<>
        {loading && <Spinner>{message}</Spinner>}
        {start && !loading && <Form id='questions-form' className='form'>{questionsElement()}</Form>}
        {start && !loading && <div className='btn-container'>
            <span className='msg'></span>
            <Button className='btn game-btn' type="button" onClick={handleClick}>Check answers</Button>
        </div>}
    </>)
}

export default Questions;