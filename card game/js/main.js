// весь скрипт — это одна большая функция
(function(){

	// карточки
	let cards = [
		{
			// название
			name: "cardOne",
			// адрес картинки
			img: "./img/card one.svg",
			// порядковый номер пары
			id: 1,
		},
		{
			name: "cardTwo",
			img: "./img/card two.svg",
			id: 2
		},
		{
			name: "cardThree",
			img: "./img/card three.svg",
			id: 3
		},
		{
			name: "cardFour",
			img: "./img/card four.svg",
			id: 4
		},
		{
			name: "cardFive",
			img: "./img/card five.svg",
			id: 5
		},
		{
			name: "cardSix",
			img: "./img/card six.svg",
			id: 6
		},
		{
			name: "cardSeven",
			img: "./img/card seven.svg",
			id: 7
		},
		{
			name: "cardEight",
			img: "./img/card eight.svg",
			id: 8
		},
    {
			name: "cardNine",
			img: "./img/card nine.svg",
			id: 9
		}
	];

  //  объявляем объект, внутри которого будет происходить основная механика игры
var Memory = {

	// создаём карточку
	init: function(cards){
		//  получаем доступ к классам
		this.$game = $(".game");
		this.$modal = $(".modal");
		this.$overlay = $(".modal-overlay");
		this.$restartButton = $("button.restart");
		// собираем из карточек массив — игровое поле
		this.cardsArray = $.merge(cards, cards);
		// перемешиваем карточки
		this.shuffleCards(this.cardsArray);
		// и раскладываем их
		this.setup();
	},

	// как перемешиваются карточки
	shuffleCards: function(cardsArray){
		// используем встроенный метод .shuffle
		this.$cards = $(this.shuffle(this.cardsArray));
	},

	// раскладываем карты
	setup: function(){
		// подготавливаем код с карточками на страницу
		this.html = this.buildHTML();
		// добавляем код в блок с игрой
		this.$game.html(this.html);
		// получаем доступ к сформированным карточкам
		this.$memoryCards = $(".card");
		// на старте мы не ждём переворота второй карточки
		this.paused = false;
		// на старте у нас нет перевёрнутой первой карточки
 		this.guess = null;
 		// добавляем элементам на странице реакции на нажатия
		this.binding();
	},

	// как элементы будут реагировать на нажатия
	binding: function(){
		// обрабатываем нажатие на карточку
		this.$memoryCards.on("click", this.cardClicked);
		// и нажатие на кнопку перезапуска игры
		this.$restartButton.on("click", $.proxy(this.reset, this));
	},

	// что происходит при нажатии на карточку
	cardClicked: function(){
		// получаем текущее состояние родительской переменной
		var _ = Memory;
		// и получаем доступ к карточке, на которую нажали
		var $card = $(this);
		// если карточка уже не перевёрнута и мы не нажимаем на ту же самую карточку второй раз подряд
		if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
			// переворачиваем её
			$card.find(".inside").addClass("picked");
			// если мы перевернули первую карточку
			if(!_.guess){
				// то пока просто запоминаем её
				_.guess = $(this).attr("data-id");
			// если мы перевернули вторую и она совпадает с первой
			} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
				// оставляем обе на поле перевёрнутыми и показываем анимацию совпадения
				$(".picked").addClass("matched");
				// обнуляем первую карточку
				_.guess = null;
					// если вторая не совпадает с первой
					} else {
						// обнуляем первую карточку
						_.guess = null;
						// не ждём переворота второй карточки
						_.paused = true;
						// ждём полсекунды и переворачиваем всё обратно
						setTimeout(function(){
							$(".picked").removeClass("picked");
							Memory.paused = false;
						}, 600);
					}
			// если мы перевернули все карточки
			if($(".matched").length == $(".card").length){
				// показываем победное сообщение
				_.win();
			}
		}
	},

	// показываем победное сообщение
	win: function(){
		// не ждём переворота карточек
		this.paused = true;
		// плавно показываем модальное окно с предложением сыграть ещё
		setTimeout(function(){
			Memory.showModal();
			Memory.$game.fadeOut();
		}, 1000);
	},

	// показываем модальное окно
	showModal: function(){
		// плавно делаем блок с сообщением видимым
		this.$overlay.show();
		this.$modal.fadeIn("slow");
	},

	// прячем модальное окно
	hideModal: function(){
		this.$overlay.hide();
		this.$modal.hide();
	},

	// перезапуск игры
	reset: function(){
		// прячем модальное окно с поздравлением
		this.hideModal();
		// перемешиваем карточки
		this.shuffleCards(this.cardsArray);
		// раскладываем их на поле
		this.setup();
		// показываем игровое поле
		this.$game.show("slow");
	},

	// Тасование Фишера–Йетса
	shuffle: function(array){
		var counter = array.length, temp, index;
	   	while (counter > 0) {
        	index = Math.floor(Math.random() * counter);
        	counter--;
        	temp = array[counter];
        	array[counter] = array[index];
        	array[index] = temp;
	    	}
	    return array;
	},

	// код, как добавляются карточки на страницу
	buildHTML: function(){
		// сюда будем складывать HTML-код
		var frag = '';
		// перебираем все карточки подряд
		this.$cards.each(function(k, v){
			// добавляем HTML-код для очередной карточки
			frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
			<div class="front"><img src="'+ v.img +'"\
			alt="'+ v.name +'" /></div>\
			<div class="back"><img src="./img/card back.svg"\
			alt="Codepen" /></div></div>\
			</div>';
		});
		// возвращаем собранный код
		return frag;
	}
};

// запускаем игру
Memory.init(cards);
})();

// 13.09.2023 21:36




