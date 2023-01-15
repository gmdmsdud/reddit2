import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";
import cookie from "cookie";
import userMiddleware from "../middlewares/user"
import authMiddleware from "../middlewares/auth"
import { User } from "../entities/User";


const mapError =(errors:Object[])=>{
    return errors.reduce((prev:any, err:any) => {
        prev[err.property] =Object.entries(err.constraints)[0][1];
        return prev;
    },{})
}

const me = async (_:Request, res:Response) => {//
    return res.json (res.locals.user);
}

const register = async(req: Request, res:Response) => {//req,res 두개의객체를 이용하서 client register res에서 받아온 것이 여기 req안에들어있고 여기res를 이용해 프론트에 다시 보내줄수있다.
    const {email, username,password } =req.body;
   
    try {
        let errors: any = {};

        const emailUser = await User.findOneBy({ email  });
        const usernameUser = await User.findOneBy({ username });

        if(emailUser) errors.email = "이미 해당 이메일 주소가 사용되었습니다."
        if(usernameUser) errors.username = "이미 이 사용자 이름이 사용되었습니다."

        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)//json으로 에러코드를 준다 클라이언트가 에러확인할수있게
        }
        const user =new User();
        user.email = email;
        user.username= username;
        user.password = password;

        errors =await validate(user);
        if(errors.length>0) return res.status(400).json(mapError(errors)); 

        await user.save()
        return res.json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error});
    }
}
const login=async(req: Request, res:Response) => {
    const { username, password } = req.body;
    try {
        let errors:any={}
        if(isEmpty(username)) errors.username ="사용자 이름은 비워둘수 없습니다.";
        if(isEmpty(password)) errors.password ="비밀번호는 비워둘 수 없습니다.";
        if(Object.keys(errors).length>0) {
            return res.status(400).json(errors);
        }

        const user = await User.findOneBy({username});

        if(!user) return res.status(404).json({username: '사용자 이름이 등록되지 않았습니다.'})

        const passwordMatches= await bcrypt.compare(password, user.password);

        if(!passwordMatches){
            return res.status(401).json({password: "비밀번호가 잘못되었습니다."})

        }
        const token =jwt.sign({username}, process.env.JWT_SECRET); //비밀번호가 맞으면 토큰생성 npm i jsonwebtoken dotenv cookie--save  npm i --save-dev @types/jsonwebtoken @types/cookie

        res.set("Set-Cookie", cookie.serialize("token", token, {  //쿠키 옵션설정
            httpOnly: true, //자바스크립트 같은 클라이언트측스크립트가 쿠키를사용할수없게
            maxAge:60*60*24*7,
            path: "/",
        }));
 
        return res.json({user,token});
    } catch (error) {
        console.error(error)
        return res.status(500).json(error);
        
    }
}

const logout = async(_:Request,res:Response) => {
    res.set(
        "Set-Cookie",
        cookie.serialize("token", "", {
            httpOnly:   true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        })
    );
    res.status(200).json({success: true});
}

const router = Router()
router.get("/me",userMiddleware, authMiddleware, me);
router.post("/register",register);
router.post("/login",login);
router.post("/logout",userMiddleware,authMiddleware,logout);

export default router;