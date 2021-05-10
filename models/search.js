import  axios from 'axios';
import _ from 'lodash';
import fs from 'fs';

class Search{
    /** Private attrs*/    
    #history = [];    
    
    /** Public attrs*/

  constructor(){
      this.#loadHistory();
  }

  /** Private area*/
  #loadHistory() {
    try{
        this.#history = fs.existsSync(process.env.JSON_DB_PATH)? 
            JSON.parse(fs.readFileSync(process.env.JSON_DB_PATH, {encoding: 'utf-8'}))
            : [];
           
    }catch(e){
        console.log(`Error on loading data from file`.red);
    }  
  }

  /** public area*/
  async place (place = '') {
      try{        
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
            params:  {
                'access_token': process.env.MAPBOX_KEY,
                'language': 'es',
                'limit': 5
            }
        });
        
        const response = await instance.get();        

        return response.data.features.map((subPlace, i) => {  
            const dataObject = {
                id: subPlace.id,
                description: subPlace.place_name_es,
                coordinates: subPlace.geometry.coordinates,
                longitud: subPlace.center[0],
                latitud: subPlace.center[1]
            };        

            return dataObject;
       });       

      }catch(e){          
        return ['Something went bad!!!']; //return all places
      }    
  }

  async weatherPlace(lat, lon) {
      try {
        const instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
            params:  {
                'appid': process.env.WEATHER_KEY,
                'lat': lat,
                'lon': lon,
                'units': 'metric',
                'lang': 'es'
            }
        });

        const response = await instance.get();        

        const dataObject = {
            description: response.data.weather[0].description,
            temp: response.data.main.temp,
            temp_min: response.data.main.temp_min,
            temp_max: response.data.main.temp_max,
            humidity: response.data.main.humidity                      
        };  

        return dataObject;

      } catch (error) {
          console.log(`I got thos error: ${error}`);
          return ['I couldn\'t found the city you provided...'];
      }
  }  

  saveHistory(place = ''){    
    if (this.#history.includes(place.toLocaleLowerCase())) return;

    this.#history.unshift(place.toLocaleLowerCase());    
    
    fs.writeFileSync(process.env.JSON_DB_PATH, JSON.stringify(this.#history));
  }

  getHistory(){
      return this.#history;
  }
}

export  {
    Search
}