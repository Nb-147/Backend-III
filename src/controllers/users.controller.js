import { usersService } from "../services/index.js";

const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const existingUser = await usersService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send({ status: "error", error: "User already exists" });
        }
        const newUser = await usersService.create({
            first_name,
            last_name,
            email,
            password
        });
        return res.status(201).send({ status: "success", payload: newUser });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await usersService.getAll();
        return res.send({ status: "success", payload: users });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUserById(uid);
        if (!user) {
            return res.status(404).send({ status: "error", error: "User not found" });
        }
        return res.send({ status: "success", payload: user });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const updateBody = req.body;
        const user = await usersService.getUserById(uid);
        if (!user) {
            return res.status(404).send({ status: "error", error: "User not found" });
        }
        const updatedUser = await usersService.update(uid, updateBody);
        return res.send({ status: "success", message: "User updated", payload: updatedUser });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUserById(uid);
        if (!user) {
            return res.status(404).send({ status: "error", error: "User not found" });
        }
        await usersService.delete(uid);
        return res.send({ status: "success", message: "User deleted" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

const uploadDocuments = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUserById(uid);
        if (!user) {
            return res.status(404).send({ status: "error", error: "User not found" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ status: "error", error: "No files uploaded" });
        }

        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));

        user.documents = [...user.documents, ...documents];
        await usersService.update(uid, { documents: user.documents });

        return res.send({ status: "success", message: "Documents uploaded successfully", payload: user.documents });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export default {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadDocuments
};