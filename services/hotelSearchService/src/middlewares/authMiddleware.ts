import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const region = "eu-central-1";
const userPoolId = "eu-central-1_8pHNKgWHg";

const client = jwksClient({
  jwksUri: `https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_8pHNKgWHg/.well-known/jwks.json`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key: any) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, {
    issuer: `https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_8pHNKgWHg/.well-known/jwks.json`,
  }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

export const verifyTokenOptional = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
  } catch {
    // ignore if token is invalid
  }
  next();
};

