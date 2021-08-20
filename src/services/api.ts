import axios from 'axios'

export const api = axios.create({
    baseURL:'http://localhost:3333'
})
// com o axios importar a contante api com a url do Json