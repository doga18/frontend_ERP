import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleUser, setRoleUser] = useState<(string | number)[] | undefined>(undefined);
  const [userLoggedId, setUserLoggedId] = useState<number | null>(null);
  // const [userTempTrue, setUserTempTrue] = useState<boolean>(false);
  // const [userCompanyId, setUserCompanyId] = useState<number | null>(null);

  // Função para Determinar o tipo de conta.
  const checkAccountType = (typeAcc: number) => {
    // TODO: Implementar verificação de tipo de conta.
    switch(typeAcc) {
      case 1:
        return ['Admin', 1];
      case 2:
        return ['Owner', 2];
      case 3:
        return ['Manager', 3];
      case 4:
        return ['Employee', 4];
      case 5:
        return ['Supplier', 5];
      default:
        return ['Employee', 6];
    }
  };

  useEffect(() => {
    // console.log("Redux user:", user.name);
    // console.log("Auth state:", auth);
    // console.log("Loading state:", loading);
    const checkAuth = async () => {
      //console.log(user);
      if (user && Object.keys(user).length > 0) {
        // Setando a Role do user para retornar esse valor.
        const userRole = checkAccountType(user.roleId ?? 6);
        //console.log('userRole', user.userId);
        // console.log(userRole)
        // Retornando o ID do usuário no userLoggedId
        setUserLoggedId(user.userId);
        setRoleUser(userRole);
        setAuth(true);
        // Verificando se o usuário está com a senha temporária habilitado, caso esteja, redireciona para renovar a senha.
        // if(user.timePassword){
        //   console.log('Usando autenticação de senha temporária.')
        //   setUserTempTrue(true);
        //   // navigate('/change-password', { replace: true });
        //   // window.location.href = '/change-password'; // Redireciona para a página de mudança de senha.
        // }else if(user.timePassword === null){
        //   console.log('Usando autenticação de senha.')
        //   setUserTempTrue(false);
        //   // navigate('/', { replace: true });
        //   // window.location.href = '/'; // Redireciona para a página inicial.
        // }
      } else {
        console.log('user not logged');
        setAuth(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [user]);
  // console.log("Redux user:", user);
  // console.log("Auth state:", auth);
  // console.log("Loading state:", loading);
  return {
    auth,
    loading,
    roleUser,
    userLoggedId,
    user,
  };
};
