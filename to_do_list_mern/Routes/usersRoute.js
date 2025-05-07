import express from 'express';
import { signUp, signIn, userInfor, addUser, updateUser, deleteUser, logout, sendVerifyOtp, verifyEmail, isAuthenticated } from '../controllers/users.js';
import {auth} from '../middleware/auth.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User related operations
 */

/**
 * @openapi
 * /user-infor:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user information (need auth)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User information retrieved
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/user-infor", auth, userInfor)

/**
 * @openapi
 * /addUser:
 *   post:
 *     tags:
 *       - User
 *     summary: Add a new user (need auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal_id:
 *                 type: string
 *                 example: "BN12363468"
 *               name:
 *                 type: string
 *                 example: "juwono"
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               address:
 *                 type: string
 *                 example: "Bandung, Indonesia"
 *               phone_number:
 *                 type: string
 *                 example: "089286382736431"
 *     responses:
 *       '200':
 *         description: New user registration successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/addUser", auth, addUser)

/**
 * @openapi
 * /updateUser/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update an existing user (need auth)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal_id:
 *                 type: string
 *                 example: "BN12363468"
 *               name:
 *                 type: string
 *                 example: "juwono"
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               address:
 *                 type: string
 *                 example: "Bandung, Indonesia"
 *               phone_number:
 *                 type: string
 *                 example: "089286382736431"
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.patch("/updateUser/:id", auth, updateUser)

/**
 * @openapi
 * /deleteUser/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: delete an existing user (need auth)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.delete("/deleteUser/:id", auth, deleteUser)

/**
 * @openapi
 * /signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal_id:
 *                 type: string
 *                 example: "BN12363468"
 *               name:
 *                 type: string
 *                 example: "juwono"
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "Password123"
 *               address:
 *                 type: string
 *                 example: "Bandung, Indonesia"
 *               phone_number:
 *                 type: string
 *                 example: "089286382736431"
 *     responses:
 *       '200':
 *         description: New user registration successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/signup", signUp)

/**
 * @openapi
 * /signin:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign in user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "viriya.savoeun@binus.ac.id"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       '200':
 *         description: Sign in successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/signin", signIn)

/**
 * @openapi
 * /logout:
 *   post:
 *     tags:
 *       - User
 *     summary: Log out user
 *     responses:
 *       '200':
 *         description: Log out successfully
 *       '500':
 *         description: Internal server error
 */
router.post("/logout", logout);

/**
 * @openapi
 * /send-verify-otp:
 *   post:
 *     tags:
 *       - User
 *     summary: Send Verify OTP
 *     responses:
 *       '200':
 *         description: Verification OTP Sent on Email
 *       '500':
 *         description: Internal server error
 */
router.post("/send-verify-otp", userAuth, sendVerifyOtp);

/**
 * @openapi
 * /verify-account:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "378541"
 *     responses:
 *       '200':
 *         description: Email Verified Successfully!
 *       '500':
 *         description: Internal server error
 */
router.post("/verify-account", userAuth, verifyEmail);

/**
 * @openapi
 * /is-auth:
 *   post:
 *     tags:
 *       - User
 *     summary: Authentication
 *     responses:
 *       '200':
 *         description: Successfully Authenticated!
 *       '500':
 *         description: Internal server error
 */
router.post("/is-auth", userAuth, isAuthenticated);

export default router