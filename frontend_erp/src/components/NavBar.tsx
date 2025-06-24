import React from 'react'

import type { AuthUserInterface } from '../interfaces/AuthUserInterface';


type Props = {
  logout: () => void;
  user?: AuthUserInterface;
}

const NavBar = (props: Props) => {
  return (
    <div>
      Barra de navegação
      <button className="btn" onClick={props.logout}>Logout</button>
    </div>
  )
}

export default NavBar