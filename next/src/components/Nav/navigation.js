
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import MenuConent from '@/components/Nav/MenuConent';
import styles from '@/styles/page.module.css'; // Импорт стилей

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    setIsLoggedIn(!!token);
    setUserName(storedName || '');
  }, []);

  const handleLogout = () => {
    // Отображаем модальное окно подтверждения
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Удаление токена, имени из локального хранилища
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    // Обновление состояния isLoggedIn и userName
    setIsLoggedIn(false);
    setUserName('');
    // Скрываем модальное окно
    setShowLogoutModal(false);
    // Перенаправление пользователя на страницу регистрации
    window.location.href = "http://localhost:3000/Registration";
  };

  const cancelLogout = () => {
    // Скрываем модальное окно
    setShowLogoutModal(false);
  };

  const userNameStyle = {
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
    borderRadius: '20px',
    marginRight: '10px',
    border: '2px solid white', // Добавление белой обводки толщиной 2 пикселя
    padding: '6px', // Добавление отступа, чтобы обводка не прижималась к тексту
    fontFamily: "Georgia",
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>Music Ministry</h1>
      <ul className={styles.navmenu}>
        {MenuConent.map((item, index) => (
          <li key={index}>
            <a href={item.url} className={item.cName}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      {isLoggedIn ? (
        <>
            {/* Применяем новые стили для имени */}
            <div style={userNameStyle}>{userName}</div>
          <button className={`${styles.button} ${styles.logoutButton}`} onClick={handleLogout}>
            Выйти
          </button>
        </>
      ) : (
        <Link href="/Registration/">
          <button className={`${styles.button} ${styles.signupButton}`}>Аккаунт</button>
        </Link>
      )}

      {/* Модальное окно подтверждения выхода */}
      {showLogoutModal && (
        <div className={`${styles.modal} ${styles.topRight}`}>
          <p>Вы уверены, что хотите выйти?</p>
          <button className={styles.modalButton} onClick={confirmLogout}>
            Да
          </button>
          <button className={styles.modalButton} onClick={cancelLogout}>
            Отмена
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;



