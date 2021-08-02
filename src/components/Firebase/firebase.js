import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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
        this.auth = app.auth();
        this.db = app.firestore();
    }

    // Inscription
    signupUser = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    // Connexion
    loginUser = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    // Deconnexion
    signoutUser = () => {
        return this.auth.signOut();
    }

    // Récupérer le mot de passe
    passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

    // Créer un nouveau document dans users avec pour id l'uid généré automatiquement lors de l'authentification via Firebase
    user = (uid) => this.db.doc(`users/${uid}`);
}

export default Firebase