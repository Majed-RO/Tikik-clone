import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { BASE_URL } from '../../src/utils/constants';
import { Video } from '../../types';
import { BsFillPlayFill } from 'react-icons/bs';
import useAuthStore from '../../src/stores/authStore';
import LikeButton from '../../src/components/LikeButton';
import Comments from '../../src/components/Comments';

interface IProps {
	postDetails: Video;
}

const VideoDetail = ({ postDetails }: IProps) => {
	const [post, setPost] = useState(postDetails);
	const [playing, setPlaying] = useState(false);
	const [isVideoMuted, setIsVideoMuted] = useState(false);

  const [isPostingComment, setIsPostingComment] = useState(false);
  const [comment, setComment] = useState('');

	const videoRef = useRef<HTMLVideoElement>(null);

	const router = useRouter();

	const { userProfile }: any = useAuthStore();

	useEffect(() => {
		if (post && videoRef?.current) {
			videoRef.current.muted = isVideoMuted;
		}
	}, [post, isVideoMuted]);

	if (!post) return null;

	const onVideoClick = () => {
		if (playing) {
			videoRef?.current?.pause();
			setPlaying(false);
		} else {
			videoRef?.current?.play();
			setPlaying(true);
		}
	};

	const handleLike = async (like: boolean) => {
		if (userProfile) {
			const { data } = await axios.put(
				`${BASE_URL}/api/post/like`,
				{
					userId: userProfile._id,
					postId: post._id,
					like
				}
			);
			setPost({ ...post, likes: data.likes });
		}
	};

  const addComment =async (e:any) => {
    e.preventDefault();
    if(userProfile && comment) {
      setIsPostingComment(true);

      const {data} = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment
      });
      setPost({ ...post, comments: data.comments });
      setComment('');
      setIsPostingComment(false);

    }
  }

	return (
		<div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
			<div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
				<div className="absolute left-2 top-6 lg:left-6 flex gap-6 z-50">
					<p
						className="cursor-pointer"
						onClick={() => router.back()}
					>
						<MdOutlineCancel className="text-white text-[35px]" />
					</p>
				</div>
				<div className="relative">
					<div className="lg:h-[100vh] h-[60vh]">
						<video
							ref={videoRef}
							loop
							onClick={onVideoClick}
							src={
								post.video.asset
									.url
							}
							className="h-full cursor-pointer"
						></video>
					</div>
					<div className="absolute top-[45%] left-[45%] cursor-pointer">
						{!playing && (
							<button
								onClick={
									onVideoClick
								}
							>
								<BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
							</button>
						)}
					</div>
				</div>

				<div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
					{isVideoMuted ? (
						<button
							onClick={() => {
								setIsVideoMuted(
									false
								);
							}}
						>
							<HiVolumeOff className="text-white text-2xl lg:text-4xl" />
						</button>
					) : (
						<button
							onClick={() => {
								setIsVideoMuted(
									true
								);
							}}
						>
							<HiVolumeUp className="text-white text-2xl lg:text-4xl" />
						</button>
					)}
				</div>
			</div>

			<div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
				<div className="lg:mt-20 mt-10">
					<div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
						<div className="ml-4 md:w-20 md:h-20 w-16 h-16">
							<Link href="/">
								<>
									<Image
										width={
											62
										}
										height={
											62
										}
										className="rounded-full"
										src={
											post
												.postedBy
												.image
										}
										alt="profile photo"
										layout="responsive"
									/>
								</>
							</Link>
						</div>
						<div>
							<Link href="/">
								<div className="mt-4 flex flex-col  gap-2">
									<p className="flex gap-2 items-center md:text-md font-bold text-primary">
										{
											post
												.postedBy
												.userName
										}{' '}
										<GoVerified className="text-blue-400 text-md" />
									</p>
									<p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
										{
											post
												.postedBy
												.userName
										}
									</p>
								</div>
							</Link>
						</div>
					</div>
					<p className="px-10 text-lg text-gray-600">
						{post.caption}
					</p>
					{/* === Likes section start */}
					<div className="mt-10 px-10">
						{userProfile && (
							<LikeButton
              likes={post.likes}
								handleLike={() => {
									handleLike(
										true
									);
								}}
								handleDislike={() => {
									handleLike(
										false
									);
								}}
							/>
						)}
					</div>
					{/* === Likes section end */}

					<Comments 
          comment={comment}
          setComment={setComment}
          addComment={addComment}
          comments={post.comments}
          isPostingComment={isPostingComment}
          />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async ({
	params: { id }
}: {
	params: { id: string };
}) => {
	const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

	return {
		props: {
			postDetails: data
		}
	};
};

export default VideoDetail;
