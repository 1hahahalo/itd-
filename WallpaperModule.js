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
            
            const uiBg = isDarkWp ? 'rgba(255, 255, 255, 0.12)' : 'rgba(20, 20, 20, 0.75)';
            const border = isDarkWp ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
            const modalBg = isDarkWp ? 'rgba(40, 40, 40, 0.98)' : 'rgba(25, 25, 25, 0.98)';
            const accentBg = isDarkWp ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.5)';

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
                    background-color: #111 !important;
                }
                #app, .layout, main, .main-container, .profile-posts, .feed-content, 
                main > div, .create-post__inner, .wall-post-form__inner, .post {
                    background: transparent !important;
                }
                .create-post, .wall-post-form, .post-container, .sidebar-pill, 
                .feed-card, .profile-card, .suggestions, .top-clans, 
                main > div[class*="svelte-"] {
                    background-color: ${uiBg} !important;
                    backdrop-filter: blur(14px) !important;
                    border: 1px solid ${border} !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
                    color: #fff !important;
                }
                .sidebar-avatar, .sidebar-avatar .avatar--emoji {
                    background-color: ${accentBg} !important;
                    border-radius: 12px !important;
                    border: 1px solid ${border} !important;
                }
                .sidebar-menu, .post-dropdown {
                    background-color: ${modalBg} !important;
                    z-index: 999999 !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    backdrop-filter: blur(25px) !important;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.7) !important;
                }
                .post-author, .post-content, .profile-bio__name, .post-time, .profile-bio__username, .feed-tab {
                    color: #fff !important;
                }
                .sidebar-pill {
                    padding: 8px !important;
                    margin-bottom: 15px !important;
                    border-radius: 24px !important;
                }
                .sidebar-nav-item.active {
                    background: rgba(255, 255, 255, 0.15) !important;
                    border-radius: 16px !important;
                }
                .feed-tabs, .profile-tabs {
                    border-bottom: 1px solid ${border} !important;
                    background: transparent !important;
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
