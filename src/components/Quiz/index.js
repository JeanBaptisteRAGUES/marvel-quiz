import React, { Component } from 'react';
import { QuizMarvel } from '../quizMarvel';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';

/*
const Quiz = (props) => {
    return (
        <div>
            <h2>Pseudo: {props.userData.pseudo}</h2>
        </div>
    )
}
*/

class Quiz extends Component {

    state = {
        levelNames: ["debutant", "confirme", "expert"],
        quizLevel: 0,
        maxQuestions: 10,
        storedQuestions: [],
        question: null,
        options: [],
        idQuestion: 0,
        btnDisabled: true,
        userAnswer: null,
        score: 0
    }

    storedDataRef = React.createRef();

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

    componentDidMount() {
        this.loadQuestions(this.state.levelNames[this.state.quizLevel])
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.storedQuestions !== prevState.storedQuestions){
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options
            })
        }

        if(this.state.idQuestion !== prevState.idQuestion){
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }
    }

    nextQuestion = () => {
        if(this.state.idQuestion === this.state.maxQuestions - 1){
            //End
        }else{
            this.setState(prevState => ({
                idQuestion: prevState.idQuestion + 1
            }))
        }

        const goodAnswer = this.storedDataRef.current[this.state.idQuestion];
        if(this.state.userAnswer === goodAnswer){
            this.setState((prevState) => ({
                score: prevState.score + 1
            }))
        }
    }

    submitAnswer = (selectedanswer) => {
        this.setState({
            userAnswer: selectedanswer,
            btnDisabled: false
        })
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

        return (
            <div>
                <Levels />
                <ProgressBar />
                <h2>{this.state.question}</h2>
                {displayOptions}
                <button 
                    disabled={this.state.btnDisabled} 
                    className="btnSubmit"
                    onClick={this.nextQuestion}
                >
                    Suivant
                </button>
            </div>
        )
    }
}

export default Quiz