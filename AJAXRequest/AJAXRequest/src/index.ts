import { Grid, Edit, Toolbar, EditEventArgs, Page } from '@syncfusion/ej2-grids';
import { Button } from '@syncfusion/ej2-buttons';
import { Ajax } from '@syncfusion/ej2-base';


Grid.Inject(Edit, Toolbar, Page);

let flag: Boolean = false;

let grid: Grid = new Grid({
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

let button: Button = new Button({
    content: 'Bind data via AJAX',
    cssClass: 'e-success'
});
button.appendTo('#buttons');

(document.getElementById('buttons') as HTMLElement).onclick = function () {
    const ajax = new Ajax("https://localhost:7248/Grid/Getdata", 'POST');//Use remote server host number instead 7248
    ajax.send();
    ajax.onSuccess = (data) => {
        grid.dataSource = JSON.parse(data);
    };
};

function actionComplete(e: EditEventArgs) {
    if (e.requestType === 'save' || e.requestType === 'delete') {
        flag = false;
    }
}
function actionBegin(e: EditEventArgs) {

    if (!flag) {
        //To add and save a new record using AJAX requests
        if (e.requestType == 'save' && ((e as any).action == 'add')) {
            var editedData = (e as any).data;
            e.cancel = true;
            var ajax = new Ajax({
                url: 'https://localhost:7248/Grid/Insert',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            ajax.onSuccess = () => {
                flag = true;
                grid.endEdit();
            };
            ajax.onFailure = () => {
                flag = false;
            };
            ajax.send();
        }
        // To edit and save a record using an AJAX request
        if (e.requestType == 'save' && ((e as any).action == "edit")) {
            var editedData = (e as any).data;
            e.cancel = true;
            var ajax = new Ajax({
                url: 'https://localhost:7248/Grid/Update',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            ajax.onSuccess = () => {
                flag = true;
                grid.endEdit();
            };
            ajax.onFailure = () => {
                flag = false;
            };
            ajax.send();
        }
        //To delete a record using an AJAX request,

        if (e.requestType == 'delete') {
            var editedData = (e as any).data;
            e.cancel = true;
            var ajax = new Ajax({
                url: 'https://localhost:7248/Grid/Delete',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ key: editedData[0][grid.getPrimaryKeyFieldNames()[0]] })
            });
            ajax.onSuccess = () => {
                flag = true;
                grid.deleteRecord();
            };
            ajax.onFailure = () => {
                flag = false;
            };
            ajax.send();
        }
    }
}
