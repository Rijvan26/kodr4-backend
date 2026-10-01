import type { Response } from "express";
import type { ApiSuccess } from "../types/api.js";

export function sendSuccess<T> (
    res:Response,
  statuscode:number,
  message:string,
  data:T | null = null
) {
  const body:ApiSuccess<T> = {
     success:true,
     message,
     data    
  }


  return res.status(statuscode).json(body)
}