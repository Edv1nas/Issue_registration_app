
import LoginForm from './form/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';

const LoginPage = () => {


    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <main className="form-signin w-100 m-auto">
            <h1 className="h3 mb-3 fw-normal text-center">Sign In</h1>
            <LoginForm />
            </main>
        </div>
    );
};

export default LoginPage;