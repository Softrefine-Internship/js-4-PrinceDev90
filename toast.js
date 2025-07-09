function showToast(type, message) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  // Icons: success = CheckCircle, error = XCircle
  const iconClass =
    type === "success" ? "ph-fill ph-check-circle" : "ph-fill ph-x-circle";

  toast.innerHTML = `
    <p class="icon"><i class="${iconClass}"></i></p>
    <p class="message bold">${message}</p>
    <button class="close-btn">X</button>
  `;

  // Append to DOM
  container.appendChild(toast);

  // Close on click
  toast.querySelector(".close-btn").addEventListener("click", () => {
    toast.remove();
  });

  // Auto remove after 3s
  setTimeout(() => {
    toast.remove();
  }, 3000); 
}