const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdWNjZ3JyeWFteXRhemdnc3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzOTI4MTIsImV4cCI6MjEwNDk2ODgxMn0.XbhN19ygrSRGuz7YvdjAeWJSYA5FRkqPIQH92w473ME';

window.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        carregarRegistros();
    }, 500);
});

async function carregarRegistros() {
    const listaDiv = document.getElementById("listaUsuarios");
    listaDiv.innerHTML = "Carregando registros da nuvem...";

    if (!window.supabase) {
        listaDiv.innerHTML = "Erro: A biblioteca do Supabase não carregou. Verifique sua conexão.";
        return;
    }

    try {
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { data, error } = await supabaseClient
            .from('usuarios')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            listaDiv.innerHTML = "Erro ao carregar: " + error.message;
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
        listaDiv.innerHTML = "Erro de conexão ao buscar dados. Verifique o sinal ou bloqueio de rede.";
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
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { error } = await supabaseClient
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
        
        carregarRegistros();
    } catch (e) {
        alert("Erro de conexão ao salvar.");
    }
}
