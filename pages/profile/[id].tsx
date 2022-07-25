import axios from 'axios';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { GoVerified } from 'react-icons/go';
import NoResults from '../../src/components/NoResults';
import VideoCard from '../../src/components/VideoCard';
import { BASE_URL } from '../../src/utils/constants';

import { IUser, Video } from '../../types';

interface IProps {
	data: {
		user: IUser;
		userVideos: Video[];
		userLikedVideos: Video[];
	};
}

const Profile = ({ data }: IProps) => {
	const { user, userVideos, userLikedVideos } = data;

  const [showUserVideos, setShowUserVideos] = useState(true);

  const [videosList, setVideosList] = useState<Video[]>([]);

  const videosClass = showUserVideos ? 'border-b-2 border-black' : "text-gray-400";
  const likedClass = !showUserVideos ? 'border-b-2 border-black' : "text-gray-400";

  useEffect(() => {
    if(showUserVideos) {
      setVideosList(userVideos)
    } else {
      setVideosList(userLikedVideos)

    }
  }, [showUserVideos, userVideos, userLikedVideos]);

	return (
		<div className="w-full">
			<div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
				<div className="w-16 h-16 md:w-32 md:h-32">
					<Image
						width={120}
						height={120}
						className="rounded-full"
						alt="user profile"
						layout="responsive"
						src={user.image}
					/>
				</div>

				<div className='flex flex-col justify-center'>
					<p className="flex gap-1 items-center  text-md font-bold text-primary lowercase md:text-2xl tracking-wider">
						{user.userName.replaceAll(
							' ',
							''
						)}
						<GoVerified color="blue" />
					</p>
					<p className="text-gray-400 capitalize text-xs md:text-2xl">
						{user.userName}
					</p>
				</div>
			</div>
      
      <div>
        <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
            <p className={`text-xl font-semibold cursor-pointer mt-2 ${videosClass}`} onClick={() =>setShowUserVideos(true)} >
              Videos
            </p>
            <p className={`text-xl font-semibold cursor-pointer mt-2 ${likedClass}`} onClick={()=>setShowUserVideos(false)}>
              Likes
            </p>
        </div>

        <div className='flex gap-6 flex-wrap md:justify-start'>
              {videosList.length > 0 ? (
                videosList.map((post: Video, idx: number) => (
                  <VideoCard post={post} key={idx} />
                ))
              ) : (
                <NoResults text={`No ${showUserVideos ? '' : 'Liked'} Videos Yet!`}/>
              )}
        </div>
      </div>

		</div>
	);
};

export default Profile;

export const getServerSideProps = async ({
	params: { id }
}: {
	params: { id: string };
}) => {
	const res = await axios.get(`${BASE_URL}/api/profile/${id}`);

	return {
		props: { data: res.data }
	};
};
