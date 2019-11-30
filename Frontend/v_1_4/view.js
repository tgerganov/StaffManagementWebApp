function View(model, elements) {
    this._model = model;
    this._elements = elements;

    this.addButtonClicked = new Event(this);
    this.delButtonClicked = new Event(this);
    this.genButtonClicked = new Event(this);
    this.chkboxChecked = new Event(this);

    this.allChkboxChecked = new Event(this);
    this.allChkboxUnchecked = new Event(this);
    
    this.totalHoursClicked = new Event(this);
    
    let _this = this;

    //Attaching listeners from model events
    this._model.employeeListUpdated.attach(function () {
        _this.rebuildList();
    });

    this._model.allChkBoxesChecked.attach(function () {
        _this.checkAllBoxes();
    });

    this._model.allChkBoxesUnchecked.attach(function () {
        _this.uncheckAllBoxes();
    });

    //Trigger events when a specific action is taking place
    //SELECT ALL and DESELECT ALL events
    this._elements.allchkbox.click( function () {
        if($(this).is(':checked')){
            _this.allChkboxChecked.notify();
        } else {
            _this.allChkboxUnchecked.notify();
        }
    });

    //Binding onCLick event for dinamically generated checkboxes for each employee
    this._elements.employeesTable.on('click', '.employeeChkBox', function () {
        _this.chkboxChecked.notify();
    });

    //Clear modal on new show 
    this._elements.showButton.click(function () {
        _this.clearModal();
    });

    //Add employee button event (placed on the Employee Modal)
    this._elements.addButton.click(function () {
        _this.addButtonClicked.notify();
    });

    //Delete event for those employees that are checked 
    this._elements.delButton.click(function () {
        _this.delButtonClicked.notify();
    });

    //Generate an employee event
    this._elements.genButton.click(function () {
        _this.genButtonClicked.notify();
    });
    
    //Filter change event whenever the option is changed
    this._elements.filter.change (function () {
        _this.rebuildList();
    });

    //Total hours event for all of the employees available in the list
    this._elements.totalHours.click(function () {
        _this.totalHoursClicked.notify();
    });
}

View.prototype = {

    //Rebuild employee list
    rebuildList: function () {
        console.log("VIEW: Starting to rebuild list!");
        let table, employees = [], key;
        let checkCounter = 0;
    
        //Get tbody html element and clear before appending the newly fetched list from Model
        table = this._elements.employeesTable;
        table.html('');

        //Depending on the request, get all employees, the employees from EU countries or employees from nonEU countries
        //Model contains three employee lists, one for each case below
        if (this.getFilterOption() == "EU") { employees = this._model.getEuCitizens(); } 
        else if (this.getFilterOption() == "nonEU") { employees = this._model.getNonEuCitizens(); }
        else if (this.getFilterOption() == "BothEuStat") { employees = this._model.getEmployees(); }

        //Append new row with employee details
        employees.forEach(function(employee,index) {
            table.append($( '<tr><td><input type="checkbox" class="employeeChkBox" name="chkBox" value="' + employee.id + '"></td>'+
                            '<td>' + employee.empN + '</td>'+
                            '<td>' + employee.fName + '</td>'+
                            '<td>' + employee.lName + '</td>'+
                            '<td>' + employee.citizenship + '</td>' +
                            '<td>' + employee.euStatus + '</td>' +
                            '<td>' + employee.address + '</td>' +
                            '<td>' + employee.email + '</td>' +
                            '<td>' + employee.phone + '</td>' +
                            '<td>' + employee.mLang + '</td>' +
                            '<td>' + employee.langs + '</td>' +
                            '<td>' + employee.bankInfo + '</td>' +
                            '<td>' + employee.hoursWorked + '</td></tr>'
                        ));
            checkCounter++;
        })

        //Reset total hours text
        document.getElementById("totalHours").innerHTML = "";
        document.getElementById("totalHoursText").innerHTML = "";
        console.log("VIEW: List updated!");
    },

    getFilterOption: function() {
        let select = document.getElementById("filterSelect");
        return euStatus = select.options[select.selectedIndex].text;
    },

    //Check all the boxes for employees
    checkAllBoxes: function () {
        let checkboxes = document.getElementsByName("chkBox");
        for (let i=0; i<checkboxes.length; i++) {
              checkboxes[i].checked = true;
        }
        console.log("VIEW: All boxes checked!");
    },

    //Uncheck all the boxes for employees
    uncheckAllBoxes: function () {
        let checkboxes = document.getElementsByName("chkBox");
        for (let i=0; i<checkboxes.length; i++) {
              checkboxes[i].checked = false;
        }
        console.log("VIEW: All boxes unchecked!");
    },

    //Update the text for the total amount of hours worked by the employees
    updateTotal: function (result,total) {
        document.getElementById("totalHoursText").innerHTML = result;
        document.getElementById("totalHours").innerHTML = total;
    },

    //Helping functions
    clearModal: function() {
        document.getElementById("fName").value = "";
        document.getElementById("lName").value = "";
        document.getElementById("citizen").value = "";
        document.getElementById("empN").value = "";
        document.getElementById("euStatus").value = "EU";
        document.getElementById("address").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("mLang").value = "English";
        document.getElementById("langs").value = "";
        document.getElementById("bankInfo").value = "";
        document.getElementById("hoursWorked").value = "";

        console.log("VIEW: Modal cleared!");
    },

    //Get all checked boxes for employees
    getAllCheckedEmployees: function() {
        let checkboxes = document.getElementsByName("chkBox");
        let checkboxesChecked = [];
        for (let i=0; i<checkboxes.length; i++) {

           if (checkboxes[i].checked) {
              checkboxesChecked.push(checkboxes[i].value);
           }
        }
        return checkboxesChecked;
    },

    //Get all employees no matter if their checkbox is checked or not
    getAllEmployees: function () {
        let checkboxes = document.getElementsByName("chkBox");
        let allcheckboxes = [];
        for (let i=0; i<checkboxes.length; i++) {
              allcheckboxes.push(checkboxes[i].value);
        }
        return allcheckboxes;
    },
   
    getElementById: function (id) {
        return document.getElementById(id);
    },
};