import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from '../../utils/firebase/initFirebase'
import { setUserCookie } from '../../utils/firebase/userCookies'
import { mapUserData } from '../../utils/firebase/mapUserData'
// Init the Firebase app.
initFirebase()

const firebaseAuthConfig = {
	signInOptions: [
		{
			provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
			requireDisplayName: true,
		},
	],
	signInSuccessUrl: '/login',
	credentialHelper: 'none',
	callbacks: {
		signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
			const userData = await mapUserData(user)
			setUserCookie(userData)
		},
	},
	// privacyPolicyUrl: 'https://confessions.link/privacyPolicy',
	// tosUrl: 'https://confessions.link/termsOfService'
}

const FirebaseAuth = () => {
	if(!firebaseAuthConfig) return null;
	if(!firebase.auth()) return null;
	try{
		return (
			<StyledFirebaseAuth
				uiConfig={firebaseAuthConfig}
				firebaseAuth={firebase.auth()}
			/>
		);
	}catch(e){
		return null;
	}

}

export default FirebaseAuth
