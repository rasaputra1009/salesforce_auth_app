import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import jsforce, { Connection } from 'jsforce';
import dotenv from 'dotenv';
import logger from '../config/logger';

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

// Safely get env vars
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    logger.error(`Missing required env variable: ${key}`);
    process.exit(1);
  }
  return value;
};

const SALESFORCE_TOKEN_URL = getEnvVar('SALESFORCE_TOKEN_URL');
const SALESFORCE_CLIENT_ID = getEnvVar('SALESFORCE_CLIENT_ID');
const SALESFORCE_CLIENT_SECRET = getEnvVar('SALESFORCE_CLIENT_SECRET');
const SALESFORCE_INSTANCE_URL = getEnvVar('SALESFORCE_INSTANCE_URL');

// Token cache
let accessToken: string | null = null;
let tokenExpiry = 0;

const getAccessToken = async (): Promise<string> => {
  if (accessToken && Date.now() < tokenExpiry) {
    logger.info('Using cached Salesforce access token');
    return accessToken;
  }

  try {
    logger.info(`Requesting new Salesforce access token from: ${SALESFORCE_TOKEN_URL}`);
    const response: AxiosResponse<TokenResponse> = await axios.post(SALESFORCE_TOKEN_URL, null, {
      params: {
        grant_type: 'client_credentials',
        client_id: SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
      },
    });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000;

    logger.info('Salesforce access token obtained successfully');
    return accessToken;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.message;
    logger.error(`Failed to obtain Salesforce token: ${JSON.stringify(error.response?.data || message)}`);
    throw new Error(`Error obtaining access token: ${message}`);
  }
};

export const getSalesforceAccounts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 10;

  try {
    logger.info(`Fetching Salesforce accounts - Page: ${page}, Page Size: ${pageSize}`);
    const token = await getAccessToken();
    const conn: Connection = new jsforce.Connection({
      instanceUrl: SALESFORCE_INSTANCE_URL,
      accessToken: token,
    });

    const countResult = await conn.query<{ expr0: number }>('SELECT COUNT() FROM Account');
    const totalSize = countResult.totalSize;
    const totalPages = Math.ceil(totalSize / pageSize);
    const offset = (page - 1) * pageSize;

    logger.info(`Total accounts: ${totalSize}, Total pages: ${totalPages}`);

    const records = await conn.query<Account>(
      `SELECT Id, Name, Industry, Phone FROM Account LIMIT ${pageSize} OFFSET ${offset}`
    );

    logger.info(`Fetched ${records.records.length} accounts from Salesforce`);
    res.json({
      accounts: records.records,
      totalPages,
      currentPage: page,
      totalSize,
    });
  } catch (error: any) {
    logger.error(`Error fetching Salesforce accounts: ${error.message}`);
    res.status(500).json({
      message: 'Error fetching Salesforce accounts',
      error: error.message,
    });
  }
};
