import {nanoid} from 'nanoid';
import {useEffect, useId, useState} from "react";
import Form from './Form';
import Input from "./Input";
import Button from "./Button.jsx";
import Spinner from "./Spinner.jsx";
import {decode} from "html-entities";

// eslint-disable-next-line react/prop-types
function Questions({start}) {
    const id = useId();
    const [formData, setFormData] = useState([]);
    const [formMsg, setFormMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState("Fetching questions...⛏️");
    let retryTimer = null;

    const [correctAnswers, setCorrectAnswers] = useState([]);
    const url = 'https://opentdb.com/api.php?amount=5&category=28&difficulty=medium&type=multiple';

    useEffect(() => {
        const getQuestionsTimer = setTimeout(getQuestions, 500)
        return () => clearTimeout(getQuestionsTimer);
    }, []);


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
        let retry = 3000;

        try {
            clearTimeout(retryTimer);
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
                        question: decode(question),
                        answers: shuffleAnswers([...incorrect_answers, correct_answer]),
                    }
                }));
                setCorrectAnswers(arr);
                setTimeout(() => setLoading(false), 1000);
                setMessage('Almost there...🥳');
            }
        } catch (err) {
            retryTimer = setTimeout(getQuestions, retry);
            setMessage(err.message)
        }
    }


    function handleChange(e) {
        const {value} = e.target;
        const parentId = e.target.parentElement.parentElement.id;
        const answersObj = {
            parentId: parentId,
            selectedAnswer: value
        }
        setFormData(prevFormData => {
            if (prevFormData.length > 0) {
                const idx = prevFormData.map(data => data.parentId).indexOf(answersObj.parentId);
                if (idx >= 0) {
                    prevFormData[idx] = {...prevFormData[idx], selectedAnswer: value};
                    return [...prevFormData];
                }
                return [...prevFormData, answersObj];
            }
            return [answersObj];
        })
    }

    function handleClick() {
        const gameBtn = document.querySelector('.btn-container > .btn');
        const msg = document.querySelector('.msg');
        let count = 0;

        if (gameBtn.classList.contains('restart-btn')) {
            setLoading(true);
            setFormData([]);
            setMessage('Fetching new questions...⛏️')
            gameBtn.classList.remove('restart-btn');
            getQuestions();
            return;
        }
        if (formData.length < 5) {
            msg.textContent = 'Check all answers before confirming your answers...🥹';
            msg.classList.add('err-msg');
            setTimeout(() => msg.textContent = '', 5000);
        } else {

            document.querySelectorAll('label > input[type=radio]').forEach(
                el => el.disabled = true);

            correctAnswers.forEach(answer => {
                document.querySelector(`input[value="${answer}"]`)
                    .parentElement.style.cssText = `
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
                }
            )
            count >= 3 ? msg.textContent = `You scored ${count}/${formData.length} correct answers🥳` :
                msg.textContent = `You scored ${count}/${formData.length} correct answers😭`;
            msg.className = 'msg score-msg';
            gameBtn.textContent = 'Play again';
            gameBtn.className = 'btn restart-btn';
        }

    }

    function labelElements(arr, idx) {
        return arr.map((answer, i) => {
                return (
                    <label
                        key={`label-${id}-${i}`}
                        htmlFor={answer.toLowerCase().replace(/\s/g, "-")}>
                        {answer}
                        <Input
                            id={answer.toLowerCase().replace(/\s/g, "-")}
                            type={"radio"}
                            name={`answer-${id}-${idx}`}
                            checked={formData.length > 0 ?
                                formData.filter(data => data.selectedAnswer === answer).length > 0 : false}
                            onChange={handleChange}
                            value={answer}
                        />
                    </label>
                )
            }
        )
    }

    const questionsElement = () => {
        return questions.map((data, idx) => {
            const {question, answers} = data;
            return (
                <section key={nanoid()} className='question'>
                    <h1>{question}</h1>
                    <div id={`choices-${idx + 1}`} className='label-wrapper'>{labelElements(answers, idx)}</div>
                </section>
            )
        })
    }
    return (
        <>
            {loading && <Spinner text={message}/>}
            {start && !loading && <Form id='questions-form' className='form'>{questionsElement()}</Form>}
            {start && !loading &&
                <div className='btn-container'>
                    <span className='msg'></span>
                    {formMsg ? <p className='err-msg'>{formMsg}</p> : ""}
                    <Button className='btn game-btn' type="button" onClick={handleClick}>Check answers</Button>
                </div>}
        </>
    )
}

export default Questions;