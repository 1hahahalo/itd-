(function() {
    window.initWallpaperModule = function() {
        const STORAGE_KEY = 'itd_custom_wallpaper';

        const analyzeBrightness = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 1; canvas.height = 1;
                    ctx.drawImage(img, 0, 0, 1, 1);
                    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    resolve(brightness > 125 ? 'light' : 'dark');
                };
                img.src = src;
            });
        };

        const applyWallpaper = async (data) => {
            if (!data) return;
            const theme = await analyzeBrightness(data);
            const isDarkWp = theme === 'dark';
            
            const brandColor = '#40ff6b';
            const uiBg = isDarkWp ? 'rgba(255, 255, 255, 0.1)' : 'rgba(25, 25, 25, 0.7)';
            const border = 'rgba(255, 255, 255, 0.12)';
            const modalBg = 'rgba(20, 20, 20, 0.98)';

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
                    background-color: #000 !important;
                }
                
                #app, .layout, main, .main-container, .profile-posts, .feed-content, 
                main > div, .create-post__inner, .wall-post-form__inner, .post {
                    background: transparent !important;
                }

                /* Основные контейнеры */
                .create-post, .wall-post-form, .post-container, .sidebar, 
                .sidebar-pill, .feed-card, .profile-card, .suggestions, 
                .top-clans, main > div[class*="svelte-"] {
                    background-color: ${uiBg} !important;
                    backdrop-filter: blur(6px) !important;
                    border: 1px solid ${border} !important;
                    border-radius: 24px !important;
                    color: #fff !important;
                }

                /* Отступ между формой и постами */
                .create-post, .wall-post-form {
                    margin-bottom: 30px !important;
                }

                /* Элементы управления (Белые) */
                svg, .post-menu-btn, .suggestions__arrow, .profile-edit-btn, 
                .create-post__attach-btn, .wall-post-form__attach-btn {
                    color: #fff !important;
                    stroke: #fff !important;
                }

                /* Замена брендового цвета #1d9bf0 на #40ff6b */
                .create-post__submit, .wall-post-form__submit, 
                .sidebar-nav-item.active, .feed-tab.active, .profile-tab.active {
                    background-color: ${brandColor} !important;
                    color: #000 !important;
                }

                .feed-tab.active, .profile-tab.active {
                    border-bottom-color: ${brandColor} !important;
                    background: transparent !important;
                    color: ${brandColor} !important;
                }

                .post-actions .post-action.liked svg {
                    fill: ${brandColor} !important;
                    color: ${brandColor} !important;
                }

                /* Боковое меню и навигация */
                .sidebar, .sidebar-pill {
                    border-radius: 30px !important;
                    padding: 10px !important;
                }

                .sidebar-avatar, .sidebar-avatar .avatar--emoji {
                    background-color: rgba(255, 255, 255, 0.2) !important;
                    border-radius: 20px !important;
                }

                .post-dropdown, .sidebar-menu {
                    background-color: ${modalBg} !important;
                    border-radius: 20px !important;
                    z-index: 999999 !important;
                    backdrop-filter: blur(20px) !important;
                }

                .sidebar-nav-item {
                    border-radius: 20px !important;
                    margin: 4px 0 !important;
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
                } catch (err) { alert('Изображение слишком большое'); }
            };
            reader.readAsDataURL(file);
        };

        const inject = () => {
            const menu = document.querySelector('.sidebar-menu.svelte-13vg9xt');
            if (menu && !menu.querySelector('.itd-wp-action')) {
                const btn = document.createElement('button');
                btn.className = 'sidebar-menu-item svelte-13vg9xt itd-wp-action';
                btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Обои</span>`;
                btn.onclick = () => fileInput.click();
                const exitBtn = menu.querySelector('.danger');
                if (exitBtn) menu.insertBefore(btn, exitBtn);
                else menu.appendChild(btn);
            }
        };

        new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
    };
})();
