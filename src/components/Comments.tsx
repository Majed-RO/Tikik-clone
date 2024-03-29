import Image from 'next/image';
import Link from 'next/link';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { GoVerified } from 'react-icons/go';
import useAuthStore from '../stores/authStore';
import NoResults from './NoResults';
useState;

import { IUser } from '../../types';

interface IProps {
	comment: string;
	isPostingComment: boolean;
	comments: IComment[];
	setComment: Dispatch<SetStateAction<string>>;
	addComment: (e: React.FormEvent) => void;
}

interface IComment {
	comment: string;
	length?: number;
	_key: string;
	postedBy: {
		_ref: string;
		_id?: string;
	};
}
const Comments = (props: IProps) => {
	const { comment, isPostingComment, comments, setComment, addComment } =
		props;

	const { userProfile, allUsers } = useAuthStore();

	return (
		<div className="border-t-2 border-gray-200 pt-4 px-10 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]">
			<div className="overflow-scroll lg:h-[475px]">
				{comments?.length ? (
					comments.map((item, idx) => (
						<>
							{allUsers.map(
								(user: IUser) =>
									user._id ===
										(item
											.postedBy
											._id ||
											item
												.postedBy
												._ref) && (
										<div
											className="p-2 items-center"
											key={
												idx
											}
										>
											<Link
												href={`/profile/${user._id}`}
											>
												<div className="flex items-start gap-6">
													<div className="w-8 h-8">
														<Image
															width={
																34
															}
															height={
																34
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

											<div>
												<p>
													{
														item.comment
													}
												</p>
											</div>
										</div>
									)
							)}
						</>
					))
				) : (
					<NoResults
						text="There is no comments yet!"
						type="comment"
					/>
				)}
			</div>

			{userProfile && (
				<div className="absolute bottom-0 left-0 pb-6 px-2 md:px-10">
					<form
						onSubmit={addComment}
						className="flex gap-4"
					>
						<input
							type="text"
							value={comment}
							onChange={e =>
								setComment(
									e.target
										.value
								)
							}
							placeholder="Add Comment..."
							className="bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg"
						/>
						<button
							className="text-md text-gray-400"
							onClick={addComment}
						>
							{isPostingComment
								? 'Commenting...'
								: 'Comment'}
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Comments;
