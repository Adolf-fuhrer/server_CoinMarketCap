const http = require('http')
const axios = require('axios');
const cheerio = require('cheerio');
const { children } = require('cheerio/lib/api/traversing');


// Funcion encargada de obtener el precio de las criptomonedas

const getPrice = async () => {
    
    try {
        const urlSite = ('https://coinmarketcap.com'); // URL del sitio web

        // Metodo para descargar la informacion del sitio web

        const {data} = await axios({
            method: 'GET',
            url: urlSite
        });

        // Metodo para procesar la informacion del sitio web
        
        const $ = cheerio.load(data);

        // Metodo para obtener la informacion PADRE de las monedas por selector

        const elemSelec = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr'

        const keys = [ 
            'rank',
            'name',
            'price',
            '24h',
            '7d',
            'marketCap',
            'volume',
            'circulatingSupply'        
        ]
        const coinArr = []

        $(elemSelec).each((parentIdx, parentElem) => {

            // Metodo para obtener la informacion HIJO de las monedas por selector
            
            let keyIdx = 0
            const coinObj = {}

            if (parentIdx <= 9/*Numero de cryptos a mostrar*/ ){ 
                $(parentElem).children().each((childIdx, childElem) => {
                    let tdValue = $(childElem).text();
                    if (keyIdx === 1 || keyIdx === 6) {
                        tdValue = $('p:first-child', $(childElem).html()).text()
                    }

                    if (tdValue) {
                        coinObj[keys[keyIdx]] = tdValue
                        keyIdx++
                    }

                })

                coinArr.push(coinObj);
            }
        })
        
        for (let i = 0; i < coinArr.length; i++) {
            const cryptoName = coinArr[i].name;
            const cryptoPrice = coinArr[i].price;
            
            const cryptos = cryptoName + ' | ' + cryptoPrice
            
            
            console.log(cryptos);
        }

    } catch (err) {
        console.error(err); // Imprime un error en la consola
    }

}

//------- Server ----------

const port = 8080; // Puerto donde se ejecuta el servidor
const host = 'localhost'; // Host donde se ejecuta el servidor

const listTop = (req, res) => {

    res.writeHead(200);
    res.end('Hola')

};



const server = http.createServer(listTop);

server.listen(port, host, () => {

    setInterval(() => {
        
        while (1) {
            console.clear();
            getPrice();

            break;
        }
        
    }, 4000);


    console.log(`El servidor esta corriendo en http://${host}:${port}`);

});

//-------