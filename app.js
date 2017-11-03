
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
		allItems: { exp: [], inc: [] },
		totals: { exp: 0, inc: 0 },
		budget: 0,
		percentage: -1
	};

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum += cur.value;
		});
		data.totals[type] = sum;
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

		calculateBudget: function(){
			// calculate total income and expenses
			calculateTotal("inc");
			calculateTotal("exp");

			// calculate the budget and percentage of expenses  
			data.budget = data.totals.inc - data.totals.exp;
			if (data.totals.inc === 0) data.percentage = 0;
			else data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
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
		inputBtn: ".add__btn",
		incomeContainer : ".income__list",
		expenseContainer: ".expenses__list"
	};

	return {
		getinput: function(){
			return {
				type : document.querySelector(DOMstrings.inputType).value, // either inc or exp
				description : document.querySelector(DOMstrings.inputDescription).value,
				value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		getDOMstrings: function() {
			return DOMstrings;
		},

		// add item to the list which 
		addListItem: function (item, type){
			var html, newHtml, element;
			
			// create HTML string with placeholder text
			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>' + 						
				'<div class="right clearfix"><div class="item__value">%value%</div>' +
				'<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if (type === 'exp'){
				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>' + 
                   '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>' +
                   '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			
			// replace the placeholder text with actual data
			newHtml = html.replace("%id%",item.id);
			newHtml = newHtml.replace("%description%",item.description);
			newHtml = newHtml.replace("%value%",item.value);

			// insert the html into DOM as the last child of the element
			document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
		},

		// clear input fields after they have been added.
		clearFields: function() {
			
			document.querySelector(DOMstrings.inputDescription).value = "";
			document.querySelector(DOMstrings.inputValue).value = "";

			// set focus back to description
			document.querySelector(DOMstrings.inputDescription).focus();
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

	var updateBudget = function() {
		
		// 1. calculate the budget
		budgetCtrl.calculateBudget();

		// 2. return the budget
		var budget = budgetCtrl.getBudget();

		// 3. display budget on the UI
		console.log(budget);

	};

	// function to add new item
	var ctrlAddItem = function () {
		var input, newItem;

		// 1. get input data 
		input = UICtrl.getinput();

		// ensure their is some description and input is a number and its value > 0
		if (input.description !== "" && !isNaN(input.value) && input.value > 0){
			
			// 2. add item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. add the item to the UI and clear fields after
			UICtrl.addListItem(newItem, input.type);
			UICtrl.clearFields();

			// 4. calculate and update budget
			updateBudget();

		}
	}

	return {
		// initialization function
		init: function(){
			setupEventListeners();
		},

	};


})(budgetController,UIController);

controller.init();