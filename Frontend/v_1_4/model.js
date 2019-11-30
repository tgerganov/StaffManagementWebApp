//Creating the person object with the main properties
function Person(firstName, lastName, citizen, id) {
    this.id = id;
    this.fName = firstName;
    this.lName = lastName;
    this.citizenship = citizen;    
}

function Model() {
    this._employees = [];
    this._euCitizens = [];
    this._nonEuCitizens = [];
    this._selectedIndex = -1;
    this._chkBoxes = [];

    //Instantiating the Model events listened by the View
    this.employeeListUpdated = new Event(this);
    this.allChkBoxesChecked = new Event(this);
    this.allChkBoxesUnchecked = new Event(this);
}

//Defining the Model functions
Model.prototype = {

    //Get and Set employee list
    getEmployees: function () {
        return this._employees;
    },

    setEmployees: function (employees) {
        this._employees = employees;
        this.employeeListUpdated.notify();
    },

    //Get and Set (setting within the same function) for both EU and nonEU employee lists
    getEuCitizens: function () {
        return this._euCitizens;
    },

    getNonEuCitizens: function () {
        return this._nonEuCitizens;
    },

    setEuCitizenship: function (euCitizens, nonEuCitizens) {
        this._euCitizens = euCitizens;
        this._nonEuCitizens = nonEuCitizens;
    },

    //Adding an employee to the list
    //Adding the employee also to a specific list depending on his/her EU citizenship status: EU or nonEU
    addEmployee: function (employee) {
        this._employees.push(employee);
        if(employee.euStatus == "EU")
        {
            this._euCitizens.push(employee);
            console.log("MODEL: Employee " + employee.fName + " " + employee.lName + " added to EU citizens!");
        } 
        else if (employee.euStatus == "nonEU") 
        {
            this._nonEuCitizens.push(employee);
            console.log("MODEL: Employee " + employee.fName + " " + employee.lName + " added to non-EU citizens!");
        }
        this.employeeListUpdated.notify();
    },

    //Adding and Getting the checkboxes that are checked to chkBoxes list
    addChkBoxes: function (chkBoxes) {
        this._chkBoxes = chkBoxes;
    },

    getChkBoxes: function () {
        return this._chkBoxes;
    },

    //Adding all of the checkboxes, disregarding their status (checked or unchecked)
    //Used for SELECT ALL
    addAllChkBoxes: function (chkBoxes) {
        this._chkBoxes = chkBoxes;
        this.allChkBoxesChecked.notify();
    },

    //Clearing the list of checked checkboxes
    //Used for DESELECT ALL
    addAllUnchkBoxes: function () {
        this._chkBoxes = [];
        this.allChkBoxesUnchecked.notify();
    },

    //FILTER() the employees by their EU status and update the model with the two newly created arrays of employees
    filterEmployeesByEuStatus: function(employees) {
        let euCitizens = employees.filter(function(employee){
            return employee.euStatus == "EU";
        });
        let nonEuCitizens = employees.filter(function(employee){
            return employee.euStatus == "nonEU";
        });
        this.setEuCitizenship(euCitizens, nonEuCitizens);
    },
};