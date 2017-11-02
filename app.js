// budget controller
var budgetController = (function(){

	// functions to add

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
	
	var DOM = UICtrl.getDOMstrings();

	// function to add new item
	var ctrlAddItem = function () {

		// 1. get input data 
		var input = UICtrl.getinput();

		// 2. add item to the budget controller

		// 3. add the item to the UI

		// 4. calculate the budget

		// 5. display the budget on UI

	}

	document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

	document.addEventListener("keypress", function(event){
		if (event.keyCode === 13 || event.which === 13) { // to support old browser without keycode
			ctrlAddItem();
		}
	});

})(budgetController,UIController);