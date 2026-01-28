(function() {
    window.initWallpaperModule = function() {
        const STORAGE_KEY = 'itd_custom_wallpaper';

        const applyWallpaper = (data) => {
            const styleId = 'itd-wallpaper-styles';
            let styleTag = document.getElementById(styleId);
            
            if (!data) {
                if (styleTag) styleTag.remove();
                return;
            }

            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = styleId;
                document.head.appendChild(styleTag);
            }

            styleTag.innerHTML = `
                /* Основной фон */
                body {
                    background-image: url('${data}') !important;
                    background-size: cover !important;
                    background-attachment: fixed !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                }

                /* Скрыть аватарку (трамвайчик) в меню */
                .sidebar-avatar-wrapper .avatar, .sidebar-avatar .avatar--emoji {
                    display: none !important;
                }

                /* Голубо-синяя круглая обводка активных пунктов */
                .sidebar-nav-item.active {
                    background: rgba(0, 149, 255, 0.15) !important;
                    border-radius: 50% !important;
                    box-shadow: 0 0 0 2px #0088ff, 0 0 10px rgba(0, 136, 255, 0.5) !important;
                    color: #00d4ff !important;
                }

                /* Общий "стеклянный" стиль */
                .layout.svelte-13vg9xt, .main-container.svelte-13vg9xt { background: transparent !important; }
                
                .sidebar-pill, .profile-card, .feed-card, .create-post, 
                .wall-post-form, .post-container, .explore-card,
                .notifications-card, .sidebar-avatar-wrapper button {
                    background: rgba(0, 0, 0, 0.5) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #ffffff !important;
                }

                /* Тексты и иконки — белые */
                .profile-bio__name, .profile-bio__username, .post-author, .post-content,
                .feed-tab, .profile-tab, .notifications-tab, .explore-section__title,
                .notification-text, .create-post__textarea, .wall-post-form__textarea {
                    color: #ffffff !important;
                }

                .sidebar-nav-item svg, .post-action svg, .explore-search__icon svg {
                    color: #ffffff !important;
                    stroke: #ffffff !important;
                }
                
                .post-action path[fill="currentColor"] { fill: #ffffff !important; }
                .profile-info, .profile-tabs, .feed-tabs, .post { background: transparent !important; }
            `;
        };

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) applyWallpaper(saved);

        // Скрытый input для выбора файла
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
                    alert('Файл слишком большой!');
                }
            };
            reader.readAsDataURL(file);
        };

        // Функция создания модалки
        const showModal = () => {
            const overlay = document.createElement('div');
            overlay.style = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
                display: flex; align-items: center; justify-content: center; z-index: 9999;
            `;

            const modal = document.createElement('div');
            modal.style = `
                background: rgba(20, 20, 20, 0.9); border: 1px solid rgba(255,255,255,0.1);
                padding: 24px; border-radius: 16px; width: 280px; text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white;
            `;
            modal.innerHTML = `
                <h3 style="margin-bottom: 20px; font-size: 18px;">Настройка фона</h3>
                <button id="wp-select" style="width: 100%; padding: 12px; margin-bottom: 10px; border-radius: 8px; border: none; background: #0088ff; color: white; cursor: pointer; font-weight: bold;">Выбрать обои</button>
                <button id="wp-reset" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #ff4d4d; cursor: pointer;">Сбросить фон</button>
            `;

            overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            modal.querySelector('#wp-select').onclick = () => {
                fileInput.click();
                overlay.remove();
            };
            modal.querySelector('#wp-reset').onclick = () => {
                localStorage.removeItem(STORAGE_KEY);
                applyWallpaper(null);
                overlay.remove();
            };
        };

        const inject = () => {
            const menu = document.querySelector('.sidebar-menu.svelte-13vg9xt');
            if (menu && !menu.querySelector('.itd-wp-action')) {
                const btn = document.createElement('button');
                btn.className = 'sidebar-menu-item svelte-13vg9xt itd-wp-action';
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10a1.65 1.65 0 0 0 1.65-1.65c0-.4-.15-.75-.4-1a1.65 1.65 0 0 1 1.25-2.75H16c3 0 5.5-2.5 5.5-5.5 0-5.2-4.2-9.3-9.5-9.3z"></path>
                        <circle cx="7.5" cy="10.5" r=".5" fill="currentColor"></circle>
                        <circle cx="10.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        <circle cx="13.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        <circle cx="16.5" cy="10.5" r=".5" fill="currentColor"></circle>
                    </svg>
                    <span>Обои</span>
                `;
                btn.onclick = showModal;

                const exitBtn = menu.querySelector('.danger');
                if (exitBtn) menu.insertBefore(btn, exitBtn);
                else menu.appendChild(btn);
            }
        };

        new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
    };
})();
