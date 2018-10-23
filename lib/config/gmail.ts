import * as fs from 'fs';
import { google } from 'googleapis';
import * as path from 'path';
import * as readline from 'readline';

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

export default class Gmail {
  private SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
  private TOKEN_PATH = path.join(__dirname, 'gmail-nodejs.json');

  constructor() {
    fs.readFile('client_secret.json', (error, content) => {
      if (error) {
        return error;
      }
      const credentials: Credentials = JSON.parse(content.toString());
      this.authorize(credentials, this.listLabels);
    });
  }

  private authorize(credentials: Credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    fs.readFile(this.TOKEN_PATH, (error, token) => {
      if (error) {
        return this.getNewToken(client, callback);
      }
      client.setCredentials(JSON.parse(token.toString()));
      callback(client);
    });
  }

  private getNewToken(client, callback) {
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES
    });
    console.log('Authorize Link: ', authUrl);
    const readLine = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readLine.question('Enter code: ', code => {
      readLine.close();
      client.getToken(code, (error, token) => {
        if (error) {
          return error;
        }
        client.setCredentials(token);

        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), error => {
          if (error) {
            return error;
          }
          console.log(token);
          callback(client);
        });
      });
    });
  }

  private listLabels(auth) {
    const gmail = google.gmail({ auth, version: 'v1' });

    gmail.users.labels.list(
      {
        userId: 'me'
      },
      (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const labels = res.data.labels;
        if (labels.length) {
          console.log('Labels:');
          labels.forEach(label => {
            console.log(`- ${label.name}`);
          });
        } else {
          console.log('No labels found.');
        }
      }
    );
  }
}
