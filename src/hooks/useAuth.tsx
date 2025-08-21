import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Slice para validar o usuário autenticado
import { validUserLogged } from '../slices/authSlice';


// export const useAuth = () => {
//   const {
//     user,
//     authenticated,
//     isLoading
//   } = useSelector((state: RootState) => state.auth);

//   const dispatch = useDispatch<AppDispatch>();

//   // Função para Determinar o tipo de conta.
//   const checkAccountType = (typeAcc: number) => {
//     switch(typeAcc) {
//       case 1: return ['Admin', 1];
//       case 2: return ['Owner', 2];
//       case 3: return ['Manager', 3];
//       case 4: return ['Employee', 4];
//       case 5: return ['Supplier', 5];
//       default: return ['Employee', 6];
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("user: ", user, "authenticated:", authenticated);
//     console.log("token: ", token);

//     if (token && authenticated === false && !user) {
//       console.log("validando usuário logado...");
//       dispatch(validUserLogged());
//     }
//   }, [dispatch, authenticated, user]);

//   const auth = Boolean(authenticated && user);
//   console.log('auth: ', auth);
//   const roleUser = user ? checkAccountType(user.roleId ?? 6) : undefined;
//   const userLoggedId = user?.userId ?? null;

//   return {
//     auth,
//     loading: isLoading,
//     roleUser,
//     userLoggedId,
//     user,
//   };
// };

export const useAuth = () => {
  const {
    user,
    authenticated,
    //isLoading
  } = useSelector((state: RootState) => state.auth);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleUser, setRoleUser] = useState<(string | number)[] | undefined>(undefined);
  const [userLoggedId, setUserLoggedId] = useState<number | null>(null);

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
      // case 5:
        return ['Supplier', 5];
      default:
        return ['Employee', 6];
    }
  };
  // Disparando a autenticação
  useEffect(() => {    
    const token = localStorage.getItem("token");
    // console.log("Verificando Token: ", localStorage.getItem("token"));
    // console.log("Verificando a autenticação: ", user, authenticated);
    if (token && !authenticated && !user) {
      dispatch(validUserLogged());
    }
  }, [dispatch, authenticated, user]);

  useEffect(() => {
    const checkAuth = async () => {
      if (user && Object.keys(user).length > 0) {
        const userRole = checkAccountType(user.roleId ?? 6);

        setUserLoggedId(user.userId);
        setRoleUser(userRole);
        setAuth(true);

      } else {
        console.log('user not logged');
        setAuth(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [user]);

  //console.log("Status de autenticado: ", auth, roleUser, userLoggedId);

  return {
    auth,
    loading,
    roleUser,
    userLoggedId,
    user,
  };
};