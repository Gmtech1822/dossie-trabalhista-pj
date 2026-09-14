const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdWNjZ3JyeWFteXRhemdnc3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzOTI4MTIsImV4cCI6MjEwNDk2ODgxMn0.XbhN19ygrSRGuz7YvdjAeWJSYA5FRkqPIQH92w473ME';

window.addEventListener("DOMContentLoaded", function() {
    carregarRegistros();
});

async function carregarRegistros() {
    const listaDiv = document.getElementById("listaUsuarios");
    listaDiv.innerHTML = "Carregando registros...";

    try {
        const url = `${SUPABASE_URL}/rest/v1/usuarios?select=*&order=id.desc`;
        const resposta = await window.fetch(url, {
            method: 'GET',
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!resposta.ok) {
            listaDiv.innerHTML = "Erro ao carregar dados do servidor.";
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
        listaDiv.innerHTML = "Erro de rede ao conectar com o banco.";
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
        const resposta = await window.fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
            method: 'POST',
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
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
            alert("Erro ao salvar os dados.");
            return;
        }

        alert("Vínculo salvo com sucesso na nuvem!");
        
        document.getElementById("nome_completo").value = "";
        document.getElementById("documento").value = "";
        document.getElementById("empresa").value = "";
        document.getElementById("salario").value = "";
        
        carregarRegistros();
    } catch (e) {
        alert("Erro de conexão ao salvar.");
    }
}
