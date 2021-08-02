import React, { Component } from 'react';

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
    render() {

        const {pseudo} = this.props.userData;

        return (
            <div>
                <h2>Pseudo: {pseudo}</h2>
            </div>
        )
    }
}

export default Quiz