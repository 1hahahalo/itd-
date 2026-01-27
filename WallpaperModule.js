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
                /* Основной фон */
                body {
                    background-image: url('${data}') !important;
                    background-size: cover !important;
                    background-attachment: fixed !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                }

                /* Прозрачность основных контейнеров */
                .layout.svelte-13vg9xt, .main-container.svelte-13vg9xt {
                    background: transparent !important;
                }

                /* Стеклянный интерфейс (Черный полупрозрачный) */
                .sidebar-pill, 
                .profile-card, 
                .feed-card, 
                .create-post, 
                .wall-post-form, 
                .post-container,
                .sidebar-avatar-wrapper button {
                    background: rgba(0, 0, 0, 0.5) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #ffffff !important;
                }

                /* Цвет текста и элементов управления */
                .profile-bio__name, .profile-bio__username, .profile-stats__label, .profile-stats__value,
                .post-author, .post-content, .post-time, .post-action, .post-views,
                .feed-tab, .profile-tab, .top-clans__title, .clan-item__count,
                .create-post__textarea, .wall-post-form__textarea {
                    color: #ffffff !important;
                }

                /* Поля ввода */
                .create-post__textarea, .wall-post-form__textarea {
                    background: rgba(255, 255, 255, 0.05) !important;
                }

                .create-post__textarea::placeholder, .wall-post-form__textarea::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                }

                /* Иконки (SVG) — делаем белыми */
                .sidebar-nav-item svg, 
                .post-action svg, 
                .post-views svg,
                .profile-banner__btn svg,
                .create-post__attach-btn svg,
                .wall-post-form__attach-btn svg {
                    color: #ffffff !important;
                    stroke: #ffffff !important;
                }

                /* Исключение для залитых иконок */
                .post-action path[fill="currentColor"] {
                    fill: #ffffff !important;
                }

                /* Убираем стандартные фоны вложенных элементов */
                .profile-info, .profile-tabs, .feed-tabs, .post, .post-header {
                    background: transparent !important;
                }

                /* Активные табы */
                .feed-tab.active, .profile-tab.active {
                    border-bottom-color: #ffffff !important;
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
                    alert('Файл слишком большой для памяти браузера');
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
                btn.onclick = () => {
                    fileInput.click();
                };

                const exitBtn = menu.querySelector('.danger');
                if (exitBtn) menu.insertBefore(btn, exitBtn);
                else menu.appendChild(btn);
            }
        };

        new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
    };
})();
