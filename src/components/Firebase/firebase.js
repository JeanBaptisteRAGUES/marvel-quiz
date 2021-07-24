import app from 'firebase/app';

const config = {
    apiKey: "AIzaSyC1il-u8OODTPY6sUjljV9jTqA3KlZA860",
    authDomain: "marvel-quiz-e8955.firebaseapp.com",
    projectId: "marvel-quiz-e8955",
    storageBucket: "marvel-quiz-e8955.appspot.com",
    messagingSenderId: "943471456592",
    appId: "1:943471456592:web:e15354cccdda371e64fc55"
};

class Firebase{
    constructor() {
        app.initializeApp(config);
    }
}

export default Firebase