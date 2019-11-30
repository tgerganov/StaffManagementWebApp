$(function () {

    let model = new Model(),
        view = new View(model, {
            'employeesTable': $('#employees'),
            'showButton': $('#showModBtn'), 
            'addButton': $('#addEmployeeBtn'),
            'delButton': $('#removeBtn'),
            'genButton': $('#randomBtn'),
            'allchkbox': $('.allEmployeeChkBox'),
            'filter': $('#filterSelect'),
            'totalHours': $('#reduceBtn')
        }),

        controller = new Controller(model, view);
        controller.getAllEmployeesApi();
        
        //Toggling between pages
        $('.page2').fadeOut(0);

        //Navigating to the employee page
        $('#employeePageClick').css('cursor', 'pointer').click(function() {
            if($('#leftSide').css("margin-left") == "100px")
            {
                $('#leftSide').animate({"margin-left": '-=750'},500);
                $('#employeePageClick').fadeOut(500);
                $('.page2').fadeIn(500);
            }
        });

        //Navigating back to the main page
        $('.title').css('cursor', 'pointer').click(function() {
            if($('#leftSide').css("margin-left") == "-650px")
            {
                $('#leftSide').animate({"margin-left": '+=750'},500);
                $('#employeePageClick').fadeIn(500);
                $('.page2').fadeOut(500);
            }
        });
});