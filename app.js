const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CITnEYD84t4G3B-4kusdBw_17ea18b9';

let supabase = null;

window.addEventListener("DOMContentLoaded", function() {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        carregarDados();
    } else {
        const listaDiv = document.getElementById("listaUsuarios");
        if (listaDiv) listaDiv.innerHTML = "Erro: A biblioteca do Supabase não carregou.";
    }

    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            await salvarDados();
        });
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
        alert("Erro crítico: Supabase não inicializado.");
        return;
    }

    const nomeInput = document.getElementById("nome_completo");
    const documentoInput = document.getElementById("documento");
    const empresaInput = document.getElementById("empresa");
    const salarioInput = document.getElementById("salario");

    const nome = nomeInput ? nomeInput.value : "";
    const documento = documentoInput ? documentoInput.value : "";
    const empresa = empresaInput ? empresaInput.value : "";
    const salario = salarioInput ? parseFloat(salarioInput.value) || 0 : 0;

    // Alerta de teste para garantir que o botão foi clicado
    console.log("Tentando salvar:", { nome, documento, empresa, salario });

    try {
        const { data, error } = await supabase
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
        
        const form = document.querySelector("form");
        if (form) form.reset();
        
        carregarDados();
    } catch (err) {
        alert("Erro inesperado na requisição: " + err.message);
    }
}
