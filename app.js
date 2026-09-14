const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CITnEYD84t4G3B-4kusdBw_17ea18b9';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", function() {
    carregarDados();

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
    if (listaDiv) listaDiv.innerHTML = "Carregando registros...";

    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        if (listaDiv) listaDiv.innerHTML = "Erro ao carregar registros.";
        return;
    }

    if (!data || data.length === 0) {
        if (listaDiv) listaDiv.innerHTML = "Nenhum vínculo salvo na nuvem ainda.";
        return;
    }

    let html = "";
    for (let i = 0; i < data.length; i++) {
        let u = data[i];
        html += "<div style='border: 1px solid #ccc; padding: 10px; margin-bottom: 8px; border-radius: 4px; background: #fff;'>";
        html += "<strong>Nome:</strong> " + u.nome_completo + "<br>";
        html += "<strong>Documento:</strong> " + u.documento + "<br>";
        html += "<strong>Empresa:</strong> " + u.empresa + "<br>";
        html += "<strong>Salário:</strong> R$ " + u.salario;
        html += "</div>";
    }
    if (listaDiv) listaDiv.innerHTML = html;
}

async function salvarDados() {
    const nome = document.getElementById("nome_completo").value;
    const documento = document.getElementById("documento").value;
    const empresa = document.getElementById("empresa").value;
    const salario = parseFloat(document.getElementById("salario").value) || 0;

    const { error } = await supabase
        .from('usuarios')
        .insert([{ nome_completo: nome, documento: documento, empresa: empresa, salario: salario }]);

    if (error) {
        alert("Erro ao salvar: " + error.message);
        return;
    }

    alert("Vínculo salvo com sucesso!");
    document.querySelector("form").reset();
    carregarDados();
}
