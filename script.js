const API_URL = "api.php";

async function getAgendamentos() {
  const response = await fetch(API_URL);
  return response.json();
}


async function saveAgendamento(cliente, dataHora, servico) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cliente, data_hora: dataHora, servico }),
  });
  return response.json();
}


async function removerAgendamento(id) {
  const response = await fetch(API_URL, {
    method: "DELETE",
    body: new URLSearchParams({ id }),
  });
  return response.json();
}


async function atualizarLista() {
  const lista = document.getElementById("lista-agendamentos");
  lista.innerHTML = "";

  const agendamentos = await getAgendamentos();

  if (agendamentos.length === 0) {
    lista.innerHTML = "<li>Não há agendamentos.</li>";
    return;
  }

  agendamentos.forEach((ag) => {
    lista.innerHTML += `
      <li>
        ${formatarDataHora(ag.data_hora)} - ${ag.cliente} (${ag.servico})
        <button onclick="removerAgendamento(${
          ag.id
        }).then(atualizarLista)">🗑️</button>
      </li>
    `;
  });
}


async function agendar() {
  const cliente = document.getElementById("cliente").value;
  const data = document.getElementById("data").value;
  const servico = document.getElementById("servico").value;
  const horario = document.getElementById("horario").value;

  if (!cliente || !data || !horario || !servico) {
    alert("Preencha todos os campos!");
    return;
  }

  const dataHora = `${data}T${horario}`;


  const agendamentos = await getAgendamentos();
  const novoAgendamentoData = new Date(dataHora);

  for (let agendamento of agendamentos) {
    const agendamentoData = new Date(agendamento.data_hora);
    const diferenca = Math.abs(novoAgendamentoData - agendamentoData);

    if (diferenca < 7200000) {
      alert(
        "Já existe um agendamento próximo desse horário (menos de 2 horas de diferença)!"
      );
      return;
    }
  }

  const sucesso = await saveAgendamento(cliente, dataHora, servico);
  if (sucesso) {
    alert("Agendamento realizado com sucesso!");
    atualizarLista();
  } else {
    alert("Erro ao salvar o agendamento.");
  }
}

function formatarDataHora(dataHora) {
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const [data, hora] = dataHora.split("T");
  const [ano, mes, dia] = data.split("-");
  const [horas, minutos] = hora.split(":");

  return `${dia} ${meses[parseInt(mes) - 1]} ${ano} - ${horas}:${minutos}`;
}


document.addEventListener("DOMContentLoaded", atualizarLista);
