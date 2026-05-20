import dotenv from 'dotenv';

dotenv.config({
    path: '.env.local'
});

import admin from 'firebase-admin';

if (!admin.apps.length) {

    admin.initializeApp({

        credential:
            admin.credential.cert({

                projectId:
                    process.env
                        .FIREBASE_PROJECT_ID,

                clientEmail:
                    process.env
                        .FIREBASE_CLIENT_EMAIL,

                privateKey:
                    process.env
                        .FIREBASE_PRIVATE_KEY
                        ? process.env
                            .FIREBASE_PRIVATE_KEY
                            .replace(
                                /\\n/g,
                                '\n'
                            )
                        : ''
            })
    });
}

const db =
    admin.firestore();

export default async function handler(
    req,
    res
) {

    try {

        const profilesRef =
            db.collection(
                'profiles'
            );

        const snapshot =
            await profilesRef.get();

        let selectedDropProfile =
            null;

        let selectedNatureProfile =
            null;

        let lowestDropCount =
            Infinity;

        let lowestNatureCount =
            Infinity;

        // -------------------------
        // DROP BALANCING
        // -------------------------

        snapshot.forEach(doc => {

            const data =
                doc.data();

            const dropCount =
                data.dropCount || 0;

            if (
                dropCount <
                lowestDropCount
            ) {

                lowestDropCount =
                    dropCount;

                selectedDropProfile =
                    {
                        id: doc.id,
                        ...data
                    };
            }
        });

        // -------------------------
        // NATURE BALANCING
        // -------------------------

        const normalNatureProfiles = [];

        const rareNatureProfiles = [];

        snapshot.forEach(doc => {

            const data =
                doc.data();

            if (data.rare) {

                rareNatureProfiles.push({

                    id: doc.id,
                    ...data
                });

            } else {

                normalNatureProfiles.push({

                    id: doc.id,
                    ...data
                });
            }
        });

        const normalBalanced =

            normalNatureProfiles.every(
                profile =>

                    (profile.natureCount || 0) >= 3
            );

        const pool =

            normalBalanced

                ? [

                    ...normalNatureProfiles,
                    ...rareNatureProfiles
                ]

                : normalNatureProfiles;

        pool.forEach(profile => {

            const natureCount =
                profile.natureCount || 0;

            const maxNatureUsers =
                profile.maxNatureUsers
                || Infinity;

            if (

                natureCount <
                maxNatureUsers &&

                natureCount <
                lowestNatureCount

            ) {

                lowestNatureCount =
                    natureCount;

                selectedNatureProfile =
                    profile;
            }
        });
        // fallback
        if (
            !selectedNatureProfile
        ) {

            snapshot.forEach(doc => {

                const data =
                    doc.data();

                const natureCount =
                    data.natureCount || 0;

                if (
                    natureCount <
                    lowestNatureCount
                ) {

                    lowestNatureCount =
                        natureCount;

                    selectedNatureProfile =
                        {
                            id: doc.id,
                            ...data
                        };
                }
            });
        }

        // -------------------------
        // VALIDATION
        // -------------------------

        if (

            !selectedDropProfile ||

            !selectedNatureProfile

        ) {

            return res
                .status(404)
                .json({

                    error:
                        'No profile found'
                });
        }

        // -------------------------
        // FIRESTORE TRANSACTION
        // -------------------------

        await db.runTransaction(
            async transaction => {

                const dropRef =
                    profilesRef.doc(
                        selectedDropProfile.id
                    );

                const natureRef =
                    profilesRef.doc(
                        selectedNatureProfile.id
                    );

                const dropDoc =
                    await transaction.get(
                        dropRef
                    );

                const natureDoc =
                    await transaction.get(
                        natureRef
                    );

                const dropData =
                    dropDoc.data();

                const natureData =
                    natureDoc.data();

                transaction.update(
                    dropRef,
                    {

                        dropCount:
                            (
                                dropData
                                    .dropCount || 0
                            ) + 1
                    }
                );

                transaction.update(
                    natureRef,
                    {

                        natureCount:
                            (
                                natureData
                                    .natureCount || 0
                            ) + 1
                    }
                );
            }
        );

        // -------------------------
        // RESPONSE
        // -------------------------

        return res
            .status(200)
            .json({

                drop:
                    selectedDropProfile
                        .drop,

                nature:
                    selectedNatureProfile
                        .nature
            });

    } catch (error) {

        console.error(
            'Error in handler:',
            error
        );

        return res
            .status(500)
            .json({

                error:
                    error.message
            });
    }
}