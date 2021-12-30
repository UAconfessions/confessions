import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import initFirebase from './initFirebase'
import {
	removeUserCookie,
	setUserCookie,
	getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData'

initFirebase()

const useUser = () => {
	const [user, setUser] = useState(getUserFromCookie());
	const data = {};

	const router = useRouter()

	const logout = async () => {
		localStorage.removeItem('user');
		return firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				router.push('/login')
			})
			.catch((e) => {
				console.error(e)
			})
	}

	useEffect(() => {
		const cancelAuthListener = firebase
			.auth()
			.onIdTokenChanged(async (fireBaseUser) => {
				const cookieUser = getUserFromCookie();
				if (fireBaseUser) {
					const updatedUser = await mapUserData(fireBaseUser);
					if (updatedUser?.token === cookieUser?.token) {
						console.log( 'fixed this one');
						return;
					}

					setUserCookie(updatedUser);
					console.log({updatedUser: updatedUser.token.slice(-5), cookieUser: cookieUser?.token?.slice(-5)});
					setUser(updatedUser);
				} else {
					if (user === undefined ) return;

					removeUserCookie();
					setUser();
					localStorage.removeItem('user');
				}
			})

		return cancelAuthListener;
	}, []);

	useEffect(() => {
		if( !user || !data?.user ) return;
		localStorage.setItem('user', JSON.stringify({ ...user, ...data?.user }))
	}, [user, data]);

	return { user: { ...user, ...data?.user }, logout }
}

export { useUser }
