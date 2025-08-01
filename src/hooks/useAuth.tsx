import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Slice para validar o usuário autenticado
import { validUserLogged } from '../slices/authSlice';


export const useAuth = () => {
  const {
    user,
    authenticated,
    isLoading
  } = useSelector((state: RootState) => state.auth);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleUser, setRoleUser] = useState<(string | number)[] | undefined>(undefined);
  const [userLoggedId, setUserLoggedId] = useState<number | null>(null);
  // const [userTempTrue, setUserTempTrue] = useState<boolean>(false);
  // const [userCompanyId, setUserCompanyId] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
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
    const token = localStorage.getItem("token");
    if (token && !authenticated) {
      dispatch(validUserLogged()).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if(authenticated && user){
      setAuth(true);
      setUserLoggedId(user.userId);
      setRoleUser(checkAccountType(user.roleId ?? 6));
    }else{
      setAuth(false);
    }
  },[authenticated, user]);

  return {
    auth,
    loading: loading || isLoading,
    roleUser,
    userLoggedId,
    user,
  };
};
