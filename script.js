const categoryInput = document.querySelector("#catagory_name");
const addCateBtn = document.querySelector("#add_category");
const expenseName = document.querySelector("#expense-name");
const expenseAmount = document.querySelector("#expense-amount");
const expenseDate = document.querySelector("#expense-date");
const expenseCategory = document.querySelector("#expense-category");
const updateExpenseCategory = document.querySelector("#updateCategory");
const form = document.querySelector("#expense-form");
const expenseBody = document.querySelector("#expense-body");
const updateModal = document.querySelector("#updateModal");
const updateForm = document.querySelector("#updateForm");
const upId = document.querySelector("#updateId");
const upName = document.querySelector("#updateName");
const upAmount = document.querySelector("#updateAmount");
const upDate = document.querySelector("#updateDate");
const upCategory = document.querySelector("#updateCategory");
const cancleModel = document.querySelector("#cancel");
const totalAmount = document.querySelector("#total-amount");

addCateBtn.addEventListener("click", handleCategoryBtn);
form.addEventListener("submit", handleAddExpence);
updateForm.addEventListener("submit", handleUpdate);
document.addEventListener("DOMContentLoaded", pageLoad);

cancleModel.addEventListener("click", () => {
  updateModal.classList.remove("show");
});

function pageLoad() {
  getCategoriesFromStorage();
  getExpensesFromStorage();
  renderTotalExpense(getTotalExpenses());
}

function handleCategoryBtn(e) {
  e.preventDefault();
  if (!categoryInput.value) {
    showToast("error", "Please fill the input.");
    categoryInput.focus();
    return;
  }

  const categoryInputVal = categoryInput.value.trim();
  const oldCategories = JSON.parse(storageGetter("categories")) || [];

  if (oldCategories.includes(categoryInputVal)) {
    showToast("error", "Category already exists.");
    return;
  }

  const newCategories = [...oldCategories, categoryInputVal];
  storageSetter("categories", newCategories);
  renderCategorySelect(categoryInputVal);
  categoryInput.value = "";
  showToast("success", "category Added.");
}

function renderCategorySelect(category) {
  console.log(category);
  const option1 = document.createElement("option");
  option1.value = category;
  option1.textContent = category;
  expenseCategory.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = category;
  option2.textContent = category;
  updateExpenseCategory.appendChild(option2);
  // updateExpenseCategory.appendChild(option);
}

function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  return option;
}

function setDefaultOptions(selectElement) {
  const defaults = ["🍽️ Food", "🚌 Transport", "🛍️ Shopping", "💡 Utilities"];
  selectElement.innerHTML = `<option value="" disabled selected>Select category</option>`;
  defaults.forEach((cat) => selectElement.appendChild(createOption(cat)));
}

function getCategoriesFromStorage() {
  const oldCategories = JSON.parse(storageGetter("categories")) || [];

  setDefaultOptions(expenseCategory);
  setDefaultOptions(updateExpenseCategory);

  oldCategories.forEach((category) => {
    expenseCategory.appendChild(createOption(category));
    updateExpenseCategory.appendChild(createOption(category));
  });
}

function handleAddExpence(e) {
  e.preventDefault();
  const formData = new FormData(form);
  if (!formData) {
    showToast("error", "fill the Form Data");
    return;
  }
  const formValue = Object.fromEntries(formData);
  formValue.id = Date.now();
  const oldFormData = JSON.parse(storageGetter("Expenses")) || [];

  if (oldFormData.length === 0) {
    document.querySelector("#availableStatus").remove();
  }

  const newFormData = [...oldFormData, formValue];
  storageSetter("Expenses", newFormData);
  renderTableExpense(formValue);
  renderTotalExpense(getTotalExpenses());
  form.reset();
  showToast("success", "Expense Added");
}

