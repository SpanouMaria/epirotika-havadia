const modal =
    document.getElementById(
        'newsletterModal'
    );

const input =
    document.getElementById(
        'newsletterInput'
    );

const button =
    document.getElementById(
        'newsletterBtn'
    );

const closeBtn =
    document.getElementById(
        'newsletterClose'
    );

const message =
    document.getElementById(
        'newsletterMessage'
    );

const alreadyClosed =
    localStorage.getItem(
        'newsletterClosed'
    );

if (!alreadyClosed) {

    setTimeout(() => {

        modal.classList.add(
            'active'
        );

    }, 1200);
}

closeBtn?.addEventListener(
    'click',
    () => {

        modal.classList.remove(
            'active'
        );

        localStorage.setItem(
            'newsletterClosed',
            'true'
        );
    }
);

button?.addEventListener(
    'click',
    async () => {

        const email =
            input.value.trim();

        if (
            !email.includes('@')
        ) {

            message.textContent =
                'Μη έγκυρο email';

            return;
        }

        try {

            const response =
                await fetch(
                    '/api/saveEmail',
                    {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify({

                                email
                            })
                    }
                );

            const data =
                await response.json();

            message.textContent =
                'Ευχαριστούμε!';

            localStorage.setItem(
                'newsletterClosed',
                'true'
            );

            setTimeout(() => {

                modal.classList.remove(
                    'active'
                );

            }, 1200);

        } catch (error) {

            message.textContent =
                'Κάτι πήγε λάθος';
        }
    }
);