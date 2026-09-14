const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CITnEYD84t4G3B-4kusdBw_17ea18b9';

let supabase = null;

window.addEventListener("DOMContentLoaded", function() {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    carregarDadosDireto();
});

// Função de busca blindada usando fetch direto para evitar travamentos da biblioteca
async function carregarDadosDireto() {
    const listaDiv = document.getElementById("listaUsuarios");
    if (!listaDiv) return;
    
    listaDiv.innerHTML = "Buscando registros na nuvem...";

    try {
        const resposta = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?select=*&order=id.desc`, {
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!resposta.ok) {
            listaDiv.innerHTML = "Erro HTTP ao carregar: " + resposta.status;
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
            html += "<strong>Nome:</strong> " + (u.nome_completo || 'Não informado') + "<br>";
            html += "<strong>Documento:</strong> " + (u.documento || 'Não informado') + "<br>";
            html += "<strong>Empresa:</strong> " + (u.empresa || 'Não informada') + "<br>";
            html += "<strong>Salário:</strong> R$ " + (u.salario || 0);
            html += "</div>";
        }
        listaDiv.innerHTML = html;
    } catch (err) {
        listaDiv.innerHTML = "Erro de conexão: " + err.message;
    }
}

async function salvarDados() {
    const nome = document.getElementById("nome_completo").value;
    const documento = document.getElementById("documento").value;
    const empresa = document.getElementById("empresa").value;
    const salario = parseFloat(document.getElementById("salario").value) || 0;

    if (!nome || !documento || !empresa) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (!supabase) {
        alert("Erro: Supabase não inicializado.");
        return;
    }

    try {
        const { error } = await supabase
            .from('usuarios')
            .insert([{ 
                nome_completo: nome, 
                documento: documento, 
                empresa: empresa, 
                salario: salario 
            }]);

        if (error) {
            alert("Erro ao salvar: " + error.message);
            return;
        }

        alert("Vínculo salvo com sucesso na nuvem!");
        
        document.getElementById("nome_completo").value = "";
        document.getElementById("documento").value = "";
        document.getElementById("empresa").value = "";
        document.getElementById("salario").value = "";
        
        carregarDadosDireto();
    } catch (err) {
        alert("Erro inesperado ao salvar: " + err.message);
    }
}
