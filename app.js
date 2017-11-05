
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
		this.percentage = -1;
	};

	// modify prototype of Expense, so that each new object can inherit this method
	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome>0) {
			this.percentage = Math.round ((this.value/totalIncome)*100);
		}
		else this.percentage = -1;
	};

	Expense.prototype.getPercentage = function(){
		return this.percentage;
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
		// add a new item 
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

		// calculate budget and percentage in the top container
		calculateBudget: function(){
			// calculate total income and expenses
			calculateTotal("inc");
			calculateTotal("exp");
			// calculate the budget and percentage of expenses  
			data.budget = data.totals.inc - data.totals.exp;
			if (data.totals.inc === 0) data.percentage = 0;
			else data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
		},

		// calculate the percentage for each expense item
		calculatePercentage: function(){
			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});
		},

		// return a list of all percentages
		getPercentages: function(){
			var allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		deleteItem: function(type, id) {
			var ids, index;

			var ids = data.allItems[type].map(function(current){
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index,1);
			}
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
		expenseContainer: ".expenses__list",
		budgetLabel: ".budget__value",
		incomeLabel: ".budget__income--value",
		expensesLabel: ".budget__expenses--value",
		percentageLabel: ".budget__expenses--percentage",
		container:".container",
		expensesPercLabel: ".item__percentage",
		dateLabel: ".budget__title--month"
	};

	// format number to be more user friendly
	var formatNumber = function(num, type){
		var numSplit, int, dec;
		num = Math.abs(num);
		num = num.toFixed(2);  // round num to 2 decimal points
			
		numSplit = num.split(".");
		int = numSplit[0];
		dec = numSplit[1];

		if (int.length > 3){
			int = int.substr(0,int.length-3) + "," + int.substr(int.length-3,int.length);
		}

		return (type==="exp" ? "-":"+") + " " + int + "." + dec;
	};

	return {

		getDOMstrings: function() {
			return DOMstrings;
		},

		// get user input
		getinput: function(){
			return {
				type : document.querySelector(DOMstrings.inputType).value, // either inc or exp
				description : document.querySelector(DOMstrings.inputDescription).value,
				value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		// add item to the list which 
		addListItem: function (item, type){
			var html, newHtml, element;
			// create HTML string with placeholder text
			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>' + 						
				'<div class="right clearfix"><div class="item__value">%value%</div>' +
				'<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if (type === 'exp'){
				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' + 
                   '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>' +
                   '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			// replace the placeholder text with actual data
			newHtml = html.replace("%id%",item.id);
			newHtml = newHtml.replace("%description%",item.description);
			newHtml = newHtml.replace("%value%",formatNumber(item.value,type));
			// insert the html into DOM as the last child of the element
			document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
		},

		// clear input fields after they have been added.
		clearFields: function() {
			document.querySelector(DOMstrings.inputDescription).value = "";
			document.querySelector(DOMstrings.inputValue).value = "";
			// set focus back to description
			document.querySelector(DOMstrings.inputDescription).focus();
		},

		// display budget and percentage in the top container
		displayBudget: function(obj){
			var type;
			obj.budget > 0 ? type = "inc" : type = "exp";
			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,"inc");
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,"exp");

			if (obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
			}
			else {
				document.querySelector(DOMstrings.percentageLabel).textContent = "---";
			}
		},

		// delete item according to its selector id. i.e. "inc-1" or "exp-0"
		deleteListItem: function(selectorID){
			var elem = document.getElementById(selectorID);
			// to delete the element, have to find the parentNode and remove its child.
			elem.parentNode.removeChild(elem);
		},

		// display the percentage of each expense
		displayPercentages: function(percentages){
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); // returns a list of nodes

			for (var i=0;i<fields.length;i++){
				if (percentages[i] > 0) fields[i].textContent = percentages[i] + "%";
				else fields[i].textContent = "---";
			}
		},

		// display current month and year on title
		displayMonth: function(){
			var now = new Date();
			months = ["January", "February", "March", "April", "May", "June", 
			"July", "August", "September", "October", "November", "December"];
			year = now.getFullYear();
			month = now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;
		},

		// change the display of input fields according to the input type
		changeType: function(){
			var fields = document.querySelectorAll(DOMstrings.inputType + "," 
				+ DOMstrings.inputDescription + "," + DOMstrings.inputValue);

			for (var i=0;i<fields.length;i++){
				fields[i].classList.toggle("red-focus");
			}

			document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
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

		document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changeType);
	};

	// update and display budget
	var updateBudget = function() {
		// 1. calculate the budget
		budgetCtrl.calculateBudget();
		// 2. return the budget
		var budget = budgetCtrl.getBudget();
		// 3. display budget on the UI
		UICtrl.displayBudget(budget);
	};

	// add item and display it on UI
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
			// 5. update percentage
			updatePercentage();
		}
	};

	// delete and remove item from UI
	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;
		// find the id of item-clearfix: i.e. "inc-0" or "exp-2" 
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
	
		if (itemID) {
			splitID = itemID.split("-");
			type = splitID[0];
			ID = parseInt(splitID[1]);  // to convert string into Integer
			// 1. delete item from data structure 
			budgetCtrl.deleteItem(type,ID);
			// 2. delete item from UI
			UICtrl.deleteListItem(itemID);
			// 3. update and show and new budget
			updateBudget();
			// 4. update expense percentage
			updatePercentage();
		}
	};

	// update percentage for each expense and display on UI
	var updatePercentage = function(){
		// 1. calculate percentage
		budgetCtrl.calculatePercentage();
		// 2. read percentage from budget controller
		var percentages = budgetCtrl.getPercentages();
		// 3. update UI
		UICtrl.displayPercentages(percentages);
	};

	return {
		// initialization function
		init: function(){
			// display current month and year
			UICtrl.displayMonth();
			// set up event lisenters
			setupEventListeners();
			// initialize all numbers
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
		}
	};
})(budgetController,UIController);

controller.init();