(function ($) {

//скрываем блок html с массивом, анимацией и отсортированными числами
    $(".box-numbers").hide();

//проверяем введенный текст, преобразуем в массив чисел, сортируем числа и создаем списки в dom c числами
    $("#button").click(function () {
        var userNumbers = $(".userNumbers").val();
        var regName = /^(?:\d\,?)+$/;

        if (userNumbers.length > 0) {
            if (regName.test(userNumbers) === false) {
                $(".userNumbers").effect("bounce", 500);
            } else {
                var array = userNumbers.split(",");

                $(".box-numbers").show("fold", 1000);

                createList(array, "number number_user", $("#arrUser"));

                createList(array, "number number_animation", $("#animation"));
                bubbleSortAnimation(0, 0, $(".number_animation"));

                bubbleSort(array);
                createList(array, "number number_sort", $("#arrSort"));
            }
        } else {
            $(".userNumbers").effect("bounce", 500);
        }
    });


//функция создающаяя список чисел из массива в dom
    function createList(array, className, ul) {
        ul.empty();
        $.each(array, function (i, item) {
            var $li = $("<li/>", {
                text: item,
                class: className
            });
            ul.append($li);
        });
    }


    //функция анимирующая процесс пузырьковой сортировки

    function bubbleSortAnimation(i, j, arr) {
        arr.eq(j).addClass("red"); //выделяем iwu и следующий элемент массива
        arr.eq(j + 1).addClass("red");

        var endI = arr.length - 1; //количество обходов массива
        var endJ = endI - i; //количество чисел в одном обходе

        if (i === endI) { // если это последний обход, то отмечаем первое число и выходим из функции
            arr.eq(0).addClass("grey");
            return arr;

        } else {
            if (j === endJ) {  //если это последнее число в обходе, то отмечаем последнее число, переходим на следующий обход
                arr.eq(j).addClass("grey");

                i++;
                setTimeout(function () {
                    bubbleSortAnimation(i, 0, arr)
                }, 2000);

            } else {
                if (+arr.eq(j).text() > +arr.eq(j + 1).text()) {//если первое число больше следующего,то
                    var number1 = arr.eq(j).text(); //записываем значения элементов
                    var number2 = arr.eq(j + 1).text();

                    arr.eq(j).text(number2); //меняем значения элементов
                    arr.eq(j + 1).text(number1);

                    arr.removeClass("red", 500); //снимаем выделение

                    setTimeout(function () { //переходим на следующий элемент
                        bubbleSortAnimation(i, j + 1, arr)
                    }, 2000);

                } else {
                    arr.removeClass("red", 500); //если первое число меньше или равно следующему,то переходим к следующему элементу

                    setTimeout(function () {
                        bubbleSortAnimation(i, j + 1, arr)
                    }, 2000);
                }
            }
        }
    }

//производим пузырьковую сортировку

    function bubbleSort(array) {
        for (var i = 0, endI = array.length - 1; i < endI; i++) {
            var wasSwap = false;
            for (var j = 0, endJ = endI - i; j < endJ; j++) {
                if (+array[j] > +array[j + 1]) {
                    var swap = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = swap;
                    wasSwap = true;
                }
            }
            if (!wasSwap) break; //проверяем есть ли неотсортированные числа
        }
        return array;
    }


})(jQuery);
