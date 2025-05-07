import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import Users from '../models/users.js';
import dotenv from 'dotenv';
import transporter from '../utils/nodemailer.js';

dotenv.config();

// check password and confirmPassword
function isMatch(password, confirm_password) {
    if (password === confirm_password) return true
    return false
}

// validate email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// validate password
function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    return re.test(password)
}

{/**
function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
}**/}

// user sign-up
export const signUp = async (req, res) => {
    try {
        const { personal_id, name, email, password, confirmPassword, address, phone_number } = req.body;

        if (!personal_id || !name || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }

        if (name.length < 3) return res.status(400).json({ success: false, message: "Your name must be at least 3 letters long" });

        if (!isMatch(password, confirmPassword)) return res.status(400).json({success: false, message: "Password did not match" });

        if (!validateEmail(email)) return res.status(400).json({ success: false, message: "Invalid emails" });

        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
            });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success:false, message: "This email is already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            personal_id,
            name,
            email,
            password: hashedPassword,
            address,
            phone_number
        });

        await newUser.save();

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to ToDo',
            text: `Welcome to ToDo website. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error) {
        return res.status(500).json({success:false, message: error.message });
    }
}

// user sign-in
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ success: false, message: "Please fill in all fields" })

        try{
            const user = await Users.findOne({ email });
            if (!user) { return res.status(400).json({ success: false, message: "Invalid Credentials" })}
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) { return res.status(400).json({ success: false, message: "Invalid Credentials" })};

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

            res.cookie('token', token, {
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 
                'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({
                success: true,
                message: "Sign In successfully!",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token: token
            })
        } catch (error) {
            return res.json({success: false, message: error.message});
        }
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none' : 'strict',
        })

        return res.status(200).json({success: true, message: "Logged Out!"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const sendVerifyOtp = async (req, res) => {
    try{
        const {id} = req.body;
        const user = await Users.findById(id);
        if(user.isAccountVerified) {
            return res.json({success: false, message: "Account Already verified"});
        };

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Account Verification OTP',
                text: `Your OTP is ${otp}. Verify your account using this OTP.`
        }
        await transporter.sendMail(mailOption);

        res.json({success: true, message: 'Verification OTP Sent on Email'});
        console.log("user.verifyOtpExpireAt: ", user.verifyOtpExpireAt);
        console.log('Date.now():', Date.now());
        console.log('user.verifyOtp:', user.verifyOtp);

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const verifyEmail = async (req, res) => {
    const {id, otp} = req.body;
    if(!id || !otp) {
        return res.json({success: false, message: 'Missing Details'});
    }try{
        const user = await Users.findById(id);
        if(!user){
            return res.json({success:false, message: 'User not found'});
        }
        if (Date.now() > user.verifyOtpExpireAt) {
            return res.json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        user.isAccountVerified = true;
        user.verifyOTP = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({success: true, message: 'Email verified successfully!'})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const addUser = async (req, res) => {
    try {
        const { personal_id, name, email, password, address, phone_number } = req.body

        if (!personal_id || !name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (name.length < 3) return res.status(400).json({ message: "Your name must be at least 3 letters long" });

        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid emails" });

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            personal_id,
            name,
            email,
            password: hashedPassword,
            address,
            phone_number
        });

        await newUser.save();

        res.status(200).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { personal_id, name, email, password, address, phone_number } = req.body;

        const updateData = {
            personal_id,
            name,
            email,
            address,
            phone_number
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully!", updatedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await Users.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// user information
export const userInfor = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await Users.findById(userId).select("-password")

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        res.json({
            success: true,
            userData: {
                personal_id: user.personal_id,
                name: user.name,
                isAccountVerified: user.isAccountVerified,
                email: user.email,
                address: user.address,
                phone_number: user.phone_number,
                user_id: user._id
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true, message: "Successfully Authenticated!"});
    } catch (error) {
        res.json ({success: false, message: error.message});
    }
}