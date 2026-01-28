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
        let css = `
            .sidebar-avatar-wrapper, .sidebar-avatar, .avatar--emoji, aside footer, footer.svelte-13vg9xt, .sidebar-pill footer { display: none !important; }
            .sidebar-nav.svelte-13vg9xt { display: flex !important; flex-direction: column !important; align-items: center !important; }
            .sidebar-nav-item.itd-nav-wp { 
                display: flex !important; align-items: center !important; justify-content: center !important; 
                width: 48px !important; height: 48px !important; padding: 0 !important; margin: 0 !important;
                cursor: pointer !important; position: relative !important; order: 99 !important;
            }
            .sidebar-nav-item.active { 
                background: rgba(0, 149, 255, 0.15) !important; border-radius: 50% !important; 
                box-shadow: 0 0 0 2px #0088ff, 0 0 10px rgba(0, 136, 255, 0.5) !important; color: #00d4ff !important; 
            }
            .post-dropdown, .post-dropdown.svelte-kvcx9g { 
                background: #121212 !important; border: 1px solid rgba(255,255,255,0.15) !important; 
                z-index: 999999 !important; box-shadow: 0 15px 35px rgba(0,0,0,0.8) !important;
                opacity: 1 !important; visibility: visible !important; display: block !important;
            }
            .post-dropdown-item { color: #fff !important; background: transparent !important; }
            .post-dropdown-item:hover { background: rgba(255,255,255,0.1) !important; }
            .post-dropdown-item.danger { color: #ff4444 !important; }
            .itd-modal-overlay { 
                position: fixed !important; top: 0 !important; left: 0 !important; 
                width: 100% !important; height: 100% !important; 
                background: rgba(0,0,0,0.85) !important; display: flex !important; 
                align-items: center !important; justify-content: center !important; 
                z-index: 2000000 !important; backdrop-filter: blur(6px) !important; 
            }
            .itd-modal { 
                background: #181818 !important; border: 1px solid rgba(255,255,255,0.1) !important; 
                padding: 24px !important; border-radius: 20px !important; 
                width: 300px !important; text-align: center !important; 
                box-shadow: 0 25px 50px rgba(0,0,0,0.6) !important; 
            }
            .itd-modal-btn { 
                width: 100% !important; padding: 12px !important; margin: 8px 0 !important; 
                border: none !important; border-radius: 12px !important; 
                cursor: pointer !important; font-weight: 600 !important; color: white !important; 
            }
            .itd-btn-primary { background: #0088ff !important; }
            .itd-btn-danger { background: rgba(255, 50, 50, 0.2) !important; border: 1px solid rgba(255,50,50,0.3) !important; }
            .itd-btn-close { background: transparent !important; font-size: 13px !important; opacity: 0.6 !important; }
        `;
        if (data) {
            css += `
                body { background-image: url("${data}") !important; background-size: cover !important; background-attachment: fixed !important; background-repeat: no-repeat !important; background-position: center !important; }
                .layout, .main-container, .layout.svelte-13vg9xt, .main-container.svelte-13vg9xt { background: transparent !important; }
                .sidebar-pill, .profile-card, .feed-card, .create-post, .wall-post-form, .post-container, .explore-card, .notifications-card { 
                    background: rgba(0, 0, 0, 0.55) !important; backdrop-filter: blur(14px) !important; 
                    -webkit-backdrop-filter: blur(14px) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; 
                }
                .explore-section__title, .explore-hashtag__name, .explore-hashtag__count, .explore-user__name, .explore-user__username, .explore-user__followers, .notifications-header__title, .notification-text, .notification-preview, .notification-time, .notification-author, .notification-action, .explore-search__input, .profile-bio__name, .profile-bio__username, .profile-stats__label, .profile-stats__value, .post-author, .post-content, .post-time, .post-action, .post-views, .feed-tab, .profile-tab, .notifications-tab, .top-clans__title, .clan-item__count, .create-post__textarea, .wall-post-form__textarea { color: #ffffff !important; }
                .sidebar-nav-item svg, .post-action svg, .post-views svg, .profile-banner__btn svg, .create-post__attach-btn svg, .wall-post-form__attach-btn svg, .explore-search__icon svg { color: #ffffff !important; stroke: #ffffff !important; }
                .feed-tab.active, .profile-tab.active, .notifications-tab.active { border-bottom: 2px solid #0088ff !important; }
            `;
        }
        styleTag.innerHTML = css;
    };
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    const showModal = () => {
        if (document.querySelector('.itd-modal-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'itd-modal-overlay';
        overlay.innerHTML = '<div class="itd-modal"><h3 style="margin-bottom:20px;color:white;">Настройка фона</h3><button class="itd-modal-btn itd-btn-primary" id="itd-set-wp">Выбрать обои</button><button class="itd-modal-btn itd-btn-danger" id="itd-reset-wp">Сбросить</button><button class="itd-modal-btn itd-btn-close" id="itd-close-modal">Отмена</button></div>';
        document.body.appendChild(overlay);
        document.getElementById('itd-set-wp').onclick = () => fileInput.click();
        document.getElementById('itd-reset-wp').onclick = () => { localStorage.removeItem(STORAGE_KEY); applyStyles(null); overlay.remove(); };
        document.getElementById('itd-close-modal').onclick = () => overlay.remove();
        overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };
    };
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { localStorage.setItem(STORAGE_KEY, ev.target.result); applyStyles(ev.target.result); document.querySelector('.itd-modal-overlay')?.remove(); };
        reader.readAsDataURL(file);
    };
    const inject = () => {
        const nav = document.querySelector('.sidebar-nav.svelte-13vg9xt');
        if (nav && !nav.querySelector('.itd-nav-wp')) {
            const navBtn = document.createElement('a');
            navBtn.className = 'sidebar-nav-item svelte-13vg9xt itd-nav-wp';
            navBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><circle cx="12" cy="13" r="3" stroke="currentColor" stroke-width="2"></circle></svg>';
            navBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showModal(); };
            nav.appendChild(navBtn);
        }
    };
    applyStyles(localStorage.getItem(STORAGE_KEY));
    new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
    inject();
};
