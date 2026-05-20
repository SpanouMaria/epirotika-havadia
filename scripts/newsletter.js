const consent =
    document.getElementById(
        'newsletterConsent'
    );

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

        if (!consent.checked) {

            message.textContent =
                'Απαιτείται αποδοχή';

            return;
        }

        const email =
            input.value
                .trim()
                .toLowerCase();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(email)
        ) {

            message.textContent =
                'Μη έγκυρο email';

            return;
        }

        const lastSubmit =
            localStorage.getItem(
                'newsletterSubmit'
            );

        if (
            lastSubmit &&
            Date.now() -
            Number(lastSubmit) <
            10000
        ) {

            message.textContent =
                'Περιμένετε λίγο';

            return;
        }

        button.disabled = true;

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

            if (
                data.message ===
                'Email already exists'
            ) {

                message.textContent =
                    'Το email υπάρχει ήδη';

            } else {

                message.textContent =
                    'Ευχαριστούμε!';

                localStorage.setItem(
                    'newsletterClosed',
                    'true'
                );

                localStorage.setItem(
                    'newsletterSubmit',
                    Date.now()
                );

                setTimeout(() => {

                    modal.classList.remove(
                        'active'
                    );

                }, 1200);
            }

        } catch (error) {

            message.textContent =
                'Κάτι πήγε λάθος';

        } finally {

            button.disabled = false;
        }
    }
);