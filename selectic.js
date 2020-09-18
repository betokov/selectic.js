; window.Selectic = (function () {
	function Selectic(elem) {

		//Variables
		let element = document.querySelector(elem);
		let previousElement = element.previousElementSibling ? element.previousElementSibling : element.parentElement;


		//Hide current select
		function hideCurrentSelect() {
			element.classList.add('selectic-hide');
			element.setAttribute("tabindex", "-1");
		}

		//Create selectic container
		function createSelecticContainer() {
			let selectContainer = document.createElement('div');
			selectContainer.classList.add('selectic');


			if (element.previousElementSibling) {
				element.parentElement.insertBefore(selectContainer, previousElement.nextSibling);
			} else {
				element.parentElement.prepend(selectContainer);
			}

			selectContainer.append(element);

			collectInfo();
		}

		//Collection of info
		function collectInfo() {
			let options = element.querySelectorAll("option"),
				newOptions = {
					val: [],
					attr: [],
				};

			//Take options
			options.forEach((item) => {
				newOptions.val.push(item.innerHTML);
				newOptions.attr.push(item.attributes);
			});

			selecticLayout(newOptions);
		}

		//Create New select
		function selecticLayout(obj) {
			let layout = document.createElement("div"),
				list = document.createElement("div");

			list.classList.add("selectic__list")
			layout.classList.add("selectic__wrapper");
			layout.append(list);

			//Set value in selectic-item
			for (let itemVal of obj.val) {
				let item = document.createElement("div");
				item.classList.add("selectic__item");
				item.innerHTML = itemVal;
				list.append(item);
			}

			let selecticItems = list.querySelectorAll('.selectic__item');
			let count = 0;
			//Set attributes in selectic item
			for (let i = 0; i < obj.attr.length; i++) {
				for (let j = 0; j < obj.attr[i].length; j++) {
					if (obj.attr[i][j].nodeName == "selected") {
						selecticItems[i].classList.add("selectic__item_selected");
						count += 1;
					}
					if (obj.attr[i][j].nodeName == "disabled") {
						selecticItems[i].classList.add("selectic__item_disabled");
					}
				}
			}

			//Set active element if there isn't selected element
			if (count == 0) {
				selecticItems[0].classList.add("selectic__item_selected");
			}

			//Set label
			let selecticLabel = document.createElement("span"), //label
				selecticLabeBox = document.createElement("div"), //label box
				selecticBtn = document.createElement('span'); //label btn

			selecticLabeBox.classList.add("selectic__label-box");
			selecticBtn.classList.add("selectic__button");
			selecticLabel.classList.add("selectic__label");
			selecticLabel.innerHTML = list.querySelector('.selectic__item_selected').innerHTML;
			selecticLabeBox.append(selecticLabel);
			selecticLabeBox.append(selecticBtn);
			layout.prepend(selecticLabeBox);

			//create layout
			element.parentElement.append(layout);
			//Event Listener for selectic
			selecticEvents(layout);
		}

		//Events for selectic
		function selecticEvents(layout) {
			let label = layout.querySelector('.selectic__label'),
				btn = layout.querySelector('.selectic__button'),
				list = layout.querySelector('.selectic__list'),
				btns = layout.querySelectorAll('.selectic__item');

			//Show selectic list
			label.addEventListener("click", function () {
				list.classList.toggle('selectic__list_show');
			});

			btn.addEventListener("click", function () {
				list.classList.toggle('selectic__list_show');
			});

			//select new label
			btns.forEach((item) => {
				if (!item.classList.contains('selectic__item_disabled') || !item.classList.contains('selectic__item_selected')) {
					item.addEventListener("click", function () {
						btns.forEach((item) => {
							item.classList.remove("selectic__item_selected");
						});

						label.innerHTML = item.innerHTML;
						item.classList.add("selectic__item_selected");
						list.classList.remove("selectic__list_show");
					});
				}
			});

			//close the selectic list
			document.addEventListener("click", (e) => {
				let target = e.target;

				if (!layout.contains(target)) {
					if (layout.querySelector('.selectic__list').classList.contains("selectic__list_show")) {
						layout.querySelector('.selectic__list').classList.remove("selectic__list_show");
					}
				}
			})


		}

		hideCurrentSelect();
		createSelecticContainer();
	}

	return Selectic;
}());