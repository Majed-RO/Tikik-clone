import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../src/utils/client';
import { topicPostsQuery } from '../../../src/utils/queries';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { topic } = req.query;

		const topicQuery = topicPostsQuery(topic as string);

		const videos = await client.fetch(topicQuery);

		res.status(200).json(videos);
	}
}
