from os import getenv
from typing import Dict, AnyStr

import jwt

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials



class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True) -> None:
        super(JWTBearer, self).__init__(auto_error=auto_error)

    def decode_jwt(self, token: str) -> Dict[str, str] | None:
        JWT_KEY: str = getenv("TOKEN_SECRET")

        if JWT_KEY is None:
            print("TOKEN_SECRET environment variable missing")
            return

        header_data: Dict[str, AnyStr] = jwt.get_unverified_header(token)
        jwt_algorithm: str = header_data.get("alg")

        if jwt_algorithm is None:
            print("JWT header data is missing!")
            return
        
        return jwt.decode(
            token,
            key=JWT_KEY,
            algorithms=[jwt_algorithm,]
        )
    
    def verify_jwt(self, token: str) -> bool:
        try:
            payload = self.decode_jwt(token)
        except jwt.PyJWTError:
            payload = None

        return not payload is None

    async def __call__(self, request: Request) -> None:
        creds: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)

        if creds:
            if not creds.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme")
            
            decoded_token = self.decode_jwt(creds.credentials)
            if not decoded_token:
                raise HTTPException(status_code=403, detail="Invalid token or expired token")
            
            return decoded_token
        
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code")