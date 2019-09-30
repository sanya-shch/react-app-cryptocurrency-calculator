import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';

import './App.css';

const App = () => {

    const [cryptoData, setCryptoData] = useState();
    useEffect(() => {
        const fsymsList = 'BTC,ETH,XRP,BCH,ZEC,EOS,XMR,ETC,LTC,DASH,QTUM,NEO,XLM,TRX,ADA,BTS,USDT';
        const tsymsList = 'USD,EUR,UAH,RUB';
        axios
            .get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsymsList}&tsyms=${tsymsList}`)
            .then(res => {
                setCryptoData({cryptoData: res.data});
            });
    },[]);

    const [currentData, setCurrentData] = useState({
        selectedCoin: '',
        price:{},
        selectedVolume: 0,
        selectedOutCoin: '',
        resultData: 0
    });
    const {selectedCoin, price, selectedVolume, selectedOutCoin, resultData} = currentData;

    const renderCBlocks = () => {
        return Object.values(cryptoData).map((cData) => {
            return Object.entries(cData).map(([cDataKey, cDataValue], cDataIndex) => {
                return <div key={cDataIndex} onClick={() => setCurrentData({...currentData, selectedCoin: cDataKey, price: cDataValue})} className="Crypto-Block">
                    <div className="Crypto-Block-Names">
                        <img
                            src={`https://endotech.io/img/coinicon/${cDataKey}.png`}
                            alt={`${cDataKey}`}
                        />
                        <h3 >{cDataKey}</h3>
                    </div>
                    <div className="Crypto-Block-Values">
                        {
                            Object.entries(cDataValue).map(([vKey, vValue], vIndex) => {
                                return <h4 key={vIndex}>{`${vKey}: ${vValue}`}</h4>
                            })
                        }
                    </div>
                </div>
            });
        })
    };

    const renderOutCoinBlocks = () => {
        return Object.entries(price).map(([key, value], index) => {
            return <div  className="Crypto-OutCoin" key={index} onClick={() => setCurrentData({...currentData, selectedOutCoin: key, resultData: Math.round(selectedVolume * value *100)/100})}>{key}</div>
        })
    };

    const onChangeInput = (e) => {
        const input = parseFloat(e.target.value);
        if(isFinite(input)){
            setCurrentData({...currentData, selectedVolume: input});
        }
    };

    return (
        <div className="App">
            {
                cryptoData === undefined
                    ? <Fragment>
                        <div className="lds-spinner"><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/></div>
                    </Fragment>
                    :
                    <Fragment>
                        <div className="Crypto-Container">
                            {renderCBlocks()}
                        </div>
                        {
                            selectedCoin &&
                                <Fragment>
                                    <div className="Crypto-SelectedCoin">
                                        <h2>Selected coin: {selectedCoin}</h2>
                                    </div>
                                    <div className="Crypto-Input">
                                        <h3>Volume:</h3>
                                        <input type='text' onChange={(e) => onChangeInput(e)}/>
                                    </div>
                                    <div className="Crypto-OutCoinContainer">
                                        {renderOutCoinBlocks()}
                                    </div>
                                    {
                                        resultData &&
                                        <div className="Crypto-Result">
                                            <h2>{`${selectedVolume} ${selectedCoin} will be ${resultData} in ${selectedOutCoin}`}</h2>
                                        </div>
                                    }
                                </Fragment>
                        }
                    </Fragment>
            }
        </div>
    );
};

export default App;
