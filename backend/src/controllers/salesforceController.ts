import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import jsforce, { Connection, QueryResult } from 'jsforce';
import dotenv from 'dotenv';
dotenv.config();

interface TokenResponse {
  access_token: string;
  expires_in: number;
  instance_url?: string;
}

interface Account {
  Id: string;
  Name: string;
  Industry?: string;
  Phone?: string;
}

const { SALESFORCE_TOKEN_URL, SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_INSTANCE_URL } = process.env;

if (!SALESFORCE_TOKEN_URL || !SALESFORCE_CLIENT_ID || !SALESFORCE_CLIENT_SECRET || !SALESFORCE_INSTANCE_URL) {
  console.error('Missing required Salesforce environment variables');
  process.exit(1);
}

let accessToken: string | null = null;
let tokenExpiry: number = 0;

const getAccessToken = async (): Promise<string> => {
  if (accessToken && Date.now() < tokenExpiry) {
    console.log('Using cached access token');
    return accessToken;
  }

  try {
    console.log('Requesting new access token from:', SALESFORCE_TOKEN_URL);
    const response: AxiosResponse<TokenResponse> = await axios.post(SALESFORCE_TOKEN_URL, null, {
      params: {
        grant_type: 'client_credentials',
        client_id: SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
      },
    });
    console.log('Token response received:', response.data);

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
    console.log('New access token obtained, expires at:', new Date(tokenExpiry));
    return accessToken;
  } catch (error: any) {
    console.error('Token request failed:', error.response?.data || error.message);
    throw new Error(`Error obtaining access token: ${error.response?.data?.error_description || error.message}`);
  }
};

export const getSalesforceAccounts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 10;

  try {
    const token = await getAccessToken();
    const conn: Connection = new jsforce.Connection({
      instanceUrl: SALESFORCE_INSTANCE_URL,
      accessToken: token,
    });

    // Step 1: Get total number of accounts
    const countResult = await conn.query<{ expr0: number }>('SELECT COUNT() FROM Account');
    const totalSize = countResult.totalSize;
    const totalPages = Math.ceil(totalSize / pageSize);
    const offset = (page - 1) * pageSize;

    // Step 2: Paginated query
    const records = await conn.query<Account>(
      `SELECT Id, Name, Industry, Phone FROM Account LIMIT ${pageSize} OFFSET ${offset}`
    );

    res.json({
      accounts: records.records,
      totalPages,
      currentPage: page,
      totalSize,
    });
  } catch (error: any) {
    console.error('Query failed:', error.message);
    res.status(500).json({ message: 'Error fetching Salesforce accounts', error: error.message });
  }
};
