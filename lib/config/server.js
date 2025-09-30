import express from "express"
import cors from "cors"
import {errormiddleware} from "../middleware/errormiddleware.js";
import {routes} from "../routes/routes.js";
export const server=express()

server.use(express.json())
server.use(cors())
server.use(express.static('public'))
server.use(express.urlencoded({extended:true}))
server.use(errormiddleware)
server.use(routes)