(function() {
    window.initVoiceModule = function() {
        const getFreshToken = async () => {
            const res = await fetch('/api/v1/auth/refresh', { method: 'POST' });
            const data = await res.json();
            return data.accessToken;
        };

        const uploadFile = async (file) => {
            const token = await getFreshToken();
            const fd = new FormData();
            fd.append('file', file);
            try {
                const res = await fetch('https://xn--d1ah4a.com/api/files/upload', {
                    method: 'POST',
                    headers: { 'authorization': `Bearer ${token}` },
                    body: fd
                });
                const data = await res.json();
                if (data.id) alert('Файл загружен! ID: ' + data.id);
            } catch (e) { alert('Ошибка загрузки'); }
        };

        const createMenu = (btn) => {
            const menu = document.createElement('div');
            menu.style = 'position:absolute;bottom:50px;right:0;background:#1a1a1a;border:1px solid #333;border-radius:12px;display:flex;flex-direction:column;z-index:9999;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.5)';
            
            const btnVoice = document.createElement('button');
            btnVoice.innerText = '🎤 Голосовое';
            btnVoice.style = 'padding:10px 16px;background:none;border:none;color:#fff;cursor:pointer;text-align:left;font-size:14px';
            btnVoice.onclick = () => {
                menu.remove();
                btn.dataset.bypass = 'true';
                btn.click();
                delete btn.dataset.bypass;
            };

            const btnFile = document.createElement('button');
            btnFile.innerText = '📁 Выбрать файл';
            btnFile.style = 'padding:10px 16px;background:none;border:none;color:#fff;cursor:pointer;text-align:left;font-size:14px;border-top:1px solid #333';
            btnFile.onclick = () => {
                menu.remove();
                const input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e) => uploadFile(e.target.files[0]);
                input.click();
            };

            menu.append(btnVoice, btnFile);
            btn.parentNode.style.position = 'relative';
            btn.parentNode.appendChild(menu);
            
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && e.target !== btn) menu.remove();
            }, { once: true });
        };

        const init = () => {
            document.querySelectorAll('.comment-submit--mic:not([data-itd-mod])').forEach(btn => {
                btn.setAttribute('data-itd-mod', 'true');
                btn.addEventListener('click', (e) => {
                    if (btn.dataset.bypass) return;
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    createMenu(btn);
                }, true);
            });
        };

        new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
    };
})();
