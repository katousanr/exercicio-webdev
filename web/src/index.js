import backendTest from './backend-test.js';
//import selecao from "./worldcup.js";

export default element => {
    element.textContent = 'Hello world';
}

var selecoes = null;

export async function updateSelecao(id) {

    var nome = document.getElementById("cs_nome").value;
    var grupo = document.getElementById("cs_grupo").value;
    var continente = document.getElementById("cs_continente").value ;

    if(!nome || !grupo || !continente) {
        alert("todos os campos devem ser preenchidos");
        return;
    }

    var data = new FormData();
    data.append( "nome",  nome );
    data.append( "grupo",  grupo );
    data.append( "continente",  continente );
    data.append("idselecao" , id);
    const response = await (await fetch("/backend/index.php", {
        method: "PUT",body : data } ) ).json();

    if(response['error']['code'] !== 0 )
        alert(response['error']['msg']);

    mostrarTodasSelecoes();
}
export function selecaoBotaoEditar(id)
{
    document.getElementById('formSelecao').style.display='block';

    document.getElementById('formSelecao').style.display = 'block';
    selecoes.forEach(function (item,index) {
        if(item['idselecao'] == id)
        {
            document.getElementById("cs_nome").value = item['nome'];
            document.getElementById("cs_grupo").value = item['grupo'];
            document.getElementById("cs_continente").value = item['continente'];

        }
    });
    document.getElementById('btnSalvar').onclick = function() {updateSelecao(id)};
    procurarSelecao();
}
export async function criarSelecao(nome,grupo,continente)
{

$error = "";
    if(!nome || !grupo || !continente) {
        alert("todos os campos devem ser preenchidos");
        return;
    }

    var data = new FormData();
    data.append( "nome",  nome );
    data.append( "grupo",  grupo );
    data.append( "continente",  continente );
    const response = await (await fetch("/backend/index.php", {
        method: "POST",body : data } ) ).json();

    if(response['error']['code'] !== 0 )
        alert(response['error']['msg']);

    return response['content'];
}
export function selecaoBotaoDeletar(id) {
    deletar(id);
    mostrarTodasSelecoes()
}

export async function deletar(id)
{
    var url = "/backend/index.php?id="+id;

    const response = await (await fetch(url, {
    method: "DELETE" } ) ).json();


    if(response['error']['code'] !== 0)
        alert("erro");
}
export function atualizaTabela(json)
{
    var selecoes = json;
    var tabela = document.getElementById("tableContent");
    tabela.innerHTML = "";

    tabela.innerHTML ="<tr><td>ID</td><td>Nome</td><td>Continente</td><td>Grupo</td></tr>";

    selecoes.forEach(function (item,index) {

        tabela.innerHTML = tabela.innerHTML + "<tr id='selRow_"+item['idselecao']+"'><td>"+item['idselecao']+"</td>"+
        "<td>"+item['nome']+"</td>"+
        "<td>"+item['continente']+"</td>"+
        "<td>"+item['grupo']+"</td>"+
        "<td><button onclick='app.selecaoBotaoEditar("+item['idselecao']+")'>editar</button>"+
            "<button onclick='app.selecaoBotaoDeletar("+item['idselecao']+")'>deletar</button></td>"+"</td></tr>";
    });

}
export async function procurarSelecao(nome)
{
    var url = "/backend/index.php";

    if(nome)
        url = url+"?nome="+nome;


    const response = await (await fetch(url, {
    method: "GET" } ) ).json();


    if(response['error']['code'] !== 0)
        alert("erro");

    selecoes = response['content'];

    return response['content'];
}
export function mostrarTodasSelecoes()
{
    var selecoes = await procurarSelecao();
    var $error = "";
    atualizaTabela(selecoes)
}
export function pesquisar()
{
    var nome = document.getElementById("textoPesquisaNome").value;
    var selecoes = await procurarSelecao(nome);
    var $error = "";
    atualizaTabela(selecoes)
}
export function criar() {
    document.getElementById('formSelecao').style.display='block';
    document.getElementById('btnSalvar').onclick = salvarCadastro;

}
export function salvarCadastro()
{

    var nome = document.getElementById("cs_nome").value;
    var grupo = document.getElementById("cs_grupo").value;
    var continente = document.getElementById("cs_continente").value;

    var result = await criarSelecao(nome,grupo,continente);
    var $error = "";
    document.getElementById('formSelecao').style.display='none';
    atualizaTabela(result);
}