export default async function handler(req, res) {

    const profiles = [
        "profile1",
        "profile2",
        "profile3",
        "profile4"
    ];

    // προσωρινό random assignment
    const randomProfile =
        profiles[Math.floor(Math.random() * profiles.length)];

    res.status(200).json({
        profile: randomProfile
    });
}