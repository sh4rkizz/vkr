import cookies from 'browser-cookies';

const API = {
    formatUrl() {
        let s = arguments[0];
        for (let i = 0; i < arguments.length - 1; i++) {
            const reg = new RegExp(`\\{${i}\\}`, 'gm');
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    },

    async post(url: string, data = {}, parseJson = true, formData = false) {
        const multiFormData = new FormData();
        if (formData) {
            for (const key in data) {
                multiFormData.append(key, data[key]);
            }
        }

        let response: any;
        let result: any;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'X-CSRFToken': cookies.get('csrftoken') },
                body: formData ? multiFormData : new URLSearchParams(data),
            });
            result = await (parseJson ? response.json() : response.text())
            if (response.ok && response.status < 400 && !response.error && !response.errors) {
                return Promise.resolve(result);
            }
            return Promise.reject({ ...result, response: response });
        } catch (e) {
            console.error('API Exception', e, e.response);

            if (e instanceof SyntaxError) {
                return Promise.reject({ response: response, 'error': "Ошибка сервера. Попробуй позже!" });
            }

            return Promise.reject({ response: response, 'error': e.toString() });
        }
    },

    async get(url: string) {
        const res = await fetch(url, {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-CSRFToken': cookies.get('csrftoken'),
            },
        });

        return await res.json();
    },

    async betterGet(url: string) {
        let response: any;
        let result: any;

        try {
            response = await fetch(url, {
                credentials: 'same-origin',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-CSRFToken': cookies.get('csrftoken'),
                },
            });

            result = await response.json();

            if (response.ok && response.status < 400 && !response.error && !response.errors) {
                return Promise.resolve(result);
            }

            return Promise.reject({ ...result, response: response });
        } catch (e) {
            console.error('API Exception', e, e.response);

            if (e instanceof SyntaxError) {
                return Promise.reject({ response: response, 'error': "Ошибка сервера" });
            }

            return Promise.reject({ response: response, 'error': e.toString() });
        }
    },

    postRedirect(url: string, data: any) {
        const form = document.createElement('form');
        document.body.appendChild(form);
        form.method = 'post';
        form.action = url;

        data = data || {};
        data['csrfmiddlewaretoken'] = cookies.get('csrftoken');
        for (const name in data) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = data[name];
            form.appendChild(input);
        }

        form.submit();
    },
};

export default API;
