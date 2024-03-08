

import React, { useState, useEffect } from "react";
import axios from 'axios';
import * as Components from './Components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StyleSheetManager } from 'styled-components';

function App() {
  const [signIn, toggle] = React.useState(true);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = React.useState({
    email: '',
    password: '',
  });

  const [error, setError] = React.useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const url = 'http://127.0.0.1:8000/auth/users/';
      const response = await axios.post(url, formData);
      console.log(response.data); // Обработайте ответ при необходимости
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      const url = 'http://127.0.0.1:8000/api/login/';
      const response = await axios.post(url, {
        email: loginData.email,
        password: loginData.password,
      });

      const { token } = response.data;
      const { user_id } = response.data;
      const { name } = response.data;

      if (token) {
        // Сохраняем токен и email в localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('name', name);

        // Выводим в консоль для отладки
        console.log('Token saved:', token);
        console.log('User_id saved:', user_id);
        console.log('Name_id saved:', name);

        // Перенаправляем пользователя на защищенную страницу или выполняем другие действия
        router.push('/protected-page'); // Измените путь по необходимости
      } else {
        setError('Токен не получен');
      }
    } catch (error) {
      setError('Неверные учетные данные');
      console.error('Ошибка входа:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home/{uid}/{token}'); // Измените путь по необходимости
    }
  }, [router.pathname]);

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== 'signinIn'}>
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Создайте аккаунт</Components.Title>
          <Components.Input
            type='text'
            name='name'
            placeholder='Имя'
            onChange={handleChange}
          />
          <Components.Input
            type='email'
            name='email'
            placeholder='Email'
            onChange={handleChange}
          />
          <Components.Input
            type='password'
            name='password'
            placeholder='Пароль'
            onChange={handleChange}
          />
          <Link href="/checkmail">
            <Components.Button onClick={handleSignUp}>Создать</Components.Button>
          </Link>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Войти</Components.Title>
          <Components.Input
            type='email'
            placeholder='Email'
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          <Components.Input
            type='password'
            placeholder='Пароль'
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <Components.Anchor href='#'>Забыли пароль?</Components.Anchor>
          {error && <p style={{ color: 'red' }}>{error}</p>}
            <Components.Button onClick={(e) => { e.preventDefault(); handleSignIn(); }}>Войти</Components.Button>

        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Добро пожаловать!</Components.Title>
            <Components.Paragraph>
              Для входа в систему введите свои персональные данные
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Войти
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title>Привет, друзья!</Components.Title>
            <Components.Paragraph>
              Для регистрации и начала работы введите свои персональные данные
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Регистрация
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
      </Components.Container>
    </StyleSheetManager>
  );
}

export default App;





