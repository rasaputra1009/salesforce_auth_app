import { Request, Response } from 'express';
import jsforce from 'jsforce';

interface Account {
  Id: string;
  Name: string;
  Industry: string;
  Phone: string;
}

interface PaginatedResponse {
  accounts: Account[];
  currentPage: number;
  totalPages: number;
  totalSize: number;
}

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });
    await conn.login(
      process.env.SALESFORCE_USERNAME as string,
      (process.env.SALESFORCE_PASSWORD as string) + (process.env.SALESFORCE_TOKEN as string)
    );

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    const query = `SELECT Id, Name, Industry, Phone FROM Account LIMIT ${pageSize} OFFSET ${offset}`;
    const result = await conn.query<Account>(query);

    const totalResult = await conn.query<Account>('SELECT COUNT() FROM Account');
    const totalSize = totalResult.totalSize;
    const totalPages = Math.ceil(totalSize / pageSize);

    const response: PaginatedResponse = {
      accounts: result.records,
      currentPage: page,
      totalPages,
      totalSize,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Salesforce accounts', error });
  }
};