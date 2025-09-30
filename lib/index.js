import {server} from "./config/server.js";
import {loggerwinston} from "./config/loggerwinston.js";

server.listen(3000,'localhost',error => {
    loggerwinston.info('server jalan')
    loggerwinston.error(error)
})