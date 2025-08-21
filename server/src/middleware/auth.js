import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => {
    try {
            const authHeader=req.headers["authorization"];
            if(!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).send({ message: "No token provided" });
            }
            const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACESS_TOKEN_SECRET);
        req.user = decoded;
        return true;

    } catch (error) {
        return res.status(500).send({ message: "Failed to verify token", error });
    }
    
}