function adminAuth(req, res, next) {
  console.log("Checking Admin.....");

  const tokken = "xyz";
  const isAdmin = tokken === "xyz";
  if (isAdmin) {
    console.log("You are Admin");
    next();
  } else {
    return res.status(400).send("You are not a admin");
  }
}

export default adminAuth;
