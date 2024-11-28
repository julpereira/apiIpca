import historicoInflacao from '../dados/dados.js';

export const historicoIPCA = () => {
  return historicoInflacao;
}

export const buscarAno = (ano) => {
  const anoHistorico = parseInt(ano);
  const historico = historicoInflacao.filter(historico => historico.ano === anoHistorico);
  return historico;
};

export const buscarId = (id) => {
  const idHistorico = parseInt(id);
  const historico = historicoInflacao.find(historico => historico.id === idHistorico);
  return historico;
};

export const calcularReajuste = (valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) => {
  const historicoFiltrado = historicoInflacao.filter(
    historico => {
      if (dataInicialAno === dataFinalAno) {
        return historico.ano === dataInicialAno && historico.mes >= dataInicialMes && historico.mes <= dataFinalMes;
      } else {
        return (
          (historico.ano === dataInicialAno && historico.mes >= dataInicialMes) ||
          (historico.ano > dataInicialAno && historico.ano < dataFinalAno) ||
          (historico.ano === dataFinalAno && historico.mes <= dataFinalMes)
        );
      }
    }
  );

  let taxasMensais = 1;
  for (const elemento of historicoFiltrado) {
    taxasMensais *= (elemento.ipca / 100) + 1;
  }

  const resultado = valor * taxasMensais;
  return parseFloat(resultado.toFixed(2));
};

export const validacaoErro = (valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) => {
  const anoLimiteFinal = historicoInflacao[historicoInflacao.length - 1].ano;
  const anoLimiteInicial = historicoInflacao[0].ano;
  const mesLimiteFinal = historicoInflacao[historicoInflacao.length - 1].mes;

  if (isNaN(valor)) return true;
  if (isNaN(dataInicialMes)) return true;
  if (isNaN(dataInicialAno)) return true;
  if (isNaN(dataFinalMes)) return true;
  if (isNaN(dataFinalAno)) return true;

  if (dataInicialMes < 1 || dataInicialMes > 12) return true;
  if (dataInicialAno < anoLimiteInicial || dataInicialAno > anoLimiteFinal) return true;
  if (dataFinalMes < 1 || dataFinalMes > 12) return true;
  if (dataFinalAno < anoLimiteInicial || dataFinalAno > anoLimiteFinal) return true;

  if (dataFinalAno === anoLimiteFinal && dataFinalMes > mesLimiteFinal) return true;
  if (dataFinalAno < dataInicialAno) return true;
  if (dataFinalAno === dataInicialAno && dataFinalMes < dataInicialMes) return true;

  return false;
}