
// budget controller
var budgetController = (function(){

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function (type, des, val) {
			var items, ID, newItem;

			items = data.allItems[type];
			
			// create new ID. Ensure the new item ID is last item's ID + 1.
			if (items.length > 0) ID = items[items.length-1].id + 1;
			else ID = 0;

			if (type === "inc") {
				newItem = new Income (ID, des, val);
			}
			else if (type === "exp"){
				newItem = new Expense (ID, des, val);
			}

			data.allItems[type].push(newItem);
			
			return newItem;
		},

		testing: function () {
			console.log(data);
		}
	}


})();

// UI controller
var UIController = (function(){

	// store all arbitrary strings
	var DOMstrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputValue: ".add__value",
		inputBtn: ".add__btn"
	};

	return {
		getinput: function(){
			return {
				type : document.querySelector(DOMstrings.inputType).value, // either inc or exp
				description : document.querySelector(DOMstrings.inputDescription).value,
				value : document.querySelector(DOMstrings.inputValue).value
			};
		},
		getDOMstrings: function() {
			return DOMstrings;
		}
	}

})();

// Global App controller 
var controller = (function(budgetCtrl, UICtrl){
	
	// set up event listeners and get strings 
	var setupEventListeners = function(){
		
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

		document.addEventListener("keypress", function(event){
			if (event.keyCode === 13 || event.which === 13) { // to support old browser without keycode
				ctrlAddItem();
			}
		});
	};

	// function to add new item
	var ctrlAddItem = function () {
		var input, newItem;

		// 1. get input data 
		input = UICtrl.getinput();

		// 2. add item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3. add the item to the UI

		// 4. calculate the budget

		// 5. display the budget on UI

	}

	return {
		// initialization function
		init: function(){
			setupEventListeners();

		},



	};


})(budgetController,UIController);

controller.init();