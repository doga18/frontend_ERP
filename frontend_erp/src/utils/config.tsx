export const api = 'http://localhost:3001/api';
export const uploads = 'http://localhost:3001/uploads';
export const hostfile = 'http://localhost:3001';
export const files = 'http://localhost:3001/files';
export const apiCep = 'https://viacep.com.br/ws/'

interface responseListClients {
  clients: Clients[]
}

interface Clients {
  idcc: string;
  firstname: string;
  lastname: string;
  cpf: string;
}

const getToken = () => {
  try {
    if(localStorage.getItem('token')){      
      const token = JSON.parse(localStorage.getItem('token') || '');
      // console.log(token);
      // console.log(token.toString());
      return token.toString();
    }    
    const userLocal = localStorage.getItem('user');
    if(userLocal){
      const user = JSON.parse(userLocal);
      console.log(user.token);
      return user.token;
    }
  } catch (error) {
    console.log(error);
    console.log('Não foi possível localizar o token do usuário logado.');
    return null;
  }
}

// Exportando função que retorna o CEP.
export const getCep = async (cep: string): Promise<any> => {
  if(cep.length > 8) return null;
  const response = await fetch(`${apiCep}${cep}/json`);  
  if (!response.ok) {
    throw new Error(`Erro ao buscar CEP: ${response.status}`);
  }
  if(response.status === 200){
    return response.json();
  }
  
};

export const getListClients = async (namePart: string, idCompany: string): Promise<responseListClients> => {
  if(namePart.length <= 2) return {clients: []};
  const token = getToken();
  const config = requestConfig("GET", null, token);
  const response = await fetch(`${api}/clients/search/${idCompany}/name?name=${namePart}`, config);
  if(!response.ok){
    const errorData = await response.json();
    throw new Error(errorData.errors? errorData.errors[0] : "Erro na tentaiva de pegar clientes.");
  }
  if(response.status === 200){
    return response.json();
  }
}

export const requestConfig = (
  method: string,
  data: any = null,
  token: string | null = null,
  // id: string | null = null
): RequestInit => {
  const headers: { [key: string]: string } = {}; // Define headers como um objeto simples

  // Adiciona o token ao cabeçalho, se fornecido
  if (token) {
    // console.log("Método Informou o Token, adicionando.");
    headers.Authorization = `Bearer ${token}`;
  }
  if(!token){
    // console.log("Método não Informou o Token.");
  }

  // Se houver dados a serem enviados
  if (data) {
    // Se o método for POST ou PUT e os dados não forem FormData
    if (method !== "GET" && method !== "HEAD") {
      if (data instanceof FormData) {
        // Se for FormData, não define o Content-Type
        return {
          method,
          headers,
          body: data, // O FormData já é um objeto que pode ser enviado diretamente
        };
      } else {
        // Para dados JSON
        headers["Content-Type"] = "application/json";
        return {
          method,
          headers,
          body: JSON.stringify(data),
        };
      }
    }
  }

  // Retorna a configuração padrão para métodos GET ou HEAD
  return {
    method,
    headers,
  };
};



