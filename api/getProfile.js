import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
    });
}

const db = admin.firestore();

export default async function handler(req, res) {

    const profilesRef = db.collection("profiles");

    const snapshot = await profilesRef.get();

    let selectedProfile = null;
    let lowestCount = Infinity;

    snapshot.forEach(doc => {
        const data = doc.data();

        if (data.count < lowestCount) {
            lowestCount = data.count;
            selectedProfile = doc.id;
        }
    });

    if (!selectedProfile) {
        return res.status(500).json({
            error: "No profile found"
        });
    }

    const profileRef = profilesRef.doc(selectedProfile);

    const selectedProfileData = (await profileRef.get()).data();
    await profileRef.update({
        count: lowestCount + 1
    });

    res.status(200).json({
        profile: selectedProfile,
        drop: selectedProfileData.drop,
        nature: selectedProfileData.nature
    });
}