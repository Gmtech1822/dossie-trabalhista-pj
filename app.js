const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CITnEYD84t4G3B-4kusdBw_17ea18b9';

let supabase = null;

// Inicializa assim que a página carregar
window.addEventListener("DOMContentLoaded", function() {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        carregarDados();
    } else {
        const listaDiv = document.getElementById("listaUsuarios");
        if (listaDiv) listaDiv.innerHTML = "Erro: A biblioteca do Supabase não carregou.";
    }
});

async function carregarDados() {
    const listaDiv = document.getElementById("listaUsuarios");
    if (!listaDiv) return;
    
    listaDiv.innerHTML = "Carregando registros...";

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            listaDiv.innerHTML = "Erro ao carregar: " + error.message;
            return;
        }

        if (!data || data.length === 0) {
            listaDiv.innerHTML = "Nenhum vínculo salvo na nuvem ainda. Preencha o formulário acima e clique em salvar.";
            return;
        }

        let html = "";
        for (let i = 0; i < data.length; i++) {
            let u = data[i];
            html += "<div style='border: 1px solid #ccc; padding: 10px; margin-bottom: 8px; border-radius: 4px; background: #fff;'>";
            html += "<strong>Nome:</strong> " + (u.nome_completo || '') + "<br>";
            html += "<strong>Documento:</strong> " + (u.documento || '') + "<br>";
            html += "<strong>Empresa:</strong> " + (u.empresa || '') + "<br>";
            html += "<strong>Salário:</strong> R$ " + (u.salario || 0);
            html += "</div>";
        }
        listaDiv.innerHTML = html;
    } catch (err) {
        listaDiv.innerHTML = "Erro de conexão ao buscar dados.";
    }
}

async function salvarDados() {
    if (!supabase) {
        alert("Erro: Supabase não inicializado.");
        return;
    }

    const nome = document.getElementById("nome_completo").value;
    const documento = document.getElementById("documento").value;
    const empresa = document.getElementById("empresa").value;
    const salario = parseFloat(document.getElementById("salario").value) || 0;

    if (!nome || !documento || !empresa) {
        alert("Por favor, preencha todos os campos obrigatórios.");
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
            alert("Erro do Supabase ao salvar: " + error.message);
            return;
        }

        alert("Vínculo salvo com sucesso na nuvem!");
        
        // Limpa os campos manualmente
        document.getElementById("nome_completo").value = "";
        document.getElementById("documento").value = "";
        document.getElementById("empresa").value = "";
        document.getElementById("salario").value = "";
        
        // Atualiza a lista na tela
        carregarDados();
    } catch (err) {
        alert("Erro inesperado: " + err.message);
    }
}
