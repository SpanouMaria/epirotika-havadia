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

    if (req.method !== 'POST') {

        return res.status(405).json({

            error:
                'Method not allowed'
        });
    }

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                error:
                    'Email required'
            });
        }

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(
                normalizedEmail
            )
        ) {

            return res.status(400).json({

                error:
                    'Invalid email'
            });
        }

        if (
            normalizedEmail.length > 120
        ) {

            return res.status(400).json({

                error:
                    'Invalid email length'
            });
        }

        const existingQuery =
            await db
                .collection(
                    'newsletterEmails'
                )
                .where(
                    'email',
                    '==',
                    normalizedEmail
                )
                .get();

        if (!existingQuery.empty) {

            return res.status(200).json({

                message:
                    'Email already exists'
            });
        }

        await db
            .collection(
                'newsletterEmails'
            )
            .add({

                email:
                    normalizedEmail,

                consent:
                    true,

                createdAt:
                    admin.firestore
                        .FieldValue
                        .serverTimestamp()
            });

        return res.status(200).json({

            success: true
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            error:
                'Server error'
        });
    }
}