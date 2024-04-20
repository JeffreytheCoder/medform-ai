const EXAMPLE_VIDEO =
  'https://videos.pexels.com/video-files/852421/852421-hd_1920_1080_30fps.mp4';

export async function POST(req) {
  try {
    // Parse the JSON body from the request
    const { keywords } = await req.json();
    console.log(keywords);

    // If no keyword is provided, return an example video
    if (!keywords || !keywords.length) {
      // Return the default video link if no valid keywords array is provided
      return new Response(JSON.stringify({ videoLink: EXAMPLE_VIDEO }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Pexels API endpoint for searching videos
    const endpoint = 'https://api.pexels.com/videos/search';

    // Prepare the headers for fetch
    const headers = new Headers();
    headers.append('Authorization', process.env.PEXELS_API_KEY);

    // Make a GET request to Pexels API using fetch
    for (let keyword of keywords) {
      // Make a GET request to Pexels API using fetch
      const response = await fetch(
        `${endpoint}?query=${encodeURIComponent(keyword)}`,
        {
          method: 'GET',
          headers: headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Check if there are any videos returned
        if (data.videos && data.videos.length > 0) {
          const videoLink = data.videos[0].video_files[0].link;
          // Return the first found video link
          return new Response(JSON.stringify({ videoLink }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
    console.log('default!');

    // If no videos found for any keywords, return the default video link
    return new Response(JSON.stringify({ videoLink: EXAMPLE_VIDEO }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle errors, such as no videos found or API errors
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
