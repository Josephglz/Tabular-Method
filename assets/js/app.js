var btnStepOne = document.getElementById('btnStepOne');
btnStepOne.addEventListener('click', function () {
    if (document.getElementById('numVariables').value > 0 && document.getElementById('numVariables').value <= 6) {
        document.getElementById('equation_input').classList.remove('hidden');

        const truthTable = generateTruthTable(document.getElementById('numVariables').value);
        
        displayTruthTable(truthTable);
    } else {
        alert('Por favor seleccione un número de variables válido');
    }
});

function generateTruthTable(numVariables) {
    const numCombinations = Math.pow(2, numVariables);
    const truthTable = [];
  
    for (let i = 0; i < numCombinations; i++) {
      const row = [];
  
      for (let j = 0; j < numVariables; j++) {
        const variableValue = (i & Math.pow(2, numVariables - j - 1)) ? 1 : 0;
        row.push(variableValue);
      }
  
      truthTable.push(row);
    }
  
    return truthTable;
  }
  
  function displayTruthTable(truthTable) {
    const tableElement = document.createElement('table');
  
    // Crear encabezado
    const headerRow = document.createElement('tr');
    for (let i = 0; i < truthTable[0].length; i++) {
      const headerCell = document.createElement('th');
      headerCell.textContent = `Var${i+1}`;
      headerRow.appendChild(headerCell);
    }
    tableElement.appendChild(headerRow);
  
    // Crear filas de datos
    for (let i = 0; i < truthTable.length; i++) {
      const dataRow = document.createElement('tr');
      for (let j = 0; j < truthTable[i].length; j++) {
        const dataCell = document.createElement('td');
        dataCell.textContent = truthTable[i][j];
        dataRow.appendChild(dataCell);
      }
      tableElement.appendChild(dataRow);
    }
  
    document.body.appendChild(tableElement);
  }
  