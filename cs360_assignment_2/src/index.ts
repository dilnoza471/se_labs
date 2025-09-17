import axios, { AxiosResponse } from 'axios'
const res = axios.get('https:google.com');
res.then(()=>{
    console.log("Promise resolved");
})

res.catch(()=>{
    console.log("Promise rejected")
})