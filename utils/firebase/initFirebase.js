import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_CLIENT_DB_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
}

export default function initFirebase() {
	if (!firebase.apps.length) {
		firebase.initializeApp(config)
	}
}


