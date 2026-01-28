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

                /* Скрыть аватарку (трамвайчик) в верхнем меню */
                .sidebar-avatar-wrapper .avatar, 
                .sidebar-avatar .avatar--emoji {
                    display: none !important;
                }

                /* Голубо-синяя круглая обводка для активных пунктов меню */
                .sidebar-nav-item.active {
                    background: rgba(0, 149, 255, 0.15) !important;
                    border-radius: 50% !important;
                    box-shadow: 0 0 0 2px #0088ff, 0 0 10px rgba(0, 136, 255, 0.5) !important;
                    color: #00d4ff !important;
                }

                /* Прозрачность основных контейнеров */
                .layout.svelte-13vg9xt, .main-container.svelte-13vg9xt {
                    background: transparent !important;
                }

                /* Стеклянный интерфейс (Черный полупрозрачный) для всех карточек */
                .sidebar-pill, 
                .profile-card, 
                .feed-card, 
                .create-post, 
                .wall-post-form, 
                .post-container,
                .explore-card,
                .notifications-card,
                .sidebar-avatar-wrapper button {
                    background: rgba(0, 0, 0, 0.5) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #ffffff !important;
                }

                /* Цвет текста для Поиска и Уведомлений */
                .explore-section__title, .explore-hashtag__name, .explore-hashtag__count,
                .explore-user__name, .explore-user__username, .explore-user__followers,
                .notifications-header__title, .notification-text, .notification-preview,
                .notification-time, .notification-author, .notification-action,
                .explore-search__input {
                    color: #ffffff !important;
                }

                /* Специфические элементы поиска и уведомлений */
                .explore-search, .explore-hashtag, .explore-user, .notification-item {
                    background: transparent !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                }

                .explore-search__input {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: none !important;
                }

                .explore-search__input::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                }

                /* Цвет текста и элементов управления (общий) */
                .profile-bio__name, .profile-bio__username, .profile-stats__label, .profile-stats__value,
                .post-author, .post-content, .post-time, .post-action, .post-views,
                .feed-tab, .profile-tab, .notifications-tab, .top-clans__title, .clan-item__count,
                .create-post__textarea, .wall-post-form__textarea {
                    color: #ffffff !important;
                }

                /* Иконки */
                .sidebar-nav-item svg, .post-action svg, .post-views svg,
                .profile-banner__btn svg, .create-post__attach-btn svg,
                .wall-post-form__attach-btn svg, .explore-search__icon svg {
                    color: #ffffff !important;
                    stroke: #ffffff !important;
                }

                .post-action path[fill="currentColor"], .notification-badge svg {
                    fill: #ffffff !important;
                }

                /* Убираем лишние фоны */
                .profile-info, .profile-tabs, .feed-tabs, .notifications-header, 
                .explore-header, .post, .post-header {
                    background: transparent !important;
                }

                /* Активные табы */
                .feed-tab.active, .profile-tab.active, .notifications-tab.active {
                    border-bottom: 2px solid #0088ff !important;
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
                btn.onclick = () => fileInput.click();

                const exitBtn = menu.querySelector('.danger');
                if (exitBtn) menu.insertBefore(btn, exitBtn);
                else menu.appendChild(btn);
            }
        };

        new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
    };
})();
