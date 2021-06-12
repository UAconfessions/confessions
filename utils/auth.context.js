import {
	createContext,
	useContext,
	useEffect,
	useState
} from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import initFirebase from './firebase/initFirebase';
import {getUserFromCookie, removeUserCookie, setUserCookie} from './firebase/userCookies';
import { mapUserData } from './firebase/mapUserData';
import fetcher from './api/fetcher';


initFirebase();
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [basic, setBasic] = useState(null);
	const [user, setUser] = useState(getUserFromCookie());
	const [fetching, setFetching] = useState(true);

	useEffect(() => {
		return firebase.auth().onIdTokenChanged(async (user) => {
			if (!user) {
				setBasic(null);
				removeUserCookie();
			} else {
				const updatedUser = await mapUserData(user);
				setBasic(updatedUser);
			}
		});
	}, []);

	// force refresh token
	useEffect(() => {
		const timeToRefresh = 20; // minutes
		const handle = setInterval(async () => {
			const user = firebase.auth().currentUser;
			if (user) await user.getIdToken(true);
		}, timeToRefresh * 60 * 1000);

		// clean up setInterval
		return () => clearInterval(handle);
	}, []);

	useEffect(() => {
		if (!basic?.token) return;
		if (user?.token === basic.token) return;

		const getUser = async () => {
			const { user } = await fetcher(`api/admin/user`, basic.token);
			setUser({ ...user, ...basic });
			setUserCookie({ ...user, ...basic })
		};

		setFetching(true);
		getUser()
			.then( _ =>
				setFetching(false)
			);
	}, [basic]);

	return (
		<AuthContext.Provider value={{ user }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
