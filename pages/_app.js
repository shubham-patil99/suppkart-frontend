import App from "next/app";
import React from "react";
import ErrorBoundary from "@components/ErrorBoundary";
import '@splidejs/react-splide/css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "@components/Modal/Loader";

class MyApp extends App {
    constructor(props) {
        super(props);
        this.state = {
            load: false,
            loading: false, // New state to track loading
        };
    }

    componentDidMount() {
        this.setState({ load: true });
    }

    render() {
        const { Component, pageProps } = this.props;
        const { load, loading } = this.state;
        return (
            <React.Fragment>
                <ToastContainer position="top-center" autoClose="2000" hideProgressBar="true" />
                {loading && <Loader />}

                {load && (
                    <ErrorBoundary>
                        <Provider store={store}>
                            <Component {...pageProps} />
                        </Provider>
                    </ErrorBoundary>
                )}
            </React.Fragment>
        );
    }
}

// Using a custom hook for handling route changes and loading state
const useRouteChangeLoader = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url) => {
            if (url !== router.asPath) {
                setLoading(true);
            }
        };
        const handleComplete = (url) => {
            if (url === router.asPath) {
                setLoading(false);
            }
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete); // Handle errors too

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return loading;
};

export default function AppWrapper(props) {
    const loading = useRouteChangeLoader(); // Call custom hook to track loading state

    return <MyApp {...props} loading={loading} />;
}
