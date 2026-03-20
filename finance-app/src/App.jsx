import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function App() {

  // ================================
  // ESTADOS
  // ================================

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [categoria, setCategoria] = useState("geral");

  const [transacoes, setTransacoes] = useState(() => {
    const dadosSalvos = localStorage.getItem("transacoes");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // ================================
  // SALVAR NO LOCALSTORAGE
  // ================================

  useEffect(() => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  // ================================
  // FUNÇÕES
  // ================================

  function adicionarTransacao() {
    if (!descricao || !valor) return;

    const nova = {
      descricao,
      valor: Number(valor),
      tipo,
      categoria
    };

    setTransacoes([...transacoes, nova]);

    setDescricao("");
    setValor("");
    setCategoria("geral");
  }

  function removerTransacao(index) {
    const novaLista = transacoes.filter((_, i) => i !== index);
    setTransacoes(novaLista);
  }

  // ================================
  // CÁLCULOS
  // ================================

  const saldo = transacoes.reduce((total, t) => {
    return t.tipo === "entrada"
      ? total + t.valor
      : total - t.valor;
  }, 0);

  const entradas = transacoes
    .filter(t => t.tipo === "entrada")
    .reduce((total, t) => total + t.valor, 0);

  const despesas = transacoes
    .filter(t => t.tipo === "despesa")
    .reduce((total, t) => total + t.valor, 0);

  const data = [
    { name: "Entradas", value: entradas },
    { name: "Despesas", value: despesas }
  ];

  const COLORS = ["#4CAF50", "#f44336"];

  // ================================
  // INTERFACE
  // ================================

  return (
    <div style={{
      background: "white",
      padding: "30px",
      borderRadius: "12px",
      width: "1000px",
      margin: "0 auto",
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
    }}>

      <h1 style={{ textAlign: "center" }}>💰 Controle Financeiro</h1>

      <div style={{
        display: "flex",
        gap: "30px",
        marginTop: "20px"
      }}>

        {/* ESQUERDA */}
        <div style={{ flex: 1 }}>

          <h2 style={{ color: saldo >= 0 ? "green" : "red" }}>
            Saldo: R$ {saldo}
          </h2>

          {/* RESUMO */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}>

            <div style={{
              background: "#e6f9ec",
              padding: "10px",
              borderRadius: "8px",
              width: "30%",
              textAlign: "center"
            }}>
              <strong>Entradas</strong>
              <p style={{ color: "green" }}>R$ {entradas}</p>
            </div>

            <div style={{
              background: "#fdeaea",
              padding: "10px",
              borderRadius: "8px",
              width: "30%",
              textAlign: "center"
            }}>
              <strong>Despesas</strong>
              <p style={{ color: "red" }}>R$ {despesas}</p>
            </div>

            <div style={{
              background: "#eef2ff",
              padding: "10px",
              borderRadius: "8px",
              width: "30%",
              textAlign: "center"
            }}>
              <strong>Total</strong>
              <p>R$ {saldo}</p>
            </div>

          </div>

          {/* INPUTS */}
          <input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "10px" }}
          />

          <input
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "10px" }}
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "10px" }}
          >
            <option value="entrada">Entrada</option>
            <option value="despesa">Despesa</option>
          </select>

          {/* NOVO: CATEGORIA */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "10px" }}
          >
            <option value="geral">Geral</option>
            <option value="salario">Salário</option>
            <option value="moradia">Moradia</option>
            <option value="alimentacao">Alimentação</option>
            <option value="transporte">Transporte</option>
            <option value="lazer">Lazer</option>
          </select>

          <button
            onClick={adicionarTransacao}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              borderRadius: "8px",
              border: "none",
              background: "#4CAF50",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Adicionar
          </button>

        </div>

        {/* DIREITA */}
        <div style={{ flex: 1 }}>

          <h3 style={{ textAlign: "center" }}>Resumo</h3>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <PieChart width={300} height={250}>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <h3>Transações</h3>

          {transacoes.map((t, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#f9f9f9",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
                color: t.tipo === "entrada" ? "green" : "red"
              }}
            >

              <span>
                {t.tipo === "entrada" ? "+" : "-"} {t.descricao}
                <span style={{ fontSize: "12px", marginLeft: "5px", color: "#555" }}>
                  ({t.categoria || "geral"})
                </span>
              </span>

              <div>
                R$ {t.valor}
                <button
                  onClick={() => removerTransacao(index)}
                  style={{
                    marginLeft: "10px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer"
                  }}
                >
                  ❌
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default App;