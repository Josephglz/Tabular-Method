var btnStepOne = document.getElementById('btnStepOne');
var contFirst = document.getElementById('ContFirstAnim');
var contentInputs = document.getElementById('contentInputs');
var contTruthTable = document.getElementById('ContTruthTable');
var contentEcuation = document.getElementById('contentEcuation');

numVariables.addEventListener('change', function () {
  contentInputs.classList.add('slide-left');
  if (document.getElementById('numVariables').value > 0 && document.getElementById('numVariables').value <= 6) {
    const truthTable = generateTruthTable(document.getElementById('numVariables').value);
    contTruthTableAnim();

    displayTruthTable(truthTable);
  } else {
    alert('Por favor seleccione un número de variables válido');
  }
});

btnStepOne.addEventListener('click', function () {
  if (document.getElementById('numVariables').value > 0 && document.getElementById('numVariables').value <= 6) {
    document.getElementById('equation_input').classList.remove('hidden');
    document.getElementById('equation_input').classList.add('flex');
    contNumBarAnim();
    contEcuationAnim();
    contentEcuation.setAttribute('style', 'transform: : tranlateX(50rem);');
    // const truthTable = generateTruthTable(document.getElementById('numVariables').value);

    // displayTruthTable(truthTable);
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
    headerCell.textContent = `Var${i + 1}`;
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

  contTruthTable.appendChild(tableElement);
}

function contTruthTableAnim() {

  contTruthTable.animate(
    [
      { opacity: 0 },
      { opacity: 1 }
    ],
    {
      duration: 1000,
      easing: 'ease-in-out',
      iterations: 1,
      direction: 'alternate',
      fill: 'forwards'
    }
  );
}

function contNumBarAnim() {

  contFirst.animate(
    [
      { transform: 'translateY(0rem)' },
      { transform: 'translateY(-6rem)' }
    ],
    {
      duration: 1000,
      easing: 'ease-in-out',
      iterations: 1,
      direction: 'alternate',
      fill: 'forwards'
    }
  );
}

function contEcuationAnim() {
  contentEcuation.animate(
    [
      {transform: 'translate(-12.05rem, 0rem)', opacity: 0 },
      {transform: 'translate(-12.05rem , -17rem)', opacity: 1}
    ],
    {
      duration: 1000,
      easing: 'ease-in-out',
      iterations: 1,
      direction: 'alternate',
      fill: 'forwards'
    }
  );
}