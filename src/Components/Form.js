import React, { useState } from 'react';
import InputMask from 'react-input-mask';

function Form({ setResult }) {
  const [procedureType, setProcedureType] = useState('');
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    nascimento: '',
    IMC: '',
    sexo: '',
    tentouEmagrecer: false,
    obesidadeCincoAnos: false,
    varizesGrossoCalibre: false,
    quadroAnteriorTrombose: false,
    condicaoPrevia: false,
    dorIncapacitanteDiaria: false,
    desgasteArticulacaoQuadril40: false,
    diabetes: false,
    hipertensao: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verifica se o procedimento foi selecionado
    if (!procedureType) {
      alert('Por favor, selecione o procedimento');
      return;
    }
  
    // Validação do CPF
    const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/;
    if (!cpfRegex.test(formData.cpf)) {
      alert('CPF inválido');
      return;
    }
  
    // Validação da data de nascimento
    const birthDate = new Date(formData.nascimento);
    const currentDate = new Date();
    if (birthDate.getFullYear() < 1900 || birthDate >= currentDate) {
      alert('Data de nascimento inválida');
      return;
    }
  
    // Validação do nome
    const nomeParts = formData.nomeCompleto.trim().split(' ');
    if (nomeParts.length < 2) {
      alert('Nome completo deve conter pelo menos duas palavras');
      return;
    }
    
     // Trata o IMC
    const formattedIMC = formData.IMC.replace(',', '.');

    // Garante que os campos de diabetes e hipertensão estejam preenchidos
    if (procedureType === 'cirurgiaBariatrica' || procedureType === 'artroplastia') {
      if (formData.diabetes === undefined || formData.hipertensao === undefined) {
        alert('Por favor, preencha os campos de diabetes e hipertensão');
        return;
      }
    }

    // Filtra apenas os campos preenchidos
    const formDataToSend = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined && value !== false) {
        formDataToSend[key] = value;
      }
    });

    // Atualiza o IMC formatado
    formDataToSend.IMC = formattedIMC;
  
    const token = localStorage.getItem('token');
    console.log('Sending data:', { procedureType, answers: formDataToSend }); // Log data being sent
    try {
      const response = await fetch('https://back-med.onrender.com/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ procedureType, answers: formDataToSend }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Response data:', data); // Log the response data
      setResult(data.result);
    } catch (error) {
      console.error('Failed to fetch:', error);
      alert('Failed to fetch');
    }
  };  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === 'sim' });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Questionário</h2>
      <div className="mb-4">
        <label className="block mb-2">Tipo de procedimento</label>
        <select
          value={procedureType}
          onChange={(e) => setProcedureType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          required
        >
          <option value="">Select a procedure</option>
          <option value="cirurgiaBariatrica">Cirurgia bariátrica</option>
          <option value="cirurgiaVarizes">Cirurgia de varizes</option>
          <option value="artroplastia">Artroplastia</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Nome Completo</label>
        <input
          type="text"
          name="nomeCompleto"
          value={formData.nomeCompleto}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">CPF</label>
        <InputMask
          mask="999.999.999-99"
          masrkChar=""
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Data de Nascimento</label>
        <input
          type="date"
          name="nascimento"
          value={formData.nascimento}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">IMC</label>
        <InputMask
          mask="99,9"
          masrkChar=""
          type="text"
          name="IMC"
          value={formData.IMC}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Sexo</label>
        <select
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          required
        >
          <option value="">Select a gender</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Possui antecedentes familiares de diabetes?</label>
        <div className="flex items-center">
          <input
            type="radio"
            name="diabetes"
            value="sim"
            checked={formData.diabetes === true}
            onChange={handleRadioChange}
            className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
          />
          <label className="mr-4">Sim</label>
          <input
            type="radio"
            name="diabetes"
            value="nao"
            checked={formData.diabetes === false}
            onChange={handleRadioChange}
            className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
          />
          <label>Não</label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Possui antecedentes familiares de hipertensão?</label>
        <div className="flex items-center">
          <input
            type="radio"
            name="hipertensao"
            value="sim"
            checked={formData.hipertensao === true}
            onChange={handleRadioChange}
            className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
          />
          <label className="mr-4">Sim</label>
          <input
            type="radio"
            name="hipertensao"
            value="nao"
            checked={formData.hipertensao === false}
            onChange={handleRadioChange}
            className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
          />
          <label>Não</label>
        </div>
      </div>

      {procedureType === 'cirurgiaBariatrica' && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Já tentou emagrecer por mais de 1 ano e não conseguiu?</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="tentouEmagrecer"
                value="sim"
                checked={formData.tentouEmagrecer === true}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label className="mr-4">Sim</label>
              <input
                type="radio"
                name="tentouEmagrecer"
                value="nao"
                checked={formData.tentouEmagrecer === false}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label>Não</label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Está com o quadro de obesidade há mais de 5 anos?</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="obesidadeCincoAnos"
                value="sim"
                checked={formData.obesidadeCincoAnos === true}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label className="mr-4">Sim</label>
              <input
                type="radio"
                name="obesidadeCincoAnos"
                value="nao"
                checked={formData.obesidadeCincoAnos === false}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label>Não</label>
            </div>
          </div>
        </>
      )}


      {procedureType === 'cirurgiaVarizes' && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Tem varizes de grosso calibre?</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="varizesGrossoCalibre"
                value="sim"
                checked={formData.varizesGrossoCalibre === true}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label className="mr-4">Sim</label>
              <input
                type="radio"
                name="varizesGrossoCalibre"
                value="nao"
                checked={formData.varizesGrossoCalibre === false}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label>Não</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Possui quadro anterior de trombose?</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="quadroAnteriorTrombose"
                value="sim"
                checked={formData.quadroAnteriorTrombose === true}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label className="mr-4">Sim</label>
              <input
                type="radio"
                name="quadroAnteriorTrombose"
                value="nao"
                checked={formData.quadroAnteriorTrombose === false}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label>Não</label>
            </div>
          </div>
        </>
      )}

      {procedureType === 'artroplastia' && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Possui condição prévia como artrose, artrite reumatóide ou espondilite anquilosante?</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="condicaoPrevia"
                value="sim"
                checked={formData.condicaoPrevia === true}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label className="mr-4">Sim</label>
              <input
                type="radio"
                name="condicaoPrevia"
                value="nao"
                checked={formData.condicaoPrevia === false}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label>Não</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Possui dor incapacitante diária?</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="dorIncapacitanteDiaria"
                value="sim"
                checked={formData.dorIncapacitanteDiaria === true}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label className="mr-4">Sim</label>
              <input
                type="radio"
                name="dorIncapacitanteDiaria"
                value="nao"
                checked={formData.dorIncapacitanteDiaria === false}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label>Não</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Possui desgaste da articulação do quadril em mais de 40%?</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="desgasteArticulacaoQuadril40"
                value="sim"
                checked={formData.desgasteArticulacaoQuadril40 === true}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label className="mr-4">Sim</label>
              <input
                type="radio"
                name="desgasteArticulacaoQuadril40"
                value="nao"
                checked={formData.desgasteArticulacaoQuadril40 === false}
                onChange={handleRadioChange}
                className="mr-2 appearance-none border border-gray-300 rounded-full w-4 h-4 checked:bg-green-500 checked:border-transparent focus:outline-none"
                />
              <label>Não</label>
            </div>
          </div>
        </>
      )}

      <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600">
        Enviar Formulário
      </button>
    </form>
  );
}

export default Form;
