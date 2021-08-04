import React, { Fragment } from 'react';

const ProgressBar = ({idQuestion, maxQuestions}) => {
    return (
        <Fragment>
            <div className="percentage">
                <div className="progressPercent">{`Question : ${(idQuestion+1)}/${maxQuestions}`}</div>
                <div className="progressPercent">{`Question : ${(idQuestion+1)*100/maxQuestions}%`}</div>
            </div>
            <div className="progressBar">
                <div className="progressBarChange" style={
                    {
                        width: `${(idQuestion+1)*10}%`
                    }
                }>
                </div>
            </div>
        </Fragment>
    )
}

export default React.memo(ProgressBar)