import React, { Fragment, useEffect, useState } from 'react';
import { GiTrophyCup } from 'react-icons/gi';
import Loader from '../Loader';
import Modal from '../Modal';
import axios from 'axios';

const QuizOver = React.forwardRef((props, ref) => {

    const {levelNames, score, maxQuestions, quizLevel, percent, loadLevelQuestions} = props;
    const [asked, setAsked] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [characterInfos, setCharacterInfos] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const hash = '197165bd50a607e72b169197cab26b7c';
    console.log(API_PUBLIC_KEY);

    useEffect(() => {
        setAsked(ref.current);

        if(localStorage.getItem('marvelStorageDate')){
            const date = localStorage.getItem('marvelStorageDate'); 
            checkDataAge(date);
        }
    }, [ref]);

    const checkDataAge = (date) => {
        const today = Date.now();
        const msDiff = today - date;
        const daysDiff = msDiff/(1000*3600*24);

        if(daysDiff >= 2){
            localStorage.clear();
            localStorage.setItem('marvelStorageDate', Date.now());
        }
    }

    const showModal = (id) => {
        setOpenModal(true);

        if(localStorage.getItem(id)){
            setCharacterInfos(JSON.parse(localStorage.getItem(id)));
            setLoading(false);
        }else{
            axios
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
            .then((response) => {
                setCharacterInfos(response.data);
                setLoading(false);

                localStorage.setItem(id, JSON.stringify(response.data));
                if(!localStorage.getItem('marvelStorageDate')){
                    localStorage.setItem('marvelStorageDate', Date.now());
                }
            })
            .catch((error) => {
                console.log(error);
            }); 
        }
    }

    const hideModal = () => {
        setOpenModal(false);
        setLoading(true);
    }

    const upcaseFirstLetter = (myString) => {
        return myString.charAt(0).toUpperCase() + myString.slice(1);
        //return "";
    }

    const averageGrade = maxQuestions / 2.0;

    if(score < averageGrade){
        setTimeout(() => {
            //loadLevelQuestions(0);
            loadLevelQuestions(quizLevel);
        }, 3000);
    }

    const decision = score >= averageGrade ? (
        <Fragment>
            <div className="stepsBtnContainer">
            {
                quizLevel < levelNames.length ? (
                    <Fragment>
                        <p className="successMsg">
                            Bravo, passez au niveau suivant !
                        </p>
                        <button 
                            className="btnResult success"
                            onClick={() => loadLevelQuestions(quizLevel)}
                        >
                            Niveau suivant 
                        </button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <p className="successMsg">
                            <GiTrophyCup size='50px'/>
                            Bravo, vous êtes un expert !
                        </p>
                        <button 
                            className="btnResult gameOver"
                            onClick={() => loadLevelQuestions(0)}
                        >
                            Accueil
                        </button>
                    </Fragment>
                )
            }
            </div>
            <div className="percentage">
                <div className="progressPercent">Réussite : {percent}%</div>
                <div className="progressPercent">Note : {score}/{maxQuestions}</div>
            </div>
        </Fragment>
    ) : (
        <Fragment>
            <div className="stepsBtnContainer">
                <p className="failureMsg">Vous avez échoué {':-('}</p>
            </div>
            <div className="percentage">
                <div className="progressPercent">Réussite : {percent}%</div>
                <div className="progressPercent">Note : {score}/{maxQuestions}</div>
            </div>
        </Fragment>
    );

    const questionAnswers =  score >= averageGrade ? (
        asked.map((question) => {
            return (
                <tr key={question.id}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td>
                        <button 
                            className="btnInfo"
                            onClick={() => showModal(question.heroId)}
                        >
                            Infos
                        </button>
                    </td>
                </tr>
            )
        })
    ) : (
        <tr>
            <td colSpan="3">
                <Loader 
                    loadingMsg="Pas de réponses !" 
                    styling={{textAlign: 'center', color: 'red'}}
                />
            </td>
        </tr>
    );

    const resultInModal = !loading ? (
        <Fragment>
            <div className="modalHeader">
                <h2>{characterInfos.data.results[0].name}</h2>
            </div>
            <div className="modalBody">
                <div className="comicImage">
                    <img 
                        src={characterInfos.data.results[0].thumbnail.path+'.'+characterInfos.data.results[0].thumbnail.extension}
                        alt={characterInfos.data.results[0].name} 
                    />
                    {characterInfos.attributionText}
                </div>
                <div className="comicDetails">
                    <h3>Description</h3>
                    {
                        characterInfos.data.results[0].description ? (
                            <p>{characterInfos.data.results[0].description}</p>
                        ) : (
                            <p>Description indisponible.</p>
                        )
                    }
                    <h3>Plus d'infos</h3>
                    {
                        characterInfos.data.results[0].urls &&
                        characterInfos.data.results[0].urls.map((url, index) => {
                            return <a 
                                key={index}
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {upcaseFirstLetter(url.type)}
                            </a>
                        })
                    }
                </div>
            </div>
            <div className="modalFooter">
                <button className="modalBtn" onClick={hideModal}>Fermer</button>
            </div>
        </Fragment>
    ) : (
        <Fragment>
            <div className="modalHeader">
                <h2>Attente d'une réponse du serveur..</h2>
            </div>
            <div className="modalBody">
                <Loader />
            </div>
        </Fragment>
    );

    return (
        <Fragment>
            {decision}

            <hr />
            <p>Les réponses aux questions posées :</p>

            <div className="answerContainer">
                <table className="answers">
                    <thread>
                        <tr>
                            <th>Questions</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thread>
                    <tbody>
                        {questionAnswers}
                    </tbody>
                </table>
            </div>

            <Modal showModal={openModal} hideModal={hideModal}>
                {resultInModal}
            </Modal>

        </Fragment>
    );
}); 

export default React.memo(QuizOver)