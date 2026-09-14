window.addEventListener("DOMContentLoaded", function() {
    carregarRegistros();
});

function carregarRegistros() {
    const listaDiv = document.getElementById("listaUsuarios");
    
    // Recupera os dados salvos localmente no celular
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
            html += "<div style='border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 10px; border-radius: 6px; background: #f8fafc;'>";
            html += "<strong>Nome:</strong> " + (u.nome_completo || 'N/A') + "<br>";
            html += "<strong>Documento:</strong> " + (u.documento || 'N/A') + "<br>";
            html += "<strong>Empresa:</strong> " + (u.empresa || 'N/A') + "<br>";
            html += "<strong>Salário:</strong> R$ " + (u.salario || 0);
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

    // Cria o novo objeto de registro
    const novoRegistro = {
        id: Date.now(),
        nome_completo: nome,
        documento: documento,
        empresa: empresa,
        salario: salario
    };

    // Puxa o que já tem salvo ou cria uma lista nova
    let dadosExistentes = [];
    const salvo = localStorage.getItem("dossie_trabalhista_usuarios");
    if (salvo) {
        try {
            dadosExistentes = JSON.parse(salvo);
        } catch (err) {
            dadosExistentes = [];
        }
    }

    // Adiciona o novo no início da lista
    dadosExistentes.unshift(novoRegistro);

    // Salva de volta no navegador do celular
    localStorage.setItem("dossie_trabalhista_usuarios", JSON.stringify(dadosExistentes));

    alert("Vínculo salvo com sucesso no dispositivo!");

    // Limpa os campos
    document.getElementById("nome_completo").value = "";
    document.getElementById("documento").value = "";
    document.getElementById("empresa").value = "";
    document.getElementById("salario").value = "";

    carregarRegistros();
}
