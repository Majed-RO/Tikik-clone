import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../src/utils/client';
import { allUsersQuery } from '../../src/utils/queries';
allUsersQuery

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const query = allUsersQuery();

		const data = await client.fetch(query);

    if(data) {

      res.status(200).json(data);
    } else {
      res.json([]);

    }
	}
}
