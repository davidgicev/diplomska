import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthStoreProvider } from './authStore/provider';
import Main from './pages/Main';
import LoadingScreen from './pages/loading';
import AuthScreen from './pages/auth';
import DiscordAuthScreen from './pages/auth/Discord';
import { GoogleOAuthProvider } from '@react-oauth/google';



export default function App(): JSX.Element {
	return (
		<GoogleOAuthProvider clientId='548105115869-ohfpqlmdtd9u7rinhdjnu2uvbtd41t0r.apps.googleusercontent.com'>
			<AuthStoreProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<LoadingScreen />} />
						<Route path='/login' element={<AuthScreen />} />
						<Route path='/auth/discord' element={<DiscordAuthScreen />} />
						<Route path='/home' element={ <Main /> } />
					</Routes>
				</BrowserRouter>
			</AuthStoreProvider>
		</GoogleOAuthProvider>
	)
}
