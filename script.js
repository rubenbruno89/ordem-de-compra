function addItem() {
  const itemsList = document.getElementById('itemsList');
  const newItemContainer = document.createElement('div');
  newItemContainer.className = 'items-container';
  
  newItemContainer.innerHTML = `
    <div class="item-row">
      <input type="number" placeholder="Item" class="item-number" required min="1">
      <input type="text" placeholder="Discriminação" class="item-description" required>
      <input type="text" placeholder="Unid" class="item-unit" required>
      <input type="number" placeholder="Quant" class="item-quantity" required min="1">
      <input type="text" placeholder="Código" class="item-code" required>
    </div>
  `;
  
  itemsList.appendChild(newItemContainer);
}

function showPreview() {
  const modal = document.getElementById('previewModal');
  const previewDiv = document.getElementById('preview');
  
  // Get form values
  const date = document.getElementById('date').value;
  const requester = document.getElementById('requester').value;
  const department = document.getElementById('department').value;
  const observations = document.getElementById('observations').value;

  // Create preview HTML
  let previewHtml = `
    <div class="preview-header">
      <h2>Ordem de Compras Comprocard</h2>
    </div>
    <div class="preview-section">
      <p><strong>Data:</strong> ${date}</p>
      <p><strong>Solicitante:</strong> ${requester}</p>
      <p><strong>Departamento:</strong> ${department}</p>
    </div>
    <div class="preview-section">
      <h3>Itens</h3>
      <table class="preview-table">
        <thead>
          <tr>
            <th>ITEM</th>
            <th>DISCRIMINAÇÃO</th>
            <th>UNID</th>
            <th>QUANT</th>
            <th>CÓDIGO</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add items to preview
  document.querySelectorAll('.items-container').forEach((container) => {
    const number = container.querySelector('.item-number').value;
    const description = container.querySelector('.item-description').value;
    const unit = container.querySelector('.item-unit').value;
    const quantity = container.querySelector('.item-quantity').value;
    const code = container.querySelector('.item-code').value;

    previewHtml += `
      <tr>
        <td>${number}</td>
        <td>${description}</td>
        <td>${unit}</td>
        <td>${quantity}</td>
        <td>${code}</td>
      </tr>
    `;
  });

  previewHtml += `
        </tbody>
      </table>
    </div>
  `;

  if (observations) {
    previewHtml += `
      <div class="preview-section">
        <h3>Observações</h3>
        <p>${observations}</p>
      </div>
    `;
  }

  previewDiv.innerHTML = previewHtml;
  modal.style.display = "block";
}

function closePreview() {
  const modal = document.getElementById('previewModal');
  modal.style.display = "none";
}

// Close modal when clicking on X
document.querySelector('.close').onclick = closePreview;

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('previewModal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(16);
  doc.text('Ordem de Compras Comprocard', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  const date = document.getElementById('date').value;
  const requester = document.getElementById('requester').value;
  const department = document.getElementById('department').value;

  doc.text(`Data: ${date}`, 20, 40);
  doc.text(`Solicitante: ${requester}`, 20, 50);
  doc.text(`Departamento: ${department}`, 20, 60);

  // Itens
  doc.text('Itens:', 20, 80);
  let yPosition = 90;
  
  document.querySelectorAll('.items-container').forEach((container) => {
    const number = container.querySelector('.item-number').value;
    const description = container.querySelector('.item-description').value;
    const unit = container.querySelector('.item-unit').value;
    const quantity = container.querySelector('.item-quantity').value;
    const code = container.querySelector('.item-code').value;

    doc.text(`Item: ${number}`, 20, yPosition);
    doc.text(`Discriminação: ${description}`, 20, yPosition + 7);
    doc.text(`Unid: ${unit} | Quant: ${quantity} | Código: ${code}`, 20, yPosition + 14);
    
    yPosition += 25;
  });

  // Observações
  const observations = document.getElementById('observations').value;
  if (observations) {
    doc.text('Observações:', 20, yPosition);
    doc.text(observations, 20, yPosition + 10, { maxWidth: 170 });
  }

  doc.save('ordem-de-compras.pdf');
}