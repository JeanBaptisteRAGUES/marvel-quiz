import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { QuizMarvel } from '../quizMarvel';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver';
import {FaChevronRight} from 'react-icons/fa';

/*
const Quiz = (props) => {
    return (
        <div>
            <h2>Pseudo: {props.userData.pseudo}</h2>
        </div>
    )
}
*/

toast.configure();

const initialState = {
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    showWelcomeMsg: true,
    quizEnd: false,
    percent: null
}

const levelNames = ["debutant", "confirme", "expert"];
class Quiz extends Component {

    constructor(props){
        super(props);

        this.state = initialState;
        this.storedDataRef = React.createRef();
    }

    loadQuestions = (quizz) => {
        const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
        if(fetchedArrayQuiz.length >= this.state.maxQuestions){
            this.storedDataRef.current = fetchedArrayQuiz;
            

            //Récupère tout sauf les réponses pour empecher un utilisateur de tricher en les affichant dans la console
            const newArray = fetchedArrayQuiz.map(({answer, ...keepRest}) => keepRest);
            this.setState({
                storedQuestions: newArray
            });
        }
    }

    showToastMsg = (pseudo) => {
        if(this.state.showWelcomeMsg){

            this.setState({
                showWelcomeMsg: false
            })

            toast.info(`Bienvenue ${pseudo}, et bonne chance !`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false
            });
        }
    }

    componentDidMount() {
        this.loadQuestions(levelNames[this.state.quizLevel])
    }

    componentDidUpdate(prevProps, prevState){
        
        const {
            maxQuestions,
            storedQuestions,
            idQuestion,
            score,
            quizEnd
        } = this.state;

        if(storedQuestions.length && (storedQuestions !== prevState.storedQuestions)){
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options
            })
        }

        if(storedQuestions.length && (idQuestion !== prevState.idQuestion)){
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }

        if(quizEnd !== prevState.quizEnd){
            const gradePercent = this.getPercentage(maxQuestions, score);
            this.gameOver(gradePercent);
        }

        if(this.props.userData.pseudo !== prevProps.userData.pseudo){
            this.showToastMsg(this.props.userData.pseudo);
        }
    }

    nextQuestion = () => {
        if(this.state.idQuestion === this.state.maxQuestions - 1){
            this.setState({
                quizEnd: true
            });
        }else{
            this.setState(prevState => ({
                idQuestion: prevState.idQuestion + 1
            }))
        }

        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        if(this.state.userAnswer === goodAnswer){
            this.setState((prevState) => ({
                score: prevState.score + 1
            }));

            toast.success('Bravo, +1 point !', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                bodyClassName: "toastify-color"
            });
        }else{
            toast.error('Mauvaise réponse :-/', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                bodyClassName: "toastify-color"
            });
        }
    }

    submitAnswer = (selectedanswer) => {
        this.setState({
            userAnswer: selectedanswer,
            btnDisabled: false
        })
    }

    getPercentage = (maxQuest, ourScore) => (ourScore * 100 / maxQuest);

    gameOver = (percent) => {

        if(percent >= 50) {
            this.setState({
                quizLevel: this.state.quizLevel + 1,
                percent
            });
        }else{
            this.setState({
                percent
            });
        }
        /*
        this.setState({
            quizEnd: true
        })
        */
    }

    loadLevelQuestions = (param) => {
        this.setState({...initialState, quizLevel: param});

        this.loadQuestions(levelNames[param]);
    }

    render() {

        const {
            quizLevel,
            maxQuestions,
            question,
            options,
            idQuestion,
            btnDisabled,
            userAnswer,
            score,
            quizEnd,
            percent
        } = this.state;
        
        const displayOptions = options.map((option, index) => {
            return (
                <p key={index} 
                    className={`answerOptions ${userAnswer === option ? "selected" : null}`}
                    onClick={() => this.submitAnswer(option)}
                >
                <FaChevronRight /> {option}
                </p>
            )
        });

        return quizEnd ? (
            <QuizOver 
                ref={this.storedDataRef}
                levelNames={levelNames}
                score={score}
                maxQuestions={maxQuestions}
                quizLevel={quizLevel}
                percent={percent}
                loadLevelQuestions={this.loadLevelQuestions}
            />
        ) : (
            <Fragment>
                <Levels 
                    levelNames={levelNames}
                    quizLevel={quizLevel}
                />
                <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions}/>
                <h2>{question}</h2>
                {displayOptions}
                <button 
                    disabled={btnDisabled} 
                    className="btnSubmit"
                    onClick={this.nextQuestion}
                >
                    {idQuestion < (maxQuestions - 1) ? "Suivant" : "Terminer"}
                </button>
            </Fragment>
        );
    }
}

export default Quiz