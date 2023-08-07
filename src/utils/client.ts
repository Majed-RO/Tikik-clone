import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: '1vk5ly2g',
  dataset: 'production',
  apiVersion: '2022-07-18',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
