"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ej2_grids_1 = require("@syncfusion/ej2-grids");
var ej2_buttons_1 = require("@syncfusion/ej2-buttons");
var ej2_base_1 = require("@syncfusion/ej2-base");
ej2_grids_1.Grid.Inject(ej2_grids_1.Edit, ej2_grids_1.Toolbar, ej2_grids_1.Page);
var flag = false;
var grid = new ej2_grids_1.Grid({
    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    allowPaging: true,
    actionBegin: actionBegin,
    actionComplete: actionComplete,
    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true, type: 'number' },
        { field: 'CustomerID', width: 140, headerText: 'Customer ID', type: 'string' },
        { field: 'ShipCity', headerText: 'ShipCity', width: 140 },
        { field: 'ShipCountry', headerText: 'ShipCountry', width: 140 }
    ]
});
grid.appendTo('#Grid');
var button = new ej2_buttons_1.Button({
    content: 'Bind data via AJAX',
    cssClass: 'e-success'
});
button.appendTo('#buttons');
document.getElementById('buttons').onclick = function () {
    var ajax = new ej2_base_1.Ajax("https://localhost:7248/Grid/Getdata", 'POST'); //Use remote server host number instead 7248
    ajax.send();
    ajax.onSuccess = function (data) {
        grid.dataSource = JSON.parse(data);
    };
};
function actionComplete(e) {
    if (e.requestType === 'save' || e.requestType === 'delete') {
        flag = false;
    }
}
function actionBegin(e) {
    if (!flag) {
        //To add and save a new record using AJAX requests
        if (e.requestType == 'save' && (e.action == 'add')) {
            var editedData = e.data;
            e.cancel = true;
            var ajax = new ej2_base_1.Ajax({
                url: 'https://localhost:7248/Grid/Insert',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            ajax.onSuccess = function () {
                flag = true;
                grid.endEdit();
            };
            ajax.onFailure = function () {
                flag = false;
            };
            ajax.send();
        }
        // To edit and save a record using an AJAX request
        if (e.requestType == 'save' && (e.action == "edit")) {
            var editedData = e.data;
            e.cancel = true;
            var ajax = new ej2_base_1.Ajax({
                url: 'https://localhost:7248/Grid/Update',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            ajax.onSuccess = function () {
                flag = true;
                grid.endEdit();
            };
            ajax.onFailure = function () {
                flag = false;
            };
            ajax.send();
        }
        //To delete a record using an AJAX request,
        if (e.requestType == 'delete') {
            var editedData = e.data;
            e.cancel = true;
            var ajax = new ej2_base_1.Ajax({
                url: 'https://localhost:7248/Grid/Delete',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ key: editedData[0][grid.getPrimaryKeyFieldNames()[0]] })
            });
            ajax.onSuccess = function () {
                flag = true;
                grid.deleteRecord();
            };
            ajax.onFailure = function () {
                flag = false;
            };
            ajax.send();
        }
    }
}
//# sourceMappingURL=index.js.map