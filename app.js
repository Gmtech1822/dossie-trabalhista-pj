// Configuração do Supabase
const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CITnEYD84t4G3B-4kusdBw_17ea18b9';

// Inicializa o cliente do Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
    buscarUsuarios();

    const formulario = document.querySelector("form");
    if (formulario) {
        formulario.addEventListener("submit", async (e) => {
            e.preventDefault();
            await salvarUsuario();
        });
    }
});

// Função para buscar e listar os registros salvos
async function buscarUsuarios() {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error("Erro ao carregar dados:", error.message);
            mostrarMensagem("Não foi possível carregar os dados da nuvem.", "erro");
            return;
        }

        renderizarLista(data);
    } catch (err) {
        console.error("Erro inesperado ao buscar:", err);
    }
}

// Função para salvar um novo registro
async function salvarUsuario() {
    // Ajuste os IDs dos inputs conforme o seu HTML atual se necessário
    const nomeInput = document.getElementById("nome_completo") || document.querySelector("input[name='nome_completo']") || document.querySelector("input");
    const documentoInput = document.getElementById("documento") || document.querySelector("input[name='documento']");
    const empresaInput = document.getElementById("empresa") || document.querySelector("input[name='empresa']");
    const salarioInput = document.getElementById("salario") || document.querySelector("input[name='salario']");

    const novoUsuario = {
        nome_completo: nomeInput ? nomeInput.value : "",
        documento: documentoInput ? documentoInput.value : "",
        empresa: empresaInput ? empresaInput.value : "",
        salario: salarioInput ? parseFloat(salarioInput.value) || 0 : 0
    };

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([novoUsuario]);

        if (error) {
            console.error("Erro ao salvar:", error.message);
            alert("Erro ao processar o salvamento: " + error.message);
            return;
        }

        alert("Vínculo salvo com sucesso!");
        formulario.reset();
        buscarUsuarios();
    } catch (err) {
        console.error("Erro inesperado ao salvar:", err);
        alert("Erro ao processar o salvamento.");
    }
}

// Função para exibir os dados na tela (caso exista um container para isso)
function renderizarLista(usuarios) {
    const container = document.getElementById("vinculos-salvos") || document.querySelector(".vinculos-lista");
    if (!container) return;

    if (!usuarios || usuarios.length === 0) {
        container.innerHTML = "<p>Nenhum vínculo salvo na nuvem ainda.</p>";
        return;
    }

    container.innerHTML = usuarios.map(u => `
        <div class="vinculo-card" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
            <p><strong>Nome:</strong> ${u.nome_completo}</p>
            <p><strong>Documento:</strong> ${u.documento}</p>
            <p><strong>Empresa:</strong> ${u.empresa}</p>
            <p><strong>Salário:</strong> R$ ${u.salario}</p>
        </div>
    `).join('');
}

function mostrarMensagem(mensagem, tipo) {
    const container = document.getElementById("vinculos-salvos") || document.querySelector(".vinculos-lista");
    if (container && tipo === "erro") {
        container.innerHTML = `<p style="color: red;">${mensagem}</p>`;
    }
}
