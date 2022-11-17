import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver";

export class JwtNaverStrategy extends PassportStrategy(Strategy, "naver") {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/login/naver",
      scope: ["email", "profile"],
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log(profile._json.nickname);

    return {
      email: profile.emails[0].value,
      hashedPassword: "09090909090909",
      name: profile._json.nickname.displayName,
      id: profile.id,
      phone_number: "01055556666",
      nickname: profile.displayName,
    };
  }
}
