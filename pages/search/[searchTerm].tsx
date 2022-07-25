import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { GoVerified } from 'react-icons/go';
import NoResults from '../../src/components/NoResults';
import VideoCard from '../../src/components/VideoCard';
import useAuthStore from '../../src/stores/authStore';
import { BASE_URL } from '../../src/utils/constants';

import { IUser, Video } from '../../types';

const Search = ({ videos }: { videos: Video[] }) => {
	const router = useRouter();
	const { searchTerm }: any = router.query;
	const { allUsers } = useAuthStore();

	const [isAccounts, setIsAccounts] = useState(false);
	const accountClass = isAccounts
		? 'border-b-2 border-black'
		: 'text-gray-400';
	const videosClass = !isAccounts
		? 'border-b-2 border-black'
		: 'text-gray-400';

	const searchedAccounts = allUsers.filter((user: IUser) =>
		user.userName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="w-full">
			<div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
				<p
					className={`text-xl font-semibold cursor-pointer mt-2 ${accountClass}`}
					onClick={() => setIsAccounts(true)}
				>
					Accounts
				</p>
				<p
					className={`text-xl font-semibold cursor-pointer mt-2 ${videosClass}`}
					onClick={() => setIsAccounts(false)}
				>
					Videos
				</p>
			</div>

			{isAccounts ? (
				<div className="md:mt-16">
					{searchedAccounts.length > 0 ? (
						searchedAccounts.map(
							(
								user: IUser,
								idx: number
							) => (
								<Link
									href={`/profile/${user._id}`}
									key={
										idx
									}
								>
									<div className="flex gap-3 p-3 cursor-pointer font-semibold rounded border-b-2 border-gray-200">
										<div className="w-8 h-8">
											<Image
												width={
													50
												}
												height={
													50
												}
												className="rounded-full"
												alt="user profile"
												layout="responsive"
												src={
													user.image
												}
											/>
										</div>

										<div className="">
											<p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
												{user.userName.replaceAll(
													' ',
													''
												)}
												<GoVerified color="blue" />
											</p>
											<p className="text-gray-400 capitalize text-xs">
												{
													user.userName
												}
											</p>
										</div>
									</div>
								</Link>
							)
						)
					) : (
						<NoResults
							text={`No Accounts Results for ${searchTerm}`}
						/>
					)}
				</div>
			) : (
				<div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
					{videos.length > 0 ? (
						videos.map(
							(
								video: Video,
								idx: number
							) => (
								<VideoCard
									post={
										video
									}
									key={
										idx
									}
								/>
							)
						)
					) : (
						<NoResults
							text={`No Videos Results for ${searchTerm}`}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default Search;

export const getServerSideProps = async ({
	params: { searchTerm }
}: {
	params: { searchTerm: string };
}) => {
	const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);

	return {
		props: { videos: res.data }
	};
};
