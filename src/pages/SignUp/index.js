import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '~/assets/images/logo.svg';
// import { Container } from './styles';

export default function SignUp() {
  return (
    <>
      <img src={Logo} alt="logo" />
      <form>
        <input placeholder="Seu nome" />
        <input type="email" placeholder="Seu e-mail" />
        <input type="password" placeholder="Sua Senha secreta" />
        <button type="submit">Criar conta</button>
        <Link to="/">Já tenho login</Link>
      </form>
    </>
  );
}
