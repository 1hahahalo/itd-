(function() {
    window.initDeleteModule = function() {
        const getFreshToken = async () => {
            try {
                const res = await fetch('/api/v1/auth/refresh', { method: 'POST' });
                const data = await res.json();
                return data.accessToken || null;
            } catch (e) { return null; }
        };

        const deletePostRequest = async (postId) => {
            if (!confirm('Удалить пост?')) return;
            const token = await getFreshToken();
            if (!token) return;

            try {
                const response = await fetch(`https://xn--d1ah4a.com/api/posts/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': '*/*',
                        'authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                if (response.ok) {
                    const el = document.querySelector(`[data-post-id="${postId}"]`);
                    if (el) el.remove();
                }
            } catch (e) {}
        };

        const inject = () => {
            document.querySelectorAll('.post-dropdown:not([data-itd-del])').forEach(menu => {
                menu.setAttribute('data-itd-del', 'true');
                const container = menu.closest('.post-container');
                const postId = container ? container.getAttribute('data-post-id') : null;
                if (postId) {
                    const btn = document.createElement('button');
                    btn.className = 'post-dropdown-item danger svelte-kvcx9g';
                    btn.style.marginTop = '4px';
                    btn.style.borderTop = '1px solid rgba(255,255,255,0.05)';
                    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" stroke-width="2" width="16" height="16"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg><span style="color:#ff4d4f;margin-left:8px;font-weight:700">Удалить пост</span>`;
                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deletePostRequest(postId);
                    };
                    menu.appendChild(btn);
                }
            });
        };

        new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
    };
})();
