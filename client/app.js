const form = document.getElementById("form");
const table = document.getElementById("table");
const tableBody = document.getElementById("tableBody");
const submitBtn = document.getElementById("submit-btn");
const updateBtn = document.getElementById("update-btn");

let isEditMode = false;

form.addEventListener("submit", addItem);

async function addItem(e) {
    e.preventDefault();
    if (isEditMode == false) {
        const amount = e.target.amount.value;
        const desc = e.target.desc.value;
        const date = e.target.date.value;
        e.target.amount.value = "";
        e.target.desc.value = "";
        e.target.date.value = "";

        let expense = {
            amount: amount,
            desc: desc,
            date: date
        };

        try {
            await axios.post("http://localhost:3000/api/expenses", expense);
            printData()
        } catch (error) {
            console.log(error);
        }
    }
}

async function printData() {
    try {
        const result = await axios.get("http://localhost:3000/api/expenses");
        const expenses = result.data;

        if (expenses.length == 0) {
            table.classList.add("d-none");
        }
        else {
            table.classList.remove("d-none");
        }

        let data = "";
        if (expenses) {
            expenses.forEach((expense, index) => {
                data = data + `<tr> <th scope="row">${index + 1}</th>
                <td>${expense.amount}</td>
                <td>${expense.desc}</td>
                <td>${expense.date}</td>
                <td><button class="btn btn-sm btn-primary" onclick="editItem('${expense._id}')">Edit</button></td>
                <td><button class="btn btn-sm btn-danger" onclick="deleteItem('${expense._id}')">Delete</button></td>
                </tr>`;
            });
        }
        tableBody.innerHTML = data;
    } catch (error) {
        console.log(error)
    }
}

async function deleteItem(id) {
    try {
        await axios.delete(`http://localhost:3000/api/expenses/${id}`)
        printData();
    } catch (error) {
        console.log(error)
    }
}

async function editItem(id) {
    try {
        const result = await axios.get(`http://localhost:3000/api/expenses/${id}`)
        const expense = result.data;
        form.amount.value = expense.amount;
        form.desc.value = expense.desc;
        form.date.value = expense.date;
        document.getElementById("submit-btn").classList.add("d-none");
        document.getElementById("update-btn").classList.remove("d-none");
        isEditMode = true;
        updateBtn.onclick = () => {
            updateItem(expense._id);
        }
    } catch (error) {
        console.log(error);
    }
}

async function updateItem(id) {
    try {
        // alert('updating');
        // Get the updated values from the form fields
        const updatedAmount = form.amount.value;
        const updatedDesc = form.desc.value;
        const updatedDate = form.date.value;

        // Create an updated appointment object
        const updatedExpense = {
            amount: updatedAmount,
            desc: updatedDesc,
            date: updatedDate
        };
        console.log(updatedExpense);

        // Send a PUT request to update the appointment
        await axios.put(`http://localhost:3000/api/expenses/${id}`, updatedExpense);

        // Clear the form fields and update the UI
        form.amount.value = "";
        form.desc.value = "";
        form.date.value = "";
        document.getElementById("update-btn").classList.add("d-none");
        document.getElementById("submit-btn").classList.remove("d-none");
        isEditMode = false;
        printData(); // Refresh the table

    } catch (error) {
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", printData);