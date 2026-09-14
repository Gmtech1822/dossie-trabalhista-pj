const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CITnEYD84t4G3B-4kusdBw_17ea18b9';

let supabaseClient = null;

window.addEventListener("DOMContentLoaded", async function() {
    const listaDiv = document.getElementById("listaUsuarios");
    
    try {
        if (!window.supabase) {
            listaDiv.innerHTML = "ERRO: A biblioteca do Supabase não carregou.";
            return;
        }

        // Inicializa o cliente padrão do Supabase
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        listaDiv.innerHTML = "Conectado à nuvem. Carregando...";

        await carregarRegistros();
    } catch (e) {
        listaDiv.innerHTML = "Erro ao iniciar: " + e.message;
    }
});

async function carregarRegistros() {
    const listaDiv = document.getElementById("listaUsuarios");
    
    try {
        // Usando a API nativa do cliente Supabase em vez de fetch manual
        const { data, error } = await supabaseClient
            .from('usuarios')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            listaDiv.innerHTML = "Erro do banco: " + error.message;
            return;
        }

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
        listaDiv.innerHTML = "Erro de conexão: Verifique sua internet.";
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

    if (!supabaseClient) {
        alert("Supabase não inicializado.");
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('usuarios')
            .insert([{ 
                nome_completo: nome, 
                documento: documento, 
                empresa: empresa, 
                salario: salario 
            }]);

        if (error) {
            alert("Erro ao salvar no Supabase: " + error.message);
            return;
        }

        alert("Vínculo salvo com sucesso!");
        
        document.getElementById("nome_completo").value = "";
        document.getElementById("documento").value = "";
        document.getElementById("empresa").value = "";
        document.getElementById("salario").value = "";
        
        carregarRegistros();
    } catch (e) {
        alert("Erro ao salvar: " + e.message);
    }
}
