const EXAMPLE_VIDEO =
    'https://videos.pexels.com/video-files/852421/852421-hd_1920_1080_30fps.mp4';

export async function POST(req) {
    return Response.json({
        videoLink: EXAMPLE_VIDEO,
    });
}