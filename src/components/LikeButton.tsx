import * as React from 'react';
import { useState, useEffect } from 'react';
import { MdFavorite } from 'react-icons/md';

import useAuthStore from '../stores/authStore';

interface IProps {
	likes: any[];
	handleLike: () => void;
	handleDislike: () => void;
}

const LikeButton = ({ likes, handleLike, handleDislike }: IProps) => {
	const [alreadyLiked, setAlreadyLiked] = useState(false);
	const { userProfile }: any = useAuthStore();

	const isLikedBefore = likes?.filter(
		item => item._ref === userProfile._id
	);

	console.log('likes==', likes, 'isLikedBefore==', isLikedBefore);

	useEffect(() => {
		if (isLikedBefore?.length > 0) {
			setAlreadyLiked(true);
		} else {
			setAlreadyLiked(false);
		}
	}, [isLikedBefore, likes]);
	return (
		<div className="flex gap-6">
			<div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
				{alreadyLiked ? (
					<div
						className="bg-primary c1 rounded-full p-2 md:p-4 text-[#F51997]"
						onClick={handleDislike}
					>
						<MdFavorite className="text-lg md-text-2xl" />
					</div>
				) : (
					<div
						className="bg-primary c2 rounded-full p-2 md:p-4"
						onClick={handleLike}
					>
						<MdFavorite className="text-lg md-text-2xl" />
					</div>
				)}
				<p className="text-md font-semibold">
					{likes?.length || 0}
				</p>
			</div>
		</div>
	);
};

export default LikeButton;
