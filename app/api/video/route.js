const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const EXAMPLE_VIDEO =
    'https://videos.pexels.com/video-files/852421/852421-hd_1920_1080_30fps.mp4';

export async function POST(req) {
    try {
        // Parse the JSON body from the request
        const { keyword } = await req.json();

        // If no keyword is provided, return an example video
        if (!keyword) {
            // Return the default video link if keyword is absent or empty
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
        const response = await fetch(endpoint + '?query=' + encodeURIComponent(keyword), {
            method: 'GET',
            headers: headers
        });

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error('Failed to fetch videos from Pexels API');
        }

        // Convert the response to JSON
        const data = await response.json();

        // Check if there are any videos returned
        const videoLink = data.videos.length > 0 ? data.videos[0].video_files[0].link : EXAMPLE_VIDEO;

        // Return the video link in response
        return new Response(JSON.stringify({ videoLink }), {
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
