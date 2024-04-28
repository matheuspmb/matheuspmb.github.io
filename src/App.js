// Matheus Peres Medeiros Barreto - RA: 2410184

import React, { useReducer } from 'react';
import { Button } from 'react-bootstrap';
import picChucknorris from './assets/images/ChuckNorris.png';
import 'bootstrap/dist/css/bootstrap.min.css';

// Ações possíveis
const ACTIONS = {
    SET_PIADA: 'SET_PIADA',
    SET_CATEGORIAS: 'SET_CATEGORIAS',
    SET_RESULTADO_BUSCA: 'SET_RESULTADO_BUSCA',
    SET_ERRO: 'SET_ERRO',
    SET_KEYWORD: 'SET_KEYWORD',
    TOGGLE_CATEGORIAS: 'TOGGLE_CATEGORIAS',
};

// Gerenciando o estado a partir do uso de Reducer
const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_PIADA:
            return { ...state, piada: action.payload };
        case ACTIONS.SET_CATEGORIAS:
            return { ...state, categorias: action.payload };
        case ACTIONS.SET_RESULTADO_BUSCA:
            return { ...state, resultadoBusca: action.payload };
        case ACTIONS.SET_ERRO:
            return { ...state, erro: action.payload };
        case ACTIONS.SET_KEYWORD:
            return { ...state, keyword: action.payload };
        case ACTIONS.TOGGLE_CATEGORIAS:
            return { ...state, mostrarCategorias: !state.mostrarCategorias };
        default:
            return state;
    }
};

function App() {
    const initialState = {
        piada: '',
        categorias: [],
        keyword: '',
        resultadoBusca: '',
        erro: '',
        mostrarCategorias: false,
    };

    const [state, dispatch] = useReducer(reducer, initialState);


    const getPiadaAleatoria = () => {
        fetch('https://api.chucknorris.io/jokes/random')
            .then(response => response.json())
            .then(data => {
                dispatch({ type: ACTIONS.SET_PIADA, payload: data.value });
                dispatch({ type: ACTIONS.SET_ERRO, payload: '' });
            })
            .catch(error => {
                console.error("Erro ao obter piada: ", error);
                dispatch({ type: ACTIONS.SET_ERRO, payload: 'Erro ao obter piada. Por favor, tente novamente mais tarde.' });
            });
    };

    const getCategorias = () => {
        if (state.mostrarCategorias) {
            dispatch({ type: ACTIONS.SET_CATEGORIAS, payload: [] });
            dispatch({ type: ACTIONS.SET_ERRO, payload: '' });
            dispatch({ type: ACTIONS.TOGGLE_CATEGORIAS });
        } else {
            fetch('https://api.chucknorris.io/jokes/categories')
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: ACTIONS.SET_CATEGORIAS, payload: data });
                    dispatch({ type: ACTIONS.SET_ERRO, payload: '' });
                    dispatch({ type: ACTIONS.TOGGLE_CATEGORIAS });
                })
                .catch(error => {
                    console.error("Erro ao obter categorias: ", error);
                    dispatch({ type: ACTIONS.SET_ERRO, payload: 'Erro ao obter categorias. Por favor, tente novamente mais tarde.' });
                });
        }
    };

    const buscarPorPalavraChave = () => {
        if (state.keyword === '') {
            dispatch({ type: ACTIONS.SET_ERRO, payload: 'Por favor, digite uma palavra-chave para buscar.' });
            dispatch({ type: ACTIONS.SET_RESULTADO_BUSCA, payload: '' });
            return;
        }
    
        fetch(`https://api.chucknorris.io/jokes/search?query=${state.keyword}`)
            .then(response => response.json())
            .then(data => {
                if (data.result.length === 0) {
                    dispatch({ type: ACTIONS.SET_RESULTADO_BUSCA, payload: 'Nenhuma piada encontrada com essa palavra-chave.' });
                    dispatch({ type: ACTIONS.SET_ERRO, payload: '' });
                    return;
                }
    
                const piadasEncontradas = data.result.map(piada => piada.value);
                dispatch({ type: ACTIONS.SET_RESULTADO_BUSCA, payload: piadasEncontradas });
                dispatch({ type: ACTIONS.SET_ERRO, payload: '' });
            })
            .catch(error => {
                console.error("Erro ao buscar por palavra-chave: ", error);
                dispatch({ type: ACTIONS.SET_ERRO, payload: 'Erro ao buscar por palavra-chave. Por favor, tente novamente mais tarde.' });
                dispatch({ type: ACTIONS.SET_RESULTADO_BUSCA, payload: '' });
            });
    };

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <img src={picChucknorris} alt="ChuckNorrisImage" style={{ height: "200px", width: "400px" }} />
            </div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1>Piadas do Chuck Norris</h1>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p>Clique no botão abaixo para receber uma piada</p>
                <Button variant="primary" size="sm" onClick={getPiadaAleatoria}>Piada aleatória</Button>
                <p>{state.piada}</p>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3>Categorias</h3>
                <p>Para ver as categorias das piadas, clique no botão abaixo</p>
                <Button variant="primary" size="sm" onClick={getCategorias}>Categorias</Button>
                {state.mostrarCategorias && (
                    <ul>
                        {state.categorias.map((categoria, index) => (
                            <li key={index}>{categoria}</li>
                        ))}
                    </ul>
                )}
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h3>Busca por palavra-chave</h3>
                <input
                    type="text"
                    value={state.keyword}
                    onChange={(e) => dispatch({ type: ACTIONS.SET_KEYWORD, payload: e.target.value })}
                    placeholder="Digite uma palavra-chave" style={{ marginRight: '10px' }}
                />
                <Button variant="primary" size="sm" onClick={buscarPorPalavraChave}>Buscar</Button>
                {/* Renderizando 1 piada por parágrafo */}
                {state.resultadoBusca && state.resultadoBusca.map((piada, index) => (
                    <p key={index}>{piada}</p>
                ))}
                {state.erro && <p style={{ color: 'red' }}>{state.erro}</p>}
            </div>

        </div>
    );
}

export default App;
