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
                
                /* Убираем заливку со всех фоновых слоев, чтобы видеть обои */
                #app, .layout, main, .main-container, .profile-posts, main > div {
                    background: transparent !important;
                }

                /* Стеклянный эффект для основных контейнеров */
                .feed-card, 
                .post-container, 
                .wall-post-form, 
                .sidebar,
                .profile-card,
                .suggestions,
                .top-clans,
                .sidebar-menu,
                .post-dropdown {
                    background-color: rgba(0, 0, 0, 0.6) !important;
                    backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
                }

                /* Исправление для постов в профиле и ленте */
                .post-container {
                    margin-bottom: 12px !important;
                    border-radius: 16px !important;
                }

                /* Исправление для боковой панели */
                .sidebar {
                    border-radius: 20px !important;
                }

                /* Делаем вкладки и шапки прозрачными */
                .feed-tabs, .profile-tabs, .profile-info, .top-clans__header {
                    background: transparent !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
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
