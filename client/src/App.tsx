import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthStoreProvider } from './authStore/provider';
import Main from './pages/Main';
import LoadingScreen from './pages/loading';
import LoginScreen from './pages/login/LoginScreen';

export default function App(): JSX.Element {
	return (
		<AuthStoreProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<LoadingScreen />} />
					<Route path='/login' element={<LoginScreen />} />
					<Route path='/home' element={ <Main /> } />
				</Routes>
			</BrowserRouter>
		</AuthStoreProvider>
	)
}
