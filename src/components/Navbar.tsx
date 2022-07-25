import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
/* @see https://react-icons.github.io/react-icons */
import { AiOutlineLogout } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import Logo from '../utils/tiktik-logo.png';
import { createOrGetUser } from '../utils';
import useAuthStore from '../stores/authStore';
import { useState, useEffect } from 'react';
import { IUser } from '../../types';
const Navbar = () => {
	const [user, setUser] = useState<IUser | null>();

	const { userProfile, addUser, removeUser } = useAuthStore();

	const [searchValue, setSearchValue] = useState('');

	const router = useRouter();

	useEffect(() => {
		setUser(userProfile);
	}, [userProfile]);

	/* Explain? */
	const handleSearch = (e: { preventDefault: () => void }) => {
		e.preventDefault();

		if (searchValue) {
			router.push(`/search/${searchValue}`);
		}
	};

	return (
		<div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
			<Link href="/">
				<div className="w-[100px] md:w-[130px] ">
					<Image
						className="cursor-pointer"
						src={Logo}
						alt="TikTik"
						layout="responsive"
					/>
				</div>
			</Link>

			<div className="relative hidden md:block">
				<form
					onSubmit={handleSearch}
					className="absolute md:static top-0 left-[20%] bg-white"
				>
					<input
						type="text"
						value={searchValue}
						onChange={e => {
							setSearchValue(
								e.target.value
							);
						}}
						placeholder="Search accounts and videos"
						className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[250px] md:w-[350px] rounded-xl md:top-0"
					/>
					<button
						className="absolute right-6 top-4 md:right-5 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400"
						onClick={handleSearch}
					>
						<BiSearch color="blue" />
					</button>
				</form>
			</div>

			<div>
				{user ? (
					<div className="flex gap-5 md:gap-10">
						<Link href="/upload">
							<button className="border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2">
								<IoMdAdd className="text-xl" />{' '}
								<span className="hidden md:block">
									Upload
								</span>
							</button>
						</Link>

						{user.image && (
							<Link href={`/profile/${user._id}`}>
								<>
									<Image
										width={
											40
										}
										height={
											40
										}
										className="rounded-full cursor-pointer"
										src={
											user.image
										}
										alt="profile photo"
									/>
								</>
							</Link>
						)}
						<button
							type="button"
							className="px-2"
							onClick={() => {
								googleLogout();
								removeUser();
							}}
						>
							<AiOutlineLogout
								color="red"
								fontSize={21}
							/>
						</button>
					</div>
				) : (
					<GoogleLogin
						onSuccess={response => {
							createOrGetUser(
								response,
								addUser
							);
						}}
						onError={() => {
							console.log('error');
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Navbar;