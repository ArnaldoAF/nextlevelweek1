import React from 'react';
import Logo from '../../assets/logo.svg';
import { FiLogIn} from 'react-icons/fi';

import './styles.css';

const Home: React.FC = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                <img src={Logo} alt="ecoleta"/>
                </header>

                <main>
                    <h1>
                        Seu marketplace de coleta de reíduos
                    </h1>
                    <p>Ajudamos pessoas a encontrarem pontos e coleta de forma eficiente.</p>

                    <a href="/cadastro">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>CAdastre um ponto de Coleta</strong>
                    </a>
                </main>
            </div>
        </div>
    )
}

export default Home;