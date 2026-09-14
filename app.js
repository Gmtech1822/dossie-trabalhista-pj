// Removendo qualquer risco de caracteres invisíveis
const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CITnEYD84t4G3B-4kusdBw_17ea18b9';

window.addEventListener("DOMContentLoaded", function() {
    carregarRegistrosSeguro();
});

async function carregarRegistrosSeguro() {
    const listaDiv = document.getElementById("listaUsuarios");
    listaDiv.innerHTML = "Tentando conectar ao banco...";

    try {
        const urlBusca = SUPABASE_URL + "/rest/v1/usuarios?select=*";
        
        const resposta = await fetch(urlBusca, {
            method: 'GET',
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": "Bearer " + SUPABASE_ANON_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            listaDiv.innerHTML = "Erro HTTP do servidor: " + resposta.status;
            return;
        }

        const data = await resposta.json();

        if (!data || data.length === 0) {
            listaDiv.innerHTML = "Nenhum vínculo salvo na nuvem ainda.";
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

    } catch (err) {
        listaDiv.innerHTML = "Falha de rede ao acessar o Supabase. Verifique se o projeto está ativo no painel oficial.";
    }
}

async function salvarDados() {
    const nome = document.getElementById("nome_completo").value;
    const documento = document.getElementById("documento").value;
    const empresa = document.getElementById("empresa").value;
    const salario = parseFloat(document.getElementById("salario").value) || 0;

    if (!nome || !documento || !empresa) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    try {
        const resposta = await fetch(SUPABASE_URL + "/rest/v1/usuarios", {
            method: 'POST',
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": "Bearer " + SUPABASE_ANON_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                nome_completo: nome,
                documento: documento,
                empresa: empresa,
                salario: salario
            })
        });

        if (!resposta.ok) {
            alert("Erro ao salvar no banco.");
            return;
        }

        alert("Vínculo salvo com sucesso na nuvem!");
        
        document.getElementById("nome_completo").value = "";
        document.getElementById("documento").value = "";
        document.getElementById("empresa").value = "";
        document.getElementById("salario").value = "";
        
        carregarRegistrosSeguro();
    } catch (e) {
        alert("Erro de conexão ao salvar.");
    }
}
