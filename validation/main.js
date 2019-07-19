"use strict";

/**
 * Объект содержащий методы для валидации.
 */
const validationMethods = {
    /**
     * Метод проверки поля по длине.
     * @param {HTMLInputElement} field Поле, которое надо проверить.
     * @param {Array} args Массив с аргументами.
     * @returns {string|null} Строку с ошибкой или null, если ошибки не было.
     */
    length(field, args) {
        const valLength = field.value.length;
        const sign = args[0];
        const then = args[1];

        let message = null;
        switch (sign) {
            case ">":
                if (!(valLength > then)) {
                    message = `Минимальная длина поля: ${then + 1}`;
                }
                break;
            case "<":
                if (!(valLength < then)) {
                    message = `Максимальная длина поля: ${then - 1}`;
                }
                break;
            case ">=":
                if (!(valLength >= then)) {
                    message = `Минимальная длина поля: ${then}`;
                }
                break;
            case "<=":
                if (!(valLength <= then)) {
                    message = `Максимальная длина поля: ${then}`;
                }
                break;
            case "==":
                if (valLength !== then) {
                    message = `Длина поля должна равняться: ${then} символам.`;
                }
                break;
        }
        return message;
    },
    /**
     * Проверяет содержит ли поле только цифры.
     * @param {HTMLInputElement} field Поле, которое надо проверить.
     * @returns {string|null} Строку с ошибкой или null, если ошибки не было.
     */
    mustContainNumber(field) {
        for (const val of field.value) {
            if (!Number.isInteger(Number.parseInt(val))) {
                return "Поле должно содержать только цифры";
            }
        }
        /*const req = new RegExp("\d+");
        if(!req.test(parseInt(field.value))){
            return "Поле должно содержать только цифры"
        }*/
        return null;
    },
    /**
     * Проверяет совпадает ли у двух полей значения
     * @param {HTMLInputElement} field Поле, которое надо проверить.
     * @param {Array} args Массив с аргументами.
     * @returns {string|null} Строку с ошибкой или null, если ошибки не было.
     */
    fieldsCompare(field, args) {
        return field.value !== document.querySelector(args[0]).value ? "Поля не совпадают" : null;
    }
};

const validation = {
    formEl: null,
    rules: null,

    init() {
        this.formEl = document.querySelector(".my-form");
        this.formEl.addEventListener("submit", event => this.formSubmit(event));

        this.rules = [
            {
                selector: "input[name=name]",
                methods: [
                    {name: "length", args: [">=", 1]},
                    {name: "length", args: ["<=", 50]},
                ]
            },
            {
                selector: "input[name=phone]",
                methods: [
                    {name: "mustContainNumber"},
                    {name: "length", args: ["==", 11]},
                ]
            },
            {
                selector: "input[name=password]",
                methods: [
                    {name: "length", args: [">=", 5]},
                    {name: "length", args: ["<=", 50]},
                ]
            },
            {
                selector: "input[name=password_repeat]",
                methods: [
                    {name: "fieldsCompare", args: ["input[name=password]"]}
                ]
            }
        ]
    },

    /**
     * Метод, который запескается перед отправкой формы
     * @param event Событие отправки формы
     */
    formSubmit(event) {
        if (!this.validate()) {
            event.preventDefault();
        }
    },

    validate() {
        let isValid = true;
        for (let rule of this.rules) {
            const inputEl = document.querySelector(rule.selector);
            for (let method of rule.methods) {
                const errMessage = validationMethods[method.name](inputEl, method.args);
                if (errMessage) {
                    isValid = false;
                    this.setInvalidField(inputEl, errMessage);
                    break;
                } else {
                    this.setValidField(inputEl);
                }
            }
        }
        return isValid;
    },

    /**
     * Устанавливает класс провала валидации и ставит сообщение о том, почему валидация провалена.
     * @param inputEl Элемент интпута, который провалидировал валидацию.
     * @param {string} message Сообщение об ошибке
     */
    setInvalidField(inputEl, message) {
        const cl = inputEl.classList;
        cl.remove("is-valid");
        cl.add("is-invalid");

        let hintWrap = inputEl.parentNode.querySelector(".invalid-feedback");
        if (!hintWrap) {
            hintWrap = document.createElement("div");
            hintWrap.classList.add("invalid-feedback");
            inputEl.parentNode.appendChild(hintWrap);
        }
        hintWrap.textContent = message;
    },

    /**
     * Устанавливает класс прохождения валидации и убирает сообщение о провале валидации.
     * @param inputEl Элемент интпута, который провалидировал валидацию.
     */
    setValidField(inputEl) {
        const cl = inputEl.classList;
        cl.remove("is-invalid");
        cl.add("is-valid");
    },
};

validation.init();



 



