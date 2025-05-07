const { Router } = require("express");
const router = Router();


router.get("/", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the Apps API",
    endpoints: {
      Clients: {
        Authentification: {
          register: {
            method: "POST",
            access: "Public",
            url: "/api/clients/register",
          },
          login: {
            method: "POST",
            access: "Public",
            url: "/api/clients/login",
          },
          logout: {
            method: "POST",
            access: "Client",
            url: "/api/clients/logout",
          },
        },
      },
    },
  });
});

module.exports = router;
