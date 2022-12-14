import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";

export class JwtGoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/login/google",
      scope: ["email", "profile"],
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    return {
      email: profile.emails[0].value,
      hashedPassword: "12312313123312",
      name: profile.displayName,
      id: profile.id,
      phone_number: "01011112222",
      nickname: profile.displayName,
    };
  }
}
