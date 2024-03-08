
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout/Layout';
import '@/styles/globals.css';
import '@/styles/page.module.css';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        // Проверяем наличие токена в локальном хранилище
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');

            // Если токена нет, перенаправляем пользователя на страницу регистрации
            if (!token && router.pathname !== '/Registration') {
                router.push('/Registration');
            }
        }
    }, []);

    // Если токена нет, не отображаем навигацию
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
        return (
            <Layout>
                <Component {...pageProps} />
            </Layout>
        );
    }

    // Если токен есть, отображаем нормальный макет
    return (
        <Layout>
            {/* Если вы хотите отобразить навигацию, добавьте её здесь */}
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;

