function Controller(model, view) {
    this._model = model;
    this._view = view;

    let _this = this;

    //Attaching action listeners for VIEW event dispatchers
    this._view.addButtonClicked.attach(function () {
        console.log("CONTROLLER: ADD button clicked!"); 
        _this.addEmployee();
    });

    this._view.delButtonClicked.attach(function () {
        console.log("CONTROLLER: DELETE button clicked!");
        _this.delEmployee();
    });

    this._view.genButtonClicked.attach(function () {
        console.log("CONTROLLER: GENERATE button clicked!");
        _this.randomEmployee();
    });

    this._view.chkboxChecked.attach(function () {
        _this.chkEmployee();
    });

    this._view.allChkboxChecked.attach(function () {
        _this.chkAllBoxes();
    });

    this._view.allChkboxUnchecked.attach(function () {
        _this.unchkAllBoxes();
    });
    
    this._view.totalHoursClicked.attach(function () {
        console.log("CONTROLLER: Total hours button clicked!");
        _this.totalHoursForEmployees();
    });

}

Controller.prototype = {
    //Add employee
    addEmployee: function () {

        let validationOk = false;

        let fName = this._view.getElementById("fName").value;
        let lName = this._view.getElementById("lName").value;
        let citizen = this._view.getElementById("citizen").value;
        let empN = this._view.getElementById("empN").value;
        let euStatus = this._view.getElementById("euStatus").value;
        let address = this._view.getElementById("address").value;
        let email = this._view.getElementById("email").value;
        let phone = this._view.getElementById("phone").value;
        let mLang = this._view.getElementById("mLang").value;
        let langs = this._view.getElementById("langs").value;
        let bankInfo = this._view.getElementById("bankInfo").value;
        let hoursWorked = this._view.getElementById("hoursWorked").value;

        let employee = new Person(fName, lName, citizen); 
        
        //Adding additional properties to the Person object
        employee.empN = empN;
        employee.euStatus = euStatus;
        employee.address = address;
        employee.email = email;
        employee.phone = phone;
        employee.mLang = mLang;
        employee.langs = langs;
        employee.bankInfo = bankInfo;
        employee.hoursWorked = hoursWorked;

        validationOk = this.validateInfo(fName, lName, citizen, empN, hoursWorked, email);

        if (employee && validationOk) {
            this.postAnEmployeeApi(employee);

            //After addition clear the modal 
            this._view.clearModal();
        }
    },

    //Check the input for fName, lName, citizen, empN, hoursWorked and email
    //fName, lName and citizen should contain at least two characters
    //empN should be a number bigger than 0
    //hoursWorked should contain at least one character (0 if there are no hours for the employee) to prevent NaN result when computing the total hours
    //email validation with a regular expression for correct format
    validateInfo: function(fName, lName, citizen, empN, hoursWorked, email) {
        console.log("VIEW: Validation started!");
        let allValid = false;
        let validFName = false;
        let validLName = false;
        let validCitizen = false;
        let validEmpN = false;
        let validHoursWorked = false;
        let validEmail = false;

        if (fName.length > 1) { 
            validFName = true; 
            this._view.getElementById("fName").style.backgroundColor = "white";
        } else { 
            validFName = false;
            this._view.getElementById("fName").style.backgroundColor = "#ead6df";
        }

        if (lName.length > 1) { 
            validLName = true; 
            this._view.getElementById("lName").style.backgroundColor = "white";
        } else { 
            validLName = false; 
            this._view.getElementById("lName").style.backgroundColor = "#ead6df";
        }

        if (citizen.length > 1) { 
            validCitizen = true; 
            this._view.getElementById("citizen").style.backgroundColor = "white";
        } else { 
            validCitizen = false; 
            this._view.getElementById("citizen").style.backgroundColor = "#ead6df";
        }

        if (parseInt(empN) > 0) { 
            validEmpN = true; 
            this._view.getElementById("empN").style.backgroundColor = "white";
        } else { 
            validEmpN = false; 
            this._view.getElementById("empN").style.backgroundColor = "#ead6df";
        }

        if (parseInt(hoursWorked) >= 0) { 
            validHoursWorked = true; 
            this._view.getElementById("hoursWorked").style.backgroundColor = "white";
        } else { 
            validHoursWorked = false; 
            this._view.getElementById("hoursWorked").style.backgroundColor = "#ead6df";
        }

        if (/^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/.test(this._view.getElementById("email").value)) {
            validEmail = true;
            this._view.getElementById("email").style.backgroundColor = "white";
        } else {
            validEmail = false;
            this._view.getElementById("email").style.backgroundColor = "#ead6df";
        }

        if (validFName && validLName && validCitizen && validEmpN && validHoursWorked && validEmail) {
            allValid = true;
            let fName = this._view.getElementById("fName").value;
            let lName = this._view.getElementById("lName").value;
            this._view.getElementById('allValid').innerHTML = fName + " " + lName + " added succesfully!";
            this._view.getElementById('allValid').style.color = "#349d0b";
        } else if (!validFName || !validLName || !validCitizen) {
            this._view.getElementById('allValid').innerHTML = "Input should be at least two characters long!";
            this._view.getElementById('allValid').style.color = "#d23636";
        } else if (!validEmpN) {
            this._view.getElementById('allValid').innerHTML = "Employee number should be bigger than 0";
            this._view.getElementById('allValid').style.color = "#d23636";
        } else if (!validHoursWorked) {
            this._view.getElementById('allValid').innerHTML = "If there are no hours worked for the employee, please enter 0";
            this._view.getElementById('allValid').style.color = "#d23636";
        } else if (!validEmail) {
            this._view.getElementById('allValid').innerHTML = "The format of the e-mail provided is not correct";
            this._view.getElementById('allValid').style.color = "#d23636";
        }
        
        console.log("CONTROLLER: Validation returned!");
        return allValid;
    },

    //Delete employee
    delEmployee: function () {
        let employees = this._model.getEmployees();
        let chkBoxes = this._model.getChkBoxes();
        for (let i=0; i< employees.length; i++)
        {
            for (let j=0; j < chkBoxes.length; j++)
            {
                if (chkBoxes[j] == employees[i].id)
                {
                    this.deleteAnEmployeeApi(employees[i].id);
                }
            }
        }
    },

    randomEmployee: function () {
        let fnames = ["Todor", "Svetoslav", "Per", "Soeren", "Maria", "Milica"];
        let lnames = ["Gerganov", "Petrov", "Radic", "Petersen", "Jakobsen", "Hofmann"];
        let citizensOf = ["BG", "DK", "SRB", "DE", "MK"];
        let empNs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let euStatuses = ["EU", "nonEU"];
        let addresses = ["Horsens", "Aarhus", "Vejle", "Randers", "Odense", "Aalborg"];
        let emails = ["tg@gmail.com", "sger@mail.bg", "pp@outlook.com", "sj@mail.dk", "mp@gmail.com", "mhof@gmx.de"];
        let phones = ["12345678", "87654321", "65234126", "76432165", "87965124"];
        let mainLangs = ["English", "Danish", "Russian"];
        let languages = ["German, Russian", "Spanish, French", "Polish, Serbian", "German, Bulgarian"]; 
        let bankInfos = ["Regnr: 1234, Kontonr: 1234567890", "Regnr: 4321, Kontonr: 4321567821", "Regnr: 8754, Kontonr: 8754567832"];
        let workedHours = [15, 25, 35, 18, 43, 27, 34, 16, 28, 31, 19];
        
        let employee = new Person(
            fnames[Math.floor(Math.random() * fnames.length)],
            lnames[Math.floor(Math.random() * lnames.length)],
            citizensOf[Math.floor(Math.random() * citizensOf.length)],
        );

        employee.empN = empNs[Math.floor(Math.random() * empNs.length)];
        employee.euStatus = euStatuses[Math.floor(Math.random() * euStatuses.length)];
        employee.address = addresses[Math.floor(Math.random() * addresses.length)];
        employee.email = emails[Math.floor(Math.random() * emails.length)];
        employee.phone = phones[Math.floor(Math.random() * phones.length)];
        employee.mLang = mainLangs[Math.floor(Math.random() * mainLangs.length)];
        employee.langs = languages[Math.floor(Math.random() * languages.length)];
        employee.bankInfo = bankInfos[Math.floor(Math.random() * bankInfos.length)];
        employee.hoursWorked = workedHours[Math.floor(Math.random() * workedHours.length)];

        this.postAnEmployeeApi(employee);
    },

    //Get all checked employees
    chkEmployee: function () {
        let checkboxesChecked = this._view.getAllCheckedEmployees();
        this._model.addChkBoxes(checkboxesChecked);
    },

    //Check all employees
    chkAllBoxes: function () {
        let allcheckboxes = this._view.getAllEmployees();
        this._model.addAllChkBoxes(allcheckboxes);
    },

    //Uncheck all employees
    unchkAllBoxes: function () {
        this._model.addAllUnchkBoxes();
    },
    
    //Get all employees from Model
    //Map the values from the employee list to form a new array only with hours worked values
    //REDUCE() the newly created array to a single value which is the total number of hours worked for all employees
    totalHoursForEmployees: function () {
        euStatus = this._view.getFilterOption();

        if (euStatus === "EU") {employees = this._model.getEuCitizens();}
        else if (euStatus === "nonEU") {employees = this._model.getNonEuCitizens();}
        else if (euStatus === "BothEuStat") {employees = this._model.getEmployees();}

        let arrHoursWorked = employees.map(function (employee) {
            return employee.hoursWorked;
        });
        let result = "No hours worked";
        let total = "";
        if(arrHoursWorked.length > 0){
            total = arrHoursWorked.reduce(function(total, employee) {
                return parseInt(total) + parseInt(employee);
            });
            result = 'Total hours for employees:';
        }

        //Update the view with the proper text and the total
        this._view.updateTotal(result,total);
    },

    //(GET) API call for getting all employees
    getAllEmployeesApi: function(){
        let url  = "http://localhost:53221/api/SM"; 
        let xhr  = new XMLHttpRequest()
        let req  = this;
        xhr.open('GET', url, true)
        xhr.onload = function () {
            let _employees = [];
            employees = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log("CONTROLLER: GET ALL API Called!");
                for (let i = 0; i < employees.length; i++)
                    {
                        _employees.push(req.parseJsonToEmployee(employees[i]));
                    }
                req._model.setEmployees(_employees);
                req._model.filterEmployeesByEuStatus(_employees);
            } else {
                console.error("CONTROLLER: " + employees);
            }
        }
        xhr.send(null);
    },
    
    //(POST) API call for posting an employee
    postAnEmployeeApi: function(data){
        let url = "http://localhost:53221/api/SM"; 
        let json = JSON.stringify(data);
        let xhr = new XMLHttpRequest();
        let req = this;
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-type','application/json');
            xhr.onload = function () {
                employee = JSON.parse(xhr.responseText);
                if (xhr.readyState == 4 && xhr.status == "201") {
                    req._model.addEmployee(req.parseJsonToEmployee(employee));
                    console.log("CONTROLLER: POST API Called!");
                    console.table(employee);
                } else {
                    console.error("CONTROLLER: " + employee);
                }
            }
            xhr.send(json);
    },

    //(DELETE) API call for deleting an employee
    deleteAnEmployeeApi: function(id){
        let url = "http://localhost:53221/api/SM"; 
        let xhr = new XMLHttpRequest();
        let req = this;
        xhr.open("DELETE", url+'/'+id, true);
        xhr.onload = function () {
            employee = JSON.parse(JSON.stringify(xhr.responseText));
            if (xhr.readyState == 4 && xhr.status == "204") {
                console.log("CONTROLLER: DELETE API Called!");
                req.getAllEmployeesApi();
            } else {
                console.error("CONTROLLER: " + employee);
            }
        }
        xhr.send(null);
    },
    
    parseJsonToEmployee: function(json) {
        let employee = new Person(json.fName,json.lName,json.citizenship,json.id);
        employee.empN = json.empN;
        employee.euStatus = json.euStatus;
        employee.address = json.address;
        employee.email = json.email;
        employee.phone = json.phone;
        employee.mLang = json.mLang;
        employee.langs = json.langs;
        employee.bankInfo = json.bankInfo;
        employee.hoursWorked = json.hoursWorked;
        return employee;
    },
};