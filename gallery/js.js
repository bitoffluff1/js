"use strict";

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки открыть.
 */
const gallery = {
    openedImageEl: null,

    settings: {
        previewSelector: '.mySuperGallery',
        openedImageWrapperClass: 'galleryWrapper',
        openedImageClass: 'galleryWrapper__image',
        openedImageScreenClass: 'galleryWrapper__screen',
        openedImageCloseBtnClass: 'galleryWrapper__close',
        openedImageCloseBtnSrc: 'images/gallery/close.png',
        openedImageNoImageSrc: 'images/gallery/noImg.jpg',
        openedImageBackClass: 'galleryWrapper__back',
        openedImageBackSrc: 'images/gallery/back.png',
        openedImageNextClass: 'galleryWrapper__next',
        openedImageNextSrc: 'images/gallery/next.png',
    },

    /**
     * Инициализирует галерею, ставит обработчик события.
     * @param {Object} userSettings Объект настроек для галереи.
     */
    init(userSettings = {}) {
        // Записываем настройки, которые передал пользователь в наши настройки.
        Object.assign(this.settings, userSettings);

        // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
        // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
        // gallery и передадим туда событие MouseEvent, которое случилось.
        document
            .querySelector(this.settings.previewSelector)
            .addEventListener('click', event => this.containerClickHandler(event));
    },

    /**
     * Обработчик события клика для открытия картинки.
     * @param {MouseEvent} event Событие клики мышью.
     * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
     */
    containerClickHandler(event) {
        // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
        if (event.target.tagName !== 'IMG') {
            return;
        }

        this.saveOpenedImage(event.target);

        this.openImage(event.target.dataset.full_image_url);
    },

    saveOpenedImage(elem) {
        this.openedImageEl = elem;
    },

    /**
     * Открывает картинку.
     * @param {string} src Ссылка на картинку, которую надо открыть.
     */
    openImage(src) {
        // Открываем картинку с полученным из целевого тега (data-full_image_url аттрибут).
        const openImageEl = this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`);
        const img = new Image();
        img.onload = () => openImageEl.src = src;
        img.onerror = () => openImageEl.src = this.settings.openedImageNoImageSrc;
        img.src = src;
    },

    /**
     * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
     * @returns {Element}
     */
    getScreenContainer() {
        // Получаем контейнер для открытой картинки.
        const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
        // Если контейнер для открытой картинки существует - возвращаем его.
        if (galleryWrapperElement) {
            return galleryWrapperElement;
        }

        // Возвращаем полученный из метода createScreenContainer контейнер.
        return this.createScreenContainer();
    },

    /**
     * Создает контейнер для открытой картинки.
     * @returns {HTMLElement}
     */
    createScreenContainer() {
        // Создаем сам контейнер-обертку и ставим ему класс.
        const galleryWrapperElement = document.createElement('div');
        galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

        const backImageElement = new Image();
        backImageElement.classList.add(this.settings.openedImageBackClass);
        backImageElement.src = this.settings.openedImageBackSrc;
        backImageElement.addEventListener('click', () => {
            this.openedImageEl = this.getPrevImage();
            this.openImage(this.openedImageEl.dataset.full_image_url);
        });
        galleryWrapperElement.appendChild(backImageElement);

        const nextImageElement = new Image();
        nextImageElement.classList.add(this.settings.openedImageNextClass);
        nextImageElement.src = this.settings.openedImageNextSrc;
        nextImageElement.addEventListener('click', () => {
           this.openedImageEl =  this.getNextImage();
           this.openImage(this.openedImageEl.dataset.full_image_url);
        });
        galleryWrapperElement.appendChild(nextImageElement);

        // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
        const galleryScreenElement = document.createElement('div');
        galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
        galleryWrapperElement.appendChild(galleryScreenElement);

        // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
        const closeImageElement = new Image();
        closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
        closeImageElement.src = this.settings.openedImageCloseBtnSrc;
        closeImageElement.addEventListener('click', () => this.close());
        galleryWrapperElement.appendChild(closeImageElement);

        // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
        const image = new Image();
        image.classList.add(this.settings.openedImageClass);
        galleryWrapperElement.appendChild(image);

        // Добавляем контейнер-обертку в тег body.
        document.body.appendChild(galleryWrapperElement);

        // Возвращаем добавленный в body элемент, наш контейнер-обертку.
        return galleryWrapperElement;
    },

    /**
     * Закрывает (удаляет) контейнер для открытой картинки.
     */
    close() {
        document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
    },

    /**
     * Возвращает следующий элемент (картинку) от открытой или первую картинку в контейнере,
     * если текущая открытая картинка последняя.
     * @returns {Element} Следующую картинку от текущей открытой.
     */
    getNextImage() {
        const nextImageElement = this.openedImageEl.nextElementSibling;
        return nextImageElement ? nextImageElement : this.openedImageEl.parentElement.firstElementChild;
    },

    /**
     * Возвращает предыдущий элемент (картинку) от открытой или последнюю картинку в контейнере,
     * если текущая открытая картинка первая.
     * @returns {Element} Предыдущую картинку от текущей открытой.
     */
    getPrevImage() {
        const prevImageElement = this.openedImageEl.previousElementSibling;
        return prevImageElement ? prevImageElement :this.openedImageEl.parentElement.lastElementChild;
    }
};

// Инициализируем нашу галерею при загрузке страницы.
window.onload = () => gallery.init({previewSelector: '.galleryPreviewsContainer'});