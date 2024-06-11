module.exports = function(req, res, next) {
    const { email,name, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    console.log("Validating info for path:", req.path);  // Log the path being validated
  
    if (req.path === "/register") {
    //   if (!email || !name || !password || name.trim() === "" || password.trim() === "") {
        if(![email,name,password].every(Boolean)){
        console.log("Missing credentials for registration");
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        console.log("Invalid email format for registration");
        return res.status(401).json("Invalid Email");
      }
    } else if (req.path === "/login") {
      if (![email,name,password].every(Boolean)) {
        console.log("Missing credentials for login");
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        console.log("Invalid email format for login");
        return res.status(401).json("Invalid Email");
      }
    }
  
    next();
  };
  