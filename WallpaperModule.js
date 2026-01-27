// ==UserScript==
// @name         ITD: Custom Wallpaper (Обои)
// @namespace    ITD
// @version      1.0
// @description  Добавляет возможность установить свой фон на сайте
// @author       You
// @match        https://*.xn--d1ah4a.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'itd_user_wallpaper_data';
    const MENU_SELECTOR = '.sidebar-menu.svelte-13vg9xt';
    const ITEM_CLASS = 'sidebar-menu-item svelte-13vg9xt';

    // --- 1. Функция применения обоев ---
    const applyWallpaper = (imageData) => {
        if (!imageData) {
            document.body.style.backgroundImage = '';
            return;
        }
        // Применяем стили к body. !important нужен, чтобы перебить стандартные стили сайта.
        document.body.setAttribute('style', `
            background-image: url('${imageData}') !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center center !important;
            background-attachment: fixed !important;
        `);
    };

    // Загружаем сохраненные обои при старте
    const savedWp = localStorage.getItem(STORAGE_KEY);
    if (savedWp) applyWallpaper(savedWp);


    // --- 2. Создание скрытого инпута для выбора файла ---
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png, image/jpeg, image/gif, image/webp';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Обработка выбора файла
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Ограничение на размер файла (например, 8 МБ), чтобы не забивать localStorage
        if (file.size > 8 * 1024 * 1024) {
             alert('Файл слишком большой. Пожалуйста, выберите изображение меньше 8 МБ.');
             return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            // Сохраняем в память браузера
            try {
                localStorage.setItem(STORAGE_KEY, imageData);
                // Применяем немедленно
                applyWallpaper(imageData);
            } catch (err) {
                alert('Ошибка сохранения. Возможно, изображение слишком большое для локального хранилища.');
                console.error(err);
            }
        };
        reader.readAsDataURL(file);
    });


    // --- 3. Функция создания и добавления кнопки в меню ---
    const injectMenuButton = (menu) => {
        // Проверяем, не добавили ли мы кнопку ранее
        if (menu.querySelector('.itd-wp-btn')) return;

        const wpBtn = document.createElement('button');
        wpBtn.className = `${ITEM_CLASS} itd-wp-btn`;
        // Иконка "изображения" и текст
        wpBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Обои</span>
        `;

        wpBtn.onclick = () => {
            // Триггерим скрытый инпут файла
            fileInput.click();
            // Опционально: закрыть меню после клика (эмуляция клика вне меню)
            document.body.click();
        };

        // Вставляем кнопку перед кнопкой "Выйти" (которая имеет класс danger)
        const exitBtn = menu.querySelector('.danger');
        if (exitBtn) {
            menu.insertBefore(wpBtn, exitBtn);
        } else {
            menu.appendChild(wpBtn);
        }
    };


    // --- 4. Наблюдатель за появлением меню в DOM ---
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
             // Если что-то добавилось в DOM
            if (mutation.addedNodes.length) {
                // Ищем наше меню по селектору из задачи
                const menu = document.querySelector(MENU_SELECTOR);
                if (menu) {
                    injectMenuButton(menu);
                }
            }
        });
    });

    // Запускаем наблюдение за телом документа
    observer.observe(document.body, { childList: true, subtree: true });

})();
