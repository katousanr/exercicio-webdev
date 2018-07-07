var app = (function (exports) {
    'use strict';

    //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tlbmQtdGVzdC5qcyhvcmlnaW5hbCkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsa0JBQWU7O0lBQ00sT0FBTSxLQUFBLENBQU0sc0JBQVo7O1lBQVgsV0FBVztZQUNKLE9BQU0sUUFBQSxDQUFTLElBQVQsR0FBTjs7b0JBQVAsT0FBTztvQkFFYixlQUFPOzs7Ozs7Ozs7O0FBTlgiLCJmaWxlIjoiYmFja2VuZC10ZXN0LmpzKG9yaWdpbmFsKSIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9iYWNrZW5kL2luZGV4LnBocFwiKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG59Il19

    var index = element => {
        element.textContent = 'Hello world';
    };
    var selecoes = null;
    function updateSelecao(id) {
        return new Promise(function ($return, $error) {
            var nome, grupo, continente, data;
            let response;
            nome = document.getElementById("cs_nome").value;
            grupo = document.getElementById("cs_grupo").value;
            continente = document.getElementById("cs_continente").value;
            if (!nome || !grupo || !continente) {
                alert("todos os campos devem ser preenchidos");
                return $return();
            }
            data = new FormData();
            data.append("nome", nome);
            data.append("grupo", grupo);
            data.append("continente", continente);
            data.append("idselecao", id);
            return fetch("/backend/index.php", {
                method: "PUT",
                body: data
            }).then(function ($await_1) {
                try {
                    return $await_1.json().then(function ($await_2) {
                        try {
                            response = $await_2;
                            if (response['error']['code'] !== 0) 
                                alert(response['error']['msg']);
                            mostrarTodasSelecoes();
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }, $error);
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }, $error);
        });
    }

    function selecaoBotaoEditar(id) {
        document.getElementById('formSelecao').style.display = 'block';
        document.getElementById('formSelecao').style.display = 'block';
        selecoes.forEach(function (item, index) {
            if (item['idselecao'] == id) {
                document.getElementById("cs_nome").value = item['nome'];
                document.getElementById("cs_grupo").value = item['grupo'];
                document.getElementById("cs_continente").value = item['continente'];
            }
        });
        document.getElementById('btnSalvar').onclick = function () {
            updateSelecao(id);
        };
        procurarSelecao();
    }

    function criarSelecao(nome, grupo, continente) {
        return new Promise(function ($return, $error) {
            var data;
            let response;
            $error = "";
            if (!nome || !grupo || !continente) {
                alert("todos os campos devem ser preenchidos");
                return $return();
            }
            data = new FormData();
            data.append("nome", nome);
            data.append("grupo", grupo);
            data.append("continente", continente);
            return fetch("/backend/index.php", {
                method: "POST",
                body: data
            }).then(function ($await_3) {
                try {
                    return $await_3.json().then(function ($await_4) {
                        try {
                            response = $await_4;
                            if (response['error']['code'] !== 0) 
                                alert(response['error']['msg']);
                            return $return(response['content']);
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }, $error);
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }, $error);
        });
    }

    function selecaoBotaoDeletar(id) {
        deletar(id);
        mostrarTodasSelecoes();
    }

    function deletar(id) {
        return new Promise(function ($return, $error) {
            var url;
            let response;
            url = "/backend/index.php?id=" + id;
            return fetch(url, {
                method: "DELETE"
            }).then(function ($await_5) {
                try {
                    return $await_5.json().then(function ($await_6) {
                        try {
                            response = $await_6;
                            if (response['error']['code'] !== 0) 
                                alert("erro");
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }, $error);
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }, $error);
        });
    }

    function atualizaTabela(json) {
        var selecoes = json;
        var tabela = document.getElementById("tableContent");
        tabela.innerHTML = "";
        tabela.innerHTML = "<tr><td>ID</td><td>Nome</td><td>Continente</td><td>Grupo</td></tr>";
        selecoes.forEach(function (item, index) {
            tabela.innerHTML = tabela.innerHTML + "<tr id='selRow_" + item['idselecao'] + "'><td>" + item['idselecao'] + "</td>" + "<td>" + item['nome'] + "</td>" + "<td>" + item['continente'] + "</td>" + "<td>" + item['grupo'] + "</td>" + "<td><button onclick='app.selecaoBotaoEditar(" + item['idselecao'] + ")'>editar</button>" + "<button onclick='app.selecaoBotaoDeletar(" + item['idselecao'] + ")'>deletar</button></td>" + "</td></tr>";
        });
    }

    function procurarSelecao(nome) {
        return new Promise(function ($return, $error) {
            var url;
            let response;
            url = "/backend/index.php";
            if (nome) 
                url = url + "?nome=" + nome;
            return fetch(url, {
                method: "GET"
            }).then(function ($await_7) {
                try {
                    return $await_7.json().then(function ($await_8) {
                        try {
                            response = $await_8;
                            if (response['error']['code'] !== 0) 
                                alert("erro");
                            selecoes = response['content'];
                            return $return(response['content']);
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }, $error);
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }, $error);
        });
    }

    function mostrarTodasSelecoes() {
        var selecoes, $error;
        return procurarSelecao().then(function ($await_9) {
            try {
                selecoes = $await_9;
                $error = "";
                atualizaTabela(selecoes);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }, $error);
    }

    function pesquisar() {
        var nome, selecoes, $error;
        nome = document.getElementById("textoPesquisaNome").value;
        return procurarSelecao(nome).then(function ($await_10) {
            try {
                selecoes = $await_10;
                $error = "";
                atualizaTabela(selecoes);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }, $error);
    }

    function criar() {
        document.getElementById('formSelecao').style.display = 'block';
        document.getElementById('btnSalvar').onclick = salvarCadastro;
    }

    function salvarCadastro() {
        var nome, grupo, continente, result, $error;
        nome = document.getElementById("cs_nome").value;
        grupo = document.getElementById("cs_grupo").value;
        continente = document.getElementById("cs_continente").value;
        return criarSelecao(nome, grupo, continente).then(function ($await_11) {
            try {
                result = $await_11;
                $error = "";
                document.getElementById('formSelecao').style.display = 'none';
                atualizaTabela(result);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }, $error);
    }

    exports.default = index;
    exports.updateSelecao = updateSelecao;
    exports.selecaoBotaoEditar = selecaoBotaoEditar;
    exports.criarSelecao = criarSelecao;
    exports.selecaoBotaoDeletar = selecaoBotaoDeletar;
    exports.deletar = deletar;
    exports.atualizaTabela = atualizaTabela;
    exports.procurarSelecao = procurarSelecao;
    exports.mostrarTodasSelecoes = mostrarTodasSelecoes;
    exports.pesquisar = pesquisar;
    exports.criar = criar;
    exports.salvarCadastro = salvarCadastro;

    return exports;

}({}));
//# sourceMappingURL=bundle.js.map
