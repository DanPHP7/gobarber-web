import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '~/assets/images/logo.svg';
// import { Container } from './styles';

export default function SignIn() {
  return (
    <>
      <img src={Logo} alt="logo" />
      <form>
        <input type="email" placeholder="Seu e-mail" />
        <input type="password" placeholder="Sua Senha secreta" />
        <button type="submit">Acessar</button>
        <Link to="/register">Criar conta gratuita</Link>
      </form>
    </>
  );
}
