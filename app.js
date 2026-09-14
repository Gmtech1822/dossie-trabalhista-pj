const SUPABASE_URL = 'https://uquccgrryamyiazggsqh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CITnEYD84t4G3B-4kusdBw_17ea18b9';

document.addEventListener("DOMContentLoaded", () => {
    buscarUsuarios();
});

async function buscarUsuarios() {
    const containerLista = document.getElementById("listaUsuarios");
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            if (data.length === 0) {
                containerLista.innerHTML = '<p style="color: #718093; font-style: italic;">Nenhum vínculo cadastrado ainda.</p>';
                return;
            }

            containerLista.innerHTML = '';
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-nome">${item.nome_completo}</div>
                    <div class="card-detalhe">Tomadora: <strong>${item.empresa_tomadora_nome}</strong></div>
                    <div class="card-detalhe">CPF/CNPJ: ${item.documento_cpf_cnpj}</div>
                    <div class="card-salario">R$ ${Number(item.salario_base_mensal).toFixed(2)}</div>
                    <button class="btn-dossie" onclick='gerarDossie(${JSON.stringify(item)})'>Gerar Dossiê Formal</button>
                `;
                containerLista.appendChild(card);
            });
        } else {
            throw new Error('Erro ao carregar registros.');
        }
    } catch (error) {
        containerLista.innerHTML = '<p style="color: #ff4757;">Não foi possível carregar os dados da nuvem.</p>';
    }
}

async function salvarPerfil() {
    const nome = document.getElementById("nome").value;
    const cpfCnpj = document.getElementById("cpfCnpj").value;
    const empresa = document.getElementById("empresa").value;
    const salarioBase = document.getElementById("salarioBase").value;

    if (!nome || !cpfCnpj || !empresa || !salarioBase) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const salarioConvertido = parseFloat(salarioBase.replace(',', '.'));

        const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                nome_completo: nome,
                documento_cpf_cnpj: cpfCnpj,
                empresa_tomadora_nome: empresa,
                salario_base_mensal: salarioConvertido
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar no servidor.');
        }

        alert('Vínculo salvo com segurança!');
        
        document.getElementById("nome").value = '';
        document.getElementById("cpfCnpj").value = '';
        document.getElementById("empresa").value = '';
        document.getElementById("salarioBase").value = '';

        buscarUsuarios();

    } catch (error) {
        alert('Erro ao processar o salvamento.');
    }
}

async function gerarDossie(item) {
    const textoDossie = 
        `📋 DOSSIÊ TRABALHISTA PJ - REGISTRO DE VÍNCULO\n\n` +
        `• Profissional: ${item.nome_completo}\n` +
        `• Empresa Tomadora: ${item.empresa_tomadora_nome}\n` +
        `• CPF/CNPJ Contratante: ${item.documento_cpf_cnpj}\n` +
        `• Salário Base Mensal: R$ ${Number(item.salario_base_mensal).toFixed(2)}\n\n` +
        `Documento gerado digitalmente para fins de comprovação e blindagem de vínculo trabalhista.`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Dossiê Trabalhista PJ',
                text: textoDossie,
            });
        } catch (err) {
            console.log('Compartilhamento cancelado.');
        }
    } else {
        navigator.clipboard.writeText(textoDossie);
        alert('Dossiê copiado para a área de transferência!');
    }
    }
      
