export async function getServerProps(context, otherProps) {
    if (!context.res.isAuth) {
        return {
            redirect: {
                destination: '/login', // The page to redirect to
                permanent: true, // Set it to true if the redirect is permanent
            },
        };
    }
    return {
        props: { isAuth: context.res.isAuth, ...otherProps }, // will be passed to the page component as props
    };
}