function renderTableExpense(formData) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td>${formData["expense-name"]}</td>
      <td style="color: #ff4c61">₹ ${formData["expense-amount"]}</td>
      <td>${formData["expense-date"]}</td>
      <td>${formData["expense-category"]}</td>
      <td id="del"></td>
      <td id="edit"></td>
    `;

  const delTd = tr.querySelector("#del");
  const editTd = tr.querySelector("#edit");

  const delBtn = document.createElement("button");
  delBtn.classList.add("delete-btn");
  delBtn.id = "delBtn";
  delBtn.textContent = "Delete";

  const editBtn = document.createElement("button");
  editBtn.classList.add("update-btn");
  editBtn.id = "editBtn";
  editBtn.textContent = "Update";

  delBtn.addEventListener("click", (e) =>
    handleDeleteExpense(e, formData["id"])
  );
  editBtn.addEventListener("click", (e) =>
    handleUpdateExpense(e, formData["id"])
  );
  delTd.append(delBtn);
  editTd.append(editBtn);
  expenseBody.appendChild(tr);
}

function getExpensesFromStorage() {
  const oldExpenses = JSON.parse(storageGetter("Expenses")) || [];
  expenseBody.innerHTML = "";
  if (oldExpenses.length === 0) {
    const tr = document.createElement("tr");
    tr.id = "availableStatus";
    tr.innerHTML = `
        <td colspan="6" style="text-align:center;">No expenses yet. Start by adding your first one!</td>
      `;
    expenseBody.appendChild(tr);
  }

  oldExpenses.forEach((expense) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${expense["expense-name"]}</td>
      <td style="color: #ff4c61">₹ ${expense["expense-amount"]}</td>
      <td>${expense["expense-date"]}</td>
      <td>${expense["expense-category"]}</td>
      <td id="del"></td>
      <td id="edit"></td>
    `;
    const delTd = tr.querySelector("#del");
    const editTd = tr.querySelector("#edit");
    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.id = "delBtn";
    delBtn.textContent = "Delete";
    const editBtn = document.createElement("button");
    editBtn.classList.add("update-btn");
    editBtn.id = "editBtn";
    editBtn.textContent = "Update";
    delTd.append(delBtn);
    editTd.append(editBtn);
    delBtn.addEventListener("click", (e) =>
      handleDeleteExpense(e, expense["id"])
    );
    editBtn.addEventListener("click", (e) =>
      handleUpdateExpense(e, expense["id"])
    );
    expenseBody.appendChild(tr);
  });
}

function handleDeleteExpense(e, id) {
  e.preventDefault();
  if (!id) {
    showToast("error", "Expense not find.");
    return;
  }
  e.target.parentElement.parentElement.remove();
  const oldFormData = JSON.parse(storageGetter("Expenses")) || [];

  if (oldFormData.length === 1) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td colspan="6" style="text-align:center;">No expenses yet. Start by adding your first one!</td>
      `;
    expenseBody.appendChild(tr);
  }

  const newFormData = oldFormData.filter((expense) => expense.id !== id);
  storageSetter("Expenses", newFormData);
  renderTotalExpense(getTotalExpenses());
  showToast("success", "Expense Deleted.");
}

function handleUpdateExpense(e, id) {
  e.preventDefault();
  trClick = e.target.parentElement.parentElement;
  const expenses = JSON.parse(storageGetter("Expenses")) || [];
  const toUpdate = expenses.find((exp) => exp.id === id);
  if (!toUpdate) return;

  upId.value = Number(toUpdate["id"]);
  upName.value = toUpdate["expense-name"];
  upAmount.value = toUpdate["expense-amount"];
  upDate.value = toUpdate["expense-date"];
  upCategory.value = toUpdate["expense-category"];
  updateModal.classList.add("show");
}

let trClick;

function handleUpdate(e) {
  e.preventDefault();

  const formData = new FormData();
  formData["expense-name"] = upName.value;
  formData["expense-amount"] = Number(upAmount.value);
  formData["expense-date"] = upDate.value;
  formData["expense-category"] = upCategory.value;
  const updatedId = Number(upId.value);

  const oldExpenses = JSON.parse(storageGetter("Expenses")) || [];

  const updatedData = oldExpenses.map((expense) => {
    if (Number(expense.id) === updatedId) {
      return { ...expense, ...formData };
    }
    return expense;
  });

  storageSetter("Expenses", updatedData);
  trClick.innerHTML = `
      <td>${formData["expense-name"]}</td>
      <td style="color: #ff4c61">₹ ${formData["expense-amount"]}</td>
      <td>${formData["expense-date"]}</td>
      <td>${formData["expense-category"]}</td>
      <td id="del"></td>
      <td id="edit"></td>
    `;

  const delTd = trClick.querySelector("#del");
  const editTd = trClick.querySelector("#edit");

  const delBtn = document.createElement("button");
  delBtn.classList.add("delete-btn");
  delBtn.id = "delBtn";
  delBtn.textContent = "Delete";

  const editBtn = document.createElement("button");
  editBtn.classList.add("update-btn");
  editBtn.id = "editBtn";
  editBtn.textContent = "Update";

  delBtn.addEventListener("click", (e) => handleDeleteExpense(e, updatedId));
  editBtn.addEventListener("click", (e) => handleUpdateExpense(e, updatedId));
  delTd.append(delBtn);
  editTd.append(editBtn);
  updateModal.classList.remove("show");
  renderTotalExpense(getTotalExpenses());
  showToast("success", "Expense Updated");
}

function getTotalExpenses() {
  const Expenses = JSON.parse(storageGetter("Expenses")) || [];

  if (Expenses.length === 0) return 0;

  return Expenses.reduce((acc, curr) => {
    return acc + Number(curr["expense-amount"]);
  }, 0);
}

function renderTotalExpense(totalAmountVal) {
  totalAmount.textContent = Number(totalAmountVal).toFixed(2);
}

function storageSetter(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function storageGetter(name) {
  return localStorage.getItem(name);
}
