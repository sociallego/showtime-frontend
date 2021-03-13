import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  let user;
  let publicAddress;
  try {
    user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );
    publicAddress = user.publicAddress;
  } catch (error) {
  } finally {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/reportitem`, {
        method: "POST",
        headers: {
          "X-Authenticated-User": publicAddress, // may be null if logged out
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY,
          "Content-Type": "application/json",
        },
        body: req.body,
      });
    } catch (error) {
      console.log(error);
    }

    //console.log(publicAddress);
    //console.log(req.body);
  }

  res.statusCode = 200;
  res.end();
};