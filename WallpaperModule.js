(function() {
    window.initWallpaperModule = function() {
        const STORAGE_KEY = 'itd_custom_wallpaper';

        const applyStyles = (data) => {
            const styleId = 'itd-wallpaper-styles';
            let styleTag = document.getElementById(styleId);
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = styleId;
                document.head.appendChild(styleTag);
            }

            // 1. Базовые стили (работают ВСЕГДА)
            let css = `
                /* Скрываем аватарку-трамвай и футер */
                .sidebar-avatar-wrapper .avatar, 
                .sidebar-avatar .avatar--emoji,
                aside footer, 
                .sidebar-pill footer { 
                    display: none !important; 
                }

                /* Голубо-синяя круглая обводка активных пунктов */
                .sidebar-nav-item.active {
                    background: rgba(0, 149, 255, 0.15) !important;
                    border-radius: 50% !important;
                    box-shadow: 0 0 0 2px #0088ff, 0 0 10px rgba(0, 136, 255, 0.5) !important;
                    color: #00d4ff !important;
                }

                /* Стили модального окна */
                .itd-modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7); display: flex; align-items: center;
                    justify-content: center; z-index: 9999; backdrop-filter: blur(4px);
                }
                .itd-modal {
                    background: #1a1a1a !important;
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 24px; border-radius: 20px; width: 300px; text-align: center;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    font-family: sans-serif;
                }
                .itd-modal-btn {
                    width: 100%; padding: 12px; margin: 8px 0; border: none;
                    border-radius: 12px; cursor: pointer; font-weight: 600;
                    transition: 0.2s; color: white;
                }
                .itd-btn-primary { background: #0088ff; }
                .itd-btn-danger { background: rgba(255, 50, 50, 0.2); border: 1px solid rgba(255,50,50,0.3); }
                .itd-btn-close { background: transparent; font-size: 13px; opacity: 0.6; }
            `;

            // 2. Стили обоев и "стекла" (только если есть данные)
            if (data) {
                css += `
                    body {
                        background-image: url('${data}') !important;
                        background-size: cover !important;
                        background-attachment: fixed !important;
                        background-repeat: no-repeat !important;
                        background-position: center !important;
                    }
                    .layout.svelte-13vg9xt, .main-container.svelte-13vg9xt { background: transparent !important; }
                    
                    .sidebar-pill, .profile-card, .feed-card, .create-post, .wall-post-form, 
                    .post-container, .explore-card, .notifications-card, .sidebar-avatar-wrapper button {
                        background: rgba(0, 0, 0, 0.5) !important;
                        backdrop-filter: blur(12px) !important;
                        -webkit-backdrop-filter: blur(12px) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    }

                    .explore-section__title, .explore-hashtag__name, .explore-hashtag__count,
                    .explore-user__name, .explore-user__username, .explore-user__followers,
                    .notifications-header__title, .notification-text, .notification-preview,
                    .notification-time, .notification-author, .notification-action,
                    .explore-search__input, .profile-bio__name, .profile-bio__username, 
                    .profile-stats__label, .profile-stats__value, .post-author, .post-content, 
                    .post-time, .post-action, .post-views, .feed-tab, .profile-tab, 
                    .notifications-tab, .top-clans__title, .clan-item__count,
                    .create-post__textarea, .wall-post-form__textarea { color: #ffffff !important; }
                    
                    .sidebar-nav-item svg, .post-action svg, .post-views svg,
                    .profile-banner__btn svg, .create-post__attach-btn svg,
                    .wall-post-form__attach-btn svg, .explore-search__icon svg {
                        color: #ffffff !important;
                        stroke: #ffffff !important;
                    }
                    .feed-tab.active, .profile-tab.active, .notifications-tab.active { border-bottom: 2px solid #0088ff !important; }
                    .itd-modal { background: rgba(20, 20, 20, 0.9) !important; backdrop-filter: blur(20px) !important; }
                `;
            }

            styleTag.innerHTML = css;
        };

        // Инициализация при загрузке
        applyStyles(localStorage.getItem(STORAGE_KEY));

        const fileInput = document.createElement('input');
        fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const data = ev.target.result;
                try {
                    localStorage.setItem(STORAGE_KEY, data);
                    applyStyles(data);
                    document.querySelector('.itd-modal-overlay')?.remove();
                } catch (err) { alert('Файл слишком большой'); }
            };
            reader.readAsDataURL(file);
        };

        const showModal = () => {
            if (document.querySelector('.itd-modal-overlay')) return;
            const overlay = document.createElement('div');
            overlay.className = 'itd-modal-overlay';
            overlay.innerHTML = `
                <div class="itd-modal">
                    <h3 style="margin-bottom: 20px; color: white;">Настройка фона</h3>
                    <button class="itd-modal-btn itd-btn-primary" id="itd-set-wp">Выбрать обои</button>
                    <button class="itd-modal-btn itd-btn-danger" id="itd-reset-wp">Сбросить</button>
                    <button class="itd-modal-btn itd-btn-close" id="itd-close-modal">Отмена</button>
                </div>
            `;
            document.body.appendChild(overlay);

            document.getElementById('itd-set-wp').onclick = () => fileInput.click();
            document.getElementById('itd-reset-wp').onclick = () => {
                localStorage.removeItem(STORAGE_KEY);
                applyStyles(null);
                overlay.remove();
            };
            document.getElementById('itd-close-modal').onclick = () => overlay.remove();
            overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };
        };

        const inject = () => {
            const nav = document.querySelector('.sidebar-nav.svelte-13vg9xt');
            if (nav && !nav.querySelector('.itd-nav-wp')) {
                const navBtn = document.createElement('a');
                navBtn.className = 'sidebar-nav-item svelte-13vg9xt itd-nav-wp';
                navBtn.style.cursor = 'pointer';
                navBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24">
                        <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <circle cx="12" cy="13" r="3" stroke="currentColor" stroke-width="2"></circle>
                    </svg>
                `;
                navBtn.onclick = (e) => {
                    e.preventDefault();
                    showModal();
                };
                nav.appendChild(navBtn);
            }
        };

        new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
    };
})();
