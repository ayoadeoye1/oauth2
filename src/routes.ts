import * as express from 'express'
import { Request, Response } from 'express';
import axios from 'axios';
import * as qs from 'qs';
import * as pg from 'pg';

const { Pool } = pg;

let pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.PORTDB
})

const connectDB = async() =>{
  try {
    await pool.connect();
    console.log('pg DB connected')
  } catch (error) {
    console.log('DB connection err', error.message);
  }
}

connectDB();

const router = express.Router();

router.get('/oauth', (req: Request, res: Response) =>{
  res.status(200).render('accesstoken', {});
})

router.post('/oauth', async(req: Request, res: Response) =>{
  const { clientId, clientSecret, tokenUrl, name } = req.body;

  if(!clientId || !clientSecret || !tokenUrl || !name){
    return res.status(400).json('all input are required');
  }

  try{
    const tokenRequestBody = {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }
    
    const apiRes = await axios.post(tokenUrl, qs.stringify(tokenRequestBody), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

    // const query = 'INSERT INTO Token (token, name) VALUES ($1, $2)';
    // const values = [apiRes.data.access_token, name];
    // await pool.query(query, values);
    
    res.status(200).json({name:name, token:apiRes.data.access_token}) //('token saved to DB');
  } catch (error) {
    console.error('Error getting access token:', error.message);
    res.status(500).json(error.message);
  }

})

export default router
