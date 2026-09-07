import {createServer} from 'node:http'


const server = createServer((req, res) =>{
   
    console.log('Request received:', req.method, req.url);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    
    res.end(`Request received: ${req.method} ${req.url}`);

    return;
});

const PORT = 9000;
server.listen(PORT, () =>{
   
    console.log(`Server is running on http://localhost:${PORT}`);

})