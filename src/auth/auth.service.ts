import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/module/users/users.service';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class AuthService {
  private jwksUri = `https://<YOUR_AUTH0_DOMAIN>/.well-known/jwks.json`;

  constructor(private readonly usersService: UsersService) {}

  async validateToken(token: string): Promise<any> {
    const client = jwksClient({ jwksUri: this.jwksUri });

    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      });
    };

    return new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }
  async handleUser(email: string, username: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return this.usersService.create(email, username);
    }
    return user;
  }
}
