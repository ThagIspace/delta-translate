/* Standalone browser dialogs. No app, framework, storage or network dependency. */
(function (global) {
    'use strict';
    let nextId = 0;
    const defaults = {
        alertTitle: 'Notice', confirmTitle: 'Confirm', promptTitle: 'Enter text',
        ok: 'OK', confirm: 'Confirm', cancel: 'Cancel', save: 'Save',
        inputLabel: 'Text', requiredMessage: 'Please enter a value.'
    };

    function create(configuration = {}) {
        const labels = { ...defaults, ...configuration.labels };
        let tail = Promise.resolve();
        let destroyed = false;
        let cancelActive = null;
        const cancelledValue = kind => kind === 'confirm' ? false : kind === 'prompt' ? null : undefined;

        function show(kind, options) {
            if (destroyed) return cancelledValue(kind);
            return new Promise((resolve, reject) => {
                const opener = document.activeElement;
                const id = `sd-${++nextId}`;
                const dialog = document.createElement('dialog');
                dialog.className = 'sd-dialog';
                dialog.dataset.sdTheme = configuration.theme === 'light' ? 'light' : 'dark';
                dialog.setAttribute('role', kind === 'confirm' ? 'alertdialog' : 'dialog');
                dialog.setAttribute('aria-labelledby', `${id}-title`);
                dialog.setAttribute('aria-describedby', `${id}-message`);
                const form = document.createElement('form');
                form.className = 'sd-form';
                const header = document.createElement('header');
                header.className = 'sd-header';
                const title = document.createElement('h2');
                title.id = `${id}-title`;
                title.className = 'sd-title';
                title.textContent = options.title ?? labels[`${kind}Title`];
                header.append(title);
                const body = document.createElement('div');
                body.className = 'sd-body';
                const message = document.createElement('p');
                message.id = `${id}-message`;
                message.className = 'sd-message';
                message.textContent = options.message ?? '';
                body.append(message);
                if (options.detail) {
                    const detail = document.createElement('p');
                    detail.id = `${id}-detail`;
                    detail.className = 'sd-detail';
                    detail.textContent = options.detail;
                    body.append(detail);
                    dialog.setAttribute('aria-describedby', `${message.id} ${detail.id}`);
                }
                let input;
                const error = document.createElement('p');
                error.id = `${id}-error`;
                error.className = 'sd-error';
                error.setAttribute('role', 'alert');
                error.hidden = true;
                if (kind === 'prompt') {
                    input = document.createElement(options.multiline ? 'textarea' : 'input');
                    if (options.multiline) input.rows = 4;
                    else input.type = 'text';
                    input.id = `${id}-input`;
                    input.className = 'sd-input';
                    input.value = options.value ?? '';
                    input.placeholder = options.placeholder ?? '';
                    input.setAttribute('aria-describedby', error.id);
                    const label = document.createElement('label');
                    label.className = 'sd-label';
                    label.htmlFor = input.id;
                    label.textContent = options.inputLabel ?? labels.inputLabel;
                    body.append(label, input, error);
                    input.addEventListener('input', () => {
                        error.hidden = true;
                        input.removeAttribute('aria-invalid');
                    });
                }
                const actions = document.createElement('footer');
                actions.className = 'sd-actions';
                const cancel = document.createElement('button');
                cancel.type = 'button';
                cancel.className = 'sd-button sd-cancel';
                cancel.textContent = options.cancelText ?? labels.cancel;
                const accept = document.createElement('button');
                accept.type = 'submit';
                accept.className = `sd-button ${options.danger ? 'sd-danger' : 'sd-accept'}`;
                accept.textContent = options.confirmText ?? (kind === 'alert' ? labels.ok : kind === 'prompt' ? labels.save : labels.confirm);
                if (kind !== 'alert') actions.append(cancel);
                actions.append(accept);
                form.append(header, body, actions);
                dialog.append(form);

                let settled = false;
                function finish(value) {
                    if (settled) return;
                    settled = true;
                    if (dialog.open) dialog.close();
                    dialog.remove();
                    cancelActive = null;
                    if (opener?.isConnected && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
                    resolve(value);
                }
                cancel.addEventListener('click', () => finish(cancelledValue(kind)));
                dialog.addEventListener('cancel', event => {
                    event.preventDefault();
                    finish(cancelledValue(kind));
                });
                dialog.addEventListener('close', () => finish(cancelledValue(kind)));
                // Outside clicks never accept or dismiss a pending action.
                form.addEventListener('submit', event => {
                    event.preventDefault();
                    if (input && options.required && !input.value.trim()) {
                        error.textContent = options.requiredMessage ?? labels.requiredMessage;
                        error.hidden = false;
                        input.setAttribute('aria-invalid', 'true');
                        input.focus();
                        return;
                    }
                    finish(kind === 'prompt' ? input.value : kind === 'confirm' ? true : undefined);
                });
                try {
                    (document.body || document.documentElement).append(dialog);
                    dialog.showModal();
                    cancelActive = () => finish(cancelledValue(kind));
                    // Cancel is the safe default, including for destructive confirmations.
                    (input || (kind === 'confirm' ? cancel : accept)).focus();
                    if (input) input.select();
                } catch (error) {
                    dialog.remove();
                    reject(error);
                }
            });
        }

        function enqueue(kind, options = {}) {
            const settings = typeof options === 'string' ? { message: options } : { ...options };
            const request = tail.then(() => show(kind, settings));
            tail = request.catch(() => {});
            return request;
        }
        return Object.freeze({
            alert: options => enqueue('alert', options),
            confirm: options => enqueue('confirm', options),
            prompt: options => enqueue('prompt', options),
            destroy() { destroyed = true; cancelActive?.(); }
        });
    }
    global.SiteDialog = Object.freeze({ create });
})(window);
