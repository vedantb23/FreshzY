import { Customer, DeliveryPartner } from "../../models/user.js";

import jwt from "jsonwebtoken";
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, res) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });

    if (!customer) {
      // add otp after wards login here
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });

      await customer.save();
    }
    const { accessToken, refreshToken } = generateTokens(customer);

    return res.send({
      message: "Login Sucessful!",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }, error);
  }
};


export const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const  deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
        return res.status(404).send({ message: "Delivery Partner not found" });
      }

      const isMatch = password === deliveryPartner.password;

      if (!isMatch) {
          return res.status(401).send({ message: "Invalid credentials" });
      }
    const { accessToken, refreshToken } = generateTokens(deliveryPartner);

    return res.send({
      message: "Login Sucessful!",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" }, error);
  }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken) {
        return res.status(400).send({ message: "Refresh token is required" });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      let user;
      if (decoded.role === "Customer") {
          user=await Customer.findById(decoded.userId);
      }
      else if(decoded.role === "DeliveryPartner") {
          user=await DeliveryPartner.findById(decoded.userId);
      }
      else {
        return res.status(404).send({ message: "Who are you " });
      }
      if(!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
      return res.send({
          message: "Token refreshed successfully",
          accessToken,
          refreshToken: newRefreshToken,
      });

    } catch (error) {
        return res.status(500).send({ message: "Internal server error" }, error);
    }
}

export const fetchUser = async (req, res) => { 
  try {
    const {userId,role } = req.user;
    let user;
    if (role === "Customer") {
        user=await Customer.findById(userId).select("-password");
      }
      else if (role === "DeliveryPartner") {
          user=await DeliveryPartner.findById(userId).select("-password");
      }
      else {
          return res.status(403).send({ message: "Invalid role  " });
      }
      if(!user) {
          return res.status(404).send({ message: "User not found" });
      }
      return res.send({ message:"User Fetched",user });

  } catch (error) {
      return res.status(500).send({ message: "Internal server error" }, error);
  }

}