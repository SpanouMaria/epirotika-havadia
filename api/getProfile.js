// 1. Πρώτα φορτώνουμε τις μεταβλητές περιβάλλοντος
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// 2. Μετά κάνουμε import το firebase-admin
import admin from 'firebase-admin';

// 3. Αρχικοποίηση του Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY
                ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
                : ''
        })
    });
}

const db = admin.firestore();

// 4. Ο Serverless Handler σου
export default async function handler(req, res) {
    try {
        const profilesRef = db.collection("profiles");
        const snapshot = await profilesRef.get();

        let selectedProfile = null;
        let lowestCount = Infinity;

        snapshot.forEach(doc => {
            const data = doc.data();
            // Έλεγχος αν το count είναι μικρότερο
            if (data.count < lowestCount) {
                lowestCount = data.count;
                selectedProfile = doc.id;
            }
        });

        if (!selectedProfile) {
            return res.status(404).json({
                error: "No profile found"
            });
        }

        const profileRef = profilesRef.doc(selectedProfile);
        const selectedProfileData = (await profileRef.get()).data();
        
        // Αυξάνουμε το count κατά 1 για το προφίλ που επιλέχθηκε
        await profileRef.update({
            count: lowestCount + 1
        });

        return res.status(200).json({
            profile: selectedProfile,
            drop: selectedProfileData.drop,
            nature: selectedProfileData.nature
        });

    } catch (error) {
        console.error("Error in handler:", error);
        return res.status(500).json({ error: error.message });
    }
}