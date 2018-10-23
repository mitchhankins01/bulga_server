import { Request, Response } from 'express';
import * as fs from 'fs';
import { google } from 'googleapis';
import * as path from 'path';
import { OAuth2Client } from 'google-auth-library';

interface Installed {
  auth_provider_x509_cert_url: string;
  auth_uri: string;
  client_id: string;
  client_secret: string;
  project_id: string;
  redirect_uris: string[];
  token_uri: string;
}

interface Credentials {
  installed: Installed;
}

export default class GmailController {
  private SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
  private TOKEN_PATH = path.join(__dirname, 'gmail-nodejs.json');
  private credentials: Credentials;
  private client: OAuth2Client;

  constructor() {
    this.getGmail = this.getGmail.bind(this);
    this.getGmailAuth = this.getGmailAuth.bind(this);
    this.getGmailCode = this.getGmailCode.bind(this);

    fs.readFile('client_secret.json', (error, content) => {
      if (error) {
        return error;
      }

      this.credentials = JSON.parse(content.toString());

      const {
        installed: { client_secret, client_id }
      } = this.credentials;

      this.client = new google.auth.OAuth2(
        client_id,
        client_secret,
        process.env.GOOGLE_REDIRECT_URI
      );
    });
  }

  public getGmail(req: Request, res: Response) {
    const gmail = google.gmail({ auth: this.client, version: 'v1' });

    gmail.users.messages.list(
      {
        auth: this.client,
        q: 'label:inbox',
        userId: 'me'
      },
      (error, topResponse) => {
        if (error) {
          console.log('Error: ', error);
          return error;
        }
        // console.log(topResponse);
        res.send(topResponse.data.messages);
      }
    );
  }

  public getGmailAuth(req: Request, res: Response) {
    fs.readFile(this.TOKEN_PATH, (error, token) => {
      if (error) {
        const authUrl = this.client.generateAuthUrl({
          access_type: 'offline',
          scope: this.SCOPES
        });
        return res.redirect(authUrl);
      }
      this.client.setCredentials(JSON.parse(token.toString()));
      res.redirect('/gmail');
    });
  }

  public getGmailCode(req: Request, res: Response) {
    if (!req.query.code) {
      res.sendStatus(422);
    }

    this.client.getToken(req.query.code, (error, token) => {
      if (error) {
        return error;
      }
      this.client.setCredentials(token);

      fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), error => {
        if (error) {
          return error;
        }
        res.redirect('/gmailAuth');
      });
    });
  }
}
