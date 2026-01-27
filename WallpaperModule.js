(function() {
    window.initWallpaperModule = function() {
        const STORAGE_KEY = 'itd_custom_wallpaper';

        const applyWallpaper = (data) => {
            if (!data) return;
            const styleId = 'itd-wallpaper-styles';
            let styleTag = document.getElementById(styleId);
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = styleId;
                document.head.appendChild(styleTag);
            }
            styleTag.innerHTML = `
                body {
                    background-image: url('${data}') !important;
                    background-size: cover !important;
                    background-attachment: fixed !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                }
                .layout.svelte-13vg9xt, .main-container.svelte-13vg9xt {
                    background: transparent !important;
                }
                .feed-card.svelte-1ooj66h, 
                .profile-card.svelte-14luta1,
                .post-container.svelte-cvb24n,
                .wall-post-form.svelte-vw1v4s,
                .suggestions.svelte-1u9eu0j,
                .top-clans.svelte-15vxund {
                    background-color: rgba(0, 0, 0, 0.65) !important;
                    backdrop-filter: blur(8px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
                .feed-tabs.svelte-1thmq55, .profile-tabs.svelte-1r4i2gu {
                    background: transparent !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
            `;
        };

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) applyWallpaper(saved);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const data = ev.target.result;
                try {
                    localStorage.setItem(STORAGE_KEY, data);
                    applyWallpaper(data);
                } catch (err) {
                    alert('Файл слишком большой');
                }
            };
            reader.readAsDataURL(file);
        };

        const inject = () => {
            const menu = document.querySelector('.sidebar-menu.svelte-13vg9xt');
            if (menu && !menu.querySelector('.itd-wp-action')) {
                const btn = document.createElement('button');
                btn.className = 'sidebar-menu-item svelte-13vg9xt itd-wp-action';
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>Обои</span>
                `;
                btn.onclick = () => fileInput.click();

                const exitBtn = menu.querySelector('.danger');
                if (exitBtn) menu.insertBefore(btn, exitBtn);
                else menu.appendChild(btn);
            }
        };

        new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
    };
})();
