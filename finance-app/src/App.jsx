import { FaTrash } from "react-icons/fa";
import { useState } from "react";


function App() {

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [transacoes, setTransacoes] = useState([]);

  // adicionar transação
  function adicionarTransacao() {

    if (!descricao || !valor) {
      return;
    }

    const nova = {
      descricao: descricao,
      valor: valor,
      tipo: tipo
    };

    setTransacoes([...transacoes, nova]);

    setDescricao("");
    setValor("");
  }

  // remover transação
  function removerTransacao(index) {

    const novaLista = transacoes.filter((_, i) => i !== index);

    setTransacoes(novaLista);
  }

  // calcular saldo
  const saldo = transacoes.reduce((total, t) => {

    if (t.tipo === "entrada") {
      return total + Number(t.valor);
    } else {
      return total - Number(t.valor);
    }

  }, 0);

  return (
    <div style={{ padding: 20 }}>

      <h1>Controle Financeiro</h1>

      <h2>Saldo: R$ {saldo}</h2>

      <input
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <br /><br />

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="entrada">Entrada</option>
        <option value="despesa">Despesa</option>
      </select>

      <br /><br />

      <button onClick={adicionarTransacao}>
        Adicionar
      </button>

      <hr />

      <h2>Transações</h2>

      {transacoes.map((t, index) => (
        <div key={index}

        //estilo entrada cor verde
        style={{ 
          color: t.tipo === "entrada" ? "green" : "red" ,
          marginBottom: "8px"
        }}
        >

          {t.tipo === "entrada" ? "+" : "-"} {t.descricao} - R$ {t.valor}

          <button
            onClick={() => removerTransacao(index)}

            //estilo saida cor vermelha
            style={{ 
              marginLeft: "10px",
              cursor: "pointer",
              border: "none",
              background: "transparent"
              }}
          >
            ❌
          </button>

        </div>
      ))}

    </div>
  );
}

export default App;