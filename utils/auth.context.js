import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import initFirebase from './firebase/initFirebase';
import { getUserFromCookie, removeUserCookie, setUserCookie } from './firebase/userCookies';
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
			const { user: freshUser } = await fetcher(`api/admin/user`, basic.token);
			if (JSON.stringify(user) !== JSON.stringify({ ...freshUser, ...basic })) setUser({ ...freshUser, ...basic });
			setUserCookie({ ...freshUser, ...basic })
		};

		setFetching(true);
		getUser()
			.then( _ =>
				setFetching(false)
			);
	}, [basic]);

	const logout = useCallback(async () => {
		return firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				setBasic(null);
				setUser(null);
			})
			.catch((e) => {
				console.error(e)
			})
	}, []);

	return (
		<AuthContext.Provider value={{ user, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
