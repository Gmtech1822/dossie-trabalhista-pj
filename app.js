window.addEventListener("DOMContentLoaded", function() {
    carregarRegistros();
});

function carregarRegistros() {
    const listaDiv = document.getElementById("listaUsuarios");
    const dadosSalvos = localStorage.getItem("dossie_trabalhista_usuarios");
    
    if (!dadosSalvos) {
        listaDiv.innerHTML = "Nenhum vínculo salvo ainda. Cadastre o primeiro acima!";
        return;
    }

    try {
        const data = JSON.parse(dadosSalvos);

        if (!data || data.length === 0) {
            listaDiv.innerHTML = "Nenhum vínculo salvo ainda.";
            return;
        }

        let html = "";
        for (let i = 0; i < data.length; i++) {
            let u = data[i];
            let provas = u.provas || [];

            html += "<div style='border: 1px solid #cbd5e1; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: #f8fafc;'>";
            html += "<h3 style='margin-top: 0; color: #1e293b;'>🏢 " + (u.empresa || 'Empresa N/A') + "</h3>";
            html += "<strong>Profissional:</strong> " + (u.nome_completo || 'N/A') + "<br>";
            html += "<strong>Documento/CNPJ:</strong> " + (u.documento || 'N/A') + "<br>";
            html += "<strong>Salário Base:</strong> R$ " + (u.salario || 0) + "<br><hr style='border:0; border-top:1px solid #e2e8f0; margin: 10px 0;'>";
            
            // Seção de Provas
            html += "<h4 style='margin: 5px 0; color: #0284c7;'>📁 Provas e Evidências Documentadas:</h4>";
            
            if (provas.length === 0) {
                html += "<p style='font-size: 13px; color: #64748b; font-style: italic;'>Nenhuma prova registrada para este vínculo ainda.</p>";
            } else {
                html += "<ul style='padding-left: 20px; font-size: 14px; margin-bottom: 10px;'>";
                for (let j = 0; j < provas.length; j++) {
                    html += "<li style='margin-bottom: 6px;'>" + provas[j] + "</li>";
                }
                html += "</ul>";
            }

            // Formulário rápido para adicionar prova neste registro específico
            html += "<div style='display: flex; gap: 5px; margin-top: 10px;'>";
            html += "<input type='text' id='nova_prova_" + u.id + "' placeholder='Ex: Print de chat exigindo horário fixo...' style='flex: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;'>";
            html += "<button onclick='adicionarProva(" + u.id + ")' style='background: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;'>Adicionar Prova</button>";
            html += "</div>";

            html += "</div>";
        }
        listaDiv.innerHTML = html;
    } catch (e) {
        listaDiv.innerHTML = "Erro ao carregar os registros locais.";
    }
}

function salvarDados() {
    const nome = document.getElementById("nome_completo").value;
    const documento = document.getElementById("documento").value;
    const empresa = document.getElementById("empresa").value;
    const salario = parseFloat(document.getElementById("salario").value) || 0;

    if (!nome || !documento || !empresa) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const novoRegistro = {
        id: Date.now(),
        nome_completo: nome,
        documento: documento,
        empresa: empresa,
        salario: salario,
        provas: [] // Inicializa a lista de provas vazia
    };

    let dadosExistentes = [];
    const salvo = localStorage.getItem("dossie_trabalhista_usuarios");
    if (salvo) {
        try {
            dadosExistentes = JSON.parse(salvo);
        } catch (err) {
            dadosExistentes = [];
        }
    }

    dadosExistentes.unshift(novoRegistro);
    localStorage.setItem("dossie_trabalhista_usuarios", JSON.stringify(dadosExistentes));

    alert("Vínculo salvo com sucesso no dispositivo!");

    document.getElementById("nome_completo").value = "";
    document.getElementById("documento").value = "";
    document.getElementById("empresa").value = "";
    document.getElementById("salario").value = "";
    
    carregarRegistros();
}

function adicionarProva(idRegistro) {
    const inputProva = document.getElementById("nova_prova_" + idRegistro);
    const textoProva = inputProva.value.trim();

    if (!textoProva) {
        alert("Digite a descrição da prova antes de adicionar.");
        return;
    }

    const salvo = localStorage.getItem("dossie_trabalhista_usuarios");
    if (!salvo) return;

    try {
        let dadosExistentes = JSON.parse(salvo);
        
        // Encontra o registro correspondente e adiciona a prova
        for (let i = 0; i < dadosExistentes.length; i++) {
            if (dadosExistentes[i].id === idRegistro) {
                if (!dadosExistentes[i].provas) {
                    dadosExistentes[i].provas = [];
                }
                dadosExistentes[i].provas.push(textoProva);
                break;
            }
        }

        localStorage.setItem("dossie_trabalhista_usuarios", JSON.stringify(dadosExistentes));
        carregarRegistros();
    } catch (e) {
        alert("Erro ao salvar a prova.");
    }
}
