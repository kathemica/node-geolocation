import dotenv from 'dotenv'
import _ from 'lodash';
import { inquirerMenu, pause, readInput, listingPlaces} from './helpers/inquirer.js';
import { Search } from './models/search.js';

dotenv.config();

console.clear();
// console.log(process.env);

//usamos una funcion asincrona
const main = async () => {
    let opt = '';    
    let search = new Search();    

    do{                
        opt = await inquirerMenu();    

        switch(opt){
            case '1': //search                                        
                    // tasks.createTask(
                    //     await readInput('Description:')
                    // );        
                    //1 show message    
                    const city = await readInput('City:');

                    //2 search place 
                    const searched= await search.place(city);

                    //3 select place
                    const selectedId = await listingPlaces(searched);                    

                    if (selectedId !== '0'){                        
                        const selectedPlace = searched.find(place => place.id === selectedId);    
                        search.saveHistory(selectedPlace.description);                
                                                                        
                        //4 get weather
                        const weather = await search.weatherPlace(selectedPlace.latitud, selectedPlace.longitud);

                        //show results                             
                        console.log("\nInfo\n".green);
                        console.log(`City: ${selectedPlace.description}`);
                        console.log(`Lat: ${selectedPlace.latitud}`);
                        console.log(`Long: ${selectedPlace.longitud}`);                    
                        console.log(`Temp: ${weather.temp}`);
                        console.log(`Min: ${weather.temp_min}`);
                        console.log(`Max: ${weather.temp_max}`);
                        console.log(`Looks like: ${weather.description} `);   
                    }                    
                break;                
            case '2': //history                    
                    search.getHistory().forEach((place, i) => {
                        console.log(`${(i+1).toString().green} ${_.capitalize(place)}`)
                    })                                  
                break;            
        };
        
        
        // saveDB(tasks.listTasksAsArray());

        if (!_.isEqual(opt, '0')) await pause();
    } while ( opt != '0')    
};

main();