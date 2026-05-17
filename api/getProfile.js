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
                    process.env.FIREBASE_PROJECT_ID,

                clientEmail:
                    process.env.FIREBASE_CLIENT_EMAIL,

                privateKey:
                    process.env.FIREBASE_PRIVATE_KEY
                        ? process.env
                            .FIREBASE_PRIVATE_KEY
                            .replace(/\\n/g, '\n')
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
            db.collection('profiles');

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


        snapshot.forEach(doc => {

            const data =
                doc.data();

            if (
                data.dropCount <
                lowestDropCount
            ) {

                lowestDropCount =
                    data.dropCount;

                selectedDropProfile =
                    {
                        id: doc.id,
                        ...data
                    };
            }
        });


        snapshot.forEach(doc => {

            const data =
                doc.data();

            if (

                data.natureCount <
                data.maxNatureUsers &&

                data.natureCount <
                lowestNatureCount

            ) {

                lowestNatureCount =
                    data.natureCount;

                selectedNatureProfile =
                    {
                        id: doc.id,
                        ...data
                    };
            }
        });


        if (!selectedNatureProfile) {

            snapshot.forEach(doc => {

                const data =
                    doc.data();

                if (
                    data.natureCount <
                    lowestNatureCount
                ) {

                    lowestNatureCount =
                        data.natureCount;

                    selectedNatureProfile =
                        {
                            id: doc.id,
                            ...data
                        };
                }
            });
        }


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


        await profilesRef
            .doc(
                selectedDropProfile.id
            )
            .update({

                dropCount:
                    selectedDropProfile
                        .dropCount + 1
            });

        await profilesRef
            .doc(
                selectedNatureProfile.id
            )
            .update({

                natureCount:
                    selectedNatureProfile
                        .natureCount + 1
            });


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