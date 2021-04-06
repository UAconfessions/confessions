import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from './initFirebase'
import {
	removeUserCookie,
	setUserCookie,
	getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData'
import useSWR from "swr";
import fetcher from "../api/fetcher";

initFirebase()

const useUser = () => {
	const [user, setUser] = useState();
	const { data, error } = useSWR(user?.token ? [`api/admin/user`, user.token] : null, fetcher);

	const router = useRouter()

	const logout = async () => {
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
			.onIdTokenChanged(async (user) => {
				if (user) {
					const userData = await mapUserData(user)
					setUserCookie(userData)
					setUser(userData)
				} else {
					removeUserCookie()
					setUser()
				}
			})

		const userFromCookie = getUserFromCookie()
		if (!userFromCookie) {
			return
		}
		setUser(userFromCookie)

		return () => {
			cancelAuthListener()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return { user:{ ...user, ...data?.user}, logout }
}

export { useUser }
