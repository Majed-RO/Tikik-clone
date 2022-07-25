import type { AppProps } from 'next/app';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../src/components/Navbar';
import Sidebar from '../src/components/Sidebar';
import { GoogleOAuthProvider } from '@react-oauth/google';

import '../src/styles/globals.css';


const MyApp = ({ Component, pageProps }: AppProps) => {
	const [isSSR, setIsSSR] = useState(true);

	useEffect(() => {
		setIsSSR(false);
	}, []);

	if (isSSR) return null;

	return (
		<GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
			<Navbar />
			<div className="flex gap-6 md:gap-20">
        {/* review: xl:hover:overflow-auto */}
				<div className="h-[92vh] overflow-hidden  xl:hover:overflow-auto ">
					<Sidebar />
				</div>
        {/* @see https://tailwindcss.com/docs/flex
          flex-1 : allow a flex item to grow and shrink as needed, ignoring its initial size:
          flex-col: position flex items vertically
        */}
				<div className='flex mt-4 flex-col gap-10 overflow-auto h-[88vh] videos flex-1 '>
					<Component {...pageProps} />
				</div>
			</div>
		</GoogleOAuthProvider>
	);
};
export default MyApp;
