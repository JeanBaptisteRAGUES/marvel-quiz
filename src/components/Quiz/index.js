import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { QuizMarvel } from '../quizMarvel';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver';

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

class Quiz extends Component {

    constructor(props){
        super(props);

        this.initialState = {
            levelNames: ["debutant", "confirme", "expert"],
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
            quizEnd: false
        }

        this.state = this.initialState;
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
        }else{
            console.log("Pas assez de questions !");
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
        this.loadQuestions(this.state.levelNames[this.state.quizLevel])
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.storedQuestions.length && (this.state.storedQuestions !== prevState.storedQuestions)){
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options
            })
        }

        if(this.state.storedQuestions.length && (this.state.idQuestion !== prevState.idQuestion)){
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }

        if(this.state.quizEnd !== prevState.quizEnd){
            const gradePercent = this.getPercentage(this.state.maxQuestions, this.state.score);
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
        this.setState({...this.initialState, quizLevel: param});

        this.loadQuestions(this.state.levelNames[param]);
    }

    render() {

        //const {pseudo} = this.props.userData;
        
        const displayOptions = this.state.options.map((option, index) => {
            return (
                <p key={index} 
                    className={`answerOptions ${this.state.userAnswer === option ? "selected" : null}`}
                    onClick={() => this.submitAnswer(option)}
                >
                {option}
                </p>
            )
        });

        return this.state.quizEnd ? (
            <QuizOver 
                ref={this.storedDataRef}
                levelNames={this.state.levelNames}
                score={this.state.score}
                maxQuestions={this.state.maxQuestions}
                quizLevel={this.state.quizLevel}
                percent={this.state.percent}
                loadLevelQuestions={this.loadLevelQuestions}
            />
        ) : (
            <Fragment>
                <Levels 
                    levelNames={this.state.levelNames}
                    quizLevel={this.state.quizLevel}
                />
                <ProgressBar idQuestion={this.state.idQuestion} maxQuestions={this.state.maxQuestions}/>
                <h2>{this.state.question}</h2>
                {displayOptions}
                <button 
                    disabled={this.state.btnDisabled} 
                    className="btnSubmit"
                    onClick={this.nextQuestion}
                >
                    {this.state.idQuestion < (this.state.maxQuestions - 1) ? "Suivant" : "Terminer"}
                </button>
            </Fragment>
        );
    }
}

export default Quiz